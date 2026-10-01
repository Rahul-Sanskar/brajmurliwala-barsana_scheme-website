"use client";

import { CONFIG, PROJECT } from "@/app/_data/project";

/**
 * NoticeStrip — institutional information ribbon.
 * Deep red background with scrolling project information.
 * Sits between the snapshot and the project overview.
 */
export function NoticeStrip() {
  const items = [
    `${PROJECT.portal.name}`,
    `${PROJECT.name}`,
    `${PROJECT.location.short}`,
    `1 / 2 / 3 BHK Residences`,
    `Pre-Launch Rate: ₹${PROJECT.pricing.preLaunchRatePerSqft.toLocaleString("en-IN")} per sq.ft.`,
    `Starting from ₹74 Lakh`,
    `Application Amount: ₹${CONFIG.APPLICATION_AMOUNT.toLocaleString("en-IN")}`,
    `Bank Loan up to ${PROJECT.pricing.bankLoanUptoPercent}%`,
    `Site visits available — call ${PROJECT.contact.phonePrimary}`,
  ];

  // duplicate for seamless loop
  const track = [...items, ...items];

  return (
    <div
      id="updates"
      aria-label="Project information"
      style={{
        background: "#68161A",
        borderBottom: "3px solid #E87516",
        overflow: "hidden",
      }}
    >
      <div style={{ display: "flex", alignItems: "stretch" }}>
        {/* Fixed label */}
        <div style={{
          flexShrink: 0,
          background: "#E87516",
          color: "#fff",
          fontWeight: 800,
          fontSize: "0.65rem",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          padding: "0.55rem 1rem",
          display: "flex",
          alignItems: "center",
          whiteSpace: "nowrap",
        }}>
          Project Info
        </div>

        {/* Scrolling track */}
        <div style={{ flex: 1, overflow: "hidden", whiteSpace: "nowrap", display: "flex", alignItems: "center" }}>
          <style>{`
            @keyframes noticeScroll {
              0%   { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .notice-scroll-track {
              display: inline-block;
              animation: noticeScroll 40s linear infinite;
              padding-left: 3rem;
            }
            .notice-scroll-track:hover { animation-play-state: paused; }
          `}</style>
          <span className="notice-scroll-track">
            {track.map((item, i) => (
              <span key={i} style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                color: "rgba(255,255,255,0.85)",
                fontSize: "0.78rem",
                fontWeight: 500,
                marginRight: "2.5rem",
              }}>
                <span style={{
                  display: "inline-block",
                  width: "4px",
                  height: "4px",
                  borderRadius: "50%",
                  background: "#E87516",
                  flexShrink: 0,
                }} aria-hidden="true" />
                {item}
              </span>
            ))}
          </span>
        </div>
      </div>
    </div>
  );
}
