import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/enquiry
 *
 * Receives form data, forwards to Web3Forms which emails it to
 * the configured recipient. Web3Forms is permanently free — no
 * credit card, no domain verification, no npm package required.
 *
 * Setup (one-time):
 *   1. Go to https://web3forms.com
 *   2. Enter info@brajmurliwala.online and click "Create Access Key"
 *   3. Copy the access key shown
 *   4. Add to .env.local:   WEB3FORMS_ACCESS_KEY=<your-key>
 *
 * The access key is safe to expose in browser requests (Web3Forms
 * uses it only to route mail — it cannot be abused to send from
 * other addresses). We keep it server-side anyway for cleanliness.
 */

interface EnquiryBody {
  fullName: string;
  mobile: string;
  email: string;
  unitPreference: string;
  message?: string;
}

export async function POST(req: NextRequest) {
  const accessKey = process.env.WEB3FORMS_ACCESS_KEY;

  if (!accessKey) {
    return NextResponse.json(
      { success: false, error: "Email service not configured. Please call us directly." },
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

  // Basic server-side validation
  if (!fullName || fullName.trim().length < 2)
    return NextResponse.json({ success: false, error: "Invalid name." }, { status: 400 });
  if (!/^[6-9]\d{9}$/.test(mobile))
    return NextResponse.json({ success: false, error: "Invalid mobile number." }, { status: 400 });
  if (!email || !email.includes("@"))
    return NextResponse.json({ success: false, error: "Invalid email." }, { status: 400 });

  const unitLabel: Record<string, string> = {
    "1bhk": "1 BHK (881–895 sq.ft.)",
    "2bhk": "2 BHK (1,395–1,675 sq.ft.)",
    "3bhk": "3 BHK (1,916–1,982 sq.ft.)",
    "any":  "Open to All Configurations",
  };

  /* ── HTML email body ── */
  const htmlBody = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8" /></head>
<body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;color:#1a1a1a;">
  <div style="background:#9F1D20;padding:18px 24px;margin-bottom:24px;">
    <h1 style="color:#fff;font-size:1.1rem;margin:0;font-weight:800;letter-spacing:0.05em;">
      NEW ENQUIRY — Braj Murliwala Residency
    </h1>
    <p style="color:rgba(255,255,255,0.75);font-size:0.78rem;margin:4px 0 0;">
      Barsana Housing Scheme · Goverdhan Road, Barsana
    </p>
  </div>

  <table style="width:100%;border-collapse:collapse;font-size:0.9rem;">
    <tr style="background:#f8f4f0;">
      <td style="padding:10px 14px;font-weight:700;width:36%;border-bottom:1px solid #e4ddd8;">Name</td>
      <td style="padding:10px 14px;border-bottom:1px solid #e4ddd8;">${fullName.trim()}</td>
    </tr>
    <tr>
      <td style="padding:10px 14px;font-weight:700;border-bottom:1px solid #e4ddd8;">Mobile</td>
      <td style="padding:10px 14px;border-bottom:1px solid #e4ddd8;">
        <a href="tel:+91${mobile}" style="color:#9F1D20;font-weight:700;">+91 ${mobile}</a>
      </td>
    </tr>
    <tr style="background:#f8f4f0;">
      <td style="padding:10px 14px;font-weight:700;border-bottom:1px solid #e4ddd8;">Email</td>
      <td style="padding:10px 14px;border-bottom:1px solid #e4ddd8;">
        <a href="mailto:${email}" style="color:#9F1D20;">${email}</a>
      </td>
    </tr>
    <tr>
      <td style="padding:10px 14px;font-weight:700;border-bottom:1px solid #e4ddd8;">Configuration</td>
      <td style="padding:10px 14px;border-bottom:1px solid #e4ddd8;font-weight:700;color:#E87516;">
        ${unitLabel[unitPreference] ?? unitPreference}
      </td>
    </tr>
    ${message?.trim() ? `
    <tr style="background:#f8f4f0;">
      <td style="padding:10px 14px;font-weight:700;border-bottom:1px solid #e4ddd8;vertical-align:top;">Message</td>
      <td style="padding:10px 14px;border-bottom:1px solid #e4ddd8;white-space:pre-wrap;">${message.trim()}</td>
    </tr>` : ""}
  </table>

  <div style="margin-top:24px;padding:14px 18px;background:#fff7ed;border-left:4px solid #E87516;font-size:0.82rem;color:#555;">
    <strong>Action required:</strong> Call back <strong>${fullName.trim()}</strong> on
    <strong> +91 ${mobile}</strong> as soon as possible.
    Pre-launch pricing — every lead is high value.
  </div>

  <p style="margin-top:20px;font-size:0.72rem;color:#aaa;text-align:center;">
    Sent via brajmurliwala.online enquiry form · ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST
  </p>
</body>
</html>`;

  /* ── Post to Web3Forms ── */
  try {
    const w3fRes = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key:   accessKey,
        subject:      `New Enquiry: ${fullName.trim()} — ${unitLabel[unitPreference] ?? unitPreference}`,
        from_name:    "Braj Murliwala Residency Website",
        replyto:      email,
        html:         htmlBody,
        /* Web3Forms also sends a plain-text fallback automatically */
        botcheck:     "", // honeypot — must be empty
      }),
    });

    const result = await w3fRes.json() as { success: boolean; message?: string };

    if (!result.success) {
      console.error("Web3Forms error:", result);
      return NextResponse.json(
        { success: false, error: "Failed to send. Please call us directly." },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Enquiry API error:", err);
    return NextResponse.json(
      { success: false, error: "Network error. Please try again or call us." },
      { status: 500 }
    );
  }
}
