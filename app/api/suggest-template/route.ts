import { generateText, Output } from "ai";
import { z } from "zod";
import { suggestTemplateFromStyle, templates } from "@/lib/templates";
import type { CeremonyStyle } from "@/lib/types";


const slugEnum = templates.map((t) => t.slug) as [string, ...string[]];

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const style = (body.style as CeremonyStyle) || "classic";
  const fallback = {
    suggestedTemplate: suggestTemplateFromStyle(style),
    reason: "",
    source: "fallback" as const,
  };

  const hasAuth = Boolean(process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN);
  if (!hasAuth) return Response.json(fallback);

  const model = process.env.AI_GATEWAY_MODEL || "google/gemini-2.5-flash";
  try {
    const { output } = await generateText({
      model,
      output: Output.object({
        schema: z.object({
          suggestedTemplate: z.enum(slugEnum),
          reason: z.string(),
        }),
      }),
      prompt: [
        "Suggest the best wedding invitation template.",
        `Style: ${style}. Tone: ${body.tone || "warm"}. Language: ${body.language || "en"}.`,
        `Venue: ${body.venue || "unspecified"}.`,
        `Names: ${body.partnerA || ""} and ${body.partnerB || ""}.`,
        `Options: ${templates.map((t) => `${t.slug} (${t.tagline})`).join("; ")}.`,
        "Pick exactly one slug and give a one-sentence reason.",
      ].join("\n"),
    });
    if (!output?.suggestedTemplate) return Response.json(fallback);
    return Response.json({ ...output, source: "ai", model });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    return Response.json({ ...fallback, reason: message.slice(0, 180) });
  }
}
