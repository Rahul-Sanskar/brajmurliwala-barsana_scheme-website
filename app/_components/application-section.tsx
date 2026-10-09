"use client";

/**
 * ApplicationSection — 2-step registration flow:
 *
 * Step 1: User clicks "Register Now" → modal form appears
 *         (Full Name, Mobile, Email, Unit Preference)
 *
 * Step 2: User clicks "Proceed to Payment" →
 *         - Details POSTed to /api/enquiry (email notification)
 *         - Razorpay payment gateway opens
 *         - On success → /results page
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  FileText, Lock, AlertTriangle, CheckCircle2,
  ShieldCheck, X, ArrowRight, CreditCard,
} from "lucide-react";
import { CONFIG, PROJECT } from "@/app/_data/project";
import { cn } from "@/app/_lib/utils";

/* ── Razorpay types ─────────────────────────────────────────────── */
interface RazorpayOptions {
  key: string; amount: number; currency: string;
  name: string; description: string; order_id: string;
  prefill?: { name?: string; email?: string; contact?: string };
  handler: (r: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => void;
  theme?: { color?: string };
  modal?: { ondismiss?: () => void };
}
declare global {
  interface Window { Razorpay?: new (o: RazorpayOptions) => { open: () => void }; }
}

function loadRazorpayScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) { resolve(); return; }
    const s = document.createElement("script");
    s.id = "razorpay-checkout-js";
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Razorpay failed to load"));
    document.head.appendChild(s);
  });
}

/* ── Form schema ────────────────────────────────────────────────── */
const schema = z.object({
  fullName:       z.string().min(2, "Enter your full name"),
  mobile:         z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),
  email:          z.string().email("Enter a valid email address"),
  unitPreference: z.string().min(1, "Select a configuration"),
});
type FormValues = z.infer<typeof schema>;

