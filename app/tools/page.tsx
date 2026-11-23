import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Free wedding tools",
  description:
    "Free tools for Indian weddings: invitation messages in English, Hindi and Gujarati, wedding hashtags, and a guest list CSV template.",
};

const tools = [
  {
    href: "/tools/messages",
    title: "Invitation message writer",
    body: "Formal, Hinglish, shayari or traditional wording, ready to copy. No account needed.",
  },
  {
    href: "/tools/hashtags",
    title: "Wedding hashtag generator",
    body: "A few clean hashtags from your names, for every function’s photos.",
  },
  {
    href: "/tools/guest-list",
    title: "Guest list CSV template",
    body: "A starter sheet for both families, ready to import into Vivaah.",
  },
  {
    href: "/create",
    title: "Invitation designer",
    body: "Turn names, events and a vibe into a designed still or video invitation.",
  },
];

export default function ToolsPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-16">
      <p className="text-[11px] tracking-[0.28em] uppercase text-[#8a7a6a]">Free tools</p>
      <h1 className="font-serif mt-2 text-4xl">Start planning in a few minutes</h1>
      <p className="mt-3 max-w-2xl text-[#6b5a4c]">
        Small tools for the first week of planning. Nothing to install, and the message writer works without an account.
      </p>
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {tools.map((tool) => (
          <Link key={tool.href} href={tool.href} className="rounded-2xl border border-[#e8dccb] bg-white p-6 transition hover:border-[#b8952a]">
            <h2 className="font-serif text-2xl">{tool.title}</h2>
            <p className="mt-2 text-sm text-[#6b5a4c]">{tool.body}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
