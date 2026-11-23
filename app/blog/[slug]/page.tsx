import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { blogPosts, getPost } from "@/lib/blog/posts";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Journal" };
  return { title: post.title, description: post.description };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  return (
    <article className="mx-auto max-w-3xl px-5 py-16">
      <p className="text-[11px] tracking-[0.28em] uppercase text-[#8a7a6a]">Journal</p>
      <h1 className="font-serif mt-2 text-4xl leading-tight">{post.title}</h1>
      <p className="mt-3 text-sm text-[#8a7a6a]">{post.date}</p>
      <div className="mt-10 space-y-5 text-[17px] leading-relaxed text-[#2a211c]">
        {post.paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 40)}>{paragraph}</p>
        ))}
      </div>
      <p className="mt-12 text-sm">
        <Link href="/blog" className="text-[#6b1d2a] hover:underline">
          All journal notes
        </Link>
      </p>
    </article>
  );
}
