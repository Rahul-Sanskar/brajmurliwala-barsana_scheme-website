import Link from "next/link";
import Image from "next/image";
import { MapPin, FileText, Lock, ExternalLink } from "lucide-react";
import { NAV_ANCHORS, PROJECT, SITE_LINKS, CONFIG } from "@/app/_data/project";

export function Footer() {
  const sitemapLinks = NAV_ANCHORS.filter((a) => a.id !== "home" && !a.primary);

  return (
    <footer className="footer">
      {/* ── Main footer body ──────────────────────────────── */}
      <div className="container-x py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-[0.88rem]">

        {/* Col 1 — Brand */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="relative h-14 w-14 flex-shrink-0 bg-white/10 overflow-hidden border border-white/20">
              <Image src="/braj/logo.png" alt={`${PROJECT.name} logo`}
                fill sizes="56px" className="object-contain bg-white" />
            </div>
            <div className="leading-tight">
              <div className="text-[0.62rem] font-bold uppercase tracking-[0.2em] text-bmu-orange mb-0.5">
                {PROJECT.portal.name}
              </div>
              <div className="text-[1rem] font-bold text-white leading-tight">
                {PROJECT.name}
              </div>
              <div className="text-[0.62rem] uppercase tracking-[0.16em] footer-muted mt-0.5">
                {PROJECT.location.short}
              </div>
            </div>
          </div>
          <p className="footer-muted leading-relaxed text-[0.83rem]">
            {PROJECT.portal.description}
          </p>
          <p className="footer-muted text-[0.78rem] mt-2">
            Developed by {PROJECT.developer.name}.
          </p>
        </div>

        {/* Col 2 — Quick links */}
        <div>
          <div className="footer-heading">Quick Links</div>
          <ul className="space-y-2">
            {sitemapLinks.map((l) => (
              <li key={l.id}>
                <a href={l.href} className="footer-muted hover:text-bmu-orange flex items-center gap-1.5 transition-colors">
                  <span className="h-1 w-1 rounded-full bg-bmu-orange flex-shrink-0" aria-hidden="true" />
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3 — Documents */}
        <div>
          <div className="footer-heading">Documents</div>
          <ul className="space-y-2">
            {PROJECT.documents.map((d) => (
              <li key={d.id}>
                <a href="#documents" className="footer-muted hover:text-bmu-orange flex items-start gap-2 transition-colors">
                  <FileText size={13} className="mt-0.5 flex-shrink-0 text-bmu-orange/60" aria-hidden="true" />
                  <span>{d.title}</span>
                </a>
              </li>
            ))}
            <li>
              {CONFIG.REGISTRATION_OPEN ? (
                <a href="#application" className="footer-muted hover:text-bmu-orange flex items-center gap-2 transition-colors font-semibold">
                  <FileText size={13} className="text-bmu-orange" aria-hidden="true" />
                  Register Now
                </a>
              ) : (
                <span className="footer-muted flex items-center gap-2 opacity-55 font-semibold">
                  <Lock size={13} className="text-bmu-orange/50" aria-hidden="true" />
                  Registration Closed
                </span>
              )}
            </li>
          </ul>
        </div>

        {/* Col 4 — Contact */}
        <div>
          <div className="footer-heading">Contact</div>
          <ul className="space-y-3">
            <li className="flex items-start gap-2.5">
              <MapPin size={14} className="mt-0.5 flex-shrink-0 text-bmu-orange/70" aria-hidden="true" />
              <span className="footer-muted text-[0.83rem] leading-relaxed">
                {PROJECT.contact.addressLines.map((l, i) => (
                  <span key={i}>{l}{i < PROJECT.contact.addressLines.length - 1 ? <br /> : null}</span>
                ))}
              </span>
            </li>
            <li>
              <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(PROJECT.contact.mapQuery)}`}
                target="_blank" rel="noreferrer"
                className="flex items-center gap-2.5 footer-muted hover:text-bmu-orange transition-colors text-[0.83rem]">
                <ExternalLink size={14} className="flex-shrink-0 text-bmu-orange/70" aria-hidden="true" />
                View on Google Maps
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* ── Bottom bar ──────────────────────────────────────── */}
      <div className="footer-line" />
      <div style={{ background: "rgba(0,0,0,0.25)" }}>
        <div className="container-x py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[0.76rem] footer-muted">
          <div>
            &copy; {new Date().getFullYear()} {PROJECT.portal.name} &middot; {PROJECT.name}.
            All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <Link href={SITE_LINKS.privacy} className="hover:text-bmu-orange transition-colors">
              Privacy Policy
            </Link>
            <Link href={SITE_LINKS.terms} className="hover:text-bmu-orange transition-colors">
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
