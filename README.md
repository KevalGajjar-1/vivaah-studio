# Vivaah — Wedding Invitation Studio

A polished Next.js app for designing wedding invitations. Choose from nine original, ready-made templates, let AI (or a studio fallback) write the wording in English, Hindi, or Gujarati, preview live, download a PNG or PDF, and share a guest link with WhatsApp RSVP. Invitation details are encoded in the URL — no database required.

## Templates

| Slug | Name | Style |
| --- | --- | --- |
| `classic-floral` | Classic Floral | Botanical ivory and blush |
| `royal-mandala` | Royal Mandala | Hindu maroon, gold, and lotus |
| `minimalist-modern` | Minimalist Modern | Editorial typography |
| `boho-watercolor` | Boho Watercolour | Terracotta, sage, and sun |
| `art-deco` | Art Deco Gold | Black, geometry, and gilded glamour |
| `rustic` | Rustic Kraft | Oak leaves on warm paper |
| `church-elegant` | Church Elegant | Ivory, navy, and a sacred arch |
| `nikah-elegant` | Nikah Emerald | Emerald, gold, and arabesque |
| `south-indian-temple` | Temple Kalyanam | Gopuram, kolam, and turmeric gold |

## Routes

- `/` — studio home
- `/templates` — gallery
- `/templates/<slug>` — sample invitation
- `/create` — AI wording harness and template picker
- `/editor?d=...` — live editor
- `/invite?d=...` — guest page (shareable)

## AI wording

The writer uses the Vercel AI SDK through [AI Gateway](https://vercel.com/docs/ai-gateway) (`google/gemini-2.5-flash` by default).

On Vercel, OIDC is used automatically when `VERCEL_OIDC_TOKEN` is present. For local development, set `AI_GATEWAY_API_KEY`. Optionally set `AI_GATEWAY_MODEL` to any Gateway model id.

If no credentials are available, or the model call fails, a high-quality template-based wording generator is used instead. The UI reports which source is live.

## Develop

```bash
npm install
npm run dev
```

## Stack

Next.js (App Router), Tailwind CSS, Vercel AI SDK, GSAP, `html-to-image`, jsPDF.
