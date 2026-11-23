import type { Metadata } from "next";
import { HashtagStudio } from "@/components/tools/HashtagStudio";

export const metadata: Metadata = {
  title: "Wedding hashtag generator",
  description: "Generate simple Indian wedding hashtags from your names, ready to use on photos from every function.",
};

export default function HashtagToolPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <p className="text-[11px] tracking-[0.28em] uppercase text-[#8a7a6a]">Free tool</p>
      <h1 className="font-serif mt-2 text-4xl">Wedding hashtag generator</h1>
      <p className="mt-3 text-[#6b5a4c]">
        A few clean tags from your names, so every function’s photos land in one place.
      </p>
      <HashtagStudio />
    </div>
  );
}
