"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { Menu } from "lucide-react";
import { Logo } from "./Logo";
import { CartDrawer } from "./CartDrawer";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const links = [
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/#contact", label: "Contact Us" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const hasSolidBackground = !isHome || scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={cn("fixed inset-x-0 top-0 z-[60] transition-colors duration-150", hasSolidBackground ? "bg-brand-black/95 backdrop-blur-sm" : "bg-transparent")}>
      <div className="mx-auto flex h-20 max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-12 xl:px-20 2xl:px-28">
        <Logo />
        <NavigationMenu.Root className="hidden md:block">
          <NavigationMenu.List className="flex items-center gap-10">
            {links.map((link) => (
              <NavigationMenu.Item key={link.href}>
                <NavigationMenu.Link asChild>
                  <Link
                    href={link.href}
                    aria-current={pathname === link.href ? "page" : undefined}
                    className={cn(
                      "flex min-h-11 items-center border-b-2 border-transparent text-sm font-bold text-white transition-colors duration-150 hover:text-brand-yellow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow",
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
          <CartDrawer />
          <Sheet>
            <SheetTrigger asChild>
              <button aria-label="Open navigation" className="grid size-11 place-items-center text-white outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow md:hidden">
                <Menu className="size-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" title="Navigation" description="Primary site navigation." className="bg-brand-black text-white">
              <Logo className="mt-2" />
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
