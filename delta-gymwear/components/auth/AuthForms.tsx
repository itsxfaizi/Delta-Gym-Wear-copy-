"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const callbackUrl = searchParams.get("callbackUrl") ?? "/account/orders";

  async function submit(formData: FormData) {
    setIsSubmitting(true);
    const result = await signIn("credentials", {
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
      redirect: false,
    });
    setIsSubmitting(false);

    if (result?.error) {
      toast.error("Invalid email or password.");
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <form action={submit} className="space-y-4">
      <Input name="email" type="email" placeholder="Email" required />
      <Input name="password" type="password" placeholder="Password" required minLength={8} maxLength={72} />
      <Button variant="yellow" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Signing in" : "Sign in"}
      </Button>
      <Button
        type="button"
        variant="outline"
        className="w-full border-black text-black"
        onClick={() => void signIn("google", { callbackUrl })}
      >
        Continue with Google
      </Button>
      <p className="text-center text-sm font-bold text-brand-muted">
        New to Delta? <Link href="/account/register" className="text-black underline decoration-brand-yellow decoration-2 underline-offset-4">Create account</Link>
      </p>
    </form>
  );
}

export function RegisterForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(formData: FormData) {
    setIsSubmitting(true);
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: String(formData.get("name") ?? ""),
        email: String(formData.get("email") ?? ""),
        phone: String(formData.get("phone") ?? ""),
        password: String(formData.get("password") ?? ""),
      }),
    });
    setIsSubmitting(false);

    if (!response.ok) {
      const payload = (await response.json()) as { error?: { message?: string } };
      toast.error(payload.error?.message ?? "Registration failed.");
      return;
    }

    toast.success("Account created. Sign in to continue.");
    router.push("/account/login");
  }

  return (
    <form action={submit} className="space-y-4">
      <Input name="name" placeholder="Name" required />
      <Input name="email" type="email" placeholder="Email" required />
      <Input name="phone" placeholder="Phone" />
      <Input name="password" type="password" placeholder="Password" required minLength={8} maxLength={72} />
      <Button variant="yellow" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Creating account" : "Create account"}
      </Button>
      <p className="text-center text-sm font-bold text-brand-muted">
        Already registered? <Link href="/account/login" className="text-black underline decoration-brand-yellow decoration-2 underline-offset-4">Sign in</Link>
      </p>
    </form>
  );
}
