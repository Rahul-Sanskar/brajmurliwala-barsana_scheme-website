/**
 * POST /api/razorpay/create-order
 *
 * Server-side route — creates a Razorpay order for the application/booking fee.
 * Credentials (RAZORPAY_KEY_SECRET) never leave the server.
 *
 * Request body (JSON):
 *   { amountInr: number }   — client sends the requested amount for server-side validation.
 *
 * Response (JSON):
 *   { orderId, amount, currency, keyId }
 */

import Razorpay from "razorpay";
import { CONFIG } from "@/app/_data/project";

// Enforce server-only — this file must never be bundled into the client.
export const runtime = "nodejs";

export async function POST(request: Request): Promise<Response> {
  try {
    /* ── 1. Validate env ──────────────────────────────────────── */
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return Response.json(
        {
          error: "Payment gateway is not configured on the server.",
          code: "RAZORPAY_NOT_CONFIGURED",
        },
        { status: 503 }
      );
    }

    /* ── 2. Parse + validate request body ────────────────────── */
    let body: { amountInr?: unknown };
    try {
      body = await request.json();
    } catch {
      return Response.json({ error: "Invalid request body." }, { status: 400 });
    }

    const requestedAmount = Number(body.amountInr);

    // Server-side guard: reject if client sends a different amount.
    if (requestedAmount !== CONFIG.APPLICATION_AMOUNT) {
      return Response.json(
        {
          error: "Invalid application amount.",
          expected: CONFIG.APPLICATION_AMOUNT,
          received: requestedAmount,
        },
        { status: 400 }
      );
    }

    /* ── 3. Check application status ─────────────────────────── */
    if (CONFIG.APPLICATION_STATUS !== "OPEN") {
      return Response.json(
        { error: "Applications are currently closed.", code: "APPLICATIONS_CLOSED" },
        { status: 403 }
      );
    }

    /* ── 4. Create Razorpay order ─────────────────────────────── */
    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

    // Razorpay amounts are in paise (1 INR = 100 paise).
    const amountPaise = CONFIG.APPLICATION_AMOUNT * 100;

    const order = await razorpay.orders.create({
      amount: amountPaise,
      currency: "INR",
      receipt: `bmu-app-${Date.now()}`,
      notes: {
        project: "Braj Murliwala Residency",
        scheme: "Barsana Urban Housing Scheme",
        type: "Application Fee",
      },
    });

    return Response.json({
      orderId: order.id,
      amount: order.amount,         // paise — used by Razorpay checkout
      amountInr: CONFIG.APPLICATION_AMOUNT,
      currency: order.currency,
      keyId,                         // public key — safe to return
    });
  } catch (err) {
    console.error("[create-order] Razorpay error:", err);
    return Response.json(
      { error: "Failed to create payment order. Please try again." },
      { status: 500 }
    );
  }
}
