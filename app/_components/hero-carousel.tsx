"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PROJECT } from "@/app/_data/project";
import { cn } from "@/app/_lib/utils";

export function HeroCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, dragFree: false },
    [Autoplay({ delay: 5800, stopOnInteraction: false, stopOnMouseEnter: true })]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft")  scrollPrev();
      if (e.key === "ArrowRight") scrollNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [scrollPrev, scrollNext]);

  return (
    <section id="hero" aria-label="Project hero" className="hero-carousel">
      <div ref={emblaRef} className="overflow-hidden">
        <div className="hero-track">
          {PROJECT.heroSlides.map((slide, i) => (
            <article key={i} className="hero-slide" aria-hidden={i !== selectedIndex}>
              {/* Full-bleed image */}
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                sizes="100vw"
                className="hero-slide-image"
                priority={i === 0}
                loading={i === 0 ? "eager" : "lazy"}
                draggable={false}
              />

              {/* Left content panel */}
              <div className="hero-panel">
                <div className="hero-panel-inner">
                  {/* Scheme badge */}
                  <div className="hero-kicker">
                    <span className="hero-kicker-text">{PROJECT.portal.name}</span>
                  </div>

                  {/* Project name — H1, large */}
                  <h1 className="hero-title">{PROJECT.name}</h1>

                  {/* Location pill */}
                  <p className="hero-location">{PROJECT.location.short}</p>

                  <div className="hero-divider" aria-hidden="true" />

                  {/* Per-slide message */}
                  <p className="hero-message">{slide.message}</p>

                  {/* CTAs */}
                  <div className="hero-ctas">
                    <a href="#overview" className="hero-btn-outline">View Project</a>
                    <a href="#application" className="hero-btn-primary">Apply Now</a>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Arrows */}
      <button onClick={scrollPrev} className="hero-arrow hero-arrow-prev" aria-label="Previous slide" type="button">
        <ChevronLeft size={20} aria-hidden="true" />
      </button>
      <button onClick={scrollNext} className="hero-arrow hero-arrow-next" aria-label="Next slide" type="button">
        <ChevronRight size={20} aria-hidden="true" />
      </button>

      {/* Dots */}
      <div className="hero-dots" role="tablist" aria-label="Carousel slides">
        {scrollSnaps.map((_, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={i === selectedIndex}
            aria-label={`Slide ${i + 1}`}
            onClick={() => emblaApi?.scrollTo(i)}
            type="button"
            className={cn("hero-dot", i === selectedIndex && "hero-dot-active")}
          />
        ))}
      </div>
    </section>
  );
}
