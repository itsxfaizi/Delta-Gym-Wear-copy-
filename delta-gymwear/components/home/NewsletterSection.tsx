"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterSection() {
  const [message, setMessage] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("Email signup is not connected yet. No subscription was created.");
  }

  return (
    <section className="bg-white py-16 text-center md:py-24 lg:py-32">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-12">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-muted">Stay in the loop</p>
        <h2 className="mt-5 text-6xl font-black uppercase leading-[0.85] tracking-[-0.06em] sm:text-8xl">No fluff.<br />Just drops.</h2>
        <p className="mx-auto mt-7 max-w-xl font-medium leading-relaxed text-brand-muted">New product launches, training content, and brand updates.</p>
        <form onSubmit={submit} className="mx-auto mt-9 flex max-w-xl flex-col gap-3 sm:flex-row">
          <label htmlFor="newsletter-email" className="sr-only">Email address</label>
          <Input id="newsletter-email" name="email" required type="email" autoComplete="email" placeholder="EMAIL ADDRESS" className="h-14 flex-1 font-bold" />
          <Button type="submit" variant="yellow" size="lg">Subscribe</Button>
        </form>
        <p className="mt-3 min-h-5 text-sm font-medium text-brand-muted" role="status" aria-live="polite">{message}</p>
      </div>
    </section>
  );
}
