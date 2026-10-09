import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/enquiry
 *
 * Validates input then forwards to Web3Forms which emails
 * the submission to ENQUIRY_TO_EMAIL (set in env vars).
 *
 * Setup:
 *  1. Go to https://web3forms.com
 *  2. Enter Invest2realty@gmail.com → click "Create Access Key"
 *  3. Add to Hostinger env vars: WEB3FORMS_ACCESS_KEY=<key>
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

export async function POST(req: NextRequest) {

  const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
  if (!accessKey) {
    return NextResponse.json(
      { success: false, error: "Email service not configured. Please try again later." },
      { status: 503 }
    );
  }

  let body: EnquiryBody;
  try {
    body = await req.json() as EnquiryBody;
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request." }, { status: 400 });
  }

  const { fullName, mobile, email, unitPreference, message } = body;

  /* Validate */
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

  /* Escape */
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
    ${safeMessage ? `<tr style="background:#f8f4f0;">
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

  try {
    const res = await fetch("https://api.web3forms.com/submit", {
      method:  "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: accessKey,
        subject:    `New Enquiry: ${safeName} — ${safeUnit}`,
        from_name:  "Braj Murliwala Residency Website",
        replyto:    safeEmail,
        html:       htmlBody,
        botcheck:   "",
      }),
    });

    const result = await res.json() as { success: boolean; message?: string };

    if (!result.success) {
      console.error("Web3Forms error:", result);
      return NextResponse.json({ success: false, error: "Failed to send. Please try again." }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Enquiry API error:", err);
    return NextResponse.json({ success: false, error: "Network error. Please try again." }, { status: 500 });
  }
}
