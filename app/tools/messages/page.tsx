import type { Metadata } from "next";
import { MessageStudio } from "@/components/tools/MessageStudio";

export const metadata: Metadata = {
  title: "Free wedding invitation messages",
  description:
    "Write WhatsApp-ready Indian wedding invitation messages in English, Hindi or Gujarati. Formal, Hinglish, shayari or traditional — no login required.",
};

export default function MessagesToolPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <p className="text-[11px] tracking-[0.28em] uppercase text-[#8a7a6a]">Free tool</p>
      <h1 className="font-serif mt-2 text-4xl">Invitation message writer</h1>
      <p className="mt-3 max-w-2xl text-[#6b5a4c]">
        Get wording you can paste into WhatsApp or a card. 8 free generations a day, no account needed.
        Sending messages from Vivaah itself comes in phase 2.
      </p>
      <MessageStudio />
    </div>
  );
}
