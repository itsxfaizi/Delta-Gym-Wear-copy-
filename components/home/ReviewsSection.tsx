const proofPoints = [
  { title: "Movement", copy: "Patterning is assessed through squats, presses, pulls, and loaded carries before a product earns the Delta mark." },
  { title: "Structure", copy: "Fabric recovery, seam stability, and shape retention are prioritized over decorative details that add no function." },
  { title: "Repeat use", copy: "The standard is not the first wear. It is how the garment performs after training, washing, and returning to work." },
];

export function ReviewsSection() {
  return (
    <section className="bg-zinc-100 py-16 md:py-24 lg:py-28">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-12 xl:px-20 2xl:px-28">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-muted">Product proof</p>
            <h2 className="mt-4 text-4xl font-black uppercase tracking-tight sm:text-6xl">Built around the work.</h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-brand-muted">Real customer ratings should appear here once a verified review platform is connected. Until then, Delta makes only claims the product process can support.</p>
        </div>
        <div className="mt-10 grid gap-px bg-black/10 lg:grid-cols-3">
          {proofPoints.map((point, index) => (
            <article key={point.title} className="bg-white p-7 lg:p-9">
              <span className="text-5xl font-black text-brand-yellow">0{index + 1}</span>
              <h3 className="mt-12 text-xl font-black uppercase tracking-tight">{point.title}</h3>
              <p className="mt-4 leading-7 text-brand-muted">{point.copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
