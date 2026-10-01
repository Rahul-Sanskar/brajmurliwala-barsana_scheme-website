/**
 * Homepage — Braj Murliwala Residency
 *
 * Section order (Grihawas IA):
 * Hero → Application → Snapshot → Notice → Overview → Highlights →
 * Price List → Master Plan → Floor Plans → Documents (incl. Specs) →
 * Gallery → Amenities → Why Barsana → Location → FAQ → Enquiry → Contact
 *
 * Specifications are removed as a standalone section and are now
 * accessible via a "View Specifications" button inside Documents.
 * Location moved to the bottom before FAQ/Enquiry/Contact.
 */

import { HeroCarousel }         from "./_components/hero-carousel";
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
      <HeroCarousel />
      <ApplicationSection />
      <ProjectStats />
      <NoticeStrip />
      <AboutProject />
      <ProjectHighlights />
      <PriceList />
      <SiteLayout />
      <FloorPlans />
      <Documents />
      <Gallery />
      <Amenities />
      <WhyBarsana />
      {/* Location moved to bottom — users first see the project, then discover where it is */}
      <LocationConnectivity />
      <FAQ />
      <EnquirySection />
      <ContactSection />
    </>
  );
}
