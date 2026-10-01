"use client";

import { EnquiryButton } from "@/app/_components/enquiry-trigger";
import { PROJECT, formatSqftRange, formatLakhs } from "@/app/_data/project";

export function PriceList() {
  return (
    <section id="pricing" aria-labelledby="pricing-heading" className="section-wrapper">
      <div className="container-x">
        <div className="section-header-row">
          <div>
            <div className="section-kicker">Investment Details</div>
            <h2 id="pricing-heading" className="section-title">Price List</h2>
            <span className="section-rule" />
          </div>
          <EnquiryButton className="btn-primary flex-shrink-0">Get Price Quote</EnquiryButton>
        </div>

        {/* Rate summary strip */}
        <div className="grid sm:grid-cols-3 gap-px bg-bmu-line mb-6">
          {[
            { label: "Pre-Launch Rate",   value: `₹${PROJECT.pricing.preLaunchRatePerSqft.toLocaleString("en-IN")} / sq.ft.`, note: "Limited period offer", bar: "bg-bmu-orange" },
            { label: "Post-Launch Rate",  value: `₹${PROJECT.pricing.postLaunchRatePerSqft.toLocaleString("en-IN")} / sq.ft.`, note: "After launch",          bar: "bg-bmu-red-700" },
            { label: "Bank Loan",         value: `Up to ${PROJECT.pricing.bankLoanUptoPercent}%`, note: "Via empanelled banks",  bar: "bg-bmu-green-600" },
          ].map((r) => (
            <div key={r.label} className="bg-white overflow-hidden">
              <div className={`card-header-bar ${r.bar}`}>{r.label}</div>
              <div className="p-4">
                <div className="stat-value-lg">{r.value}</div>
                <div className="text-[0.75rem] text-bmu-muted mt-0.5">{r.note}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop table */}
        <div className="hidden md:block table-scroll border border-bmu-line">
            <table className="institutional-table">
              <thead>
                <tr>
                  <th>Configuration</th>
                  <th>Super Area</th>
                  <th>Pre-Launch Rate</th>
                  <th>Post-Launch Rate</th>
                  <th>Starting Price</th>
                  <th>Furnished</th>
                  <th>Availability</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {PROJECT.unitConfigs.map((u) => (
                  <tr key={u.id}>
                    <td className="font-bold text-bmu-ink">{u.name}</td>
                    <td>{formatSqftRange(u.superAreaSqftMin, u.superAreaSqftMax)}</td>
                    <td>₹{u.preLaunchRatePerSqft.toLocaleString("en-IN")}/sq.ft.</td>
                    <td>₹{u.postLaunchRatePerSqft.toLocaleString("en-IN")}/sq.ft.</td>
                    <td className="font-semibold">{u.startingPrice ? formatLakhs(u.startingPrice) : "Contact for details"}</td>
                    <td>{u.furnishedAvailable ? "✓ Available" : "—"}</td>
                    <td><span className={u.status === "Available" ? "avail-badge-available" : "avail-badge-enquire"}>{u.status}</span></td>
                    <td><EnquiryButton className="btn-primary px-3 py-1.5 text-[0.72rem]">Enquire</EnquiryButton></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        {/* Mobile stacked cards */}
        <div className="md:hidden space-y-4">
          {PROJECT.unitConfigs.map((u) => (
            <div key={u.id} className="border border-bmu-line bg-white overflow-hidden">
              <div className="card-header-bar bg-bmu-red-800 justify-between">
                <span>{u.name}</span>
                <span className={u.status === "Available" ? "avail-badge-available" : "avail-badge-enquire"}>{u.status}</span>
              </div>
              <div className="divide-y divide-bmu-line">
                {[
                  ["Super Area", formatSqftRange(u.superAreaSqftMin, u.superAreaSqftMax)],
                  ["Pre-Launch Rate", `₹${u.preLaunchRatePerSqft.toLocaleString("en-IN")}/sq.ft.`],
                  ["Starting Price", u.startingPrice ? formatLakhs(u.startingPrice) : "Contact for details"],
                  ["Furnished", u.furnishedAvailable ? "Available" : "N/A"],
                ].map(([lbl, val]) => (
                  <div key={lbl} className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
                    <span className="text-bmu-muted">{lbl}</span>
                    <span className="font-semibold text-bmu-ink text-right">{val}</span>
                  </div>
                ))}
              </div>
              <div className="px-4 py-3">
                <EnquiryButton className="btn-primary w-full justify-center">Enquire Now</EnquiryButton>
              </div>
            </div>
          ))}
        </div>

        <p className="text-[0.72rem] text-bmu-muted mt-4">
          * Prices are indicative and subject to change. Government charges and applicable taxes extra.
        </p>
      </div>
    </section>
  );
}
