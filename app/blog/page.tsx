import type { Metadata } from "next";
import Link from "next/link";
import { blogPosts } from "@/lib/blog/posts";

export const metadata: Metadata = {
  title: "Journal",
  description: "Guides for Indian wedding invitations, function schedules, and wedding websites.",
};

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <p className="text-[11px] tracking-[0.28em] uppercase text-[#8a7a6a]">Journal</p>
      <h1 className="font-serif mt-2 text-4xl">Notes for the planning weeks</h1>
      <p className="mt-3 text-[#6b5a4c]">Short guides on wording, schedules and the wedding page your guests will actually open.</p>
      <ul className="mt-12 space-y-8">
        {blogPosts.map((post) => (
          <li key={post.slug} className="border-t border-[#e8dccb] pt-8">
            <p className="text-xs text-[#8a7a6a]">{post.date}</p>
            <h2 className="font-serif mt-2 text-3xl">
              <Link href={`/blog/${post.slug}`} className="hover:text-[#6b1d2a]">
                {post.title}
              </Link>
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#6b5a4c]">{post.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
