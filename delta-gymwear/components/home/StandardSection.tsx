const conditions = [
  "Moves without restriction",
  "Holds structure under stress",
  "Performs after repeated use",
];

export function StandardSection() {
  return (
    <section className="border-t border-brand-black bg-brand-yellow py-16 md:py-24 lg:py-32">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-12 xl:px-20 2xl:px-28">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em]">The standard</p>
          <h2 className="mt-6 max-w-4xl text-5xl font-black uppercase leading-[0.9] tracking-[-0.05em] sm:text-7xl">Every product must pass three tests.</h2>
          <p className="mt-7 max-w-xl font-medium leading-relaxed">If a product cannot prove itself under real training conditions, it does not carry the Delta mark.</p>
        </div>
        <div className="mt-12 grid gap-3 sm:grid-cols-3 lg:mt-16">
          {conditions.map((condition, index) => (
            <div key={condition} className="flex aspect-square flex-col justify-between bg-brand-black p-6 text-white sm:p-7 lg:p-8">
              <span className="self-end text-5xl font-black tabular-nums text-white/20 sm:text-6xl">0{index + 1}</span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/60">Condition {["one", "two", "three"][index]}</p>
                <h3 className="mt-3 text-2xl font-extrabold uppercase leading-tight tracking-tight lg:text-3xl">{condition}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
