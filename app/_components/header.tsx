"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, Phone, FileText } from "lucide-react";
import { NAV_ANCHORS, PROJECT } from "@/app/_data/project";
import { cn } from "@/app/_lib/utils";
import { useEnquiry } from "@/app/_components/enquiry-trigger";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { open: openEnquiry } = useEnquiry();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const desktopNavItems = NAV_ANCHORS.filter((a) => !a.primary && a.id !== "home");
  const mobileNavItems  = NAV_ANCHORS.filter((a) => !a.primary);

  return (
    <>
      {/* ── Main header (no utility bar above) ───────────────────────── */}
      <header
        className={cn(
          "sticky top-0 z-40 w-full transition-all duration-150",
          scrolled
            ? "bg-bmu-red-800 shadow-[0_2px_12px_rgba(0,0,0,0.25)]"
            : "bg-bmu-red-800"
        )}
      >
        {/* Project identity row */}
        <div className="border-b border-white/10">
          <div className="container-x flex items-center justify-between py-3 gap-4">
            {/* Brand */}
            <Link href="/" className="flex items-center gap-3 flex-shrink-0">
              <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden bg-white/10 border border-white/20">
                <Image
                  src="/braj/logo.png"
                  alt={`${PROJECT.name} logo`}
                  fill sizes="48px"
                  className="object-contain bg-white"
                  priority
                />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-[0.58rem] font-bold uppercase tracking-[0.22em] text-bmu-orange">
                  {PROJECT.portal.name}
                </span>
                <span className="text-[0.95rem] font-bold text-white leading-tight tracking-tight">
                  {PROJECT.name}
                </span>
                <span className="text-[0.55rem] font-medium uppercase tracking-[0.18em] text-white/60">
                  {PROJECT.location.short}
                </span>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden xl:flex items-center flex-1 justify-center" aria-label="Main navigation">
              {desktopNavItems.map((a) => (
                <a
                  key={a.id}
                  href={a.href}
                  className="px-2.5 py-2 text-[0.72rem] font-medium text-white/80 hover:text-white hover:bg-white/10 whitespace-nowrap transition-colors"
                >
                  {a.label}
                </a>
              ))}
            </nav>

            {/* Right CTAs */}
            <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
              <button
                type="button"
                onClick={openEnquiry}
                className="hidden xl:flex items-center gap-1.5 text-[0.72rem] font-medium text-white/70 hover:text-white transition-colors"
              >
                <Phone size={13} aria-hidden="true" />
                {PROJECT.contact.phonePrimary}
              </button>
              <a
                href="#application"
                className="btn-apply"
                style={{ padding: "0.5rem 1rem", fontSize: "0.7rem", width: "auto" }}
              >
                <FileText size={13} aria-hidden="true" />
                Apply Now
              </a>
            </div>

            {/* Mobile hamburger */}
            <button
              aria-label="Open menu"
              aria-expanded={open}
              className="lg:hidden h-10 w-10 flex items-center justify-center border border-white/25 text-white hover:bg-white/10 transition-colors"
              onClick={() => setOpen(true)}
            >
              <Menu size={20} aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile drawer ─────────────────────────────────────────────── */}
      <div
        className={cn("lg:hidden fixed inset-0 z-50 transition-[visibility]", open ? "visible" : "invisible")}
        id="mobile-drawer"
      >
        <div
          className={cn("absolute inset-0 bg-black/60 transition-opacity duration-200", open ? "opacity-100" : "opacity-0")}
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
        <aside
          className={cn(
            "absolute right-0 top-0 h-full w-[85%] bg-bmu-red-800 shadow-2xl transition-transform duration-200",
            open ? "translate-x-0" : "translate-x-full"
          )}
          aria-label="Navigation"
        >
          {/* Drawer header */}
          <div className="px-4 pt-4 pb-3 border-b border-white/15 flex items-start justify-between">
            <div className="flex flex-col leading-tight">
              <span className="text-[0.6rem] font-bold uppercase tracking-[0.22em] text-bmu-orange">
                {PROJECT.portal.name}
              </span>
              <span className="text-[0.95rem] font-bold text-white mt-0.5 leading-tight">
                {PROJECT.name}
              </span>
              <span className="text-[0.62rem] font-medium uppercase tracking-[0.15em] text-white/55 mt-0.5">
                {PROJECT.location.short}
              </span>
            </div>
            <button
              aria-label="Close menu"
              className="h-9 w-9 flex items-center justify-center border border-white/25 text-white hover:bg-white/10"
              onClick={() => setOpen(false)}
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>

          {/* Nav links */}
          <nav className="flex flex-col overflow-y-auto" aria-label="Mobile navigation">
            {mobileNavItems.map((a) => (
              <a
                key={a.id}
                href={a.href}
                onClick={() => setOpen(false)}
                className="px-5 py-3.5 text-[0.92rem] font-medium text-white/85 border-b border-white/10 hover:bg-white/10 hover:text-white transition-colors"
              >
                {a.label}
              </a>
            ))}
          </nav>

          {/* Mobile CTAs */}
          <div className="px-4 pt-4 pb-5 flex flex-col gap-2.5 border-t border-white/15">
            <button
              type="button"
              onClick={() => { openEnquiry(); setOpen(false); }}
              className="flex items-center justify-center gap-2 py-2.5 border border-white/25 text-white text-[0.82rem] font-semibold hover:bg-white/10 transition-colors"
            >
              <Phone size={15} aria-hidden="true" />
              {PROJECT.contact.phonePrimary}
            </button>
            <a
              href="#application"
              className="btn-apply"
              onClick={() => setOpen(false)}
            >
              <FileText size={14} aria-hidden="true" />
              Apply Now — ₹{PROJECT.pricing && "21,000"}
            </a>
          </div>
        </aside>
      </div>
    </>
  );
}
