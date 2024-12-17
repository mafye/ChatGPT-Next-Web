import { NextRequest, NextResponse } from "next/server";
import { getServerSideConfig } from "../../config/server";

async function makeRequest(req: NextRequest) {
  try {
    const config = getServerSideConfig();
    const body = await req.json();
    
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${config.apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (e) {
    console.error("[Gemini] ", e);
    return NextResponse.json(
      {
        error: true,
        msg: JSON.stringify(e),
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(req: NextRequest) {
  return makeRequest(req);
}

export async function GET(req: NextRequest) {
  return makeRequest(req);
}