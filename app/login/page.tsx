export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/AuthForm";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next, error } = await searchParams;
  return (
    <AuthForm
      mode="login"
      nextPath={next?.startsWith("/") ? next : "/designs"}
      errorMessage={error ? "Could not complete sign-in. Please try again." : undefined}
    />
  );
}
