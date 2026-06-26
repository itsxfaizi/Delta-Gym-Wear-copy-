"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { Menu, Search } from "lucide-react";
import { Logo } from "./Logo";
import { CartDrawer } from "./CartDrawer";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const links = [
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/#contact", label: "Contact Us" },
];

const tickerSeparator = "//";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const useDarkHeader = isHome || scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-[60] transition duration-200",
        useDarkHeader ? "text-white" : "border-b border-black/10 bg-white text-brand-black",
        isHome && !scrolled ? "bg-transparent" : useDarkHeader ? "bg-brand-black shadow-[0_10px_34px_rgba(0,0,0,0.28)]" : "shadow-[0_8px_30px_rgba(0,0,0,0.08)]",
      )}
    >
      <div className={cn("overflow-hidden whitespace-nowrap px-4 py-2 text-center text-[10px] font-semibold uppercase tracking-[0.12em]", isHome ? "bg-brand-black/90 text-white" : "bg-brand-black text-white")}>
        <span>Function first. Always</span>
        <span className="mx-6 text-white/70">{tickerSeparator}</span>
        <span>Engineered for discipline</span>
        <span className="mx-6 text-white/70">{tickerSeparator}</span>
        <span>Fabric integrity. Always</span>
        <span className="mx-6 text-white/70">{tickerSeparator}</span>
        <span>Show up when no one&apos;s watching</span>
        <span className="mx-6 text-white/70">{tickerSeparator}</span>
        <span>Minimal. Precise</span>
        <span className="mx-6 text-white/70">{tickerSeparator}</span>
        <span>Change that is earned. Not assumed</span>
      </div>
      <div className="mx-auto flex h-14 max-w-[1920px] items-center justify-between px-7 sm:px-10 lg:h-16 lg:px-16 xl:px-20 2xl:px-24">
        <Logo inverted={useDarkHeader} />
        <NavigationMenu.Root className="hidden md:block">
          <NavigationMenu.List className="flex items-center gap-10">
            {links.map((link) => (
              <NavigationMenu.Item key={link.href}>
                <NavigationMenu.Link asChild>
                  <Link
                    href={link.href}
                    aria-current={pathname === link.href ? "page" : undefined}
                    className={cn(
                      "flex min-h-11 items-center border-b-2 border-transparent text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow",
                      useDarkHeader ? "text-white hover:text-brand-yellow" : "text-brand-black hover:text-brand-muted",
                      pathname === link.href && "border-brand-yellow text-brand-yellow",
                    )}
                  >
                    {link.label}
                  </Link>
                </NavigationMenu.Link>
              </NavigationMenu.Item>
            ))}
          </NavigationMenu.List>
        </NavigationMenu.Root>
        <div className="flex items-center gap-1">
          <Link href="/shop" aria-label="Search products" className={cn("grid size-11 place-items-center outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow", useDarkHeader && "text-white")}>
            <Search className="size-5" />
          </Link>
          <CartDrawer />
          <Sheet>
            <SheetTrigger asChild>
              <button aria-label="Open navigation" className={cn("grid size-11 place-items-center outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow md:hidden", useDarkHeader && "text-white")}>
                <Menu className="size-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" title="Navigation" description="Primary site navigation." className="bg-brand-black text-white">
              <Logo className="mt-2" inverted />
              <nav className="mt-20 flex flex-col">
                {links.map((link, index) => (
                  <SheetClose asChild key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={pathname === link.href ? "page" : undefined}
                      className={cn(
                        "border-b border-white/15 py-6 text-4xl font-black uppercase tracking-tight focus-visible:outline-none focus-visible:text-brand-yellow",
                        pathname === link.href && "border-brand-yellow text-brand-yellow underline decoration-2 underline-offset-8",
                      )}
                    >
                      <span className="mr-4 text-xs text-brand-yellow">0{index + 1}</span>{link.label}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
