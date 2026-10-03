"use client";

import { EnquiryButton } from "@/app/_components/enquiry-trigger";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { PROJECT } from "@/app/_data/project";
import { cn } from "@/app/_lib/utils";
import { Reveal } from "@/app/_components/reveal-hooks";

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const toggle = (i: number) => setOpenIndex((p) => (p === i ? null : i));

  return (
    <section id="faq" aria-labelledby="faq-heading" className="section-wrapper">
      <div className="container-x">
        <div className="grid lg:grid-cols-3 gap-10">

          {/* Left sidebar */}
          <Reveal>
            <div className="section-kicker mb-1">FAQ</div>
            <h2 id="faq-heading" className="section-title">
              Frequently Asked Questions
            </h2>
            <span className="section-rule mb-5 block" />
            <p className="prose-body mb-6">
              Common questions about Braj Murliwala Residency — configurations, pricing,
              application, location and amenities.
            </p>

            <div className="p-5 bg-bmu-red-50 border border-bmu-red-100">
              <p className="text-[0.85rem] font-bold text-bmu-ink mb-1">Still have questions?</p>
              <p className="text-[0.82rem] text-bmu-muted mb-3 leading-relaxed">
                Our team is available to answer any queries about the project.
              </p>
              <a href="#application" className="btn-apply block text-center">
                Register Now
              </a>
            </div>
          </Reveal>

          {/* Accordion */}
          <div className="lg:col-span-2">
            <Reveal>
              <div className="border-t border-bmu-line">
                {PROJECT.faq.map((item, i) => (
                  <div key={i} className="accordion-item">
                    <button
                      className="accordion-btn"
                      aria-expanded={openIndex === i}
                      aria-controls={`faq-body-${i}`}
                      id={`faq-btn-${i}`}
                      onClick={() => toggle(i)}
                    >
                      <span className="text-left pr-4">{item.q}</span>
                      <ChevronDown
                        size={18}
                        aria-hidden="true"
                        className={cn("accordion-icon flex-shrink-0", openIndex === i && "accordion-icon-open")}
                      />
                    </button>
                    {openIndex === i && (
                      <div
                        id={`faq-body-${i}`}
                        role="region"
                        aria-labelledby={`faq-btn-${i}`}
                        className="accordion-body"
                      >
                        {item.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
