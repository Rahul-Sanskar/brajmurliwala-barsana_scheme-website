"use client";

import Image from "next/image";
import { useState } from "react";
import { Maximize2, X } from "lucide-react";
import { PROJECT, formatSqftRange } from "@/app/_data/project";
import { cn } from "@/app/_lib/utils";
import { Reveal } from "@/app/_components/reveal-hooks";

type Plan = { src: string; alt: string; type: string };
type Tab  = { id: string; label: string; plans: Plan[]; config: typeof PROJECT.unitConfigs[0] };

const TABS: Tab[] = [
  {
    id: "1bhk", label: "1 BHK",
    plans: [{ src: "/braj/floorplans/1bhk.png", alt: "1 BHK floor plan — Braj Murliwala Residency, Barsana (881–895 sq.ft.)", type: "1 BHK" }],
    config: PROJECT.unitConfigs[0],
  },
  {
    id: "2bhk", label: "2 BHK",
    plans: [
      { src: "/braj/floorplans/2bhk-ab.png", alt: "2 BHK Type A/B floor plan — Braj Murliwala Residency", type: "Type A/B" },
      { src: "/braj/floorplans/2bhk-cd.png", alt: "2 BHK Type C/D floor plan — Braj Murliwala Residency", type: "Type C/D" },
      { src: "/braj/floorplans/2bhk-ef.png", alt: "2 BHK Type E/F floor plan — Braj Murliwala Residency", type: "Type E/F" },
      { src: "/braj/floorplans/2bhk-gh.png", alt: "2 BHK Type G/H floor plan — Braj Murliwala Residency", type: "Type G/H" },
    ],
    config: PROJECT.unitConfigs[1],
  },
  {
    id: "3bhk", label: "3 BHK",
    plans: [{ src: "/braj/floorplans/3bhk.png", alt: "3 BHK floor plan — Braj Murliwala Residency, Barsana (1916–1982 sq.ft.)", type: "3 BHK" }],
    config: PROJECT.unitConfigs[2],
  },
];

export function FloorPlans() {
  const [tab, setTab]         = useState(0);
  const [modal, setModal]     = useState<{ src: string; alt: string } | null>(null);
  const [planIdx, setPlanIdx] = useState(0);
  const current = TABS[tab];
  const plan    = current.plans[planIdx] ?? current.plans[0];

  return (
    <section id="floor-plans" aria-labelledby="fp-heading" className="section-wrapper-stone">
      <div className="container-x">
        {/* Header row */}
        <div className="section-header-row">
          <div>
            <div className="section-kicker">Unit Configuration</div>
            <h2 id="fp-heading" className="section-title">Floor Plans</h2>
            <span className="section-rule" />
          </div>
        </div>

        {/* Config tabs */}
        <div className="tab-list mb-0" role="tablist" aria-label="Floor plan configurations">
          {TABS.map((t, i) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === i}
              onClick={() => { setTab(i); setPlanIdx(0); }}
              className={cn("tab-btn", tab === i && "tab-btn-active")}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Main layout: responsive CSS class (no inline style grid) ── */}
        <Reveal>
          <div className="fp-main-grid border border-bmu-line overflow-hidden">

            {/* Image pane — takes 65% on desktop, full width on mobile */}
            <div
              className="relative bg-white cursor-zoom-in fp-image-area"
              onClick={() => setModal({ src: plan.src, alt: plan.alt })}
            >
              <Image
                src={plan.src}
                alt={plan.alt}
                fill
                className="object-contain p-4"
                sizes="(min-width: 1024px) 65vw, 100vw"
              />
              <div className="absolute bottom-3 right-3 bg-bmu-red/85 text-white text-[0.68rem] font-bold px-2.5 py-1.5 flex items-center gap-1.5 z-10">
                <Maximize2 size={11} aria-hidden="true" /> Enlarge
              </div>
            </div>

            {/* Info pane — 35% on desktop, full width on mobile */}
            <div className="bg-bmu-stone border-t md:border-t-0 md:border-l border-bmu-line p-5 md:p-6 flex flex-col">
              <h3 className="font-bold text-bmu-ink text-[1rem] mb-4">
                {current.config.name} — {plan.type}
              </h3>

              {/* Key facts */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                {[
                  { label: "Configuration", value: current.config.name },
                  { label: "Super Area",    value: formatSqftRange(current.config.superAreaSqftMin, current.config.superAreaSqftMax) },
                  { label: "Pre-Launch Rate", value: `₹${current.config.preLaunchRatePerSqft.toLocaleString("en-IN")}/sq.ft.` },
                  { label: "Furnished",     value: current.config.furnishedAvailable ? "Available" : "N/A" },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="text-[0.62rem] font-bold uppercase tracking-[0.1em] text-bmu-muted mb-0.5">{item.label}</div>
                    <div className="font-bold text-bmu-ink text-[0.88rem]">{item.value}</div>
                  </div>
                ))}
              </div>

              {/* Plan type selector for 2 BHK */}
              {current.plans.length > 1 && (
                <div className="mb-5">
                  <div className="text-[0.62rem] font-bold uppercase tracking-[0.1em] text-bmu-muted mb-2">Plan Type</div>
                  <div className="flex flex-wrap gap-1.5">
                    {current.plans.map((p, idx) => (
                      <button
                        key={p.type}
                        onClick={() => setPlanIdx(idx)}
                        className={cn(
                          "px-2.5 py-1 text-[0.72rem] font-semibold border transition-colors",
                          planIdx === idx
                            ? "bg-bmu-red text-white border-bmu-red"
                            : "border-bmu-line text-bmu-muted hover:border-bmu-red hover:text-bmu-red"
                        )}
                      >
                        {p.type}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-[0.75rem] text-bmu-muted mb-5 leading-relaxed">
                Floor plans are indicative. All areas are super built-up. Actual dimensions may vary.
              </p>

              <div className="flex flex-col gap-2 mt-auto">
                <button
                  onClick={() => setModal({ src: plan.src, alt: plan.alt })}
                  className="btn-secondary w-full justify-center"
                >
                  <Maximize2 size={14} aria-hidden="true" /> View Full Plan
                </button>
                <a href="#application" className="btn-apply block text-center">
                  Register Now
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Lightbox */}
      {modal && (
        <div
          className="modal-backdrop"
          role="dialog"
          aria-modal="true"
          onClick={(e) => e.target === e.currentTarget && setModal(null)}
        >
          <div className="relative max-w-5xl w-full bg-white">
            <button onClick={() => setModal(null)} className="modal-close" aria-label="Close">
              <X size={16} aria-hidden="true" />
            </button>
            <Image
              src={modal.src}
              alt={modal.alt}
              width={1200}
              height={900}
              className="w-full h-auto object-contain max-h-[88vh]"
              sizes="(min-width: 1024px) 1000px, 100vw"
            />
          </div>
        </div>
      )}
    </section>
  );
}
