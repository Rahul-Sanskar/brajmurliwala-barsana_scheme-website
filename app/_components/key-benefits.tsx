import { MapPin, Banknote, Home, Building2, type LucideIcon } from "lucide-react";
import { PROJECT } from "@/app/_data/project";
import { cn } from "@/app/_lib/utils";

const ICON_MAP: Record<string, LucideIcon> = { MapPin, Banknote, Home, Building2 };

const ACCENT = [
  { bar: "border-t-bmu-saffron-600", icon: "bg-bmu-saffron-50 text-bmu-saffron-600" },
  { bar: "border-t-bmu-navy-700",    icon: "bg-bmu-navy-50 text-bmu-navy-700" },
  { bar: "border-t-bmu-leaf-600",    icon: "bg-bmu-leaf-50 text-bmu-leaf-600" },
  { bar: "border-t-bmu-teal-600",    icon: "bg-bmu-teal-50 text-bmu-teal-600" },
];

export function KeyBenefits() {
  return (
    <section id="benefits" aria-labelledby="benefits-heading" className="section-wrapper">
      <div className="container-x">
        <div className="section-header">
          <div className="section-kicker">Why Choose Us</div>
          <h2 id="benefits-heading" className="section-title">Key Benefits</h2>
          <span className="section-rule" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PROJECT.keyBenefits.map((b, i) => {
            const Icon = ICON_MAP[b.icon] ?? MapPin;
            const accent = ACCENT[i % ACCENT.length];
            return (
              <div
                key={i}
                className={cn(
                  "bg-white border border-bmu-line border-t-[3px] p-5 flex flex-col gap-3",
                  accent.bar
                )}
              >
                <div className={cn("flex items-center justify-center w-10 h-10 flex-shrink-0", accent.icon)}>
                  <Icon size={18} aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-[0.9rem] font-bold text-bmu-navy-700 mb-1 leading-snug">{b.title}</h3>
                  <p className="text-[0.82rem] text-bmu-muted leading-relaxed">{b.detail}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
