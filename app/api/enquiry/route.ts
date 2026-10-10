import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

/**
 * POST /api/enquiry
 *
 * Sends enquiry form submissions via Gmail SMTP using Nodemailer.
 * Free, ~500 emails/day, no third-party service needed.
 *
 * Required env vars in Hostinger (and .env.local):
 *   GMAIL_USER        = Invest2realty@gmail.com
 *   GMAIL_APP_PASSWORD = xxxx xxxx xxxx xxxx   (16-char app password)
 *   ENQUIRY_TO_EMAIL  = Invest2realty@gmail.com  (recipient — can be same)
 *
 * How to get Gmail App Password:
 *   1. Go to myaccount.google.com → Security
 *   2. Enable 2-Step Verification (required)
 *   3. Search "App Passwords" → create one named "Brajmurliwala"
 *   4. Copy the 16-character password → paste as GMAIL_APP_PASSWORD
 */

export const runtime = "nodejs";

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

export async function POST(req: NextRequest) {

  /* ── Env check ─────────────────────────────────────────────── */
  const gmailUser    = process.env.GMAIL_USER;
  const gmailPass    = process.env.GMAIL_APP_PASSWORD;
  const toEmail      = process.env.ENQUIRY_TO_EMAIL ?? "glocious.smo@gmail.com";

  if (!gmailUser || !gmailPass) {
    return NextResponse.json(
      { success: false, error: "Email service not configured." },
      { status: 503 }
    );
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

  /* ── Escape ─────────────────────────────────────────────────── */
  const safeName    = escHtml(fullName.trim());
  const safeMobile  = escHtml(mobile);
  const safeEmail   = escHtml(email.trim());
  const safeMessage = message?.trim() ? escHtml(message.trim()) : "";

  const unitLabel: Record<string, string> = {
    "1bhk": "1 BHK (881–895 sq.ft.)",
    "2bhk": "2 BHK (1,395–1,675 sq.ft.)",
    "3bhk": "3 BHK (1,916–1,982 sq.ft.)",
    "any":  "Open to All Configurations",
  };
  const safeUnit = unitLabel[unitPreference];

  /* ── HTML email body ────────────────────────────────────────── */
  const htmlBody = `
<!DOCTYPE html><html><head><meta charset="UTF-8"/></head>
<body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;color:#1a1a1a;">
  <div style="background:#9F1D20;padding:18px 24px;margin-bottom:24px;">
    <h1 style="color:#fff;font-size:1.1rem;margin:0;font-weight:800;">NEW ENQUIRY — Braj Murliwala Residency</h1>
    <p style="color:rgba(255,255,255,0.75);font-size:0.78rem;margin:4px 0 0;">Barsana Housing Scheme · Goverdhan Road, Barsana</p>
  </div>
  <table style="width:100%;border-collapse:collapse;font-size:0.9rem;">
    <tr style="background:#f8f4f0;">
      <td style="padding:10px 14px;font-weight:700;width:36%;border-bottom:1px solid #e4ddd8;">Name</td>
      <td style="padding:10px 14px;border-bottom:1px solid #e4ddd8;">${safeName}</td>
    </tr>
    <tr>
      <td style="padding:10px 14px;font-weight:700;border-bottom:1px solid #e4ddd8;">Mobile</td>
      <td style="padding:10px 14px;border-bottom:1px solid #e4ddd8;font-weight:700;">+91 ${safeMobile}</td>
    </tr>
    <tr style="background:#f8f4f0;">
      <td style="padding:10px 14px;font-weight:700;border-bottom:1px solid #e4ddd8;">Email</td>
      <td style="padding:10px 14px;border-bottom:1px solid #e4ddd8;">${safeEmail}</td>
    </tr>
    <tr>
      <td style="padding:10px 14px;font-weight:700;border-bottom:1px solid #e4ddd8;">Configuration</td>
      <td style="padding:10px 14px;border-bottom:1px solid #e4ddd8;font-weight:700;color:#E87516;">${safeUnit}</td>
    </tr>
    ${safeMessage ? `
    <tr style="background:#f8f4f0;">
      <td style="padding:10px 14px;font-weight:700;border-bottom:1px solid #e4ddd8;vertical-align:top;">Message</td>
      <td style="padding:10px 14px;border-bottom:1px solid #e4ddd8;white-space:pre-wrap;">${safeMessage}</td>
    </tr>` : ""}
  </table>
  <div style="margin-top:24px;padding:14px 18px;background:#fff7ed;border-left:4px solid #E87516;font-size:0.82rem;color:#555;">
    <strong>Action required:</strong> Follow up with <strong>${safeName}</strong> — mobile: <strong>+91 ${safeMobile}</strong>.
  </div>
  <p style="margin-top:20px;font-size:0.72rem;color:#aaa;text-align:center;">
    Sent via brajmurliwala.info · ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST
  </p>
</body></html>`;

  /* ── Send via Gmail SMTP ─────────────────────────────────────── */
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: gmailUser,
        pass: gmailPass,   // Gmail App Password (not your login password)
      },
    });

    await transporter.sendMail({
      from:    `"Braj Murliwala Residency" <${gmailUser}>`,
      to:      toEmail,
      replyTo: email.trim(),
      subject: `New Enquiry: ${safeName} — ${safeUnit}`,
      html:    htmlBody,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[enquiry] Gmail SMTP error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to send email. Please try again." },
      { status: 500 }
    );
  }
}
