import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, isAdminRole } from "@/lib/auth";

const navItems = [
  ["Dashboard", "/admin"],
  ["Products", "/admin/products"],
  ["Orders", "/admin/orders"],
  ["Customers", "/admin/customers"],
  ["Media", "/admin/media"],
  ["Coupons", "/admin/coupons"],
  ["Reviews", "/admin/reviews"],
  ["Settings", "/admin/settings"],
] as const;

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.id || !isAdminRole(session.user.role)) redirect("/account/login");

  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-950">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-zinc-200 bg-white p-5 lg:block">
        <Link href="/admin" className="text-lg font-black uppercase tracking-wider">
          Delta Admin
        </Link>
        <nav className="mt-8 grid gap-1">
          {navItems.map(([label, href]) => (
            <Link key={href} href={href} className="px-3 py-2 text-sm font-bold hover:bg-zinc-100">
              {label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <Link href="/admin" className="font-black uppercase tracking-wider lg:hidden">
              Delta Admin
            </Link>
            <p className="ml-auto text-sm font-bold text-zinc-600">{session.user.email}</p>
          </div>
        </header>
        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
