import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/AuthForms";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your Delta Gym Wear account.",
};

export default function LoginPage() {
  return (
    <main className="bg-zinc-50 pb-24 pt-36">
      <div className="mx-auto max-w-md px-4">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-brand-muted">Account</p>
        <h1 className="mt-4 text-5xl font-black uppercase leading-[0.9]">Sign in.</h1>
        <div className="mt-8 border-2 border-black bg-white p-5">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
