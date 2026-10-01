"use client";

/**
 * EnquirySection — dual-action: ENQUIRE (free form) + APPLY NOW (₹21,000 Razorpay)
 * These two actions are visually distinct so users can never confuse them.
 */

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send, CheckCircle, X, FileText, Lock } from "lucide-react";
import { PROJECT, CONFIG } from "@/app/_data/project";
import { cn } from "@/app/_lib/utils";
import { Reveal } from "@/app/_components/reveal-hooks";

const schema = z.object({
  fullName:       z.string().min(2, "Please enter your full name"),
  mobile:         z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  email:          z.string().email("Enter a valid email address"),
  unitPreference: z.string().min(1, "Please select a configuration"),
  message:        z.string().optional(),
  consent:        z.literal(true, { error: "You must agree to be contacted" }),
});
type FormValues = z.infer<typeof schema>;

function EnquiryForm({ compact = false, onSuccess }: { compact?: boolean; onSuccess?: () => void }) {
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } =
    useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (_data: FormValues) => {
    await new Promise((r) => setTimeout(r, 600));
    setSubmitted(true);
    reset();
    onSuccess?.();
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
        <CheckCircle size={42} className="text-bmu-green" aria-hidden="true" />
        <p className="font-bold text-bmu-ink text-[1.1rem]">Enquiry Submitted</p>
        <p className="text-bmu-muted text-[0.9rem] leading-relaxed">
          Thank you. Our team will contact you within 24 hours.
        </p>
        <button className="btn-outline mt-2" onClick={() => setSubmitted(false)}>
          Submit Another Enquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div className={cn("grid gap-4", compact ? "grid-cols-1" : "sm:grid-cols-2")}>
        <div>
          <label htmlFor="enq-fullName" className="form-label">
            Full Name <span className="text-red-500" aria-hidden="true">*</span>
          </label>
          <input id="enq-fullName" type="text" autoComplete="name" placeholder="Your full name"
            className={cn("form-input", errors.fullName && "border-red-400")}
            {...register("fullName")} />
          {errors.fullName && <p className="form-error" role="alert">{errors.fullName.message}</p>}
        </div>

        <div>
          <label htmlFor="enq-mobile" className="form-label">
            Mobile Number <span className="text-red-500" aria-hidden="true">*</span>
          </label>
          <input id="enq-mobile" type="tel" inputMode="numeric" autoComplete="tel"
            placeholder="10-digit mobile number"
            className={cn("form-input", errors.mobile && "border-red-400")}
            {...register("mobile")} />
          {errors.mobile && <p className="form-error" role="alert">{errors.mobile.message}</p>}
        </div>

        <div>
          <label htmlFor="enq-email" className="form-label">
            Email Address <span className="text-red-500" aria-hidden="true">*</span>
          </label>
          <input id="enq-email" type="email" autoComplete="email" placeholder="your@email.com"
            className={cn("form-input", errors.email && "border-red-400")}
            {...register("email")} />
          {errors.email && <p className="form-error" role="alert">{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="enq-unit" className="form-label">
            Configuration <span className="text-red-500" aria-hidden="true">*</span>
          </label>
          <select id="enq-unit" defaultValue=""
            className={cn("form-input form-select", errors.unitPreference && "border-red-400")}
            {...register("unitPreference")}>
            <option value="" disabled>Select configuration</option>
            <option value="1bhk">1 BHK — 881 to 895 sq.ft.</option>
            <option value="2bhk">2 BHK — 1,395 to 1,675 sq.ft.</option>
            <option value="3bhk">3 BHK — 1,916 to 1,982 sq.ft.</option>
            <option value="any">Open to All</option>
          </select>
          {errors.unitPreference && <p className="form-error" role="alert">{errors.unitPreference.message}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="enq-message" className="form-label">
          Message <span className="text-[0.75rem] text-bmu-muted font-normal">(optional)</span>
        </label>
        <textarea id="enq-message" rows={3}
          placeholder="Floor plan queries, site visit scheduling, pricing…"
          className="form-input resize-none" {...register("message")} />
      </div>

      <div className="flex items-start gap-2.5">
        <input id="enq-consent" type="checkbox"
          className="mt-1 h-4 w-4 border-bmu-line accent-bmu-red flex-shrink-0"
          {...register("consent")} />
        <label htmlFor="enq-consent" className="text-[0.8rem] text-bmu-muted leading-relaxed">
          I consent to being contacted by the {PROJECT.name} team. This enquiry is for
          information only and does not constitute a booking.
        </label>
      </div>
      {errors.consent && <p className="form-error" role="alert">{errors.consent.message}</p>}

      <button type="submit" disabled={isSubmitting}
        className="btn-secondary w-full sm:w-auto justify-center disabled:opacity-60">
        {isSubmitting ? "Submitting…" : (
          <><Send size={15} aria-hidden="true" /> Submit Enquiry</>
        )}
      </button>
    </form>
  );
}

/* ── Homepage enquiry section ──────────────────────────────────── */
export function EnquirySection() {
  const isOpen = CONFIG.APPLICATION_STATUS === "OPEN";

  return (
    <section id="enquiry" aria-labelledby="enquiry-heading" className="section-wrapper-red">
      <div className="container-x">
        <div className="grid lg:grid-cols-2 gap-10 items-start">

          {/* Left — info + Apply Now CTA */}
          <Reveal>
            <div className="section-kicker text-bmu-orange mb-1">Enquire / Apply</div>
            <h2 id="enquiry-heading" className="text-white font-bold leading-tight mb-2"
              style={{ fontSize: "clamp(1.5rem, 2.5vw, 2.1rem)" }}>
              Enquire About Braj Murliwala Residency
            </h2>
            <div className="h-1 w-10 bg-bmu-orange mb-5" />

            <p className="text-white/70 text-[0.9rem] leading-relaxed mb-6">
              Fill the form to receive project details, floor plans, price list and
              site visit information. Our team responds within 24 hours.
            </p>

            <div className="space-y-2.5 mb-7">
              {[
                { label: "Phone",   value: PROJECT.contact.phonePrimary,
                  href: `tel:${PROJECT.contact.phonePrimary.replace(/\s/g,"")}` },
                { label: "Email",   value: PROJECT.contact.email,
                  href: `mailto:${PROJECT.contact.email}` },
                { label: "Address", value: `${PROJECT.location.address}, ${PROJECT.location.city}`,
                  href: undefined },
              ].map((r) => (
                <div key={r.label} className="text-[0.87rem] text-white/75">
                  <span className="font-bold text-white/40 uppercase tracking-[0.1em] text-[0.65rem] mr-2">
                    {r.label}
                  </span>
                  {r.href
                    ? <a href={r.href} className="font-semibold text-white hover:text-bmu-orange-100 transition-colors">{r.value}</a>
                    : <span className="font-semibold text-white">{r.value}</span>}
                </div>
              ))}
            </div>

            {/* Apply divider */}
            <div className="enquiry-action-divider">Or apply directly</div>

            {/* Formal application block */}
            <div className="bg-black/20 border border-white/15 p-5">
              <p className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-bmu-orange mb-1">
                Formal Application
              </p>
              <p className="text-white font-bold text-[1rem] mb-1">
                Reserve Your Home — Application Fee
              </p>
              <p className="text-white/55 text-[0.82rem] mb-4">
                ₹{CONFIG.APPLICATION_AMOUNT.toLocaleString("en-IN")} application amount via
                secure Razorpay payment.
              </p>
              <a href="#application"
                className={cn(
                  "btn-apply block text-center",
                  !isOpen && "opacity-50 pointer-events-none"
                )}
                aria-disabled={!isOpen}>
                {isOpen ? (
                  <><FileText size={15} aria-hidden="true" className="inline mr-1.5" />
                  Apply Now — ₹{CONFIG.APPLICATION_AMOUNT.toLocaleString("en-IN")}</>
                ) : (
                  <><Lock size={15} aria-hidden="true" className="inline mr-1.5" />
                  Applications Closed</>
                )}
              </a>
              <p className="text-white/30 text-[0.68rem] mt-2 text-center">
                Enquiry above is free. This initiates a ₹{CONFIG.APPLICATION_AMOUNT.toLocaleString("en-IN")} Razorpay payment.
              </p>
            </div>
          </Reveal>

          {/* Right — form */}
          <Reveal delay={120}>
            <div className="bg-white p-6">
              <p className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-bmu-muted mb-5">
                Free Enquiry Form — No Payment Required
              </p>
              <EnquiryForm />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ── Modal version ─────────────────────────────────────────────── */
export function EnquiryModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true"
      aria-labelledby="modal-enquiry-heading"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white w-full max-h-[90vh] overflow-y-auto relative">
        <div className="card-header-bar bg-bmu-red-800 justify-between sticky top-0">
          <span id="modal-enquiry-heading">Enquire — {PROJECT.name}</span>
          <button onClick={onClose}
            className="h-7 w-7 flex items-center justify-center bg-white/10 hover:bg-white/20"
            aria-label="Close">
            <X size={15} aria-hidden="true" />
          </button>
        </div>
        <div className="p-6"><EnquiryForm compact onSuccess={onClose} /></div>
      </div>
    </div>
  );
}
