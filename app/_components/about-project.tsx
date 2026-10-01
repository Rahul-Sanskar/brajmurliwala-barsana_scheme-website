import Image from "next/image";
import { CheckCircle } from "lucide-react";
import { PROJECT } from "@/app/_data/project";
import { Reveal } from "@/app/_components/reveal-hooks";

export function AboutProject() {
  const { aboutContent, developer } = PROJECT;

  return (
    <section id="overview" aria-labelledby="about-heading" className="section-wrapper-stone">
      <div className="container-x">
        <div className="grid lg:grid-cols-2 gap-8 items-start">

          {/* Left — large project image */}
          <Reveal>
            <div className="relative w-full overflow-hidden border border-bmu-line section-has-image"
                 style={{ aspectRatio: "4/3" }}>
              <Image
                src="/braj/about/about.png"
                alt="Braj Murliwala Residency — residential project on Goverdhan Road, Barsana"
                fill
                sizes="(min-width: 1024px) 55vw, 100vw"
                className="object-cover object-center"
              />
            </div>
          </Reveal>

          {/* Right — content */}
          <Reveal delay={100}>
            <div className="section-kicker">The Project</div>
            <h2 id="about-heading" className="section-title mt-1">{aboutContent.heading}</h2>
            <span className="section-rule mb-5 block" />

            <div className="space-y-3.5 mb-5">
              {aboutContent.paragraphs.map((p, i) => (
                <p key={i} className="prose-body">{p}</p>
              ))}
            </div>

            <ul className="space-y-2 mb-5">
              {aboutContent.points.map((pt, i) => (
                <li key={i} className="flex items-start gap-2 text-[0.92rem] text-bmu-ink">
                  <CheckCircle size={16} className="text-bmu-green mt-0.5 flex-shrink-0" aria-hidden="true" />
                  {pt}
                </li>
              ))}
            </ul>

            <div className="pt-3.5 border-t border-bmu-line mb-5">
              <p className="text-[0.82rem] text-bmu-muted leading-relaxed">
                <span className="font-semibold text-bmu-ink">Developer: </span>
                {developer.lineage}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <a href="#floor-plans" className="btn-secondary">View Floor Plans</a>
              <a href="#pricing"     className="btn-outline">Price List</a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
