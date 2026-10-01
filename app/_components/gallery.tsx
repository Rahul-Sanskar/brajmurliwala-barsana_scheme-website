"use client";

import Image from "next/image";
import { useState } from "react";
import { X, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/app/_lib/utils";
import { Reveal } from "@/app/_components/reveal-hooks";

type GalleryImage = { src: string; alt: string; category: "elevations" | "interiors" | "floor-plans" | "location" };

const GALLERY: GalleryImage[] = [
  { src: "/braj/hero/1-elevation-day.png",    alt: "Braj Murliwala Residency daytime elevation — Goverdhan Road, Barsana",                   category: "elevations" },
  { src: "/braj/hero/2-elevation-night.png",  alt: "Braj Murliwala Residency illuminated night elevation, Barsana",                          category: "elevations" },
  { src: "/braj/hero/3-elevation-side.png",   alt: "Braj Murliwala Residency side elevation — residential project Barsana",                  category: "elevations" },
  { src: "/braj/about/overview-side.png",     alt: "Braj Murliwala Residency building overview, Barsana",                                    category: "elevations" },
  { src: "/braj/hero/4-furnished.png",        alt: "Furnished apartment interior at Braj Murliwala Residency, Barsana",                      category: "interiors" },
  { src: "/braj/interiors/bedroom.png",       alt: "Master bedroom interior — Braj Murliwala Residency, Barsana",                            category: "interiors" },
  { src: "/braj/interiors/kitchen.png",       alt: "Modular kitchen interior — Braj Murliwala Residency, Barsana",                           category: "interiors" },
  { src: "/braj/floorplans/1bhk.png",         alt: "1 BHK floor plan — Braj Murliwala Residency, Barsana (881–895 sq.ft.)",                  category: "floor-plans" },
  { src: "/braj/floorplans/2bhk-ab.png",      alt: "2 BHK floor plan Type A/B — Braj Murliwala Residency, Barsana",                         category: "floor-plans" },
  { src: "/braj/floorplans/2bhk-cd.png",      alt: "2 BHK floor plan Type C/D — Braj Murliwala Residency",                                  category: "floor-plans" },
  { src: "/braj/floorplans/3bhk.png",         alt: "3 BHK floor plan — Braj Murliwala Residency (1916–1982 sq.ft.)",                         category: "floor-plans" },
  { src: "/braj/location/barsana.png",        alt: "Barsana town — birthplace of Shri Radha Rani, Mathura district",                         category: "location" },
  { src: "/braj/location/location-specs.png", alt: "Location overview — Goverdhan Road, Barsana connectivity to Mathura and Vrindavan",     category: "location" },
  { src: "/braj/hero/5-barsana.png",          alt: "Goverdhan Road, Barsana — project location near Radha Rani Temple",                     category: "location" },
];

const TABS = [
  { id: "all"         as const, label: "All Photos" },
  { id: "elevations"  as const, label: "Elevations" },
  { id: "interiors"   as const, label: "Interiors" },
  { id: "floor-plans" as const, label: "Floor Plans" },
  { id: "location"    as const, label: "Location" },
];

type TabId = "all" | GalleryImage["category"];

export function Gallery() {
  const [activeTab, setActiveTab] = useState<TabId>("all");
  const [lbIndex, setLbIndex]   = useState<number | null>(null);

  const filtered = activeTab === "all" ? GALLERY : GALLERY.filter((i) => i.category === activeTab);
  const close    = () => setLbIndex(null);
  const prev     = () => setLbIndex((p) => p != null ? (p - 1 + filtered.length) % filtered.length : null);
  const next     = () => setLbIndex((p) => p != null ? (p + 1) % filtered.length : null);

  return (
    <section id="gallery" aria-labelledby="gallery-heading" className="section-wrapper-stone">
      <div className="container-x">
        <div className="section-header">
          <div className="section-kicker">Photo Gallery</div>
          <h2 id="gallery-heading" className="section-title">Gallery</h2>
          <span className="section-rule" />
          <p className="prose-body mt-1">
            Actual images from Braj Murliwala Residency — elevations, interiors, floor plans and location.
          </p>
        </div>

        {/* Category tabs */}
        <div className="tab-list mb-5" role="tablist" aria-label="Gallery categories">
          {TABS.map((t) => (
            <button key={t.id} role="tab" aria-selected={activeTab === t.id}
              onClick={() => setActiveTab(t.id)}
              className={cn("tab-btn", activeTab === t.id && "tab-btn-active")}>
              {t.label}
            </button>
          ))}
        </div>

        <Reveal>
          <div className="gallery-grid-lg">
            {filtered.map((img, i) => (
              <div key={img.src + i} className="gallery-thumb"
                onClick={() => setLbIndex(i)} role="button" tabIndex={0}
                aria-label={`View: ${img.alt}`}
                onKeyDown={(e) => e.key === "Enter" && setLbIndex(i)}>
                <Image
                  src={img.src} alt={img.alt} fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                  className="object-cover"
                />
                <div className="gallery-thumb-overlay">
                  <ZoomIn size={26} className="gallery-thumb-icon" aria-hidden="true" />
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        <p className="text-[0.75rem] text-bmu-muted mt-3">
          {filtered.length} of {GALLERY.length} images
          {activeTab !== "all" && ` — ${TABS.find((t) => t.id === activeTab)?.label}`}.
        </p>
      </div>

      {/* Lightbox */}
      {lbIndex != null && (
        <div className="modal-backdrop" role="dialog" aria-modal="true"
          onClick={(e) => e.target === e.currentTarget && close()}>
          <button className="modal-close" onClick={close} aria-label="Close"><X size={16} aria-hidden="true" /></button>
          {filtered.length > 1 && (
            <button onClick={prev} aria-label="Previous"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-white/10 border border-white/20 text-white hover:bg-white/20">
              <ChevronLeft size={22} aria-hidden="true" />
            </button>
          )}
          <div className="max-w-4xl w-full flex flex-col items-center gap-2">
            <Image src={filtered[lbIndex].src} alt={filtered[lbIndex].alt}
              width={1200} height={800}
              className="w-full h-auto object-contain max-h-[80vh]"
              sizes="(min-width: 1280px) 1000px, 100vw" />
            <p className="text-white/80 text-[0.82rem] text-center px-4">{filtered[lbIndex].alt}</p>
            <p className="text-white/45 text-xs">{lbIndex + 1} / {filtered.length}</p>
          </div>
          {filtered.length > 1 && (
            <button onClick={next} aria-label="Next"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-white/10 border border-white/20 text-white hover:bg-white/20">
              <ChevronRight size={22} aria-hidden="true" />
            </button>
          )}
        </div>
      )}
    </section>
  );
}
