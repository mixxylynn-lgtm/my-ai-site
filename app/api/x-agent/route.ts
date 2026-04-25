import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'tinyllama',
        prompt: prompt,
        stream: false,
      }),
    });

    const data = await response.json();
    
    let text = data.response || 'Something went wrong.';
    
    // Clean up: remove quotes and extra whitespace
    text = text.replace(/^["']|["']$/g, '').trim();

    return NextResponse.json({ text });
  } catch (error: any) {
    return NextResponse.json({ text: `Error: ${error.message}. Make sure Ollama is running.` });
  }
}