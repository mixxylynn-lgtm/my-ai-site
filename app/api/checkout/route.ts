export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";

// Stripe price IDs by plan. Monthly + annual are recurring subscriptions;
// lifetime is a one-time payment.
const PLANS = {
  monthly:  { price: "price_1TgUgYCehIvEVmmtjt6puNJf", mode: "subscription" as const },
  annual:   { price: "price_1TgUWnCehIvEVmmtVpUymVoh", mode: "subscription" as const },
  lifetime: { price: "price_1TgUdHCehIvEVmmtKPIuo8P6", mode: "payment" as const },
};

type Plan = keyof typeof PLANS;

export async function POST(req: NextRequest) {
  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      return NextResponse.json(
        { error: "Server misconfiguration: missing STRIPE_SECRET_KEY." },
        { status: 500 }
      );
    }

    const { plan, email } = await req.json();
    const selected = PLANS[plan as Plan];
    if (!selected) {
      return NextResponse.json(
        { error: `Unknown plan: ${plan}` },
        { status: 400 }
      );
    }

    const origin =
      req.headers.get("origin") || new URL(req.url).origin;

    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(stripeSecretKey);

    const session = await stripe.checkout.sessions.create({
      mode: selected.mode,
      line_items: [{ price: selected.price, quantity: 1 }],
      ...(email ? { customer_email: email } : {}),
      success_url: `${origin}/?checkout=success`,
      cancel_url: `${origin}/?checkout=cancelled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("CHECKOUT ERROR:", error?.message || error);
    return NextResponse.json(
      { error: error?.message || "Failed to start checkout." },
      { status: 500 }
    );
  }
}
