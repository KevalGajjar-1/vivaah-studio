import { generateText, Output } from "ai";
import { z } from "zod";
import { templates } from "@/lib/templates";
import { buildGeneratePrompt, generateFallbackWording, type WordingInput } from "@/lib/wording";
import type { CeremonyStyle, Language, Tone } from "@/lib/types";


const slugEnum = templates.map((t) => t.slug) as [string, ...string[]];

const outputSchema = z.object({
  heading: z.string(),
  wording: z.string(),
  hostLine: z.string(),
  suggestedTemplate: z.enum(slugEnum),
});

function asInput(body: Record<string, unknown>): WordingInput {
  const language = (body.language === "hi" || body.language === "gu" ? body.language : "en") as Language;
  return {
    partnerA: String(body.partnerA || ""),
    partnerB: String(body.partnerB || ""),
    date: String(body.date || ""),
    time: String(body.time || ""),
    venue: String(body.venue || ""),
    venueAddress: String(body.venueAddress || ""),
    familyA: String(body.familyA || ""),
    familyB: String(body.familyB || ""),
    hostLine: String(body.hostLine || ""),
    language,
    tone: (body.tone as Tone) || "warm",
    style: (body.style as CeremonyStyle) || "classic",
  };
}

function hasGatewayAuth() {
  return Boolean(process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN);
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const input = asInput(body);
  const fallback = generateFallbackWording(input);

  if (!hasGatewayAuth()) {
    return Response.json({ ...fallback, source: "fallback", reason: "no-credentials" });
  }

  const model = process.env.AI_GATEWAY_MODEL || "google/gemini-2.5-flash";

  try {
    const { output } = await generateText({
      model,
      output: Output.object({ schema: outputSchema }),
      prompt: buildGeneratePrompt(input),
    });

    if (!output?.wording) {
      return Response.json({ ...fallback, reason: "empty-output" });
    }

    return Response.json({
      heading: output.heading || fallback.heading,
      wording: output.wording,
      hostLine: output.hostLine || fallback.hostLine,
      suggestedTemplate: output.suggestedTemplate || fallback.suggestedTemplate,
      source: "ai",
      model,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Generation failed";
    return Response.json({ ...fallback, reason: message.slice(0, 180) });
  }
}
