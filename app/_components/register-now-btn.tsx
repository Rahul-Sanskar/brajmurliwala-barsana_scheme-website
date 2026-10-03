"use client";

import { Lock, Calendar, CheckCircle2 } from "lucide-react";
import { CONFIG } from "@/app/_data/project";
import { cn } from "@/app/_lib/utils";

/**
 * RegisterNowBtn — single source of truth for the Register Now / Registration Closed button.
 *
 * When CONFIG.REGISTRATION_OPEN === true:
 *   • Shows "Register Now", scrolls to #application
 *   • Shows registration dates strip below
 *
 * When CONFIG.REGISTRATION_OPEN === false:
 *   • Shows "Registration Closed" (disabled, unclickable)
 *   • Shows "Allotment Date: 25 Oct 2026" below
 *
 * Variants:
 *   "default"  — orange btn-apply style (used in most sections)
 *   "dark"     — same but on dark/red background (enquiry section)
 *   "small"    — compact for table rows, urgency banner etc.
 *   "hero"     — hero panel style (hero-btn-primary)
 */

type Variant = "default" | "dark" | "small" | "hero";

export function RegisterNowBtn({
  variant = "default",
  className = "",
  label,
}: {
  variant?: Variant;
  className?: string;
  label?: string;   // override button text when open
}) {
  const isOpen = CONFIG.REGISTRATION_OPEN;

  /* ── styles per variant ── */
  const btnClass = cn(
    variant === "hero"
      ? "hero-btn-primary"
      : variant === "small"
      ? "btn-apply px-3 py-1.5 text-[0.72rem] inline-flex items-center gap-1"
      : "btn-apply block text-center w-full",
    !isOpen && "opacity-60 cursor-not-allowed pointer-events-none",
    className
  );

  const dateTextClass = variant === "dark"
    ? "text-white/55"
    : "text-bmu-muted";

  const dateBorderClass = variant === "dark"
    ? "border-white/15 bg-black/15"
    : "border-bmu-line bg-[#faf8f6]";

  /* ── Closed state ── */
  if (!isOpen) {
    return (
      <div className="flex flex-col gap-0">
        <button
          type="button"
          disabled
          aria-disabled="true"
          className={btnClass}
        >
          <Lock size={variant === "small" ? 12 : 14} aria-hidden="true" className="inline mr-1.5" />
          Registration Closed
        </button>

        {/* Allotment date strip */}
        <div className={cn("border flex items-center gap-2 px-3 py-2 text-[0.72rem]", dateBorderClass)}>
          <CheckCircle2 size={11} className="text-bmu-green flex-shrink-0" aria-hidden="true" />
          <span className={dateTextClass}>Allotment Date</span>
          <span className={cn("font-bold ml-auto", variant === "dark" ? "text-white" : "text-bmu-ink")}>
            {CONFIG.ALLOTMENT_DATE}
          </span>
        </div>
      </div>
    );
  }

  /* ── Open state ── */
  return (
    <div className="flex flex-col gap-0">
      <a
        href="#application"
        className={btnClass}
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("application")?.scrollIntoView({ behavior: "smooth", block: "start" });
        }}
      >
        {label ?? "Register Now"}
      </a>

      {/* Registration dates strip */}
      <div className={cn("border flex flex-col text-[0.7rem]", dateBorderClass)}>
        <div className={cn("flex items-center gap-2 px-3 py-1.5 border-b", dateBorderClass)}>
          <Calendar size={11} className="text-bmu-orange flex-shrink-0" aria-hidden="true" />
          <span className={dateTextClass}>Registration Open</span>
          <span className={cn("font-bold ml-auto", variant === "dark" ? "text-white" : "text-bmu-ink")}>
            {CONFIG.REGISTRATION_START} – {CONFIG.REGISTRATION_END}
          </span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5">
          <CheckCircle2 size={11} className="text-bmu-green flex-shrink-0" aria-hidden="true" />
          <span className={dateTextClass}>Allotment Date</span>
          <span className={cn("font-bold ml-auto", variant === "dark" ? "text-white" : "text-bmu-ink")}>
            {CONFIG.ALLOTMENT_DATE}
          </span>
        </div>
      </div>
    </div>
  );
}
