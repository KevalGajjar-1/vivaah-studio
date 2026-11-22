"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function AuthForm({
  mode,
  nextPath = "/designs",
  errorMessage,
}: {
  mode: "login" | "signup";
  nextPath?: string;
  errorMessage?: string;
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(errorMessage || "");
  const [busy, setBusy] = useState<string | null>(null);

  async function withPassword(e: React.FormEvent) {
    e.preventDefault();
    setBusy("password");
    setMessage("");
    try {
      const supabase = createClient();
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}` },
        });
        if (error) throw error;
        setMessage("Check your email to confirm the account, or sign in if confirmation is already enabled.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push(nextPath);
        router.refresh();
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Could not sign in.");
    } finally {
      setBusy(null);
    }
  }

  async function magicLink() {
    setBusy("magic");
    setMessage("");
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}` },
      });
      if (error) throw error;
      setMessage("A sign-in link is on its way to your inbox.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Could not send a magic link.");
    } finally {
      setBusy(null);
    }
  }

  async function google() {
    setBusy("google");
    setMessage("");
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}` },
      });
      if (error) throw error;
    } catch (err) {
      setMessage(
        err instanceof Error
          ? err.message
          : "Google sign-in is not configured yet. Use email and password for now.",
      );
      setBusy(null);
    }
  }

  return (
    <div className="mx-auto max-w-md px-5 py-16">
      <p className="text-[11px] tracking-[0.28em] uppercase text-[#8a7a6a]">Your studio</p>
      <h1 className="font-serif mt-2 text-4xl">{mode === "login" ? "Sign in" : "Create an account"}</h1>
      <p className="mt-3 text-sm text-[#6b5a4c]">
        {mode === "login"
          ? "Sign in to save designs, unlock clean downloads, and return to your invitations."
          : "Save your invitations, pick them up later, and request a clean download when you are ready."}
      </p>
      <form onSubmit={withPassword} className="mt-8 space-y-4">
        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="btn-gold w-full" disabled={!!busy}>
          {busy === "password" ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
        </button>
      </form>
      <div className="mt-4 flex flex-col gap-2">
        <button type="button" className="btn-outline w-full" onClick={magicLink} disabled={!email || !!busy}>
          {busy === "magic" ? "Sending…" : "Email me a magic link"}
        </button>
        <button type="button" className="btn-outline w-full" onClick={google} disabled={!!busy}>
          {busy === "google" ? "Redirecting…" : "Continue with Google"}
        </button>
      </div>
      {message ? <p className="mt-4 text-sm text-[#6b1d2a]">{message}</p> : null}
      <p className="mt-8 text-sm text-[#6b5a4c]">
        {mode === "login" ? (
          <>
            New here?{" "}
            <Link href={`/signup?next=${encodeURIComponent(nextPath)}`} className="text-[#6b1d2a] underline">
              Create an account
            </Link>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Link href={`/login?next=${encodeURIComponent(nextPath)}`} className="text-[#6b1d2a] underline">
              Sign in
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
