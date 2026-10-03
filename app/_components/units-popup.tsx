"use client";

import { useEffect, useState } from "react";
import { X, AlertTriangle, Flame } from "lucide-react";
import { useEnquiry } from "@/app/_components/enquiry-trigger";
import { CONFIG } from "@/app/_data/project";

const STORAGE_KEY = "bmu_popup_seen";
const DELAY_MS    = 4000;   // show after 4 s
const SNOOZE_H    = 6;      // don't re-show for 6 hours

/**
 * UnitsPopup — appears after DELAY_MS on first visit (or after snooze expires).
 * Shows scarcity: "Only 50 units left", price rise, enquiry CTA.
 */
export function UnitsPopup() {
  const [visible, setVisible] = useState(false);
  const { open: openEnquiry } = useEnquiry();

  useEffect(() => {
    // Check snooze
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const ts = parseInt(raw, 10);
        if (Date.now() - ts < SNOOZE_H * 60 * 60 * 1000) return;
      }
    } catch { /* storage blocked */ }

    const t = setTimeout(() => setVisible(true), DELAY_MS);
    return () => clearTimeout(t);
  }, []);

  const dismiss = () => {
    setVisible(false);
    try { sessionStorage.setItem(STORAGE_KEY, String(Date.now())); } catch { /* */ }
  };

  const handleEnquire = () => {
    dismiss();
    openEnquiry();
  };

  if (!visible || CONFIG.APPLICATION_STATUS !== "OPEN") return null;

  return (
    <div
      className="units-popup-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="units-popup-heading"
      onClick={(e) => e.target === e.currentTarget && dismiss()}
    >
      <div className="units-popup">

        {/* Close */}
        <button
          type="button"
          onClick={dismiss}
          className="units-popup-close"
          aria-label="Close"
        >
          <X size={15} />
        </button>

        {/* Icon */}
        <div className="units-popup-icon" aria-hidden="true">
          <AlertTriangle size={28} />
        </div>

        {/* Heading */}
        <h2 id="units-popup-heading" className="units-popup-heading">
          ⚠️ Only <span className="units-popup-number">50 Units</span> Left!
        </h2>

        <p className="units-popup-sub">
          Braj Murliwala Residency — Goverdhan Road, Barsana
        </p>

        {/* Price rise */}
        <div className="units-popup-price-row">
          <Flame size={14} className="flex-shrink-0" aria-hidden="true" />
          <span>
            Pre-launch <strong>₹7,999/sq.ft.</strong> rises to{" "}
            <strong>₹8,499</strong> after launch.
            <br />
            <span className="text-bmu-orange font-bold">
              Every day you wait costs you more.
            </span>
          </span>
        </div>

        {/* Bullets */}
        <ul className="units-popup-bullets">
          {[
            "Steps from Shree Radha Rani Mandir & Kirti Mandir",
            "1, 2 & 3 BHK — starting ₹74 Lakh",
            "Bank loan up to 90% available",
            "Secure your slot now — first come, first served",
          ].map((b) => (
            <li key={b}>
              <span className="units-popup-bullet-dot" aria-hidden="true" />
              {b}
            </li>
          ))}
        </ul>

        {/* CTAs */}
        <button type="button" className="units-popup-cta-primary" onClick={handleEnquire}>
          Register Now — It&apos;s Free
        </button>
        <button type="button" className="units-popup-cta-secondary" onClick={dismiss}>
          Remind me later
        </button>

      </div>
    </div>
  );
}
