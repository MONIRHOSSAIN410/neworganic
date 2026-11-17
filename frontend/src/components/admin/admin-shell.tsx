"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingCart,
  LogOut,
  Store,
  Sliders,
  Menu,
  X,
  Settings,
} from "lucide-react";
import Image from "next/image";

const nav = [
  ["/admin", "Overview", LayoutDashboard],
  ["/admin/products", "Products", Package],
  ["/admin/categories", "Categories", Tags],
  ["/admin/orders", "Orders", ShoppingCart],
  ["/admin/banners", "Banners", Sliders],
  ["/admin/settings", "Shop Settings", Settings],
] as const;

export function AdminShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function logout() {
    localStorage.removeItem("gb-token");
    router.push("/admin/login");
  }

  if (path === "/admin/login") return <>{children}</>;

  return (
    <div className="min-h-screen bg-muted/40 md:grid md:grid-cols-[240px_1fr]">
      {/* Mobile Top Navigation Bar */}
      <div className="flex md:hidden items-center justify-between border-b bg-card px-4 py-3 sticky top-0 z-40">
        <Link href="/admin" className="flex items-center gap-2.5">
          <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border-2 border-emerald-500/30 shadow-md">
            <Image
              src="/image/savory.jpg"
              alt="Savory Nest Logo"
              fill
              unoptimized
              className="object-cover"
              priority
            />
          </div>
          <div>
            <span className="text-base font-black tracking-tight text-emerald-800 dark:text-emerald-400">
              Savory <span className="text-emerald-600 font-extrabold">Nest</span>
            </span>
            <span className="block text-[9px] uppercase tracking-wider font-semibold text-muted-foreground">
              Admin Portal
            </span>
          </div>
        </Link>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="icon-button"
          aria-label="Toggle admin menu"
        >
          {mobileMenuOpen ? <X size={18} className="shrink-0" /> : <Menu size={18} className="shrink-0" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b bg-card px-4 py-3 space-y-1.5 shadow-md">
          {nav.map(([href, label, Icon]) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                path === href
                  ? "bg-emerald-700 text-white shadow-sm"
                  : "hover:bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon size={17} className="shrink-0" />
              {label}
            </Link>
          ))}
          <div className="pt-2 border-t mt-2 flex items-center justify-between">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-xs font-semibold hover:bg-muted rounded-lg transition text-foreground"
            >
              <Store size={15} className="shrink-0" /> View store
            </Link>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                logout();
              }}
              className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition"
            >
              <LogOut size={15} className="shrink-0" /> Sign out
            </button>
          </div>
        </div>
      )}

      {/* Desktop Aside Sidebar */}
      <aside className="hidden md:block border-b bg-card p-4 md:min-h-screen md:border-b-0 md:border-r">
        <Link href="/admin" className="flex items-center gap-3 mb-6 px-1">
          <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border-2 border-emerald-500/30 shadow-md">
            <Image
              src="/image/savory.jpg"
              alt="Savory Nest Logo"
              fill
              unoptimized
              className="object-cover"
              priority
            />
          </div>
          <div>
            <span className="text-base font-black tracking-tight text-emerald-800 dark:text-emerald-400">
              Savory <span className="text-emerald-600 font-extrabold">Nest</span>
            </span>
            <span className="block text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
              Admin Portal
            </span>
          </div>
        </Link>

        <nav className="flex flex-col gap-1.5">
          {nav.map(([href, label, Icon]) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                path === href
                  ? "bg-emerald-700 text-white shadow-sm"
                  : "hover:bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon size={17} className="shrink-0" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="mt-8 border-t pt-4">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium hover:bg-muted rounded-xl transition text-muted-foreground hover:text-foreground"
          >
            <Store size={17} className="shrink-0" /> View store
          </Link>
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition"
          >
            <LogOut size={17} className="shrink-0" /> Sign out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="p-3.5 sm:p-7 overflow-x-hidden">{children}</main>
    </div>
  );
}
