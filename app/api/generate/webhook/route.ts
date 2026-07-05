export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!supabaseUrl || !supabaseServiceKey || !stripeSecretKey || !webhookSecret) {
    return NextResponse.json({ error: "Missing env vars" }, { status: 500 });
  }

  let event;
  try {
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(stripeSecretKey);
    event = stripe.webhooks.constructEvent(body, sig!, webhookSecret);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;

    // Only treat it as paid if Stripe actually collected the money.
    const isPaid = session.payment_status === "paid" || session.status === "complete";
    const code = session.metadata?.access_code ?? session.client_reference_id;
    const email = session.customer_details?.email ?? session.customer_email ?? null;

    if (isPaid && code) {
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(supabaseUrl, supabaseServiceKey);

      // Flip the pending code to paid. The bot activates the buyer's Telegram
      // account when they open the t.me/<bot>?start=<code> deep link.
      const { error } = await supabase
        .from("bot_access_codes")
        .update({ paid: true, paid_at: new Date().toISOString(), ...(email ? { email } : {}) })
        .eq("code", code);

      if (error) {
        console.error("WEBHOOK: failed to mark code paid:", error.message);
        // 500 so Stripe retries rather than dropping a paid customer.
        return NextResponse.json({ error: "Could not record payment" }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true });
}
