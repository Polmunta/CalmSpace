import { NextResponse } from "next/server";

export async function GET() {
  const hasKey = !!process.env.GOOGLE_GENAI_API_KEY;
  return NextResponse.json({
    ok: hasKey,
    keyStartsWith: hasKey ? process.env.GOOGLE_GENAI_API_KEY?.slice(0, 8) + "..." : null,
  });
}
