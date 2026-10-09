"use client";

/**
 * ApplicationSection — 2-step registration flow.
 *
 * Step 1: User fills in their details (name, mobile, email, config).
 *         Details are sent to contact.php so you get an email lead
 *         even if the user abandons the payment.
 *
 * Step 2: Razorpay payment is initiated with the prefilled details.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FileText, Lock, AlertTriangle, CheckCircle2, ShieldCheck, ArrowRight, User, Phone, Mail, Home } from "lucide-react";
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

/* ── Main component ─────────────────────────────────────────────── */
export function ApplicationSection() {
  const [step, setStep]       = useState<"form" | "paying">("form");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const mountedRef = useRef(true);
  useEffect(() => () => { mountedRef.current = false; }, []);

  const isOpen  = CONFIG.APPLICATION_STATUS === "OPEN";
  const enabled = CONFIG.RAZORPAY_ENABLED;
  const amount  = CONFIG.APPLICATION_AMOUNT;

  const { register, handleSubmit, getValues, formState: { errors } } =
    useForm<FormValues>({ resolver: zodResolver(schema) });

  /* ── Step 1: submit form → send lead email → go to step 2 ─── */
  const onFormSubmit = async (data: FormValues) => {
    setError(null);
    setLoading(true);

    // Send lead to contact.php (fire-and-forget — don't block payment)
    const phpUrl = "/contact.php";
    fetch(phpUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName:       data.fullName,
        mobile:         data.mobile,
        email:          data.email,
        unitPreference: data.unitPreference,
        message:        "Registration payment initiated",
      }),
    }).catch(() => { /* silent — don't block payment if email fails */ });

    setStep("paying");
    setLoading(false);
  };

  /* ── Step 2: initiate Razorpay payment ──────────────────────── */
  const handlePay = useCallback(async () => {
    setError(null);
    if (!enabled) { setError("Online payment not yet configured. Please contact us."); return; }
    setLoading(true);

    const { fullName, mobile, email } = getValues();

    try {
      await loadRazorpayScript();
      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amountInr: amount }),
      });
      const data = await res.json() as {
        orderId?: string; amount?: number; currency?: string;
        keyId?: string; error?: string; code?: string;
      };

      if (!res.ok || !data.orderId) {
        if (mountedRef.current) setError(
          data.code === "RAZORPAY_NOT_CONFIGURED" ? "Payment not configured." :
          data.code === "APPLICATIONS_CLOSED"     ? "Registrations are currently closed." :
          data.error ?? "Could not initiate payment."
        );
        setLoading(false); return;
      }

      if (!window.Razorpay) { setError("Payment gateway unavailable."); setLoading(false); return; }

      new window.Razorpay({
        key:         data.keyId!,
        amount:      data.amount!,
        currency:    data.currency ?? "INR",
        name:        PROJECT.name,
        description: `Registration Fee — ${PROJECT.portal.name}`,
        order_id:    data.orderId,
        prefill: {
          name:    fullName,
          contact: `+91${mobile}`,
          email:   email,
        },
        handler: async (r) => {
          try {
            const v = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
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
              ? { status: "success", paymentId: vd.paymentId ?? r.razorpay_payment_id, orderId: vd.orderId ?? r.razorpay_order_id, amountInr: String(vd.amountInr ?? amount), name: fullName }
              : { status: "failed", reason: vd.error ?? "Verification failed." }
            );
            window.location.href = `/results?${p}`;
          } catch {
            window.location.href = "/results?status=failed&reason=Verification+failed.";
          }
        },
        theme: { color: "#E87516" },
        modal: { ondismiss: () => {
          if (mountedRef.current) { setLoading(false); setStep("form"); }
        }},
      }).open();
    } catch (e) {
      if (mountedRef.current) {
        setError(e instanceof Error ? e.message : "Unexpected error.");
        setLoading(false);
      }
    }
  }, [amount, enabled, getValues]);

  /* ── Auto-trigger payment when step changes to "paying" ─────── */
  useEffect(() => {
    if (step === "paying") handlePay();
  }, [step, handlePay]);

  return (
    <section id="application" aria-labelledby="app-heading" className="app-section">

      {/* ── Header bar ──────────────────────────────────────────── */}
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
              Registrations Open — Only 50 Units Left
            </span>
          ) : (
            <span className="app-status-closed">
              <span className="app-status-dot" aria-hidden="true" />
              Registrations Closed
            </span>
          )}
        </div>
      </div>

      <div className="container-x">
        <div className="app-grid" style={{ gap: "1px", background: "rgba(255,255,255,0.08)" }}>

          {/* ── Pane 1: Details form ────────────────────────────── */}
          <div className="app-pane flex flex-col gap-3" style={{ background: "#fff" }}>

            {/* Step indicator */}
            <div className="flex items-center gap-2 mb-1">
              <div className={cn("flex items-center justify-center w-6 h-6 rounded-full text-[0.7rem] font-bold",
                step === "form" ? "bg-bmu-red text-white" : "bg-bmu-green text-white")}>
                {step === "form" ? "1" : "✓"}
              </div>
              <span className="text-[0.72rem] font-bold uppercase tracking-[0.1em] text-bmu-ink">
                Your Details
              </span>
              <div className="flex-1 h-px bg-bmu-line mx-1" />
              <div className={cn("flex items-center justify-center w-6 h-6 rounded-full text-[0.7rem] font-bold",
                step === "paying" ? "bg-bmu-red text-white" : "bg-bmu-line text-bmu-muted")}>
                2
              </div>
              <span className="text-[0.72rem] font-bold uppercase tracking-[0.1em] text-bmu-muted">
                Payment
              </span>
            </div>

            {isOpen && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 px-3 py-2">
                <AlertTriangle size={14} className="text-bmu-red flex-shrink-0" aria-hidden="true" />
                <span className="text-[0.75rem] font-bold text-bmu-red">
                  Only 50 units remaining — secure your slot now!
                </span>
              </div>
            )}

            <h2 id="app-heading" className="font-bold text-bmu-ink leading-tight"
              style={{ fontSize: "clamp(1.05rem, 1.6vw, 1.3rem)" }}>
              Step 1 — Fill Your Details
            </h2>

            <form onSubmit={handleSubmit(onFormSubmit)} noValidate className="space-y-3">

              {/* Full Name */}
              <div>
                <label htmlFor="reg-name" className="form-label">
                  <User size={12} className="inline mr-1" aria-hidden="true" />
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="reg-name" type="text" autoComplete="name"
                  placeholder="Your full name"
                  className={cn("form-input", errors.fullName && "border-red-400")}
                  disabled={!isOpen || step === "paying"}
                  {...register("fullName")}
                />
                {errors.fullName && <p className="form-error" role="alert">{errors.fullName.message}</p>}
              </div>

              {/* Mobile */}
              <div>
                <label htmlFor="reg-mobile" className="form-label">
                  <Phone size={12} className="inline mr-1" aria-hidden="true" />
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  id="reg-mobile" type="tel" inputMode="numeric" autoComplete="tel"
                  placeholder="10-digit mobile number"
                  className={cn("form-input", errors.mobile && "border-red-400")}
                  disabled={!isOpen || step === "paying"}
                  {...register("mobile")}
                />
                {errors.mobile && <p className="form-error" role="alert">{errors.mobile.message}</p>}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="reg-email" className="form-label">
                  <Mail size={12} className="inline mr-1" aria-hidden="true" />
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  id="reg-email" type="email" autoComplete="email"
                  placeholder="your@email.com"
                  className={cn("form-input", errors.email && "border-red-400")}
                  disabled={!isOpen || step === "paying"}
                  {...register("email")}
                />
                {errors.email && <p className="form-error" role="alert">{errors.email.message}</p>}
              </div>

              {/* Configuration */}
              <div>
                <label htmlFor="reg-unit" className="form-label">
                  <Home size={12} className="inline mr-1" aria-hidden="true" />
                  Configuration <span className="text-red-500">*</span>
                </label>
                <select
                  id="reg-unit" defaultValue=""
                  className={cn("form-input form-select", errors.unitPreference && "border-red-400")}
                  disabled={!isOpen || step === "paying"}
                  {...register("unitPreference")}
                >
                  <option value="" disabled>Select configuration</option>
                  <option value="1bhk">1 BHK — 881 to 895 sq.ft.</option>
                  <option value="2bhk">2 BHK — 1,395 to 1,675 sq.ft.</option>
                  <option value="3bhk">3 BHK — 1,916 to 1,982 sq.ft.</option>
                </select>
                {errors.unitPreference && <p className="form-error" role="alert">{errors.unitPreference.message}</p>}
              </div>

              {/* Submit → proceed to payment */}
              <button
                type="submit"
                className="btn-apply w-full justify-center"
                style={{ fontSize: "0.95rem", padding: "0.75rem 1rem" }}
                disabled={!isOpen || loading || step === "paying"}
              >
                {loading ? (
                  <><span className="app-spinner" aria-hidden="true" /> Please wait…</>
                ) : !isOpen ? (
                  <><Lock size={15} aria-hidden="true" /> Registration Closed</>
                ) : step === "paying" ? (
                  <><span className="app-spinner" aria-hidden="true" /> Opening Payment…</>
                ) : (
                  <>Proceed to Payment <ArrowRight size={15} aria-hidden="true" /></>
                )}
              </button>

            </form>

            {error && (
              <div className="flex items-start gap-2 text-[0.78rem] text-red-700 bg-red-50 border border-red-200 px-3 py-2" role="alert">
                <AlertTriangle size={14} className="flex-shrink-0 mt-0.5 text-red-600" aria-hidden="true" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* ── Pane 2: Amount ──────────────────────────────────── */}
          <div className="app-pane flex flex-col justify-center gap-2" style={{ background: "#fff" }}>
            <div className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-bmu-muted mb-0.5">
              Registration Amount
            </div>
            <div className="font-bold text-bmu-ink leading-none"
                 style={{ fontSize: "clamp(2rem, 3.5vw, 2.6rem)" }}>
              ₹{amount.toLocaleString("en-IN")}
            </div>
            <div className="h-0.5 w-8 bg-bmu-orange mt-0.5" />
            <p className="text-bmu-muted text-[0.78rem] leading-relaxed mt-1">
              One-time registration fee. Fill your details on the left,
              then complete payment via Razorpay.
            </p>
            <div className="flex flex-col gap-1 mt-2">
              <div className="flex items-center gap-1.5 text-[0.72rem] text-bmu-muted">
                <ShieldCheck size={12} className="text-bmu-green flex-shrink-0" aria-hidden="true" />
                Secured via Razorpay · 256-bit SSL
              </div>
              <div className="flex items-center gap-1.5 text-[0.72rem] text-bmu-muted">
                <CheckCircle2 size={12} className="text-bmu-green flex-shrink-0" aria-hidden="true" />
                Payment powered by Razorpay
              </div>
            </div>

            {/* Dates */}
            {isOpen ? (
              <div className="border border-bmu-line bg-[#faf8f6] flex flex-col text-[0.7rem] mt-2">
                <div className="flex items-center gap-2 px-3 py-1.5 border-b border-bmu-line">
                  <span className="text-bmu-orange">📅</span>
                  <span className="text-bmu-muted">Registration Open</span>
                  <span className="font-bold text-bmu-ink ml-auto">
                    {CONFIG.REGISTRATION_START} – {CONFIG.REGISTRATION_END}
                  </span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5">
                  <span className="text-bmu-green">✓</span>
                  <span className="text-bmu-muted">Allotment Date</span>
                  <span className="font-bold text-bmu-ink ml-auto">{CONFIG.ALLOTMENT_DATE}</span>
                </div>
              </div>
            ) : (
              <div className="border border-bmu-line bg-[#faf8f6] flex items-center gap-2 px-3 py-2 text-[0.72rem] mt-2">
                <span className="text-bmu-green">✓</span>
                <span className="text-bmu-muted">Allotment Date</span>
                <span className="font-bold text-bmu-ink ml-auto">{CONFIG.ALLOTMENT_DATE}</span>
              </div>
            )}
          </div>

          {/* ── Pane 3: Configurations ──────────────────────────── */}
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
              Same registration fee for all configurations.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
