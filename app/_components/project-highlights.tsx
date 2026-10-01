"use client";

import { PROJECT, formatSqftRange } from "@/app/_data/project";
import { useEffect, useRef } from "react";

/** Simple hook: add `is-visible` to an element when it enters the viewport */
function useReveal(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.classList.add("is-visible"); },
      { rootMargin: "-60px", threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);
}

const CARDS = [
  {
    num: "01", title: "Configurations", color: "bg-bmu-red-800", href: "#floor-plans",
    desc: "Available unit types",
    content: (
      <table className="w-full text-[0.87rem]">
        <tbody>
          {PROJECT.unitConfigs.map((u) => (
            <tr key={u.id} className="border-b border-bmu-line last:border-0">
              <td className="py-2 font-bold text-bmu-ink w-1/3">{u.name}</td>
              <td className="py-2 text-bmu-muted">{formatSqftRange(u.superAreaSqftMin, u.superAreaSqftMax)}</td>
              <td className="py-2 text-right">
                <span className={u.status === "Available" ? "avail-badge-available" : "avail-badge-enquire"}>
                  {u.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    ),
  },
  {
    num: "02", title: "Unit Sizes", color: "bg-bmu-red-600", href: "#floor-plans",
    desc: "Super built-up area",
    content: (
      <div className="space-y-2.5">
        {PROJECT.unitConfigs.map((u) => (
          <div key={u.id} className="flex items-center gap-2">
            <span className="text-[0.7rem] font-bold uppercase tracking-[0.08em] bg-bmu-orange text-white px-2 py-0.5 flex-shrink-0">
              {u.name}
            </span>
            <span className="text-[0.9rem] font-bold text-bmu-ink">
              {formatSqftRange(u.superAreaSqftMin, u.superAreaSqftMax)}
            </span>
          </div>
        ))}
        <p className="text-[0.73rem] text-bmu-muted mt-1">Super built-up. Carpet area may vary.</p>
      </div>
    ),
  },
  {
    num: "03", title: "Lifestyle Amenities", color: "bg-bmu-green-600", href: "#amenities",
    desc: "Recreation & community",
    content: (
      <ul className="space-y-1.5">
        {["Swimming Pool","Gymnasium","Temple within Campus","Landscaped Park","Kids Play Zone","Community Center","Yoga Area","Senior Citizen Corner"].map((a) => (
          <li key={a} className="flex items-center gap-2 text-[0.87rem] text-bmu-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-bmu-green flex-shrink-0" aria-hidden="true" />
            {a}
          </li>
        ))}
      </ul>
    ),
  },
  {
    num: "04", title: "Security & Services", color: "bg-bmu-orange-600", href: "#amenities",
    desc: "Safety & infrastructure",
    content: (
      <ul className="space-y-1.5">
        {["CCTV Surveillance 24×7","Boom Barrier Entry","High-Speed Lifts","Intercom Facility","Fire Safety System","100% Power Backup","Covered Car Parking","Wi-Fi / DTH Provision"].map((a) => (
          <li key={a} className="flex items-center gap-2 text-[0.87rem] text-bmu-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-bmu-orange flex-shrink-0" aria-hidden="true" />
            {a}
          </li>
        ))}
      </ul>
    ),
  },
];

export function ProjectHighlights() {
  const gridRef = useRef<HTMLDivElement>(null);
  useReveal(gridRef);

  return (
    <section id="highlights" aria-labelledby="highlights-heading" className="section-wrapper">
      <div className="container-x">
        <div className="section-header">
          <div className="section-kicker">Project Highlights</div>
          <h2 id="highlights-heading" className="section-title">What the Project Offers</h2>
          <span className="section-rule" />
          <p className="prose-body mt-1">
            Configurations, unit sizes, lifestyle amenities and residential services at
            Braj Murliwala Residency.
          </p>
        </div>

        {/* Wrap the whole grid — individual Reveal wrappers break gap-px grids */}
        <div ref={gridRef} className="reveal grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-bmu-line">
          {CARDS.map((c) => (
            <div key={c.num} className="highlight-card">
              <div className={`highlight-card-header ${c.color}`}>
                <div className="flex-1">
                  <div className="text-white/55 text-[0.62rem] font-bold tracking-widest mb-0.5">{c.num}</div>
                  <div>{c.title}</div>
                </div>
              </div>
              <div className="highlight-card-body">
                <p className="text-[0.7rem] text-bmu-muted uppercase tracking-[0.08em] font-semibold mb-2.5">{c.desc}</p>
                <div className="flex-1">{c.content}</div>
                <a href={c.href} className="mt-3.5 text-[0.8rem] font-bold text-bmu-red hover:text-bmu-orange inline-flex items-center gap-1 transition-colors">
                  View Details →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
