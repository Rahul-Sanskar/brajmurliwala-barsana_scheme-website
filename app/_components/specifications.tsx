import { Fragment } from "react";
import { PROJECT } from "@/app/_data/project";
import { Reveal } from "@/app/_components/reveal-hooks";

export function Specifications() {
  return (
    <section id="specifications" aria-labelledby="spec-heading" className="section-wrapper-stone">
      <div className="container-x">
        <div className="section-header">
          <div className="section-kicker">Construction &amp; Finishes</div>
          <h2 id="spec-heading" className="section-title">Specifications</h2>
          <span className="section-rule" />
          <p className="prose-body mt-1">
            Detailed specifications for structure, flooring, fittings, doors, windows
            and community infrastructure at Braj Murliwala Residency.
          </p>
        </div>

        <Reveal>
          <div className="table-scroll border border-bmu-line">
            <table className="institutional-table min-w-full">
              <thead>
                <tr>
                  <th style={{ width: "32%" }}>Feature</th>
                  <th>Specification</th>
                </tr>
              </thead>
              <tbody>
                {PROJECT.specifications.map((cat) => (
                  <Fragment key={cat.category}>
                    <tr>
                      <td colSpan={2} className="spec-category-header">{cat.category}</td>
                    </tr>
                    {cat.rows.map((row) => (
                      <tr key={row.feature}>
                        <td className="font-semibold text-bmu-ink">{row.feature}</td>
                        <td className="text-bmu-muted">{row.detail}</td>
                      </tr>
                    ))}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>

        <p className="text-[0.72rem] text-bmu-muted mt-3">
          * Specifications are indicative. Developer reserves the right to substitute materials
          of equivalent or better quality. Final specifications as per sale agreement.
        </p>
      </div>
    </section>
  );
}
