import { MessageCircle } from "lucide-react";
import { PROJECT } from "@/app/_data/project";
import { whatsappChatLink } from "@/app/_lib/utils";

export function WhatsAppFloat() {
  const link = whatsappChatLink(
    PROJECT.contact.whatsapp,
    `Hello Braj Murliwala Residency, I wish to enquire about ${PROJECT.name} at Barsana.`
  );
  return (
    <a
      href={link}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-50 h-14 w-14 inline-flex items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_24px_rgba(37,211,102,0.35)] hover:scale-105 transition"
    >
      <MessageCircle size={26} />
    </a>
  );
}
