"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Clock, Flame, Lock } from "lucide-react";
import { CONFIG } from "@/app/_data/project";

export function UrgencyBanner() {
  const [visible, setVisible] = useState(true);
  const isOpen = CONFIG.REGISTRATION_OPEN;

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setVisible(window.scrollY < window.innerHeight * 0.8);
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`urgency-banner${visible ? "" : " urgency-banner-hidden"}`}
      role="alert"
      aria-live="polite"
      aria-label="Registration status"
    >
      <div className="container-x">
        <div className="urgency-banner-inner">

          <div className="urgency-units">
            <span className="urgency-pulse" aria-hidden="true" />
            <AlertTriangle size={15} className="flex-shrink-0" aria-hidden="true" />
            <span>
              <strong>Only 50 Units Left</strong>
              <span className="urgency-sub"> — register now to secure yours</span>
            </span>
          </div>

          <div className="urgency-price">
            <Flame size={14} className="flex-shrink-0 text-bmu-orange" aria-hidden="true" />
            {isOpen ? (
              <span>
                Pre-launch <strong>₹7,999/sq.ft.</strong>
                <span className="urgency-arrow"> → </span>
                rises to <strong>₹8,499</strong> after launch
              </span>
            ) : (
              <span>
                Allotment Date: <strong>{CONFIG.ALLOTMENT_DATE}</strong>
              </span>
            )}
          </div>

          <div className="urgency-cta-wrap">
            <Clock size={13} className="flex-shrink-0" aria-hidden="true" />
            {isOpen ? (
              <a href="#application" className="urgency-cta">
                Register Now
              </a>
            ) : (
              <span className="urgency-cta" style={{ opacity: 0.55, cursor: "not-allowed", display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
                <Lock size={12} aria-hidden="true" /> Registration Closed
              </span>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
