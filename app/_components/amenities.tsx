"use client";

import {
  Waves, Dumbbell, Building2, Trees, Camera, ShieldCheck,
  ArrowUpDown, Phone, Flame, Zap, Wifi, Users, Star,
  Car, Heart, User, Droplets, Recycle, type LucideIcon,
} from "lucide-react";
import { PROJECT, type Amenity } from "@/app/_data/project";
import { useEffect, useRef } from "react";

const ICON_MAP: Record<string, LucideIcon> = {
  Waves, Dumbbell, Building2, Trees, Camera, ShieldCheck,
  ArrowUpDown, Phone, Flame, Zap, Wifi, Users, Star,
  Car, Heart, User, Droplets, Recycle,
};

const GROUPS: { label: string; category: Amenity["category"] }[] = [
  { label: "Wellness & Recreation",      category: "Wellness" },
  { label: "Safety & Security",          category: "Safety" },
  { label: "Community & Social",         category: "Community" },
  { label: "Services & Infrastructure",  category: "Services" },
  { label: "Environment & Green",        category: "Green" },
];

function useReveal(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.classList.add("is-visible"); },
      { rootMargin: "-60px", threshold: 0.05 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);
}

export function Amenities() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imgRef     = useRef<HTMLDivElement>(null);
  useReveal(sectionRef);
  useReveal(imgRef);

  const grouped = GROUPS.map((g) => ({
    ...g,
    items: PROJECT.amenities.filter((a) => a.category === g.category),
  })).filter((g) => g.items.length > 0);

  return (
    <section id="amenities" aria-labelledby="amenities-heading" className="section-wrapper-stone">
      <div className="container-x">
        <div className="section-header-row">
          <div>
            <div className="section-kicker">Amenities &amp; Features</div>
            <h2 id="amenities-heading" className="section-title">Amenities</h2>
            <span className="section-rule" />
            <p className="prose-body mt-1">
              Community facilities at Braj Murliwala Residency — wellness, safety, community and infrastructure.
            </p>
          </div>
        </div>

        <div ref={sectionRef} className="reveal space-y-6">
          {grouped.map((group) => (
            <div key={group.category}>
              <div className="amenity-group-heading">{group.label}</div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {group.items.map((a) => {
                  const Icon = ICON_MAP[a.icon] ?? ShieldCheck;
                  return (
                    <div key={a.id} className="amenity-item">
                      <div className="amenity-icon"><Icon size={22} aria-hidden="true" /></div>
                      <span className="amenity-label">{a.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div ref={imgRef} className="reveal mt-8 relative overflow-hidden border border-bmu-line" style={{ maxHeight: "380px" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/braj/amenities/amenities.png"
            alt="Braj Murliwala Residency — amenities overview showing community facilities"
            className="w-full h-auto object-cover object-center"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
