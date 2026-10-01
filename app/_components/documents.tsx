"use client";

import { Fragment, useState } from "react";
import { FileText, Download, Eye, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { PROJECT } from "@/app/_data/project";
import { Reveal } from "@/app/_components/reveal-hooks";

/**
 * Specifications panel — rendered inline inside the Documents section.
 * Opens/closes when the user clicks the "View Specifications" button.
 */
function SpecificationsPanel() {
  return (
    <div className="border border-bmu-line overflow-x-auto mt-1">
      <table className="institutional-table w-full">
        <thead>
          <tr>
            <th style={{ width: "30%" }}>Feature</th>
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
      <p className="text-[0.72rem] text-bmu-muted p-3 border-t border-bmu-line">
        * Specifications are indicative. Developer reserves the right to substitute materials of equivalent or better quality.
      </p>
    </div>
  );
}

export function Documents() {
  const [specsOpen, setSpecsOpen] = useState(false);

  // Filter out spec-sheet from the docs list — it's embedded below as an interactive panel
  const displayDocs = PROJECT.documents.filter((d) => d.id !== "spec-sheet");

  return (
    <section id="documents" aria-labelledby="documents-heading" className="section-wrapper">
      <div className="container-x">
        <div className="section-header-row">
          <div>
            <div className="section-kicker">Downloads</div>
            <h2 id="documents-heading" className="section-title">Documents &amp; Downloads</h2>
            <span className="section-rule" />
            <p className="prose-body mt-1">
              Official project documents. Additional documents will be published as they are released.
            </p>
          </div>
        </div>

        {/* Desktop portal table */}
        <Reveal>
          <div className="hidden md:block table-scroll border border-bmu-line">
            <table className="doc-table w-full">
              <thead>
                <tr>
                  <th style={{ width: "25%" }}>Document</th>
                  <th>Description</th>
                  <th style={{ width: "8%" }}>Type</th>
                  <th style={{ width: "10%" }}>Status</th>
                  <th style={{ width: "18%" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* Regular documents */}
                {displayDocs.map((doc) => (
                  <tr key={doc.id}>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="doc-card-icon flex-shrink-0">
                          <FileText size={15} aria-hidden="true" />
                        </div>
                        <span className="font-semibold text-bmu-ink">{doc.title}</span>
                      </div>
                    </td>
                    <td className="text-[0.83rem] text-bmu-muted">{doc.description}</td>
                    <td>
                      <span className={doc.available
                        ? (doc.type === "Brochure" ? "doc-badge doc-badge-brochure" : "doc-badge doc-badge-pdf")
                        : "doc-badge doc-badge-tbd"}>
                        {doc.available ? doc.type : "—"}
                      </span>
                    </td>
                    <td>
                      {doc.available
                        ? <span className="avail-badge-available text-[0.7rem]">Available</span>
                        : <span className="avail-badge-enquire text-[0.7rem]">Coming Soon</span>}
                    </td>
                    <td>
                      {doc.available ? (
                        <div className="flex items-center gap-2">
                          <button className="btn-outline px-2 py-1 text-[0.7rem]" aria-label={`View ${doc.title}`}>
                            <Eye size={12} aria-hidden="true" /> View
                          </button>
                          <button className="btn-primary px-2 py-1 text-[0.7rem]" aria-label={`Download ${doc.title}`}>
                            <Download size={12} aria-hidden="true" /> Download
                          </button>
                        </div>
                      ) : (
                        <button disabled className="inline-flex items-center gap-1 text-[0.7rem] text-bmu-muted border border-bmu-line px-2 py-1 opacity-55 cursor-not-allowed">
                          <Clock size={12} aria-hidden="true" /> Pending
                        </button>
                      )}
                    </td>
                  </tr>
                ))}

                {/* Specifications — expandable row */}
                <tr>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="doc-card-icon flex-shrink-0">
                        <FileText size={15} aria-hidden="true" />
                      </div>
                      <span className="font-semibold text-bmu-ink">Specification Sheet</span>
                    </div>
                  </td>
                  <td className="text-[0.83rem] text-bmu-muted">
                    Detailed construction specifications — structure, flooring, fittings, doors, windows and infrastructure.
                  </td>
                  <td>
                    <span className="doc-badge doc-badge-tbd">Inline</span>
                  </td>
                  <td>
                    <span className="avail-badge-available text-[0.7rem]">Available</span>
                  </td>
                  <td>
                    <button
                      onClick={() => setSpecsOpen(!specsOpen)}
                      className="btn-secondary px-2 py-1 text-[0.7rem] inline-flex items-center gap-1"
                      aria-expanded={specsOpen}
                      aria-controls="spec-panel"
                    >
                      {specsOpen
                        ? <><ChevronUp size={12} aria-hidden="true" /> Hide</>
                        : <><ChevronDown size={12} aria-hidden="true" /> View Specs</>}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Reveal>

        {/* Expandable specifications panel — desktop */}
        {specsOpen && (
          <div id="spec-panel" className="hidden md:block mt-0">
            <SpecificationsPanel />
          </div>
        )}

        {/* Mobile cards */}
        <div className="md:hidden space-y-3">
          {displayDocs.map((doc) => (
            <div key={doc.id} className="doc-card">
              <div className="p-3.5 flex items-start gap-3 flex-1">
                <div className="doc-card-icon mt-0.5"><FileText size={16} aria-hidden="true" /></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="font-semibold text-bmu-ink text-[0.9rem] leading-snug">{doc.title}</span>
                    <span className={doc.available ? "doc-badge doc-badge-pdf" : "doc-badge doc-badge-tbd"}>
                      {doc.available ? "Available" : "Pending"}
                    </span>
                  </div>
                  <p className="text-[0.8rem] text-bmu-muted leading-relaxed">{doc.description}</p>
                </div>
              </div>
              <div className="px-3.5 pb-3.5 flex items-center gap-2">
                {doc.available ? (
                  <>
                    <button className="btn-outline px-3 py-1"><Eye size={12} aria-hidden="true" /> View</button>
                    <button className="btn-primary px-3 py-1"><Download size={12} aria-hidden="true" /> Download</button>
                  </>
                ) : (
                  <button disabled className="inline-flex items-center gap-1.5 text-[0.75rem] text-bmu-muted border border-bmu-line px-3 py-1.5 opacity-55 cursor-not-allowed">
                    <Clock size={12} aria-hidden="true" /> To Be Provided
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Specifications mobile card */}
          <div className="doc-card">
            <div className="p-3.5 flex items-start gap-3 flex-1">
              <div className="doc-card-icon mt-0.5"><FileText size={16} aria-hidden="true" /></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="font-semibold text-bmu-ink text-[0.9rem] leading-snug">Specification Sheet</span>
                  <span className="avail-badge-available text-[0.7rem]">Available</span>
                </div>
                <p className="text-[0.8rem] text-bmu-muted leading-relaxed">
                  Construction specs — structure, flooring, fittings, doors, windows and infrastructure.
                </p>
              </div>
            </div>
            <div className="px-3.5 pb-3.5">
              <button
                onClick={() => setSpecsOpen(!specsOpen)}
                className="btn-secondary w-full justify-center"
                aria-expanded={specsOpen}
              >
                {specsOpen
                  ? <><ChevronUp size={14} aria-hidden="true" /> Hide Specifications</>
                  : <><ChevronDown size={14} aria-hidden="true" /> View Specifications</>}
              </button>
            </div>
          </div>

          {/* Expandable specifications panel — mobile */}
          {specsOpen && (
            <div id="spec-panel-mobile">
              <SpecificationsPanel />
            </div>
          )}
        </div>

        <div className="mt-5 p-4 bg-bmu-red-50 border border-bmu-red-100">
          <p className="text-[0.85rem] text-bmu-ink">
            For immediate document requests, contact{" "}
            <a href={`tel:${PROJECT.contact.phonePrimary.replace(/\s/g, "")}`} className="font-semibold text-bmu-red hover:text-bmu-orange">
              {PROJECT.contact.phonePrimary}
            </a>{" "}
            or{" "}
            <a href={`mailto:${PROJECT.contact.email}`} className="font-semibold text-bmu-red hover:text-bmu-orange">
              {PROJECT.contact.email}
            </a>.
          </p>
        </div>
      </div>
    </section>
  );
}
