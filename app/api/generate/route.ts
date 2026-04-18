import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { brand, details, images } = await req.json();

    const contentParts: any[] = [];

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

    contentParts.push({
      type: "text",
      text: `You are an expert eBay seller and copywriter. Given the item details and/or photos, generate TWO things:

${brand ? `Item Name: ${brand}` : ""}
${details ? `Item Details: ${details}` : ""}
${images && images.length > 0 ? "Use the provided images to identify key details like brand, condition, color, style, era, and any visible markings." : ""}

Generate your response in this EXACT format with these EXACT separators:

===LISTING===
[Full eBay listing including:
- Title (80 chars max, keyword-rich)
- Description (detailed, human, persuasive)
- Suggested keywords]

===XPOST===
[A short punchy X/Twitter post promoting this item for sale. Max 280 chars. Include relevant hashtags. Make it sound like a real person selling something cool, not a robot. Do NOT include a URL placeholder.]`,
    });

    const message = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 1500,
      messages: [{ role: "user", content: contentParts }],
    });

    const content = message.content[0];
    if (content.type === "text") {
      const text = content.text;
      const listingMatch = text.match(/===LISTING===([\s\S]*?)===XPOST===/);
      const xpostMatch = text.match(/===XPOST===([\s\S]*?)$/);

      const listing = listingMatch ? listingMatch[1].trim() : text;
      const xpost = xpostMatch ? xpostMatch[1].trim() : "";

      return NextResponse.json({ content: listing, xpost });
    }

    return NextResponse.json({ content: "No output generated.", xpost: "" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to generate listing." },
      { status: 500 }
    );
  }
}