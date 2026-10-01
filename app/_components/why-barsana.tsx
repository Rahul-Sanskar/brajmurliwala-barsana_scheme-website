"use client";

import {
  MapPin, Trees, Star, Navigation, Banknote, Home, type LucideIcon,
} from "lucide-react";
import { PROJECT } from "@/app/_data/project";
import { useEffect, useRef } from "react";

const ICON_MAP: Record<string, LucideIcon> = {
  MapPin, Trees, Star, Navigation, Banknote, Home,
};

function useReveal(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.classList.add("is-visible"); },
      { rootMargin: "-60px", threshold: 0.08 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);
}

export function WhyBarsana() {
  const { whyBarsana } = PROJECT;
  const gridRef   = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLDivElement>(null);
  useReveal(gridRef);
  useReveal(imagesRef);

  return (
    <section id="why-barsana" aria-labelledby="why-barsana-heading" className="section-wrapper-stone">
      <div className="container-x">
        <div className="section-header">
          <div className="section-kicker">Location Context</div>
          <h2 id="why-barsana-heading" className="section-title">{whyBarsana.heading}</h2>
          <span className="section-rule" />
          <p className="prose-body mt-1">{whyBarsana.intro}</p>
        </div>

        {/* Grid with reveal on the container */}
        <div ref={gridRef} className="reveal why-barsana-grid">
          {whyBarsana.points.map((point) => {
            const Icon = ICON_MAP[point.icon] ?? MapPin;
            return (
              <div key={point.title} className="why-card">
                <div className="why-card-icon">
                  <Icon size={20} aria-hidden="true" />
                </div>
                <h3>{point.title}</h3>
                <p>{point.detail}</p>
              </div>
            );
          })}
        </div>

        {/* Location images */}
        <div ref={imagesRef} className="reveal mt-8 grid sm:grid-cols-2 gap-4">
          <div className="relative border border-bmu-line overflow-hidden" style={{ aspectRatio: "4/3" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/braj/location/barsana.png"
              alt="Barsana town — birthplace of Shri Radha Rani, Mathura district, Uttar Pradesh"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="relative border border-bmu-line overflow-hidden" style={{ aspectRatio: "4/3" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/braj/hero/5-barsana.png"
              alt="Goverdhan Road, Barsana — location of Braj Murliwala Residency"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>

        <div className="mt-6 p-4 bg-white border-l-4 border-bmu-orange">
          <p className="text-[0.85rem] text-bmu-muted leading-relaxed">
            <strong className="text-bmu-ink">Note: </strong>
            Braj Murliwala Residency is a private residential project by{" "}
            {PROJECT.developer.name}. The project is situated in Barsana for its location
            advantages and is not a government scheme. All factual claims are based on
            verified project information.
          </p>
        </div>
      </div>
    </section>
  );
}
