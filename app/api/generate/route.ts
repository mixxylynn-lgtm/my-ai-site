import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Server misconfiguration: missing API key." },
        { status: 500 }
      );
    }

    const client = new Anthropic({ apiKey });
    const body = await req.json();
    const { brand, details, images } = body;

    const contentParts: any[] = [];

    if (images && images.length > 0) {
      for (const image of images) {
        const base64Data = image.data.replace(/^data:image\/\w+;base64,/, "");
        const mediaType = image.type || "image/jpeg";
        contentParts.push({
          type: "image",
          source: { type: "base64", media_type: mediaType, data: base64Data },
        });
      }
    }

    contentParts.push({
      type: "text",
      text: `You are an expert marketplace seller and copywriter. Generate THREE things based on the item info below.

Item: ${brand || "unknown item"}
Details: ${details || "no additional details"}
${images && images.length > 0 ? "Also use the provided images to identify key details." : ""}

Respond in this EXACT format:

===LISTING===
Title: [80 char max, keyword-rich title]

Description:
[3-4 paragraphs, persuasive and detailed]

Keywords: [comma separated search keywords]

===PRICE===
Suggested price: [a single recommended price or tight range, e.g. $45–55]

[2-3 short sentences: how condition affects value, what comparable items sell for, and one tip to get the highest price.]

===XPOST===
[Punchy X/Twitter post, max 280 chars, hashtags, sounds like a real person selling something cool, no URL placeholder]`,
    });

    const message = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 1500,
      messages: [{ role: "user", content: contentParts }],
    });

    const content = message.content[0];
    if (content.type === "text") {
      const text = content.text;
      const listingMatch = text.match(/===LISTING===([\s\S]*?)===PRICE===/);
      const priceMatch = text.match(/===PRICE===([\s\S]*?)===XPOST===/);
      const xpostMatch = text.match(/===XPOST===([\s\S]*?)$/);
      const listing = listingMatch ? listingMatch[1].trim() : text;
      const price = priceMatch ? priceMatch[1].trim() : "";
      const xpost = xpostMatch ? xpostMatch[1].trim() : "";
      return NextResponse.json({ content: listing, price, xpost });
    }

    return NextResponse.json({ content: "No output generated.", price: "", xpost: "" });
  } catch (error: any) {
    console.error("GENERATE ERROR:", error?.message || error);
    return NextResponse.json(
      { error: error?.message || "Failed to generate listing." },
      { status: 500 }
    );
  }
}