"use client";

/**
 * EnquirySection — free enquiry form + Apply Now (Razorpay).
 *
 * On submit the form POSTs to /api/enquiry which forwards the data
 * to Web3Forms → delivers an HTML email to info@brajmurliwala.online.
 * No npm package needed. Works forever on the free tier.
 */

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send, CheckCircle, AlertTriangle, X } from "lucide-react";
import { PROJECT, CONFIG } from "@/app/_data/project";
import { cn } from "@/app/_lib/utils";
import { Reveal } from "@/app/_components/reveal-hooks";
import { RegDates } from "@/app/_components/reg-dates";

/* ── Validation schema ─────────────────────────────────────────── */
const schema = z.object({
  fullName:       z.string().min(2, "Please enter your full name"),
  mobile:         z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  email:          z.string().email("Enter a valid email address"),
  unitPreference: z.string().min(1, "Please select a configuration"),
  message:        z.string().optional(),
  consent:        z.literal(true, { error: "You must agree to be contacted" }),
});
type FormValues = z.infer<typeof schema>;

/* ── Shared form component (used inline + in modal) ─────────────── */
function EnquiryForm({
  compact = false,
  onSuccess,
}: {
  compact?: boolean;
  onSuccess?: () => void;
}) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitted,   setSubmitted]   = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormValues) => {
    setServerError(null);
    try {
      const res = await fetch("/api/enquiry", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName:       data.fullName,
          mobile:         data.mobile,
          email:          data.email,
          unitPreference: data.unitPreference,
          message:        data.message ?? "",
        }),
      });

      const result = await res.json() as { success: boolean; error?: string };

      if (!result.success) {
        setServerError(result.error ?? "Submission failed. Please try again.");
        return;
      }

      setSubmitted(true);
      reset();
      onSuccess?.();
    } catch {
      setServerError("Network error. Please check your connection and try again.");
    }
  };

  /* ── Success state ── */
  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
        <CheckCircle size={44} className="text-bmu-green" aria-hidden="true" />
        <p className="font-bold text-bmu-ink text-[1.15rem]">Enquiry Submitted!</p>
        <p className="text-bmu-muted text-[0.88rem] leading-relaxed max-w-xs">
          Thank you{" "}— our team will call you back within the hour.
          For faster response call{" "}
          <a
            href={`tel:${PROJECT.contact.phonePrimary.replace(/\s/g, "")}`}
            className="font-bold text-bmu-red hover:underline"
          >
            {PROJECT.contact.phonePrimary}
          </a>.
        </p>
        <button className="btn-outline mt-1 text-[0.82rem]" onClick={() => setSubmitted(false)}>
          Submit Another Enquiry
        </button>
      </div>
    );
  }

  /* ── Form ── */
  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div className={cn("grid gap-4", compact ? "grid-cols-1" : "sm:grid-cols-2")}>

        {/* Full Name */}
        <div>
          <label htmlFor="enq-fullName" className="form-label">
            Full Name <span className="text-red-500" aria-hidden="true">*</span>
          </label>
          <input
            id="enq-fullName" type="text" autoComplete="name"
            placeholder="Your full name"
            className={cn("form-input", errors.fullName && "border-red-400")}
            {...register("fullName")}
          />
          {errors.fullName && (
            <p className="form-error" role="alert">{errors.fullName.message}</p>
          )}
        </div>

        {/* Mobile */}
        <div>
          <label htmlFor="enq-mobile" className="form-label">
            Mobile <span className="text-red-500" aria-hidden="true">*</span>
          </label>
          <input
            id="enq-mobile" type="tel" inputMode="numeric" autoComplete="tel"
            placeholder="10-digit mobile number"
            className={cn("form-input", errors.mobile && "border-red-400")}
            {...register("mobile")}
          />
          {errors.mobile && (
            <p className="form-error" role="alert">{errors.mobile.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="enq-email" className="form-label">
            Email <span className="text-red-500" aria-hidden="true">*</span>
          </label>
          <input
            id="enq-email" type="email" autoComplete="email"
            placeholder="your@email.com"
            className={cn("form-input", errors.email && "border-red-400")}
            {...register("email")}
          />
          {errors.email && (
            <p className="form-error" role="alert">{errors.email.message}</p>
          )}
        </div>

        {/* Unit preference */}
        <div>
          <label htmlFor="enq-unit" className="form-label">
            Configuration <span className="text-red-500" aria-hidden="true">*</span>
          </label>
          <select
            id="enq-unit" defaultValue=""
            className={cn("form-input form-select", errors.unitPreference && "border-red-400")}
            {...register("unitPreference")}
          >
            <option value="" disabled>Select configuration</option>
            <option value="1bhk">1 BHK — 881 to 895 sq.ft.</option>
            <option value="2bhk">2 BHK — 1,395 to 1,675 sq.ft.</option>
            <option value="3bhk">3 BHK — 1,916 to 1,982 sq.ft.</option>
            <option value="any">Open to All</option>
          </select>
          {errors.unitPreference && (
            <p className="form-error" role="alert">{errors.unitPreference.message}</p>
          )}
        </div>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="enq-message" className="form-label">
          Message{" "}
          <span className="text-[0.75rem] text-bmu-muted font-normal">(optional)</span>
        </label>
        <textarea
          id="enq-message" rows={3}
          placeholder="Floor plan queries, site visit scheduling, pricing…"
          className="form-input resize-none"
          {...register("message")}
        />
      </div>

      {/* Consent */}
      <div className="flex items-start gap-2.5">
        <input
          id="enq-consent" type="checkbox"
          className="mt-1 h-4 w-4 border-bmu-line accent-bmu-red flex-shrink-0"
          {...register("consent")}
        />
        <label htmlFor="enq-consent" className="text-[0.8rem] text-bmu-muted leading-relaxed">
          I consent to being contacted by the {PROJECT.name} team regarding this enquiry.
          This is for information only and does not constitute a booking.
        </label>
      </div>
      {errors.consent && (
        <p className="form-error" role="alert">{errors.consent.message}</p>
      )}

      {/* Server error */}
      {serverError && (
        <div
          className="flex items-start gap-2 text-[0.82rem] text-red-700 bg-red-50 border border-red-200 px-3 py-2.5"
          role="alert"
        >
          <AlertTriangle size={15} className="flex-shrink-0 mt-0.5 text-red-600" aria-hidden="true" />
          <div>
            <span>{serverError}</span>
            <span className="block mt-0.5 text-[0.75rem] text-red-500">
              Or call us directly:{" "}
              <a
                href={`tel:${PROJECT.contact.phonePrimary.replace(/\s/g, "")}`}
                className="font-bold underline"
              >
                {PROJECT.contact.phonePrimary}
              </a>
            </span>
          </div>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-secondary w-full sm:w-auto justify-center disabled:opacity-60"
      >
        {isSubmitting ? (
          <>
            <span className="app-spinner" aria-hidden="true" /> Sending…
          </>
        ) : (
          <>
            <Send size={15} aria-hidden="true" /> Submit Enquiry
          </>
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

          {/* Left — info + Register Now CTA */}
          <Reveal>
            <div className="section-kicker text-bmu-orange mb-1">Register Now</div>
            <h2
              id="enquiry-heading"
              className="text-white font-bold leading-tight mb-2"
              style={{ fontSize: "clamp(1.5rem, 2.5vw, 2.1rem)" }}
            >
              Don&apos;t Miss Out — Only 50 Units Left
            </h2>
            <div className="h-1 w-10 bg-bmu-orange mb-4" />

            {/* Urgency callout */}
            <div className="bg-bmu-orange/20 border border-bmu-orange/40 px-4 py-3 mb-5">
              <p className="text-white text-[0.88rem] font-bold leading-snug">
                🔥 Pre-launch price ₹7,999/sq.ft. ends soon.{" "}
                <span className="text-bmu-orange-100">Every day you wait costs you money.</span>
              </p>
              <p className="text-white/70 text-[0.8rem] mt-1">
                Steps from Shree Radha Rani Mandir, Kirti Mandir &amp; Barsana Bus Stand.
                Bank loan up to 90% available.
              </p>
            </div>

            <p className="text-white/70 text-[0.9rem] leading-relaxed mb-6">
              Fill the form — our team calls back within the hour to discuss your unit,
              floor plan and site visit. Free, no obligation.
            </p>

            {/* Contact details */}
            <div className="space-y-2.5 mb-7">
              {[
                { label: "Phone",   value: PROJECT.contact.phonePrimary,   href: `tel:${PROJECT.contact.phonePrimary.replace(/\s/g, "")}` },
                { label: "Email",   value: PROJECT.contact.email,           href: `mailto:${PROJECT.contact.email}` },
                { label: "Address", value: `${PROJECT.location.address}, ${PROJECT.location.city}`, href: undefined },
              ].map((r) => (
                <div key={r.label} className="text-[0.87rem] text-white/75">
                  <span className="font-bold text-white/40 uppercase tracking-[0.1em] text-[0.65rem] mr-2">
                    {r.label}
                  </span>
                  {r.href ? (
                    <a href={r.href} className="font-semibold text-white hover:text-bmu-orange-100 transition-colors">
                      {r.value}
                    </a>
                  ) : (
                    <span className="font-semibold text-white">{r.value}</span>
                  )}
                </div>
              ))}
            </div>

            {/* Register Now block */}
            <div className="bg-black/20 border border-white/15 p-5">
              <p className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-bmu-orange mb-1">
                ⚡ Block Your Unit Now
              </p>
              <p className="text-white font-bold text-[1rem] mb-1">
                Reserve Before Someone Else Does
              </p>
              <p className="text-white/55 text-[0.82rem] mb-4">
                Just ₹{CONFIG.APPLICATION_AMOUNT.toLocaleString("en-IN")} via secure Razorpay
                blocks your unit at the pre-launch price. Only 50 homes available — don&apos;t wait.
              </p>
              <a
                href="#application"
                className={cn("btn-apply block text-center", !isOpen && "opacity-50 pointer-events-none")}
                aria-disabled={!isOpen}
              >
                {isOpen ? "Register Now" : "Registrations Closed"}
              </a>
              <RegDates variant="dark" />
            </div>
          </Reveal>

          {/* Right — form */}
          <Reveal delay={120}>
            <div className="bg-white p-6">
              <p className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-bmu-red mb-1">
                🔥 Units going fast — register now to secure yours
              </p>
              <p className="text-[0.72rem] text-bmu-muted mb-5">
                Free enquiry · No payment required · Team responds within the hour
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
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-enquiry-heading"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white w-full max-w-xl max-h-[92vh] overflow-y-auto relative">
        {/* Header */}
        <div className="card-header-bar bg-bmu-red-800 justify-between sticky top-0 z-10">
          <div className="flex flex-col leading-tight">
            <span id="modal-enquiry-heading" className="font-bold text-white text-[0.95rem]">
              Enquire — {PROJECT.name}
            </span>
            <span className="text-[0.65rem] text-white/60 font-normal">
              Free · No payment · Team responds within the hour
            </span>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 flex items-center justify-center bg-white/10 hover:bg-white/20 ml-3 flex-shrink-0"
            aria-label="Close enquiry form"
          >
            <X size={15} aria-hidden="true" />
          </button>
        </div>

        {/* Urgency strip */}
        <div className="bg-bmu-orange px-4 py-2 flex items-center gap-2">
          <span className="text-[0.78rem] font-bold text-white">
            ⚠️ Only 50 units left — fill this form to secure yours
          </span>
        </div>

        <div className="p-5 sm:p-6">
          <EnquiryForm compact onSuccess={onClose} />
        </div>
      </div>
    </div>
  );
}
