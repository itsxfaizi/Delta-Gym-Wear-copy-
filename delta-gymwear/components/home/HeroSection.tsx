import Image from "next/image";
import Link from "next/link";
import { ArrowDownRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MarqueeBanner } from "@/components/layout/MarqueeBanner";

export function HeroSection() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-brand-black text-white">
      <div className="absolute inset-x-0 top-0"><MarqueeBanner /></div>
      <Image src="/images/delta-hero.png" alt="Athlete training with battle ropes in Delta performance wear" fill preload sizes="100vw" className="object-cover object-[64%_center]" />
      <div className="absolute inset-0 bg-black/50" />
      <div className="absolute inset-y-0 left-0 w-3/4 bg-black/35 lg:w-1/2" />
      <div className="relative mx-auto flex min-h-[100svh] max-w-screen-2xl items-end px-4 pb-14 pt-40 sm:px-6 sm:pb-20 lg:items-center lg:px-12 lg:pb-0 xl:px-20 2xl:px-28">
        <div className="max-w-5xl">
          <p className="mb-6 max-w-md text-xs font-semibold uppercase leading-5 tracking-[0.25em] text-white/60 sm:text-sm">Built for the ones who show up when no one&apos;s watching.</p>
          <h1 className="text-[clamp(3.2rem,8vw,8.8rem)] font-black uppercase leading-[0.77] tracking-[-0.07em]">
            Built for<br />those who<br /><span className="italic text-brand-yellow">train</span> with intent
          </h1>
          <Button asChild variant="yellow" size="lg" className="mt-9">
            <Link href="/shop">Explore the range <ArrowDownRight className="size-5" /></Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
