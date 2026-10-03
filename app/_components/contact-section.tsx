"use client";

import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { PROJECT } from "@/app/_data/project";
import { Reveal } from "@/app/_components/reveal-hooks";

export function ContactSection() {
  const { contact } = PROJECT;
  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(contact.mapQuery)}&output=embed&z=14`;

  return (
    <section id="contact" aria-labelledby="contact-heading" className="section-wrapper-stone">
      <div className="container-x">
        <div className="section-header">
          <div className="section-kicker">Contact</div>
          <h2 id="contact-heading" className="section-title">Contact Us</h2>
          <span className="section-rule" />
          <p className="prose-body mt-1">
            Reach the Braj Murliwala Residency team for site visits, pricing, documents and registration.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">

          {/* Contact card */}
          <Reveal>
            <div className="border border-bmu-line bg-white overflow-hidden mb-4">
              <div className="card-header-bar bg-bmu-red-800">{PROJECT.name}</div>
              <div className="divide-y divide-bmu-line">
                {[
                  { Icon: MapPin, label: "Address", content: (
                    <div>{contact.addressLines.map((l, i) => (
                      <div key={i} className="text-[0.9rem] text-bmu-ink leading-snug">{l}</div>
                    ))}</div>
                  )},
                  { Icon: Phone, label: "Phone", content: (
                    <span className="text-[0.9rem] font-semibold text-bmu-ink">{contact.phonePrimary}</span>
                  )},
                  { Icon: Mail, label: "Email", content: (
                    <span className="text-[0.9rem] font-semibold text-bmu-ink break-all">{contact.email}</span>
                  )},
                  { Icon: MessageCircle, label: "WhatsApp", content: (
                    <span className="text-[0.9rem] font-semibold text-bmu-ink">{contact.whatsapp}</span>
                  )},
                ].map(({ Icon, label, content }) => (
                  <div key={label} className="contact-info-row px-4">
                    <div className="contact-info-icon"><Icon size={15} aria-hidden="true" /></div>
                    <div>
                      <div className="text-[0.68rem] font-bold uppercase tracking-[0.1em] text-bmu-muted mb-0.5">{label}</div>
                      {content}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <a href="#application" className="btn-apply block text-center">
              Register Now
            </a>
          </Reveal>

          {/* Map */}
          <Reveal delay={120}>
            <div className="relative border border-bmu-line overflow-hidden" style={{ aspectRatio: "4/3" }}>
              <iframe
                title={`${PROJECT.name} — Goverdhan Road, Barsana location`}
                src={mapSrc} width="100%" height="100%"
                style={{ border: 0, position: "absolute", inset: 0 }}
                allowFullScreen loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
