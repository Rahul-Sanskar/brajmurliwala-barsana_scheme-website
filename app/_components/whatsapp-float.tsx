"use client";

import { MessageCircle } from "lucide-react";
import { useEnquiry } from "@/app/_components/enquiry-trigger";

/**
 * WhatsAppFloat — floating button, opens enquiry modal on click.
 * (All non-Apply CTAs open the enquiry form only.)
 */
export function WhatsAppFloat() {
  const { open } = useEnquiry();
  return (
    <button
      type="button"
      onClick={open}
      aria-label="Enquire now"
      className="fixed bottom-5 right-5 z-50 h-14 w-14 inline-flex items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_24px_rgba(37,211,102,0.35)] hover:scale-105 transition"
    >
      <MessageCircle size={26} />
    </button>
  );
}
