import { Building2, MapPin, Banknote, Home, type LucideIcon } from "lucide-react";
import { PROJECT } from "@/app/_data/project";

const ICON_MAP: Record<string, LucideIcon> = { Building2, MapPin, Banknote, Home };

/**
 * ProjectStats / Snapshot — 4 large dashboard tiles directly below the
 * application section. Shows DISTINCT info from the hero + application strip.
 * No Reveal wrapper on individual cards — the grid layout requires direct children.
 */
export function ProjectStats() {
  return (
    <section id="stats" aria-label="Project at a Glance" className="bg-white border-b border-bmu-line">
      <div className="container-x">
        <div className="snapshot-grid">
          {PROJECT.snapshot.map((s) => {
            const Icon = ICON_MAP[s.icon] ?? Building2;
            return (
              <div key={s.label} className="snapshot-card">
                <div className="snapshot-card-icon">
                  <Icon size={20} aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <div className="snapshot-card-label">{s.label}</div>
                  <div className="snapshot-card-value">{s.value}</div>
                  <div className="snapshot-card-sub">{s.sub}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
