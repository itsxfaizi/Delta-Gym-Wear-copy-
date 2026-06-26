const conditions = [
  ["Condition one", "Moves without restriction"],
  ["Condition two", "Holds structure under stress"],
  ["Condition three", "Performs after repeated"],
];

export function StandardSection() {
  return (
    <section className="bg-brand-yellow py-20 text-brand-black lg:py-44">
      <div className="mx-auto grid max-w-[1920px] gap-14 px-8 sm:px-16 lg:grid-cols-[0.95fr_1fr] lg:items-center lg:px-20">
        <div>
          <h2 className="max-w-[760px] text-[clamp(3.8rem,6vw,6.6rem)] font-black uppercase leading-[0.94] tracking-[-0.065em]">
            Every product<br />
            must pass<br />
            <span className="italic text-black/45">three tests.</span>
          </h2>
          <p className="mt-8 max-w-[800px] text-2xl font-medium leading-9 tracking-[-0.03em]">
            If it fails any of these conditions, it does not ship. No exceptions. No compromises.
          </p>
        </div>
        <div className="grid gap-9">
          {conditions.map(([eyebrow, condition], index) => (
            <article key={condition} className="grid min-h-36 grid-cols-[1fr_auto] items-center gap-8 bg-black px-8 py-8 text-white sm:px-12">
              <div>
                <p className="text-[clamp(1.7rem,2.2vw,2.8rem)] font-light uppercase leading-none tracking-[-0.05em]">{eyebrow}</p>
                <h3 className="mt-3 text-[clamp(1.5rem,2vw,2.45rem)] font-black uppercase leading-none tracking-[-0.055em]">{condition}</h3>
              </div>
              <span className="text-[clamp(2rem,2.4vw,3.1rem)] font-light tabular-nums">{String(index + 1).padStart(2, "0")}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
