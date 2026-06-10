export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

async function sendTelegram(token: string, chatId: number | string, text: string) {
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text }),
  });
}

export async function POST(req: Request) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const allowedChatId = process.env.TELEGRAM_CHAT_ID;
  const apiKey = process.env.ANTHROPIC_API_KEY;

  // Always return 200 so Telegram doesn't retry (and duplicate) on our errors.
  if (!botToken || !apiKey) {
    console.error("agent/reply: missing TELEGRAM_BOT_TOKEN or ANTHROPIC_API_KEY");
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
  const text = (message?.text ?? message?.caption ?? "").trim();

  if (!chatId || !text) return NextResponse.json({ ok: true });

  // Only respond to your own chat — stops strangers who find the bot from using your key.
  if (allowedChatId && String(chatId) !== String(allowedChatId)) {
    return NextResponse.json({ ok: true });
  }

  // Friendly help text for /start and other commands.
  if (text.startsWith("/")) {
    await sendTelegram(botToken, chatId, "Forward or paste a tweet and I'll write a reply that promotes CopyAI Pro. 📝");
    return NextResponse.json({ ok: true });
  }

  try {
    const client = new Anthropic({ apiKey });
    const completion = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 400,
      system:
        "You write short, friendly, human-sounding replies to tweets (X posts) for CopyAI Pro — a tool that writes optimized marketplace listings (eBay, Etsy, Depop, Poshmark, Facebook Marketplace) and suggests prices. " +
        "Given a tweet, write ONE reply (max ~250 characters) that sounds like a real reseller, responds genuinely to what they said, and naturally suggests copyaipro.xyz as a fix for their listing/pricing pain. " +
        "No hashtags. No surrounding quotes. Not salesy or spammy. If the tweet isn't about selling/listings, keep it warm and only mention the site if it fits. Output only the reply text.",
      messages: [{ role: "user", content: `Tweet:\n${text}` }],
    });

    const part = completion.content[0];
    const reply = part && part.type === "text" ? part.text.trim() : "Couldn't generate a reply — try again.";
    await sendTelegram(botToken, chatId, reply);
  } catch (err: any) {
    console.error("agent/reply error:", err?.message || err);
    await sendTelegram(botToken, chatId, "⚠️ Error generating reply. Try again in a moment.");
  }

  return NextResponse.json({ ok: true });
}
