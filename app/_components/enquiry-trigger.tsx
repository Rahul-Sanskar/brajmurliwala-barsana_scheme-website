"use client";

/**
 * EnquiryTrigger — global context for the enquiry modal.
 *
 * Usage:
 *   1. Wrap the app in <EnquiryProvider> (done in layout.tsx).
 *   2. Use <EnquiryButton> anywhere in place of href="#enquiry" links.
 *      It opens the modal without navigating.
 *   3. "Apply Now" buttons remain wired to Razorpay via ApplicationSection.
 */

import { createContext, useCallback, useContext, useState } from "react";
import { EnquiryModal } from "@/app/_components/enquiry-section";

/* ── Context ────────────────────────────────────────────────────── */
const EnquiryCtx = createContext<{ open: () => void }>({ open: () => {} });

export function EnquiryProvider({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  const open  = useCallback(() => setVisible(true),  []);
  const close = useCallback(() => setVisible(false), []);

  return (
    <EnquiryCtx.Provider value={{ open }}>
      {children}
      {visible && <EnquiryModal onClose={close} />}
    </EnquiryCtx.Provider>
  );
}

export function useEnquiry() {
  return useContext(EnquiryCtx);
}

/**
 * EnquiryButton — drop-in replacement for any anchor/button that should
 * open the enquiry modal. Accepts the same className as btn-primary etc.
 */
export function EnquiryButton({
  children,
  className = "btn-outline",
  type = "button",
}: {
  children: React.ReactNode;
  className?: string;
  type?: "button" | "submit";
}) {
  const { open } = useEnquiry();
  return (
    <button type={type} className={className} onClick={open}>
      {children}
    </button>
  );
}
