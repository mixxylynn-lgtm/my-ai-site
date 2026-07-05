export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";

// One-time price for CopyAI Pro Bot access, in cents.
const PRICE_CENTS = 499;

export async function POST(req: NextRequest) {
  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      return NextResponse.json(
        { error: "Server misconfiguration: missing STRIPE_SECRET_KEY." },
        { status: 500 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: "Server misconfiguration: missing Supabase credentials." },
        { status: 500 }
      );
    }

    const { email } = await req.json().catch(() => ({ email: undefined }));

    // Mint a one-time access code and record it as unpaid. The webhook flips it
    // to paid once Stripe confirms the payment; the bot burns it on activation.
    const code = randomUUID().replace(/-/g, "");

    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { error: insertError } = await supabase
      .from("bot_access_codes")
      .insert({ code, email: email ?? null, paid: false, claimed: false });
    if (insertError) {
      console.error("CHECKOUT: failed to store access code:", insertError.message);
      // TEMPORARY DIAGNOSTIC: surface the real DB error to pin down the cause.
      return NextResponse.json(
        {
          error: "Could not start checkout.",
          debug: {
            code: (insertError as any).code,
            message: insertError.message,
            details: (insertError as any).details,
            hint: (insertError as any).hint,
            serviceKeyLen: (process.env.SUPABASE_SERVICE_ROLE_KEY || "").length,
            serviceKeyPrefix: (process.env.SUPABASE_SERVICE_ROLE_KEY || "").slice(0, 6),
          },
        },
        { status: 500 }
      );
    }

    const origin = req.headers.get("origin") || new URL(req.url).origin;

    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(stripeSecretKey);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: PRICE_CENTS,
            product_data: {
              name: "CopyAI Pro Bot Access",
              description:
                "One-time access to the CopyAI Pro Telegram bot — send a photo, get a full marketplace listing.",
            },
          },
        },
      ],
      // Carry the code through Stripe so the webhook can mark it paid.
      metadata: { access_code: code },
      client_reference_id: code,
      ...(email ? { customer_email: email } : {}),
      success_url: `${origin}/success?code=${code}`,
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
