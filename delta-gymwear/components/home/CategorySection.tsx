import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const categories = [
  { name: "Strength layers", category: "Hoodies", image: "/images/delta-product.png", position: "object-center" },
  { name: "Training tops", category: "T-Shirts", image: "/images/delta-philosophy.png", position: "object-center" },
  { name: "Technical bottoms", category: "Trousers", image: "/images/delta-hero.png", position: "object-[70%_center]" },
];

export function CategorySection() {
  return (
    <section className="bg-brand-black py-16 text-white md:py-24 lg:py-28">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-12 xl:px-20 2xl:px-28">
        <div className="mb-10 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-yellow">Shop by training need</p>
          <h2 className="mt-4 text-4xl font-black uppercase tracking-tight sm:text-6xl">Find your uniform.</h2>
        </div>
        <div className="grid gap-3 lg:grid-cols-3">
          {categories.map((category) => (
            <Link key={category.name} href={`/shop?category=${encodeURIComponent(category.category)}`} className="group relative min-h-[480px] overflow-hidden bg-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow">
              <Image src={category.image} alt="" fill loading="lazy" sizes="(max-width: 1024px) 100vw, 33vw" className={`object-cover transition duration-500 group-hover:scale-[1.025] motion-reduce:transition-none ${category.position}`} />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-yellow">{category.category}</p>
                  <h3 className="mt-2 text-3xl font-black uppercase">{category.name}</h3>
                </div>
                <span className="grid size-12 place-items-center bg-brand-yellow text-black"><ArrowUpRight className="size-5" /></span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
