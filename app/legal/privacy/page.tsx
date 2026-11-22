import type { Metadata } from "next";
export const metadata: Metadata = { title: "Privacy" };
export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-2xl px-5 py-16 text-[15px] leading-relaxed text-[#4a3d34]">
      <h1 className="font-serif text-4xl text-[#1a1410]">Privacy</h1>
      <p className="mt-6">
        We store the account you create, the invitations you save, and any photo you upload to a design.
        This is used to show you your studio, generate guest links, and (later) process a download purchase.
      </p>
      <p className="mt-4">
        Auth and database hosting is provided by Supabase. The website is hosted on Vercel. We do not sell
        your guest lists or invitation wording. You can ask us to delete your account and saved designs.
      </p>
      <p className="mt-4">
        If you share a guest link after a design is unlocked, anyone with that link can view the invitation.
      </p>
    </article>
  );
}
