/**
 * POST /api/razorpay/verify
 *
 * Server-side route — verifies the Razorpay payment signature after checkout.
 * RAZORPAY_KEY_SECRET is used here and never exposed to the client.
 *
 * Request body (JSON):
 *   { razorpay_order_id, razorpay_payment_id, razorpay_signature }
 *
 * Response (JSON — success):
 *   { success: true, paymentId, orderId, amountInr }
 *
 * Response (JSON — failure):
 *   { success: false, error }
 */

import crypto from "crypto";

export const runtime = "nodejs";

const ALLOWED_ORIGINS = new Set([
  "https://www.brajmurliwala.online",
  "https://brajmurliwala.online",
  "http://localhost:3000",
]);

export async function POST(request: Request): Promise<Response> {
  try {
    /* ── CSRF: Origin check ───────────────────────────────────── */
    const origin = request.headers.get("origin") ?? "";
    if (!ALLOWED_ORIGINS.has(origin)) {
      return Response.json({ success: false, error: "Forbidden." }, { status: 403 });
    }

    /* ── 1. Validate env ──────────────────────────────────────── */
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keySecret) {
      return Response.json(
        { success: false, error: "Payment gateway not configured." },
        { status: 503 }
      );
    }

    /* ── 2. Parse request ─────────────────────────────────────── */
    let body: {
      razorpay_order_id?: unknown;
      razorpay_payment_id?: unknown;
      razorpay_signature?: unknown;
    };
    try {
      body = await request.json();
    } catch {
      return Response.json({ success: false, error: "Invalid request body." }, { status: 400 });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    if (
      typeof razorpay_order_id !== "string" ||
      typeof razorpay_payment_id !== "string" ||
      typeof razorpay_signature !== "string"
    ) {
      return Response.json(
        { success: false, error: "Missing required payment fields." },
        { status: 400 }
      );
    }

    /* ── 3. Verify HMAC-SHA256 signature ─────────────────────── */
    const body_str = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(body_str)
      .digest("hex");

    // Guard: both buffers must be same length for timingSafeEqual
    let isValid = false;
    try {
      const expected = Buffer.from(expectedSignature, "hex");
      const received = Buffer.from(razorpay_signature, "hex");
      if (expected.length === received.length) {
        isValid = crypto.timingSafeEqual(expected, received);
      }
    } catch {
      isValid = false;
    }

    if (!isValid) {
      console.warn("[verify] Signature mismatch for order:", razorpay_order_id);
      return Response.json(
        { success: false, error: "Payment verification failed. Signature mismatch." },
        { status: 400 }
      );
    }

    /* ── 4. Return verified confirmation ─────────────────────── */
    // In production you would also: persist payment record to DB, send confirmation email, etc.
    console.log("[verify] Payment verified:", razorpay_payment_id, "for order:", razorpay_order_id);

    return Response.json({
      success: true,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      // Return display amount for the success page (server-confirmed, not client-supplied)
      amountInr: Number(process.env.BOOKING_AMOUNT_INR) || 21000,
    });
  } catch (err) {
    console.error("[verify] Error:", err);
    return Response.json(
      { success: false, error: "An error occurred during verification." },
      { status: 500 }
    );
  }
}
