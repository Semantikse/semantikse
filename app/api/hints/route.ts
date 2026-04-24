import { NextResponse } from "next/server";
import { HintsScraper } from "@/app/utils/hintsScraper";

export async function GET() {
  try {
    const hints = await HintsScraper.getDailyHints();
    return NextResponse.json({ hints });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
