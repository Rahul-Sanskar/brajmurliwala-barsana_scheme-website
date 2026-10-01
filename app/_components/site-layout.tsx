"use client";

import Image from "next/image";
import { useState } from "react";
import { Maximize2, X } from "lucide-react";
import { Reveal } from "@/app/_components/reveal-hooks";

export function SiteLayout() {
  const [open, setOpen] = useState(false);

  return (
    <section id="site-layout" aria-labelledby="site-layout-heading" className="section-wrapper">
      <div className="container-x">
        <div className="section-header-row">
          <div>
            <div className="section-kicker">Layout &amp; Planning</div>
            <h2 id="site-layout-heading" className="section-title">Master Plan</h2>
            <span className="section-rule" />
            <p className="prose-body mt-1">
              Explore the planned layout of Braj Murliwala Residency — towers, community spaces,
              green areas and common infrastructure.
            </p>
          </div>
          <button onClick={() => setOpen(true)} className="btn-outline flex-shrink-0" aria-label="View master plan full size">
            <Maximize2 size={14} aria-hidden="true" /> View Full Plan
          </button>
        </div>

        <Reveal>
          <div
            className="relative w-full overflow-hidden cursor-zoom-in bg-white border border-bmu-line section-has-image"
            onClick={() => setOpen(true)}
            role="button" tabIndex={0}
            aria-label="Master plan — click to enlarge"
            onKeyDown={(e) => e.key === "Enter" && setOpen(true)}
            style={{ minHeight: "380px" }}
          >
            <Image
              src="/braj/site/floor-plan-banner.png"
              alt="Braj Murliwala Residency master plan — site layout on Goverdhan Road, Barsana"
              width={1400} height={750}
              className="w-full h-auto object-contain"
              sizes="(min-width: 1360px) 1360px, 100vw"
            />
            <div className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-bmu-red/85 text-white text-[0.7rem] font-bold px-3 py-1.5 uppercase tracking-[0.08em]">
              <Maximize2 size={12} aria-hidden="true" /> View Full Plan
            </div>
          </div>
        </Reveal>

        <p className="text-[0.72rem] text-bmu-muted mt-2">
          * Master plan is indicative and subject to change. Approved plan will be available once RERA registration is published.
        </p>
      </div>

      {open && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Master plan full view"
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}>
          <div className="relative max-w-6xl w-full max-h-[92vh] overflow-auto bg-white">
            <button onClick={() => setOpen(false)} className="modal-close" aria-label="Close">
              <X size={16} aria-hidden="true" />
            </button>
            <Image
              src="/braj/site/floor-plan-banner.png"
              alt="Braj Murliwala Residency — master plan full size"
              width={1800} height={950}
              className="w-full h-auto"
              sizes="(min-width: 1280px) 1200px, 100vw"
            />
          </div>
        </div>
      )}
    </section>
  );
}
