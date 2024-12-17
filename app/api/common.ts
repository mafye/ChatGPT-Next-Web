import { NextRequest } from "next/server";

const GEMINI_URL = "generativelanguage.googleapis.com";
const DEFAULT_PROTOCOL = "https";
const PROTOCOL = process.env.PROTOCOL ?? DEFAULT_PROTOCOL;
const BASE_URL = process.env.BASE_URL ?? GEMINI_URL;
const API_VERSION = "v1beta";

export async function requestGemini(req: NextRequest) {
  const apiKey = req.headers.get("token");
  const modelPath = "models/gemini-pro:generateContent";

  return fetch(`${PROTOCOL}://${BASE_URL}/${API_VERSION}/${modelPath}?key=${apiKey}`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: req.method,
    body: req.body,
  });
}