/* ── Registration modal ─────────────────────────────────────────── */
function RegistrationModal({ onClose }: { onClose: () => void }) {
  const [step, setStep]         = useState<"form" | "paying">("form");
  const [payError, setPayError] = useState<string | null>(null);
  const mountedRef = useRef(true);
  useEffect(() => () => { mountedRef.current = false; }, []);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const amount  = CONFIG.APPLICATION_AMOUNT;
  const enabled = CONFIG.RAZORPAY_ENABLED;

  /* Submit: send enquiry email then open Razorpay */
  const onSubmit = async (data: FormValues) => {
    setPayError(null);
    setStep("paying");

    /* 1. Send details to /api/enquiry (email notification) */
    try {
      await fetch("/api/enquiry", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName:       data.fullName,
          mobile:         data.mobile,
          email:          data.email,
          unitPreference: data.unitPreference,
          message:        "Registration payment initiated",
        }),
      });
    } catch {
      /* Non-fatal — proceed to payment even if email fails */
    }

    /* 2. Create Razorpay order */
    if (!enabled) {
      setPayError("Payment not configured. Please contact us.");
      setStep("form");
      return;
    }

    try {
      await loadRazorpayScript();
      const res  = await fetch("/api/razorpay/create-order", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amountInr: amount }),
      });
      const orderData = await res.json() as {
        orderId?: string; amount?: number; currency?: string;
        keyId?: string; error?: string; code?: string;
      };

      if (!res.ok || !orderData.orderId) {
        setPayError(
          orderData.code === "RAZORPAY_NOT_CONFIGURED" ? "Payment not configured." :
          orderData.code === "APPLICATIONS_CLOSED"     ? "Registrations are currently closed." :
          orderData.error ?? "Could not initiate payment."
        );
        setStep("form");
        return;
      }

      if (!window.Razorpay) {
        setPayError("Payment gateway unavailable. Please try again.");
        setStep("form");
        return;
      }

      new window.Razorpay({
        key:         orderData.keyId!,
        amount:      orderData.amount!,
        currency:    orderData.currency ?? "INR",
        name:        PROJECT.name,
        description: `Registration Fee — ${PROJECT.portal.name}`,
        order_id:    orderData.orderId,
        /* Pre-fill user details in Razorpay checkout */
        prefill: {
          name:    data.fullName,
          email:   data.email,
          contact: `+91${data.mobile}`,
        },
        handler: async (r) => {
          try {
            const v = await fetch("/api/razorpay/verify", {
              method: "POST", headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id:   r.razorpay_order_id,
                razorpay_payment_id: r.razorpay_payment_id,
                razorpay_signature:  r.razorpay_signature,
              }),
            });
            const vd = await v.json() as {
              success?: boolean; paymentId?: string;
              orderId?: string; amountInr?: number; error?: string;
            };
            const p = new URLSearchParams(vd.success
              ? {
                  status:    "success",
                  paymentId: vd.paymentId ?? r.razorpay_payment_id,
                  orderId:   vd.orderId   ?? r.razorpay_order_id,
                  amountInr: String(vd.amountInr ?? amount),
                  name:      data.fullName,
                  unit:      data.unitPreference,
                }
              : { status: "failed", reason: vd.error ?? "Verification failed." }
            );
            window.location.href = `/results?${p}`;
          } catch {
            window.location.href = "/results?status=failed&reason=Verification+failed.";
          }
        },
        theme: { color: "#E87516" },
        modal: {
          ondismiss: () => {
            if (mountedRef.current) { setStep("form"); setPayError(null); }
          },
        },
      }).open();
    } catch (e) {
      if (mountedRef.current) {
        setPayError(e instanceof Error ? e.message : "Unexpected error.");
        setStep("form");
      }
    }
  };

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reg-modal-heading"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white w-full max-w-lg max-h-[95vh] overflow-y-auto relative">

        {/* Header */}
        <div className="card-header-bar bg-bmu-red-800 justify-between sticky top-0 z-10">
          <div className="flex flex-col leading-tight">
            <span id="reg-modal-heading" className="font-bold text-white text-[0.95rem]">
              Registration — {PROJECT.name}
            </span>
            <span className="text-[0.65rem] text-white/60 font-normal">
              Fill your details then proceed to payment
            </span>
          </div>
          <button
            type="button" onClick={onClose}
            className="h-8 w-8 flex items-center justify-center bg-white/10 hover:bg-white/20 ml-3 flex-shrink-0"
            aria-label="Close"
          >
            <X size={15} aria-hidden="true" />
          </button>
        </div>

        {/* Urgency strip */}
        <div className="bg-bmu-orange px-4 py-2">
          <span className="text-[0.78rem] font-bold text-white">
            ⚠️ Only 50 units left · ₹{amount.toLocaleString("en-IN")} registration fee
          </span>
        </div>

        <div className="p-5 sm:p-6">

          {/* Step indicators */}
          <div className="flex items-center gap-2 mb-6">
            <div className={cn(
              "flex items-center justify-center w-7 h-7 rounded-full text-[0.75rem] font-bold border-2",
              step === "form"
                ? "bg-bmu-red text-white border-bmu-red"
                : "bg-bmu-green text-white border-bmu-green"
            )}>
              {step === "paying" ? "✓" : "1"}
            </div>
            <span className="text-[0.8rem] font-semibold text-bmu-ink">Your Details</span>
            <div className="flex-1 h-px bg-bmu-line mx-1" />
            <div className={cn(
              "flex items-center justify-center w-7 h-7 rounded-full text-[0.75rem] font-bold border-2",
              step === "paying"
                ? "bg-bmu-orange text-white border-bmu-orange"
                : "border-bmu-line text-bmu-muted bg-white"
            )}>
              2
            </div>
            <span className={cn(
              "text-[0.8rem] font-semibold",
              step === "paying" ? "text-bmu-ink" : "text-bmu-muted"
            )}>
              Payment
            </span>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">

            {/* Full Name */}
            <div>
              <label htmlFor="reg-fullName" className="form-label">
                Full Name <span className="text-red-500" aria-hidden="true">*</span>
              </label>
              <input
                id="reg-fullName" type="text" autoComplete="name"
                placeholder="As per Aadhaar / official ID"
                className={cn("form-input", errors.fullName && "border-red-400")}
                {...register("fullName")}
              />
              {errors.fullName && <p className="form-error" role="alert">{errors.fullName.message}</p>}
            </div>

            {/* Mobile */}
            <div>
              <label htmlFor="reg-mobile" className="form-label">
                Mobile Number <span className="text-red-500" aria-hidden="true">*</span>
              </label>
              <input
                id="reg-mobile" type="tel" inputMode="numeric" autoComplete="tel"
                placeholder="10-digit mobile number"
                className={cn("form-input", errors.mobile && "border-red-400")}
                {...register("mobile")}
              />
              {errors.mobile && <p className="form-error" role="alert">{errors.mobile.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="reg-email" className="form-label">
                Email Address <span className="text-red-500" aria-hidden="true">*</span>
              </label>
              <input
                id="reg-email" type="email" autoComplete="email"
                placeholder="your@email.com"
                className={cn("form-input", errors.email && "border-red-400")}
                {...register("email")}
              />
              {errors.email && <p className="form-error" role="alert">{errors.email.message}</p>}
            </div>

            {/* Unit Preference */}
            <div>
              <label htmlFor="reg-unit" className="form-label">
                Unit Preference <span className="text-red-500" aria-hidden="true">*</span>
              </label>
              <select
                id="reg-unit" defaultValue=""
                className={cn("form-input form-select", errors.unitPreference && "border-red-400")}
                {...register("unitPreference")}
              >
                <option value="" disabled>Select configuration</option>
                <option value="1bhk">1 BHK — 881 to 895 sq.ft.</option>
                <option value="2bhk">2 BHK — 1,395 to 1,675 sq.ft.</option>
                <option value="3bhk">3 BHK — 1,916 to 1,982 sq.ft.</option>
              </select>
              {errors.unitPreference && <p className="form-error" role="alert">{errors.unitPreference.message}</p>}
            </div>

            {/* Payment error */}
            {payError && (
              <div className="flex items-start gap-2 text-[0.82rem] text-red-700 bg-red-50 border border-red-200 px-3 py-2.5" role="alert">
                <AlertTriangle size={15} className="flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span>{payError}</span>
              </div>
            )}

            {/* Amount summary */}
            <div className="bg-bmu-stone border border-bmu-line px-4 py-3 flex items-center justify-between">
              <div>
                <div className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-bmu-muted">Registration Fee</div>
                <div className="font-bold text-bmu-ink text-[1.4rem] leading-tight">
                  ₹{amount.toLocaleString("en-IN")}
                </div>
              </div>
              <div className="flex flex-col gap-1 text-right">
                <div className="flex items-center gap-1 text-[0.7rem] text-bmu-muted justify-end">
                  <ShieldCheck size={11} className="text-bmu-green" aria-hidden="true" />
                  256-bit SSL secured
                </div>
                <div className="flex items-center gap-1 text-[0.7rem] text-bmu-muted justify-end">
                  <CheckCircle2 size={11} className="text-bmu-green" aria-hidden="true" />
                  Powered by Razorpay
                </div>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting || step === "paying"}
              className="btn-apply w-full justify-center"
              style={{ fontSize: "1rem", padding: "0.85rem 1rem" }}
            >
              {step === "paying" || isSubmitting ? (
                <><span className="app-spinner" aria-hidden="true" /> Opening Payment Gateway…</>
              ) : (
                <>
                  <CreditCard size={16} aria-hidden="true" />
                  Proceed to Payment
                  <ArrowRight size={16} aria-hidden="true" />
                </>
              )}
            </button>

            <p className="text-[0.68rem] text-bmu-muted text-center">
              Your details will be shared with {PROJECT.developer.name} for registration purposes.
            </p>

          </form>
        </div>
      </div>
    </div>
  );
}

