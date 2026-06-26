import Link from "next/link";
import { Logo } from "./Logo";

const columns = [
  {
    title: "Shop",
    links: [
      { label: "Compression T-Shirts", href: "/shop?category=T-Shirts" },
      { label: "Performance Leggings", href: "/shop?category=Leggings" },
      { label: "Training Tank Tops", href: "/shop?category=Tank%20Tops" },
      { label: "Functional Trousers", href: "/shop?category=Trousers" },
      { label: "All Products", href: "/shop" },
    ],
  },
  {
    title: "Brand",
    links: [
      { label: "About Delta", href: "/about" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Contact Us", href: "/#contact" },
      { label: "Sizing Guide", href: "/shop" },
      { label: "Returns", href: "/shop" },
      { label: "FAQ", href: "/shop" },
    ],
  },
];

export function Footer() {
  return (
    <footer id="contact" className="border-t border-white/20 bg-[#101112] px-7 py-20 text-white sm:px-10 lg:px-16 xl:px-20 2xl:px-24">
      <div className="mx-auto grid max-w-[1920px] gap-16 lg:grid-cols-[1fr_1.25fr] lg:items-start">
        <div>
          <Logo inverted className="h-12 w-40" />
          <p className="mt-12 max-w-[700px] text-2xl font-medium leading-9 tracking-[-0.04em]">
            Performance gymwear engineered for discipline.<br />
            Built in Islamabad for those who train with intent.
          </p>
          <div className="mt-12 space-y-2 text-xl font-medium leading-7 tracking-[-0.03em]">
            <a href="tel:+923285386793" className="block hover:text-brand-yellow">+92 328 538 679 3</a>
            <a href="mailto:info@deltagymwear.com" className="block hover:text-brand-yellow">info@deltagymwear.com</a>
            <a href="https://www.deltagymwear.com" className="block hover:text-brand-yellow">www.deltagymwear.com</a>
          </div>
        </div>
        <nav aria-label="Footer navigation" className="grid gap-10 sm:grid-cols-3">
          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="text-lg font-black tracking-[-0.04em]">{column.title}</h3>
              <ul className="mt-8 space-y-6">
                {column.links.map((link) => (
                  <li key={`${column.title}-${link.label}`}>
                    <Link href={link.href} className="text-lg font-medium tracking-[-0.04em] text-white/85 transition-colors duration-150 hover:text-brand-yellow">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
    </footer>
  );
}
