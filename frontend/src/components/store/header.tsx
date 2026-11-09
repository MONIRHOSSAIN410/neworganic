"use client";

import Link from "next/link";
import { ShoppingBasket, Sun, Moon, Menu } from "lucide-react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useCart } from "./cart-provider";
import { useState } from "react";

export function Header() {
  const { count } = useCart();
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
      <div className="container-shell flex h-16 items-center justify-between gap-4">
        {/* উন্নত এবং প্রিমিয়াম লোগো ডিজাইন */}
        <Link
          href="/"
          className="group flex items-center gap-3 transition-transform duration-300 hover:scale-[1.02]"
        >
          <div className="relative h-11 w-11 overflow-hidden rounded-full border-2 border-emerald-500/30 shadow-md transition-all duration-300 group-hover:border-emerald-500 group-hover:shadow-emerald-500/20">
            <Image
              src="/image/savory.jpg"
              alt="Savory Nest Logo"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight text-emerald-800 dark:text-emerald-400">
              Savory <span className="text-primary font-extrabold">Nest</span>
            </span>
            
          </div>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium md:flex">
          <Link href="/#products" className="hover:text-primary transition-colors">
            Shop
          </Link>
          <Link href="/#categories" className="hover:text-primary transition-colors">
            Categories
          </Link>
          <Link href="/admin/login" className="hover:text-primary transition-colors">
            Admin
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <button
            aria-label="Toggle theme"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="icon-button"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <Link href="/cart" className="btn-primary !px-3">
            <ShoppingBasket size={17} /> <span>Basket</span>
            <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">
              {count}
            </span>
          </Link>
          <button
            className="icon-button md:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Open menu"
          >
            <Menu size={19} />
          </button>
        </div>
      </div>

      {open && (
        <div className="container-shell flex gap-5 pb-4 text-sm md:hidden border-t pt-3 bg-background">
          <Link href="/#products" onClick={() => setOpen(false)}>
            Shop
          </Link>
          <Link href="/#categories" onClick={() => setOpen(false)}>
            Categories
          </Link>
          <Link href="/admin/login" onClick={() => setOpen(false)}>
            Admin
          </Link>
        </div>
      )}
    </header>
  );
}