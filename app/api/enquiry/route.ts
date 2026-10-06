import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/enquiry
 *
 * Validates input then forwards to contact.php on the same server.
 * contact.php sends the email via PHP mail().
 *
 * The PHP endpoint URL is set via CONTACT_PHP_URL in .env.local:
 *   CONTACT_PHP_URL=https://www.brajmurliwala.online/contact.php
 *
 * Security:
 *  - Origin header CSRF check
 *  - Full server-side validation
 *  - HTML escaping before email interpolation
 *  - Allowlist for unitPreference
 */

interface EnquiryBody {
  fullName: string;
  mobile: string;
  email: string;
  unitPreference: string;
  message?: string;
}

function escHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

const ALLOWED_UNITS = new Set(["1bhk", "2bhk", "3bhk", "any"]);

const ALLOWED_ORIGINS = new Set([
  "https://www.brajmurliwala.online",
  "https://brajmurliwala.online",
  "http://localhost:3000",
]);

export async function POST(req: NextRequest) {
  /* ── CSRF ───────────────────────────────────────────────────── */
  const origin = req.headers.get("origin") ?? "";
  if (!ALLOWED_ORIGINS.has(origin)) {
    return NextResponse.json({ success: false, error: "Forbidden." }, { status: 403 });
  }

  /* ── Parse body ─────────────────────────────────────────────── */
  let body: EnquiryBody;
  try {
    body = await req.json() as EnquiryBody;
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request." }, { status: 400 });
  }

  const { fullName, mobile, email, unitPreference, message } = body;

  /* ── Validate ───────────────────────────────────────────────── */
  if (typeof fullName !== "string" || fullName.trim().length < 2 || fullName.trim().length > 100)
    return NextResponse.json({ success: false, error: "Invalid name." }, { status: 400 });
  if (typeof mobile !== "string" || !/^[6-9]\d{9}$/.test(mobile))
    return NextResponse.json({ success: false, error: "Invalid mobile number." }, { status: 400 });
  if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254)
    return NextResponse.json({ success: false, error: "Invalid email." }, { status: 400 });
  if (!ALLOWED_UNITS.has(unitPreference))
    return NextResponse.json({ success: false, error: "Invalid configuration." }, { status: 400 });
  if (typeof message === "string" && message.length > 1000)
    return NextResponse.json({ success: false, error: "Message too long." }, { status: 400 });

  /* ── Forward to contact.php ─────────────────────────────────── */
  const phpUrl = process.env.CONTACT_PHP_URL;

  if (!phpUrl) {
    // Fallback: if CONTACT_PHP_URL not set, try same-origin /contact.php
    console.warn("[enquiry] CONTACT_PHP_URL not set in env — using fallback");
  }

  const endpoint = phpUrl ?? "https://www.brajmurliwala.online/contact.php";

  try {
    const phpRes = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Origin": "https://www.brajmurliwala.online",
      },
      body: JSON.stringify({
        fullName:       escHtml(fullName.trim()),
        mobile:         mobile,
        email:          email.trim(),
        unitPreference: unitPreference,
        message:        message?.trim() ?? "",
      }),
    });

    const result = await phpRes.json() as { success: boolean; error?: string };

    if (!result.success) {
      console.error("[enquiry] contact.php error:", result);
      return NextResponse.json(
        { success: false, error: result.error ?? "Failed to send. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[enquiry] fetch error:", err);
    return NextResponse.json(
      { success: false, error: "Could not reach mail server. Please try again." },
      { status: 500 }
    );
  }
}
