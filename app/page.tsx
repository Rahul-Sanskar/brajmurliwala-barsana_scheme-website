/**
 * Homepage — Braj Murliwala Residency
 *
 * Section order:
 * Hero → UrgencyBanner → Application → Snapshot → Notice → Overview →
 * Highlights → Price List → Master Plan → Floor Plans → Documents →
 * Gallery → Amenities → Why Barsana → Location → FAQ → Enquiry → Contact
 */

import { ClientOnly }           from "./_components/client-only";
import { HeroCarousel }         from "./_components/hero-carousel";
import { UrgencyBanner }        from "./_components/urgency-banner";
import { UnitsPopup }           from "./_components/units-popup";
import { ApplicationSection }   from "./_components/application-section";
import { ProjectStats }         from "./_components/project-stats";
import { NoticeStrip }          from "./_components/notice-strip";
import { AboutProject }         from "./_components/about-project";
import { ProjectHighlights }    from "./_components/project-highlights";
import { PriceList }            from "./_components/price-list";
import { SiteLayout }           from "./_components/site-layout";
import { FloorPlans }           from "./_components/floor-plans";
import { Documents }            from "./_components/documents";
import { Gallery }              from "./_components/gallery";
import { Amenities }            from "./_components/amenities";
import { WhyBarsana }           from "./_components/why-barsana";
import { LocationConnectivity } from "./_components/location-connectivity";
import { FAQ }                  from "./_components/faq";
import { EnquirySection }       from "./_components/enquiry-section";
import { ContactSection }       from "./_components/contact-section";

export default function HomePage() {
  return (
    <>
      {/* Hero: interactive (carousel arrows, dots) */}
      <ClientOnly fallback={<div className="w-full bg-bmu-red" style={{ height: "clamp(420px,56vw,680px)" }} />}>
        <HeroCarousel />
      </ClientOnly>

      {/* Urgency banner: interactive (scroll listener) */}
      <ClientOnly>
        <UrgencyBanner />
      </ClientOnly>

      {/* 50-units popup: appears after 4s on first visit */}
      <ClientOnly>
        <UnitsPopup />
      </ClientOnly>

      {/* Application: interactive (Razorpay payment) */}
      <ClientOnly fallback={<div className="w-full bg-[#68161A]" style={{ height: 180 }} />}>
        <ApplicationSection />
      </ClientOnly>

      {/* Stats: static, no interactivity */}
      <ProjectStats />

      {/* Notice strip: CSS animation only — no JS interaction */}
      <NoticeStrip />

      {/* About: static */}
      <AboutProject />

      {/* Highlights: static */}
      <ProjectHighlights />

      {/* Price list: interactive (enquiry modal buttons) */}
      <ClientOnly fallback={<div className="w-full bg-white" style={{ height: 420 }} />}>
        <PriceList />
      </ClientOnly>

      {/* Site layout: interactive (zoom modal) */}
      <ClientOnly fallback={<div className="w-full bg-bmu-stone" style={{ height: 360 }} />}>
        <SiteLayout />
      </ClientOnly>

      {/* Floor plans: interactive (tabs, lightbox) */}
      <ClientOnly fallback={<div className="w-full bg-bmu-stone" style={{ height: 500 }} />}>
        <FloorPlans />
      </ClientOnly>

      {/* Documents: interactive (spec accordion) */}
      <ClientOnly fallback={<div className="w-full bg-white" style={{ height: 320 }} />}>
        <Documents />
      </ClientOnly>

      {/* Gallery: interactive (tabs, lightbox) */}
      <ClientOnly fallback={<div className="w-full bg-bmu-stone" style={{ height: 420 }} />}>
        <Gallery />
      </ClientOnly>

      {/* Amenities: static */}
      <Amenities />

      {/* Why Barsana: static */}
      <WhyBarsana />

      {/* Location: embeds map iframe */}
      <LocationConnectivity />

      {/* FAQ: interactive (accordion) */}
      <ClientOnly fallback={<div className="w-full bg-white" style={{ height: 480 }} />}>
        <FAQ />
      </ClientOnly>

      {/* Enquiry: interactive (form + Razorpay) */}
      <ClientOnly fallback={<div className="w-full bg-bmu-red" style={{ height: 480 }} />}>
        <EnquirySection />
      </ClientOnly>

      {/* Contact: static */}
      <ContactSection />
    </>
  );
}
