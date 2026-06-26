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
    <section className="bg-white px-6 py-28 text-center text-brand-black sm:py-40 lg:py-60">
      <div className="mx-auto max-w-5xl">
        <p className="text-2xl font-medium tracking-[-0.04em]">Stay In The Loop</p>
        <h2 className="mt-8 text-[clamp(3rem,4.2vw,5.2rem)] font-black uppercase leading-[1.05] tracking-[-0.055em]">No fluff.<br />Just drops.</h2>
        <p className="mx-auto mt-9 max-w-5xl text-xl font-medium leading-8 tracking-[-0.035em] sm:text-3xl">New product launches, training content, and brand updates. That&apos;s it. We don&apos;t do noise.</p>
        <form onSubmit={submit} className="mx-auto mt-10 flex max-w-[820px] flex-col sm:flex-row">
          <label htmlFor="newsletter-email" className="sr-only">Email address</label>
          <Input id="newsletter-email" name="email" required type="email" autoComplete="email" placeholder="info@deltagymwear.com" className="h-16 flex-1 border-0 bg-[#101112] text-center text-xl text-white placeholder:text-white sm:text-2xl" />
          <Button type="submit" variant="yellow" size="lg" className="h-16 min-w-72 text-xl normal-case tracking-[-0.04em] sm:text-2xl">Subscribe</Button>
        </form>
        <p className="mt-3 min-h-5 text-sm font-medium text-brand-muted" role="status" aria-live="polite">{message}</p>
      </div>
    </section>
  );
}
