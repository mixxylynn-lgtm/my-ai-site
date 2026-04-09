import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { brand, details } = await req.json();

    const message = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `You are an expert copywriter. Write high-converting marketing copy for the following brand.

Brand: ${brand}
Details: ${details}

Write compelling, engaging copy that grabs attention and drives action. Keep it concise and punchy.`,
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
      { error: "Failed to generate copy." },
      { status: 500 }
    );
  }
}