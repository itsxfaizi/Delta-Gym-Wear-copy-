import Image from "next/image";

const fallbackPhilosophyImage = "https://picsum.photos/seed/delta-philosophy/800/1000";

export function PhilosophySection({ imageUrl = fallbackPhilosophyImage }: { imageUrl?: string }) {
  return (
    <section className="bg-brand-black" aria-labelledby="product-philosophy-title">
      <div className="flex w-full flex-col lg:grid lg:min-h-[600px] lg:grid-cols-2">
        <div className="flex flex-col justify-center bg-brand-yellow p-10 text-brand-black lg:p-16 xl:p-24">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-black/50">Product philosophy</p>
          <h2 id="product-philosophy-title" className="mt-8 text-4xl font-black uppercase leading-[0.9] text-black lg:text-6xl">
            <span className="block">Function first.</span>
            <span className="block italic">Always.</span>
            <span className="block">Excess removed.</span>
          </h2>
          <p className="mt-6 max-w-sm font-medium leading-relaxed text-black/70">
            Every Delta product must move without restriction, hold structure under stress, and maintain performance after repeated use. If it fails any of these — it does not ship.
          </p>
        </div>

        <div className="relative min-h-[400px] bg-brand-black lg:min-h-[600px]">
          <Image
            src={imageUrl}
            alt="Delta athlete training"
            fill
            loading="lazy"
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover object-center grayscale"
          />
          <div className="absolute inset-0 bg-black/35" aria-hidden="true" />
        </div>
      </div>
      <h2 className="py-16 text-center text-2xl font-medium uppercase tracking-[-0.03em] text-white sm:text-4xl">The standard</h2>
    </section>
  );
}
