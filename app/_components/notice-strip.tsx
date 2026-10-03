"use client";

import { CONFIG, PROJECT } from "@/app/_data/project";

export function NoticeStrip() {
  type NoticeItem = { text: string; highlight?: "scheme" | "divine" };

  const items: NoticeItem[] = [
    { text: "⚠️ ONLY 50 UNITS LEFT — Book your slot before it's gone!",  highlight: "scheme" },
    { text: PROJECT.portal.name,                                    highlight: "scheme" },
    { text: "🔥 Pre-launch ₹7,999/sq.ft. → ₹8,499 after launch — every day costs more!" },
    { text: PROJECT.name },
    { text: "City of Shree Radha Rani — Barsana",                  highlight: "divine" },
    { text: "Steps from Shree Radha Rani Mandir & Kirti Mandir",   highlight: "divine" },
    { text: `Pre-Launch Rate: ₹${PROJECT.pricing.preLaunchRatePerSqft.toLocaleString("en-IN")}/sq.ft. — LIMITED PERIOD ONLY` },
    { text: PROJECT.location.short },
    { text: "1 / 2 / 3 BHK Residences — Starting ₹74 Lakh" },
    { text: `Bank Loan up to ${PROJECT.pricing.bankLoanUptoPercent}% — Apply NOW!` },
    { text: `Application Amount: ₹${CONFIG.APPLICATION_AMOUNT.toLocaleString("en-IN")} — Block your unit today` },
    { text: "🙏 Shree Radha Rani ke aashirwad mein apna ghar paayein",  highlight: "divine" },
    { text: `Site visits daily — call ${PROJECT.contact.phonePrimary} NOW` },
    { text: "50 units only — first come, first served. Don't let someone else take yours." },
  ];

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
              animation: noticeScroll 55s linear infinite;
              padding-left: 3rem;
            }
            .notice-scroll-track:hover { animation-play-state: paused; }
            .notice-item-scheme {
              color: #FFD700 !important;
              font-weight: 800 !important;
              font-size: 0.85rem !important;
              letter-spacing: 0.06em;
              text-shadow: 0 0 8px rgba(255,215,0,0.55);
            }
            .notice-item-divine {
              color: #FFC2C2 !important;
              font-weight: 800 !important;
              font-size: 0.85rem !important;
              letter-spacing: 0.04em;
              text-shadow: 0 0 8px rgba(255,100,100,0.45);
            }
            .notice-dot-scheme { background: #FFD700 !important; }
            .notice-dot-divine { background: #FFC2C2 !important; }
          `}</style>
          <span className="notice-scroll-track">
            {track.map((item, i) => (
              <span key={i} style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                marginRight: "2.5rem",
              }}>
                <span
                  style={{
                    display: "inline-block",
                    width: "4px", height: "4px",
                    borderRadius: "50%",
                    background: "#E87516",
                    flexShrink: 0,
                  }}
                  className={
                    item.highlight === "scheme" ? "notice-dot-scheme" :
                    item.highlight === "divine" ? "notice-dot-divine" : ""
                  }
                  aria-hidden="true"
                />
                <span
                  style={{
                    color: "rgba(255,255,255,0.85)",
                    fontSize: "0.78rem",
                    fontWeight: 500,
                  }}
                  className={
                    item.highlight === "scheme" ? "notice-item-scheme" :
                    item.highlight === "divine" ? "notice-item-divine" : ""
                  }
                >
                  {item.text}
                </span>
              </span>
            ))}
          </span>
        </div>
      </div>
    </div>
  );
}
