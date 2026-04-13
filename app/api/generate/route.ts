import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { brand, details, images } = await req.json();

    const contentParts: any[] = [];

    // Add images if provided
    if (images && images.length > 0) {
      for (const image of images) {
        const base64Data = image.data.replace(/^data:image\/\w+;base64,/, "");
        const mediaType = image.type || "image/jpeg";
        contentParts.push({
          type: "image",
          source: {
            type: "base64",
            media_type: mediaType,
            data: base64Data,
          },
        });
      }
    }

    // Add text prompt
    contentParts.push({
      type: "text",
      text: `You are an expert eBay seller and copywriter. Write a high-converting eBay listing for the following item.

${brand ? `Brand/Store: ${brand}` : ""}
${details ? `Item Details: ${details}` : ""}
${images && images.length > 0 ? "I have also provided images of the item — use them to identify key details like brand, condition, color, style, era, and any visible markings or tags." : ""}

Write a complete eBay listing including:
1. A compelling title (80 characters max, keyword-rich)
2. A detailed description that highlights key features, condition, and why someone should buy it
3. Suggested keywords/tags

Make it sound human, specific, and persuasive. Focus on what makes this item valuable to a buyer.`,
    });

    const message = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: contentParts,
        },
      ],
    });

    const content = message.content[0];
    if (content.type === "text") {
      return NextResponse.json({ content: content.text });
    }

    return NextResponse.json({ content: "No output generated." });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to generate listing." },
      { status: 500 }
    );
  }
}