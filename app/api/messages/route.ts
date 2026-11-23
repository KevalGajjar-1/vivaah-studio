import { createHash } from "crypto";
import { generateMessages, type MessageInput } from "@/lib/planning/messages";
import type { MessageStyle } from "@/lib/planning/types";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import type { Language } from "@/lib/types";

const DAILY_LIMIT = 8;

function bucketFrom(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  return createHash("sha256").update(`vivaah-messages:${ip}`).digest("hex").slice(0, 32);
}

function asInput(body: Record<string, unknown>): MessageInput {
  const language: Language = body.language === "hi" || body.language === "gu" ? body.language : "en";
  const style = (["formal", "hinglish", "shayari", "traditional"] as MessageStyle[]).includes(
    body.style as MessageStyle,
  )
    ? (body.style as MessageStyle)
    : "formal";
  return {
    partnerA: String(body.partnerA || "").slice(0, 80),
    partnerB: String(body.partnerB || "").slice(0, 80),
    date: String(body.date || ""),
    time: String(body.time || ""),
    venue: String(body.venue || "").slice(0, 160),
    venueAddress: String(body.venueAddress || "").slice(0, 200),
    eventTitle: String(body.eventTitle || "").slice(0, 80),
    familyA: String(body.familyA || "").slice(0, 80),
    familyB: String(body.familyB || "").slice(0, 80),
    language,
    style,
  };
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const input = asInput(body);
  if (!input.partnerA.trim() && !input.partnerB.trim()) {
    return Response.json({ error: "Please add at least one name." }, { status: 400 });
  }

  let remaining = DAILY_LIMIT;
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("consume_tool_quota", {
      p_bucket: bucketFrom(request),
      p_tool: "messages",
      p_limit: DAILY_LIMIT,
    });
    if (error) {
      return Response.json(
        { error: "The writer is briefly unavailable. Please try again in a moment." },
        { status: 503 },
      );
    }
    const quota = (data || {}) as { allowed?: boolean; remaining?: number };
    if (!quota.allowed) {
      return Response.json(
        {
          error: `Daily limit reached. You can generate ${DAILY_LIMIT} message sets per day without an account.`,
          remaining: 0,
          limit: DAILY_LIMIT,
        },
        { status: 429 },
      );
    }
    remaining = typeof quota.remaining === "number" ? quota.remaining : 0;
  }

  return Response.json({
    messages: generateMessages(input),
    source: "fallback",
    remaining,
    limit: DAILY_LIMIT,
  });
}
