import { MapPin, Navigation } from "lucide-react";
import { PROJECT } from "@/app/_data/project";
import { Reveal } from "@/app/_components/reveal-hooks";

/**
 * LocationConnectivity — full-width layout.
 * Left: Large interactive map (60%).
 * Right: Address, context, landmarks table (40%).
 * No redundant secondary image — the map is the primary visual.
 */
export function LocationConnectivity() {
  const { location, contact } = PROJECT;
  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(contact.mapQuery)}&output=embed&z=14`;

  return (
    <section id="location" aria-labelledby="location-heading" className="section-wrapper-stone">
      <div className="container-x">
        <div className="section-header">
          <div className="section-kicker">Location</div>
          <h2 id="location-heading" className="section-title">Location &amp; Connectivity</h2>
          <span className="section-rule" />
          <p className="prose-body mt-1">
            Braj Murliwala Residency is located on Goverdhan Road, Barsana — in Mathura district,
            Uttar Pradesh, well connected by road to the major towns of the Braj region.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-0 border border-bmu-line overflow-hidden">

          {/* Left — full-height map (no secondary image) */}
          <Reveal>
            <div className="relative w-full h-full min-h-[480px] lg:min-h-[560px] bg-bmu-stone">
              <iframe
                title="Braj Murliwala Residency location — Goverdhan Road, Barsana"
                src={mapSrc}
                width="100%"
                height="100%"
                style={{ border: 0, position: "absolute", inset: 0, width: "100%", height: "100%" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </Reveal>

          {/* Right — all info in one scrollable pane */}
          <Reveal delay={100}>
            <div className="p-6 lg:p-8 flex flex-col gap-5 bg-white h-full">

              {/* Address card */}
              <div className="flex items-start gap-3 p-4 bg-bmu-red-50 border border-bmu-red-100">
                <span className="flex h-10 w-10 items-center justify-center bg-bmu-red text-white flex-shrink-0 mt-0.5">
                  <MapPin size={18} aria-hidden="true" />
                </span>
                <div>
                  <div className="font-bold text-bmu-ink text-[1rem]">{PROJECT.name}</div>
                  <div className="text-[0.87rem] text-bmu-muted mt-0.5">
                    {location.address}, {location.city}, {location.district} — {location.state}
                  </div>
                  <div className="text-[0.78rem] text-bmu-orange font-bold mt-0.5">{location.landmark}</div>
                </div>
              </div>

              {/* Context bullets */}
              <div>
                <h3 className="text-[0.7rem] font-bold uppercase tracking-[0.12em] text-bmu-muted mb-2.5">
                  About the Location
                </h3>
                <ul className="space-y-1.5">
                  {location.context.map((c, i) => (
                    <li key={i} className="flex items-start gap-2 text-[0.9rem] text-bmu-ink">
                      <span className="h-1.5 w-1.5 rounded-full bg-bmu-orange mt-1.5 flex-shrink-0" aria-hidden="true" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Distances table */}
              <div className="flex-1">
                <h3 className="text-[0.7rem] font-bold uppercase tracking-[0.12em] text-bmu-muted mb-2">
                  Distances from Barsana
                </h3>
                <div className="border border-bmu-line overflow-hidden">
                  {location.nearbyLandmarks.map((lm) => (
                    <div key={lm.label} className="landmark-row px-3">
                      <span className="landmark-name">{lm.label}</span>
                      <span className="landmark-dist">{lm.distance}</span>
                    </div>
                  ))}
                </div>
                <p className="text-[0.7rem] text-bmu-muted mt-1.5">* Approximate road distances.</p>
              </div>

              {/* CTA */}
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.mapQuery)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline inline-flex"
              >
                <Navigation size={14} aria-hidden="true" />
                Get Directions
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
