import Image from "next/image";

export function PhilosophySection() {
  return (
    <section className="grid bg-brand-black lg:min-h-[760px] lg:grid-cols-2">
      <div className="flex flex-col justify-between bg-brand-yellow px-4 py-16 text-brand-black sm:px-6 md:py-24 lg:px-12 lg:py-32 xl:px-20">
        <p className="text-xs font-semibold uppercase tracking-[0.25em]">Product philosophy</p>
        <div className="py-14 lg:py-20">
          <h2 className="text-[clamp(3.8rem,7vw,8rem)] font-black uppercase leading-[0.78] tracking-[-0.07em]">Function first.<br />Always.<br />Excess removed.</h2>
          <p className="mt-9 max-w-xl text-base font-bold leading-relaxed sm:text-lg">Every seam, panel, and fabric choice must earn its place. We strip away distraction so the product can do one thing exceptionally well: support the work.</p>
        </div>
        <p className="text-xs font-semibold uppercase tracking-[0.25em]">Delta standard 001</p>
      </div>
      <div className="relative min-h-[520px] lg:min-h-0">
        <Image src="/images/delta-philosophy.png" alt="Athlete preparing for a barbell lift" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
        <div className="absolute inset-0 bg-black/15" />
      </div>
    </section>
  );
}
