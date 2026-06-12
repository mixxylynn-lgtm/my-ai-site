export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const OWNER_CHAT_ID = process.env.TELEGRAM_OWNER_CHAT_ID ?? "8019616275";

async function sendTelegram(token: string, chatId: number | string, text: string) {
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text }),
  });
}

// Download a Telegram photo and return it as base64 for /api/generate.
async function fetchPhotoBase64(token: string, fileId: string): Promise<string | null> {
  const metaRes = await fetch(`https://api.telegram.org/bot${token}/getFile?file_id=${fileId}`);
  const meta = await metaRes.json();
  const filePath = meta?.result?.file_path;
  if (!filePath) return null;
  const fileRes = await fetch(`https://api.telegram.org/file/bot${token}/${filePath}`);
  const buf = await fileRes.arrayBuffer();
  return Buffer.from(buf).toString("base64");
}

export async function POST(req: Request) {
  const token = process.env.TELEGRAM_LISTING_BOT_TOKEN;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  // Prefer service role (bypasses RLS) for this server-only allowlist table;
  // fall back to anon key if that's all that's configured.
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Always return 200 so Telegram doesn't retry/duplicate on our errors.
  if (!token || !supabaseUrl || !supabaseKey) {
    console.error("bot/listing: missing TELEGRAM_LISTING_BOT_TOKEN or Supabase credentials");
    return NextResponse.json({ ok: true });
  }

  let update: any;
  try {
    update = await req.json();
  } catch {
    return NextResponse.json({ ok: true });
  }

  const message = update.message ?? update.edited_message;
  const chatId = message?.chat?.id;
  if (!chatId) return NextResponse.json({ ok: true });

  const telegramId = String(message.from?.id ?? chatId);
  const username = message.from?.username ?? message.from?.first_name ?? null;
  const text = (message.text ?? message.caption ?? "").trim();
  const photos = message.photo as Array<{ file_id: string }> | undefined;

  const db = createClient(supabaseUrl, supabaseKey);

  // /start (and other slash commands) get a friendly intro, no gating.
  if (text.startsWith("/")) {
    await sendTelegram(
      token,
      chatId,
      "👋 Send me a photo of your item or a short description, and I'll write you a full marketplace listing + suggested price.\n\nAccess is for CopyAI Pro subscribers — subscribe at copyaipro.xyz",
    );
    return NextResponse.json({ ok: true });
  }

  // Ignore empty messages (e.g. stickers) with nothing to work from.
  if (!text && !(photos && photos.length)) return NextResponse.json({ ok: true });

  // Look the sender up in the allowlist.
  const { data: existing } = await db
    .from("bot_users")
    .select("telegram_id, active")
    .eq("telegram_id", telegramId)
    .maybeSingle();

  // Brand-new user: record them (inactive) and notify the owner ONCE.
  if (!existing) {
    await db.from("bot_users").insert({ telegram_id: telegramId, username, active: false });
    await sendTelegram(
      token,
      OWNER_CHAT_ID,
      `🆕 New user tried CopyAI Pro Bot:\n${username ? "@" + username : "(no username)"} — id ${telegramId}`,
    );
    await sendTelegram(token, chatId, "Subscribe at copyaipro.xyz to access CopyAI Pro Bot");
    return NextResponse.json({ ok: true });
  }

  // Known but not subscribed.
  if (!existing.active) {
    await sendTelegram(token, chatId, "Subscribe at copyaipro.xyz to access CopyAI Pro Bot");
    return NextResponse.json({ ok: true });
  }

  // Allowed user → generate the listing.
  await sendTelegram(token, chatId, "✍️ Working on your listing…");

  try {
    let images: Array<{ data: string; type: string }> | undefined;
    if (photos && photos.length) {
      const base64 = await fetchPhotoBase64(token, photos[photos.length - 1].file_id);
      if (base64) images = [{ data: base64, type: "image/jpeg" }];
    }

    const origin = new URL(req.url).origin;
    const genRes = await fetch(`${origin}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        brand: text,
        details: "Platform: eBay. Write a full optimized listing and suggest the best price to sell it for.",
        images,
      }),
    });
    const gen = await genRes.json();

    if (gen.error) {
      await sendTelegram(token, chatId, "⚠️ Couldn't generate that one. Try again in a moment.");
      return NextResponse.json({ ok: true });
    }

    const parts = [
      gen.content && `📝 LISTING\n\n${gen.content}`,
      gen.price && `💰 PRICE\n\n${gen.price}`,
      gen.xpost && `𝕏 POST\n\n${gen.xpost}`,
    ].filter(Boolean);

    await sendTelegram(token, chatId, parts.join("\n\n———\n\n") || "No output generated.");
  } catch (err: any) {
    console.error("bot/listing error:", err?.message || err);
    await sendTelegram(token, chatId, "⚠️ Error generating your listing. Try again in a moment.");
  }

  return NextResponse.json({ ok: true });
}
