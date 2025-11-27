import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    const apiKey = process.env.GOOGLE_GENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Falta GOOGLE_GENAI_API_KEY" },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Genera 3 preguntas abiertas para journaling (diario personal) en español.
- Deben ser amables, orientadas al bienestar y a la reflexión.
- Relaciónalas con el texto del usuario si es posible.

Texto del usuario:
"""${text || ""}"""`;

    const result = await model.generateContent(prompt);
    const raw = result.response.text().trim();

    const prompts = raw
      .split("\n")
      .map((line) => line.replace(/^[-*0-9\.\s]+/, "").trim())
      .filter(Boolean)
      .slice(0, 3);

    return NextResponse.json({ prompts });
  } catch (err: any) {
    console.error("journal-prompts error", err);
    return NextResponse.json(
      { error: err?.message || "Error interno" },
      { status: 500 }
    );
  }
}
