import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative min-h-[900px] overflow-hidden bg-brand-black text-white lg:h-[900px]">
      <Image
        src="/images/delta-pdf-hero.webp"
        alt="Athlete resting in a gritty black and white training space"
        fill
        priority
        sizes="(max-width: 1920px) 100vw, 1920px"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/5 to-black/10" />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-brand-black to-transparent" />

      <div className="relative mx-auto flex min-h-[900px] max-w-[1920px] items-end px-7 pb-16 pt-36 sm:px-10 lg:px-16 xl:px-20 2xl:px-24">
        <div className="max-w-[760px]">
          <h1 className="text-[clamp(3rem,4.25vw,4.9rem)] font-black uppercase leading-[0.94] tracking-[-0.055em]">
            <span className="block">Built for</span>
            <span className="block pl-0">those who</span>
            <span className="block pl-3 sm:pl-4">
              <span className="italic text-brand-yellow">train</span>
              <span className="ml-2">with intent</span>
            </span>
          </h1>
          <p className="mt-6 max-w-[680px] border-t border-white/75 pt-3 text-base leading-7 text-white/90 sm:text-xl">
            Built for the ones who show up when no one&apos;s watching.
          </p>
          <Button asChild variant="yellow" size="lg" className="mt-7 h-16 px-10 text-base tracking-tight">
            <Link href="/shop">Explore the range</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
