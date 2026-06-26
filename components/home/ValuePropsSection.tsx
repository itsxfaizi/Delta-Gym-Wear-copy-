import { LockKeyhole, RefreshCcw, Ruler, Truck } from "lucide-react";

const values = [
  { icon: Truck, title: "Free delivery", copy: "Nationwide over PKR 25,000" },
  { icon: RefreshCcw, title: "Easy exchanges", copy: "14 days on unworn items" },
  { icon: Ruler, title: "Fit guidance", copy: "Clear sizing on every product" },
  { icon: LockKeyhole, title: "Secure shopping", copy: "Your details stay protected" },
];

export function ValuePropsSection() {
  return (
    <section aria-label="Shopping benefits" className="border-b border-black/10 bg-white">
      <div className="mx-auto grid max-w-screen-2xl grid-cols-2 px-4 sm:px-6 lg:grid-cols-4 lg:px-12 xl:px-20 2xl:px-28">
        {values.map(({ icon: Icon, title, copy }) => (
          <div key={title} className="flex min-h-32 items-center gap-3 border-black/10 px-2 py-6 even:border-l lg:border-l lg:px-6 lg:first:border-l-0">
            <Icon className="size-5 shrink-0 text-brand-yellow" aria-hidden="true" />
            <div>
              <h2 className="text-xs font-black uppercase tracking-wider">{title}</h2>
              <p className="mt-1 text-xs leading-5 text-brand-muted">{copy}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
