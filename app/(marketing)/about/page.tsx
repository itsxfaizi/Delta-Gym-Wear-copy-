import type { Metadata } from "next";
import Image from "next/image";
import { PhilosophySection } from "@/components/home/PhilosophySection";

export const metadata: Metadata = {
  title: "About Delta",
  description: "Delta exists to make disciplined, precise performance apparel without distraction.",
  openGraph: { title: "About Delta Gym Wear", description: "Change that is earned. Not assumed." },
};

export default function AboutPage() {
  return (
    <>
      <section className="relative flex min-h-[82svh] items-end overflow-hidden bg-brand-black pb-16 pt-32 text-white lg:pb-24">
        <Image src="/images/delta-hero.png" alt="Delta athlete training in a dark studio" fill preload sizes="100vw" className="object-cover opacity-45" />
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-12 xl:px-20 2xl:px-28">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-yellow">The Delta manifesto</p>
          <h1 className="mt-6 max-w-6xl text-[clamp(3.5rem,8vw,9rem)] font-black uppercase leading-[0.8] tracking-[-0.07em]">Change is earned.<br />Never assumed.</h1>
        </div>
      </section>
      <section className="bg-white py-16 md:py-24 lg:py-32">
        <div className="mx-auto grid max-w-screen-2xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-24 lg:px-12 xl:px-20 2xl:px-28">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-muted">Why Delta exists</p>
          <div><h2 className="text-4xl font-black uppercase leading-tight tracking-tight sm:text-6xl">We build for consistency, not attention.</h2><p className="mt-7 max-w-2xl text-lg font-medium leading-relaxed text-brand-muted">Delta began with a simple frustration: performance wear had become louder while becoming less useful. We chose another direction. Better fabric. Cleaner construction. Fewer distractions. Products made for repetition, pressure, and the quiet discipline of showing up again.</p></div>
        </div>
      </section>
      <PhilosophySection />
    </>
  );
}
