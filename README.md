# Vivaah — Indian Wedding Planning Studio

A Next.js app for Indian weddings: a ready-made invitation library (still cards and video), an AI invitation designer, an animated wedding website with RSVP, a guest list manager, and free wording tools in English, Hindi and Gujarati.

Accounts, designs, wedding pages, guests and RSVPs are stored in Supabase with row-level security. Clean invitation downloads stay watermarked until a design is unlocked (payments are still a placeholder; an admin can grant access). WhatsApp sending is reserved for a later phase.

## Routes

- `/` — studio home
- `/templates` and `/templates/<slug>` — invitation library
- `/create` — invitation designer wizard
- `/editor` and `/designs/<id>` — wording editor, preview and download
- `/dashboard` — couple dashboard
- `/dashboard/wedding` — wedding website editor
- `/dashboard/guests` — guest list, CSV import/export, per-event RSVPs
- `/w/<slug>` — public wedding website
- `/i/<slug>` — public unlocked invitation link
- `/tools/messages` — free message writer (rate-limited, no login)
- `/tools/hashtags` and `/tools/guest-list` — small planning tools
- `/blog` — planning guides

## AI wording

The invitation writer uses the Vercel AI SDK through [AI Gateway](https://vercel.com/docs/ai-gateway) (`google/gemini-2.5-flash` by default) when `AI_GATEWAY_API_KEY` or `VERCEL_OIDC_TOKEN` is present. Otherwise a built-in English, Hindi and Gujarati fallback is used. The free message tool always uses the built-in generator.

## Develop

```bash
npm install
npm run dev
```

## Stack

Next.js (App Router), Tailwind CSS, Supabase, Vercel AI SDK, GSAP, `html-to-image`, jsPDF.
