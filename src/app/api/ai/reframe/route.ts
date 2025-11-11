import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();
    const apiKey = process.env.GOOGLE_GENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Falta GOOGLE_GENAI_API_KEY" }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Reescribe el siguiente texto con un reencuadre positivo y compasivo.
- Mantén el sentido y las emociones.
- Sé breve (4–6 frases).
Texto:
"""
${text || ""}
"""`;

    const result = await model.generateContent(prompt);
    const rewritten = result.response.text().trim();

    return NextResponse.json({ rewritten });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Error interno" }, { status: 500 });
  }
}
