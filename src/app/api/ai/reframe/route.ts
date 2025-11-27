import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Fuerza runtime Node.js
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    const apiKey = process.env.GOOGLE_GENAI_API_KEY;
    if (!apiKey) {
      console.error("GOOGLE_GENAI_API_KEY no está definida");
      return NextResponse.json(
        { error: "Falta GOOGLE_GENAI_API_KEY en el servidor" },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Reescribe el siguiente texto con un reencuadre positivo y compasivo.
- No ignores el dolor de la persona.
- Usa un tono cálido, humano y realista (no "todo es perfecto").
- 4 a 6 frases máximo.
- Mantén el contexto en español.

Texto:
"""${text || ""}"""`;

    const result = await model.generateContent(prompt);
    const rewritten = result.response.text().trim();

    return NextResponse.json({ rewritten });
  } catch (err: any) {
    console.error("reframe error:", err);
    return NextResponse.json(
      { error: err?.message || "Error interno en reframe" },
      { status: 500 }
    );
  }
}
