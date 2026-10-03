"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Lock } from "lucide-react";
import { PROJECT, CONFIG } from "@/app/_data/project";
import { cn } from "@/app/_lib/utils";

/* ── Highlight phrases ─────────────────────────────────────────── */
const HIGHLIGHT_PHRASES: { pattern: RegExp; cls: string }[] = [
  { pattern: /(\bBarsana Housing Scheme\b|बरसाना अर्बन हाउसिंग स्कीम)/gi, cls: "hero-hl-scheme" },
  { pattern: /(\bShree Radha Rani\b|\bRadha Rani\b|श्री राधा रानी)/gi,    cls: "hero-hl-divine"  },
];

function HighlightedText({ text }: { text: string }) {
  type Seg = { text: string; cls: string | null };
  let segs: Seg[] = [{ text, cls: null }];
  for (const { pattern, cls } of HIGHLIGHT_PHRASES) {
    const next: Seg[] = [];
    for (const seg of segs) {
      if (seg.cls !== null) { next.push(seg); continue; }
      const parts = seg.text.split(pattern);
      parts.forEach((p, k) => { if (p) next.push({ text: p, cls: k % 2 === 1 ? cls : null }); });
    }
    segs = next;
  }
  return (
    <>{segs.map((s, i) => s.cls
      ? <mark key={i} className={s.cls}>{s.text}</mark>
      : <span key={i}>{s.text}</span>
    )}</>
  );
}

const INTERVAL = 6000;

export function HeroCarousel() {
  const slides = PROJECT.heroSlides;
  const count  = slides.length;

  const [current,     setCurrent]     = useState(0);
  const [textVisible, setTextVisible] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* Fade text out → swap content → fade back in */
  const goTo = useCallback((next: number) => {
    setTextVisible(false);
    setTimeout(() => { setCurrent(next); setTextVisible(true); }, 350);
  }, []);

  const prev = useCallback(() => goTo((current - 1 + count) % count), [current, count, goTo]);
  const next = useCallback(() => goTo((current + 1) % count),          [current, count, goTo]);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent((c) => {
        const n = (c + 1) % count;
        setTextVisible(false);
        setTimeout(() => { setCurrent(n); setTextVisible(true); }, 350);
        return c;
      });
    }, INTERVAL);
  }, [count]);

  useEffect(() => { resetTimer(); return () => { if (timerRef.current) clearInterval(timerRef.current); }; }, [resetTimer]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft")  { prev(); resetTimer(); }
      if (e.key === "ArrowRight") { next(); resetTimer(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next, resetTimer]);

  const slide      = slides[current];
  const kicker     = slide.kicker      ?? PROJECT.portal.name;
  const title      = slide.title       ?? PROJECT.name;
  const location   = slide.location    ?? PROJECT.location.short;
  const ctaPrimary   = slide.ctaPrimary   ?? "Register Now";
  const ctaSecondary = slide.ctaSecondary ?? "View Project";
  const msgLines   = slide.message.split("\n");
  const isScheme   = kicker === PROJECT.portal.name || kicker === "बरसाना अर्बन हाउसिंग स्कीम";

  return (
    <section id="hero" aria-label="Project hero" className="hero-section">
      {/* ── LEFT: text panel — fixed, never moves ── */}
      <div className="hero-left">
        <div
          className={cn("hero-content", textVisible ? "hero-text-in" : "hero-text-out")}
          aria-live="polite"
        >
          {/* Kicker */}
          <div className="hero-kicker">
            <span className={cn("hero-kicker-text", isScheme && "hero-kicker-scheme")}>
              {kicker}
            </span>
          </div>

          {/* Title */}
          <h1 className="hero-title">{title}</h1>

          {/* Location pill */}
          <p className="hero-location">{location}</p>

          <div className="hero-divider" aria-hidden="true" />

          {/* Message */}
          <div className="hero-message">
            {msgLines.map((line, j) => (
              <span key={j}>
                <HighlightedText text={line} />
                {j < msgLines.length - 1 && <br />}
              </span>
            ))}
          </div>

          {/* CTAs */}
          <div className="hero-ctas">
            <a href="#overview" className="hero-btn-outline">{ctaSecondary}</a>
            {CONFIG.REGISTRATION_OPEN ? (
              <a href="#application" className="hero-btn-primary">{ctaPrimary}</a>
            ) : (
              <span className="hero-btn-primary" style={{ opacity: 0.6, cursor: "not-allowed", pointerEvents: "none" }}>
                <Lock size={14} aria-hidden="true" className="inline mr-1" />
                Registration Closed
              </span>
            )}
          </div>
        </div>

        {/* Dots inside left panel, bottom */}
        <div className="hero-dots" role="tablist" aria-label="Slides">
          {slides.map((_, i) => (
            <button
              key={i} type="button" role="tab"
              aria-selected={i === current}
              aria-label={`Slide ${i + 1}`}
              onClick={() => { goTo(i); resetTimer(); }}
              className={cn("hero-dot", i === current && "hero-dot-active")}
            />
          ))}
        </div>
      </div>

      {/* ── RIGHT: image carousel ── */}
      <div className="hero-right" aria-hidden="true">
        {/* All images stacked, crossfade via opacity */}
        {slides.map((s, i) => (
          <div key={i} className={cn("hero-img-frame", i === current && "hero-img-active")}>
            <Image
              src={s.src}
              alt={s.alt}
              fill
              sizes="(min-width: 1024px) 55vw, 100vw"
              className={s.objectFit === "contain" ? "object-contain object-center bg-white" : "object-cover object-center"}
              priority={i === 0}
              loading={i === 0 ? "eager" : "lazy"}
              draggable={false}
            />
          </div>
        ))}

        {/* Arrows overlaid on image panel */}
        <button
          type="button"
          onClick={() => { prev(); resetTimer(); }}
          className="hero-arrow hero-arrow-prev"
          aria-label="Previous slide"
        >
          <ChevronLeft size={20} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => { next(); resetTimer(); }}
          className="hero-arrow hero-arrow-next"
          aria-label="Next slide"
        >
          <ChevronRight size={20} aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
