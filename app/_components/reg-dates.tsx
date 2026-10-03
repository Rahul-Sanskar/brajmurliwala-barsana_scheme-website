import { Calendar, CheckCircle2 } from "lucide-react";
import { CONFIG } from "@/app/_data/project";

/**
 * RegDates — small date strip shown under every "Register Now" button.
 * variant="light"  → dark text on white/light background (default)
 * variant="dark"   → light text on dark/red background
 */
export function RegDates({ variant = "light" }: { variant?: "light" | "dark" }) {
  const isLight = variant === "light";
  const label   = isLight ? "text-bmu-muted"          : "text-white/50";
  const value   = isLight ? "text-bmu-ink font-bold"  : "text-white font-bold";
  const divider = isLight ? "border-bmu-line"         : "border-white/15";

  return (
    <div
      className={`reg-dates ${isLight ? "reg-dates-light" : "reg-dates-dark"}`}
      aria-label="Registration and allotment schedule"
    >
      <div className={`reg-dates-row border-b ${divider}`}>
        <Calendar size={11} className={isLight ? "text-bmu-orange" : "text-bmu-orange"} aria-hidden="true" />
        <span className={`${label} text-[0.7rem]`}>Registration Open</span>
        <span className={`${value} text-[0.72rem] ml-auto`}>
          {CONFIG.REGISTRATION_START} – {CONFIG.REGISTRATION_END}
        </span>
      </div>
      <div className="reg-dates-row">
        <CheckCircle2 size={11} className={isLight ? "text-bmu-green" : "text-green-400"} aria-hidden="true" />
        <span className={`${label} text-[0.7rem]`}>Allotment Date</span>
        <span className={`${value} text-[0.72rem] ml-auto`}>
          {CONFIG.ALLOTMENT_DATE}
        </span>
      </div>
    </div>
  );
}
