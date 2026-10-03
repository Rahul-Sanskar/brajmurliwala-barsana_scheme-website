"use client";

/**
 * ApplicationSection — immediately below the hero.
 * Red/orange institutional strip.
 * Single Apply Now button (not duplicated).
 * Amount and status from CONFIG only — never hardcoded.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { FileText, Lock, AlertTriangle, CheckCircle2, ShieldCheck } from "lucide-react";
import { CONFIG, PROJECT } from "@/app/_data/project";

/* ── Razorpay types ─────────────────────────────────────────────── */
interface RazorpayOptions {
  key: string; amount: number; currency: string;
  name: string; description: string; order_id: string;
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

export function ApplicationSection() {
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState<string | null>(null);
  const mountedRef = useRef(true);
  useEffect(() => () => { mountedRef.current = false; }, []);

  const isOpen     = CONFIG.APPLICATION_STATUS === "OPEN";
  const enabled    = CONFIG.RAZORPAY_ENABLED;
  const amount     = CONFIG.APPLICATION_AMOUNT;

  const handleApply = useCallback(async () => {
    setError(null);
    if (!enabled) { setError("Online payment not yet configured. Please call us."); return; }
    setLoading(true);
    try {
      await loadRazorpayScript();
      const res  = await fetch("/api/razorpay/create-order", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amountInr: amount }),
      });
      const data = await res.json() as { orderId?: string; amount?: number; currency?: string; keyId?: string; error?: string; code?: string };
      if (!res.ok || !data.orderId) {
        if (mountedRef.current) setError(
          data.code === "RAZORPAY_NOT_CONFIGURED" ? "Payment not configured." :
          data.code === "APPLICATIONS_CLOSED"     ? "Applications are currently closed." :
          data.error ?? "Could not initiate payment."
        );
        setLoading(false); return;
      }
      if (!window.Razorpay) { setError("Payment gateway unavailable."); setLoading(false); return; }
      new window.Razorpay({
        key: data.keyId!, amount: data.amount!, currency: data.currency ?? "INR",
        name: PROJECT.name, description: `Application Fee — ${PROJECT.portal.name}`,
        order_id: data.orderId,
        handler: async (r) => {
          try {
            const v = await fetch("/api/razorpay/verify", {
              method: "POST", headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ razorpay_order_id: r.razorpay_order_id, razorpay_payment_id: r.razorpay_payment_id, razorpay_signature: r.razorpay_signature }),
            });
            const vd = await v.json() as { success?: boolean; paymentId?: string; orderId?: string; amountInr?: number; error?: string };
            const p = new URLSearchParams(vd.success
              ? { status: "success", paymentId: vd.paymentId ?? r.razorpay_payment_id, orderId: vd.orderId ?? r.razorpay_order_id, amountInr: String(vd.amountInr ?? amount) }
              : { status: "failed", reason: vd.error ?? "Verification failed." });
            window.location.href = `/results?${p}`;
          } catch { window.location.href = "/results?status=failed&reason=Verification+failed."; }
        },
        theme: { color: "#E87516" },
        modal: { ondismiss: () => { if (mountedRef.current) { setLoading(false); window.location.href = "/results?status=cancelled"; } } },
      }).open();
    } catch (e) {
      if (mountedRef.current) { setError(e instanceof Error ? e.message : "Unexpected error."); setLoading(false); }
    }
  }, [amount, enabled]);

  return (
    <section id="application" aria-labelledby="app-heading" className="app-section">
      {/* ── Urgency bar ─────────────────────────────────────────── */}
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

      {/* ── Three white panes ───────────────────────────────────── */}
      <div className="container-x">
        <div className="app-grid" style={{ gap: "1px", background: "rgba(255,255,255,0.08)" }}>

          {/* Pane 1 — Apply CTA */}
          <div className="app-pane flex flex-col justify-center gap-3"
               style={{ background: "#fff" }}>
            {/* Scarcity badge */}
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

            {error && (
              <div className="flex items-start gap-2 text-[0.78rem] text-red-700 bg-red-50 border border-red-200 px-3 py-2" role="alert">
                <AlertTriangle size={14} className="flex-shrink-0 mt-0.5 text-red-600" aria-hidden="true" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Pane 2 — Amount + Register Now button */}
          <div className="app-pane flex flex-col justify-center gap-2"
               style={{ background: "#fff" }}>
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

            {/* Register Now — full width, large, below ₹21,000 */}
            <button
              type="button"
              className="btn-apply w-full justify-center"
              style={{ fontSize: "1rem", padding: "0.85rem 1rem", letterSpacing: "0.08em" }}
              onClick={handleApply}
              disabled={!isOpen || loading}
              aria-disabled={!isOpen || loading}
              aria-busy={loading}
            >
              {loading ? (
                <><span className="app-spinner" aria-hidden="true" /> Processing…</>
              ) : !isOpen ? (
                <><Lock size={16} aria-hidden="true" /> Registration Closed</>
              ) : (
                <><FileText size={16} aria-hidden="true" /> Register Now</>
              )}
            </button>

            {/* Dates strip — shows registration dates when open, allotment date when closed */}
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

            {error && (
              <div className="flex items-start gap-2 text-[0.78rem] text-red-700 bg-red-50 border border-red-200 px-3 py-2 mt-1" role="alert">
                <AlertTriangle size={14} className="flex-shrink-0 mt-0.5 text-red-600" aria-hidden="true" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Pane 3 — Configurations */}
          <div className="app-pane flex flex-col justify-center gap-2"
               style={{ background: "#fff" }}>
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
    </section>
  );
}