/* ── Main section ───────────────────────────────────────────────── */
export function ApplicationSection() {
  const [modalOpen, setModalOpen] = useState(false);

  const isOpen = CONFIG.APPLICATION_STATUS === "OPEN";
  const amount = CONFIG.APPLICATION_AMOUNT;

  return (
    <section id="application" aria-labelledby="app-heading" className="app-section">

      {/* Status bar */}
      <div style={{ background: "rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="container-x flex items-center justify-between py-2.5">
          <div className="flex items-center gap-2.5">
            <FileText size={15} className="text-bmu-orange" aria-hidden="true" />
            <span className="text-[0.72rem] font-bold uppercase tracking-[0.18em] text-white/80">
              Registration
            </span>
          </div>
          {isOpen ? (
            <span className="app-status-open">
              <span className="app-status-dot" aria-hidden="true" />
              Applications Open — Only 50 Units Left
            </span>
          ) : (
            <span className="app-status-closed">
              <span className="app-status-dot" aria-hidden="true" />
              Applications Closed
            </span>
          )}
        </div>
      </div>

      {/* Three panes */}
      <div className="container-x">
        <div className="app-grid" style={{ gap: "1px", background: "rgba(255,255,255,0.08)" }}>

          {/* Pane 1 — description */}
          <div className="app-pane flex flex-col justify-center gap-3" style={{ background: "#fff" }}>
            {isOpen && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 px-3 py-2">
                <AlertTriangle size={14} className="text-bmu-red flex-shrink-0" aria-hidden="true" />
                <span className="text-[0.75rem] font-bold text-bmu-red">
                  Only 50 units remaining — secure your slot now!
                </span>
              </div>
            )}
            <h2 id="app-heading" className="font-bold text-bmu-ink leading-tight"
              style={{ fontSize: "clamp(1.15rem, 1.8vw, 1.45rem)" }}>
              Secure Your Home Today
            </h2>
            <p className="text-bmu-muted text-[0.85rem] leading-relaxed">
              Don&apos;t miss the pre-launch rate of ₹7,999/sq.ft. — price rises to ₹8,499 after launch.
              Reserve your unit at {PROJECT.name},&nbsp;{PROJECT.location.short} right now.
            </p>
            <div className="flex flex-col gap-1.5 mt-1">
              <div className="flex items-start gap-2 text-[0.82rem] text-bmu-muted">
                <span className="text-bmu-orange font-bold mt-0.5">①</span>
                Fill your registration details
              </div>
              <div className="flex items-start gap-2 text-[0.82rem] text-bmu-muted">
                <span className="text-bmu-orange font-bold mt-0.5">②</span>
                Proceed to secure ₹{amount.toLocaleString("en-IN")} payment via Razorpay
              </div>
            </div>
          </div>

          {/* Pane 2 — amount + button */}
          <div className="app-pane flex flex-col justify-center gap-2" style={{ background: "#fff" }}>
            <div className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-bmu-muted mb-0.5">
              Application Amount
            </div>
            <div className="font-bold text-bmu-ink leading-none"
                 style={{ fontSize: "clamp(2rem, 3.5vw, 2.6rem)" }}>
              ₹{amount.toLocaleString("en-IN")}
            </div>
            <div className="h-0.5 w-8 bg-bmu-orange mt-0.5" />
            <p className="text-bmu-muted text-[0.78rem] leading-relaxed mt-1">
              One-time refundable application fee blocks your unit.{" "}
              <span className="font-semibold text-bmu-ink">Act now before someone else takes it.</span>
            </p>
            <div className="flex flex-col gap-1 mb-2">
              <div className="flex items-center gap-1.5 text-[0.72rem] text-bmu-muted">
                <ShieldCheck size={12} className="text-bmu-green flex-shrink-0" aria-hidden="true" />
                Secured via Razorpay · 256-bit SSL
              </div>
              <div className="flex items-center gap-1.5 text-[0.72rem] text-bmu-muted">
                <CheckCircle2 size={12} className="text-bmu-green flex-shrink-0" aria-hidden="true" />
                Payment powered by Razorpay
              </div>
            </div>

            {/* Register Now → opens modal form */}
            <button
              type="button"
              className="btn-apply w-full justify-center"
              style={{ fontSize: "1rem", padding: "0.85rem 1rem", letterSpacing: "0.08em" }}
              onClick={() => setModalOpen(true)}
              disabled={!isOpen}
              aria-disabled={!isOpen}
            >
              {!isOpen ? (
                <><Lock size={16} aria-hidden="true" /> Registration Closed</>
              ) : (
                <><FileText size={16} aria-hidden="true" /> Register Now</>
              )}
            </button>

            {/* Dates strip */}
            {isOpen ? (
              <div className="border border-bmu-line bg-[#faf8f6] flex flex-col text-[0.7rem]">
                <div className="flex items-center gap-2 px-3 py-1.5 border-b border-bmu-line">
                  <span className="text-bmu-orange text-[10px]">📅</span>
                  <span className="text-bmu-muted">Registration Open</span>
                  <span className="font-bold text-bmu-ink ml-auto">{CONFIG.REGISTRATION_START} – {CONFIG.REGISTRATION_END}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5">
                  <span className="text-bmu-green text-[10px]">✓</span>
                  <span className="text-bmu-muted">Allotment Date</span>
                  <span className="font-bold text-bmu-ink ml-auto">{CONFIG.ALLOTMENT_DATE}</span>
                </div>
              </div>
            ) : (
              <div className="border border-bmu-line bg-[#faf8f6] flex items-center gap-2 px-3 py-2 text-[0.72rem]">
                <span className="text-bmu-green text-[10px]">✓</span>
                <span className="text-bmu-muted">Allotment Date</span>
                <span className="font-bold text-bmu-ink ml-auto">{CONFIG.ALLOTMENT_DATE}</span>
              </div>
            )}
          </div>

          {/* Pane 3 — configurations */}
          <div className="app-pane flex flex-col justify-center gap-2" style={{ background: "#fff" }}>
            <div className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-bmu-muted mb-0.5">
              Available Configurations
            </div>
            {PROJECT.unitConfigs.map((u) => (
              <div key={u.id}
                className="flex items-center justify-between gap-3 py-1.5 border-b border-bmu-line last:border-0">
                <span className="font-bold text-bmu-ink text-[0.9rem]">{u.name}</span>
                <span className="text-[0.72rem] font-bold text-bmu-orange bg-bmu-orange-50 px-2 py-0.5 whitespace-nowrap">
                  {u.superAreaSqftMin}–{u.superAreaSqftMax}&nbsp;sq.ft.
                </span>
              </div>
            ))}
            <p className="text-bmu-muted text-[0.72rem] mt-1">
              Same application fee for all configurations.
            </p>
          </div>

        </div>
      </div>

      {/* Registration modal */}
      {modalOpen && <RegistrationModal onClose={() => setModalOpen(false)} />}

    </section>
  );
}
