/**
 * /results — Payment result page
 *
 * Handles three states via URL search params:
 *   ?status=success&paymentId=pay_xxx&orderId=order_xxx&amountInr=21000
 *   ?status=failed&reason=<message>
 *   ?status=cancelled    (user dismissed Razorpay checkout)
 *
 * This page is a Server Component — params come from the URL, not client state.
 * No real payment data is generated here; it only DISPLAYS what the server returned.
 */

import type { Metadata } from "next";
import Link from "next/link";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  ArrowLeft,
  RotateCcw,
  Building2,
} from "lucide-react";
import { PROJECT, CONFIG } from "@/app/_data/project";

export const metadata: Metadata = {
  title: `Application Result | ${PROJECT.name}`,
  robots: { index: false, follow: false },
};

interface ResultsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

function formatInrDisplay(n: string | string[] | undefined): string {
  const num = typeof n === "string" ? parseInt(n, 10) : NaN;
  if (isNaN(num)) return `₹${CONFIG.APPLICATION_AMOUNT.toLocaleString("en-IN")}`;
  return `₹${num.toLocaleString("en-IN")}`;
}

function maskPaymentId(id: string): string {
  // Show full Razorpay payment ID — it is not sensitive (visible in Razorpay dashboard).
  return id;
}

export default async function ResultsPage({ searchParams }: ResultsPageProps) {
  const params = await searchParams;
  const status = typeof params.status === "string" ? params.status : "unknown";
  const paymentId = typeof params.paymentId === "string" ? params.paymentId : null;
  const orderId = typeof params.orderId === "string" ? params.orderId : null;
  const amountInr = formatInrDisplay(params.amountInr);
  const reason = typeof params.reason === "string" ? params.reason : null;

  const isSuccess = status === "success";
  const isCancelled = status === "cancelled";
  void (status === "failed" || status === "unknown");

  return (
    <main className="min-h-[80vh] bg-bmu-stone flex items-start justify-center py-14 px-4">
      <div className="w-full max-w-lg">

        {/* ── Status card ──────────────────────────────────── */}
        <div className="bg-white border border-bmu-line overflow-hidden">

          {/* Header strip */}
          <div
            className={
              isSuccess
                ? "card-header-bar bg-bmu-leaf-600"
                : isCancelled
                ? "card-header-bar bg-bmu-navy-700"
                : "card-header-bar bg-red-700"
            }
          >
            {isSuccess
              ? "Application Submitted Successfully"
              : isCancelled
              ? "Payment Cancelled"
              : "Payment Could Not Be Completed"}
          </div>

          <div className="p-6 flex flex-col gap-5">

            {/* Icon + status line */}
            <div className="flex items-center gap-3">
              {isSuccess ? (
                <CheckCircle size={36} className="text-bmu-leaf-600 flex-shrink-0" aria-hidden="true" />
              ) : isCancelled ? (
                <AlertTriangle size={36} className="text-bmu-navy-700 flex-shrink-0" aria-hidden="true" />
              ) : (
                <XCircle size={36} className="text-red-600 flex-shrink-0" aria-hidden="true" />
              )}
              <div>
                <p className="font-bold text-bmu-navy-700 text-[1rem] leading-snug">
                  {isSuccess
                    ? "Your application has been received."
                    : isCancelled
                    ? "You cancelled the payment."
                    : "Payment could not be completed."}
                </p>
                {reason && !isSuccess && (
                  <p className="text-[0.82rem] text-bmu-muted mt-0.5">{reason}</p>
                )}
              </div>
            </div>

            {/* Project details row */}
            <div className="border border-bmu-line bg-bmu-stone px-4 py-3 flex items-center gap-3">
              <Building2 size={16} className="text-bmu-navy-700 flex-shrink-0" aria-hidden="true" />
              <div className="text-[0.82rem] leading-snug">
                <div className="font-semibold text-bmu-navy-700">{PROJECT.name}</div>
                <div className="text-bmu-muted">{PROJECT.portal.name} · {PROJECT.location.short}</div>
              </div>
            </div>

            {/* Payment details table — success only */}
            {isSuccess && (
              <table className="institutional-table text-[0.85rem]">
                <tbody>
                  <tr>
                    <td className="text-bmu-muted font-medium w-1/2">Application Amount</td>
                    <td className="font-bold text-bmu-navy-700">{amountInr}</td>
                  </tr>
                  <tr>
                    <td className="text-bmu-muted font-medium">Payment Status</td>
                    <td>
                      <span className="avail-badge-available">Payment Successful</span>
                    </td>
                  </tr>
                  {paymentId && (
                    <tr>
                      <td className="text-bmu-muted font-medium">Payment ID</td>
                      <td className="font-mono text-[0.8rem] break-all text-bmu-navy-700">
                        {maskPaymentId(paymentId)}
                      </td>
                    </tr>
                  )}
                  {orderId && (
                    <tr>
                      <td className="text-bmu-muted font-medium">Order ID</td>
                      <td className="font-mono text-[0.8rem] break-all text-bmu-navy-700">
                        {orderId}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}

            {/* Notice for success */}
            {isSuccess && (
              <p className="text-[0.78rem] text-bmu-muted border-l-2 border-bmu-saffron-600 pl-3 leading-relaxed">
                Please save your Payment ID for future reference. Our team will contact you
                within 24 hours to confirm your application.
              </p>
            )}

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 pt-1">
              <Link href="/#hero" className="btn-primary inline-flex items-center gap-2">
                <ArrowLeft size={14} aria-hidden="true" />
                Back to Project
              </Link>
              {!isSuccess && (
                <Link href="/#application" className="btn-outline inline-flex items-center gap-2">
                  <RotateCcw size={14} aria-hidden="true" />
                  Try Again
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-[0.72rem] text-bmu-muted text-center mt-4 leading-relaxed">
          {PROJECT.name} is a private residential project by {PROJECT.developer.name}.
          This is not a government portal. Application is subject to the project&apos;s
          applicable terms and conditions.
        </p>
      </div>
    </main>
  );
}
