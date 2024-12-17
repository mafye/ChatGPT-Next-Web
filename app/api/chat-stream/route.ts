import { NextRequest } from "next/server";
import { getServerSideConfig } from "../../config/server";

async function createStream(req: NextRequest) {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const config = getServerSideConfig();
  
  const apiKey = config.apiKey;
  const body = await req.json();

  // 转换消息格式为Gemini格式
  const messages = body.messages.map((m: any) => ({
    role: m.role === "user" ? "user" : "model",
    parts: [{ text: m.content }]
  }));

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:streamGenerateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: messages,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(JSON.stringify(error));
  }

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const reader = response.body?.getReader();
        if (!reader) throw new Error("No reader available");

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');
          
          for (const line of lines) {
            if (line.trim()) {
              const json = JSON.parse(line);
              if (json.candidates?.[0]?.content?.parts?.[0]?.text) {
                const text = json.candidates[0].content.parts[0].text;
                controller.enqueue(encoder.encode(text));
              }
            }
          }
        }
        controller.close();
      } catch (e) {
        controller.error(e);
      }
    },
  });

  return stream;
}

export async function POST(req: NextRequest) {
  try {
    const stream = await createStream(req);
    return new Response(stream);
  } catch (error) {
    console.error("[Chat Stream]", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
}

export const config = {
  runtime: "edge",
}; 