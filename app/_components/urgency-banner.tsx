"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Clock, Flame } from "lucide-react";
import { CONFIG } from "@/app/_data/project";
import { useEnquiry } from "@/app/_components/enquiry-trigger";

export function UrgencyBanner() {
  const [visible, setVisible] = useState(true);
  const { open } = useEnquiry();

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

  if (CONFIG.APPLICATION_STATUS !== "OPEN") return null;

  return (
    <div
      className={`urgency-banner${visible ? "" : " urgency-banner-hidden"}`}
      role="alert"
      aria-live="polite"
      aria-label="Limited units warning"
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
            <span>
              Pre-launch <strong>₹7,999/sq.ft.</strong>
              <span className="urgency-arrow"> → </span>
              rises to <strong>₹8,499</strong> after launch
            </span>
          </div>

          <div className="urgency-cta-wrap">
            <Clock size={13} className="flex-shrink-0" aria-hidden="true" />
            <button type="button" onClick={open} className="urgency-cta">
              Enquire Now — Free
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
