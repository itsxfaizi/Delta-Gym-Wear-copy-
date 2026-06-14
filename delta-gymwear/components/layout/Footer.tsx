import Link from "next/link";
import { Logo } from "./Logo";

const columns = [
  {
    title: "Shop",
    links: [
      { label: "Hoodies", href: "/shop?category=Hoodies" },
      { label: "T-Shirts", href: "/shop?category=T-Shirts" },
      { label: "Trousers", href: "/shop?category=Trousers" },
      { label: "Leggings", href: "/shop?category=Leggings" },
      { label: "All Products", href: "/shop" },
    ],
  },
  {
    title: "Brand",
    links: [
      { label: "About Delta", href: "/about" },
      { label: "Contact Us", href: "mailto:contact@deltagymwear.com" },
    ],
  },
];

export function Footer() {
  return (
    <footer id="contact" className="bg-brand-black px-4 pb-8 pt-16 text-white sm:px-6 md:pt-24 lg:px-12 xl:px-20 2xl:px-28">
      <div className="mx-auto grid max-w-screen-2xl gap-12 md:grid-cols-2 lg:grid-cols-3">
        <div>
          <Logo />
          <p className="mt-7 max-w-xs text-sm leading-6 text-zinc-400">Performance apparel for those who train with intent. Function first. Always.</p>
          <a href="mailto:contact@deltagymwear.com" className="mt-4 inline-flex min-h-11 items-center text-sm font-bold transition-colors duration-150 hover:text-brand-yellow">contact@deltagymwear.com</a>
          <p className="mt-2 text-sm text-zinc-500">Lahore, Pakistan</p>
        </div>
        {columns.map((column) => (
          <div key={column.title}>
            <h3 className="text-xs font-black uppercase tracking-[0.25em] text-brand-yellow">{column.title}</h3>
            <ul className="mt-4">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="inline-flex min-h-11 items-center text-sm text-zinc-300 transition-colors duration-150 hover:text-brand-yellow">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mx-auto mt-16 flex max-w-screen-2xl flex-col gap-3 border-t border-white/15 pt-7 text-xs text-zinc-500 sm:flex-row sm:justify-between">
        <span>&copy; 2026 Delta Gym Wear. All rights reserved.</span>
        <span>Built for the work no one sees.</span>
      </div>
    </footer>
  );
}
