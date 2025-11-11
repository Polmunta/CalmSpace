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

    const prompt = `Genera 3 propuestas de preguntas de journaling, abiertas y amables, basadas en este texto reciente del usuario. Devuelve solo una lista con guiones.
Texto del usuario:
"""
${text || ""}
"""`;

    const result = await model.generateContent(prompt);
    const output = result.response.text().trim();

    // convierte lista en array
    const prompts = output
      .split("\n")
      .map(s => s.replace(/^[-*\d\.\s]+/, "").trim())
      .filter(Boolean)
      .slice(0, 3);

    return NextResponse.json({ prompts });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Error" }, { status: 500 });
  }
}
