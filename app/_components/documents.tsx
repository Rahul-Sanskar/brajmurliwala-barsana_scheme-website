"use client";

import { Fragment, useState } from "react";
import {
  FileText, Download, Eye, Clock,
  ChevronDown, ChevronUp, X, ExternalLink,
} from "lucide-react";
import { PROJECT, type DocumentItem } from "@/app/_data/project";
import { Reveal } from "@/app/_components/reveal-hooks";

/* ─────────────────────────────────────────────────────────────────
   PDF Viewer Modal
   Opens the PDF in an <iframe> with a toolbar: download + open-in-tab
   ───────────────────────────────────────────────────────────────── */
function PdfModal({
  doc,
  onClose,
}: {
  doc: DocumentItem;
  onClose: () => void;
}) {
  return (
    <div
      className="pdf-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pdf-modal-title"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="pdf-modal">
        {/* Header bar */}
        <div className="pdf-modal-header">
          <div className="flex items-center gap-2 min-w-0">
            <FileText size={16} className="text-bmu-orange flex-shrink-0" aria-hidden="true" />
            <span id="pdf-modal-title" className="font-bold text-white text-[0.95rem] truncate">
              {doc.title}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Download */}
            <a
              href={doc.file}
              download
              className="pdf-modal-btn"
              aria-label={`Download ${doc.title}`}
            >
              <Download size={14} aria-hidden="true" />
              <span className="hidden sm:inline">Download</span>
            </a>
            {/* Open in new tab */}
            <a
              href={doc.file}
              target="_blank"
              rel="noopener noreferrer"
              className="pdf-modal-btn"
              aria-label={`Open ${doc.title} in new tab`}
            >
              <ExternalLink size={14} aria-hidden="true" />
              <span className="hidden sm:inline">Open Tab</span>
            </a>
            {/* Close */}
            <button
              type="button"
              onClick={onClose}
              className="pdf-modal-close"
              aria-label="Close preview"
            >
              <X size={16} aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* PDF iframe */}
        <div className="pdf-modal-body">
          <iframe
            src={`${doc.file}#toolbar=1&view=FitH`}
            title={doc.title}
            className="pdf-iframe"
            loading="lazy"
          />
        </div>

        {/* Footer note */}
        <div className="pdf-modal-footer">
          <span>
            If the document doesn&apos;t load,{" "}
            <a href={doc.file} download className="underline text-bmu-orange hover:text-bmu-orange-100">
              download it directly
            </a>.
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Specifications panel (unchanged)
   ───────────────────────────────────────────────────────────────── */
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

/* ─────────────────────────────────────────────────────────────────
   Main Documents section
   ───────────────────────────────────────────────────────────────── */
export function Documents() {
  const [specsOpen, setSpecsOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<DocumentItem | null>(null);

  // Available PDFs + pending ones; spec-sheet handled separately at bottom
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
              Official project documents. Click <strong>Preview</strong> to view any document inline, or download it directly.
            </p>
          </div>
        </div>

        {/* ── Desktop table ──────────────────────────────────── */}
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
                      {doc.available && doc.file ? (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            className="btn-secondary px-2 py-1 text-[0.7rem]"
                            aria-label={`Preview ${doc.title}`}
                            onClick={() => setPreviewDoc(doc)}
                          >
                            <Eye size={12} aria-hidden="true" /> Preview &amp; Download
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

                {/* Specifications row */}
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
                  <td><span className="doc-badge doc-badge-tbd">Inline</span></td>
                  <td><span className="avail-badge-available text-[0.7rem]">Available</span></td>
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

        {/* Expandable spec panel — desktop */}
        {specsOpen && (
          <div id="spec-panel" className="hidden md:block mt-0">
            <SpecificationsPanel />
          </div>
        )}

        {/* ── Mobile cards ───────────────────────────────────── */}
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
                {doc.available && doc.file ? (
                  <>
                    <button
                      type="button"
                      className="btn-secondary px-3 py-1"
                      onClick={() => setPreviewDoc(doc)}
                    >
                      <Eye size={12} aria-hidden="true" /> Preview &amp; Download
                    </button>
                  </>
                ) : (
                  <button disabled className="inline-flex items-center gap-1.5 text-[0.75rem] text-bmu-muted border border-bmu-line px-3 py-1.5 opacity-55 cursor-not-allowed">
                    <Clock size={12} aria-hidden="true" /> Coming Soon
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Spec sheet mobile */}
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

          {specsOpen && (
            <div id="spec-panel-mobile"><SpecificationsPanel /></div>
          )}
        </div>

        {/* Contact strip */}

      </div>

      {/* PDF viewer modal */}
      {previewDoc && (
        <PdfModal doc={previewDoc} onClose={() => setPreviewDoc(null)} />
      )}
    </section>
  );
}
