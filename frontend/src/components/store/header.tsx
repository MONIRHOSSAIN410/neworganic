"use client";
import Link from "next/link";
import { Leaf, ShoppingBasket, Sun, Moon, Menu } from "lucide-react";
import { useTheme } from "next-themes";
import { useCart } from "./cart-provider";
import { useState } from "react";
export function Header() {
  const { count } = useCart(); const { theme, setTheme } = useTheme(); const [open, setOpen] = useState(false);
  return <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
    <div className="container-shell flex h-16 items-center justify-between gap-4">
      <Link href="/" className="flex items-center gap-2 text-xl font-black tracking-tight text-emerald-800 dark:text-emerald-400"><span className="rounded-xl bg-emerald-100 p-2 text-emerald-800"><Leaf size={19}/></span>greenbasket</Link>
      <nav className="hidden items-center gap-7 text-sm font-medium md:flex"><Link href="/#products" className="hover:text-primary">Shop</Link><Link href="/#categories" className="hover:text-primary">Categories</Link><Link href="/admin/login" className="hover:text-primary">Admin</Link></nav>
      <div className="flex items-center gap-2">
        <button aria-label="Toggle theme" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="icon-button">{theme === "dark" ? <Sun size={18}/> : <Moon size={18}/>}</button>
        <Link href="/cart" className="btn-primary !px-3"><ShoppingBasket size={17}/> <span>Basket</span><span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">{count}</span></Link>
        <button className="icon-button md:hidden" onClick={() => setOpen(!open)} aria-label="Open menu"><Menu size={19}/></button>
      </div>
    </div>
    {open && <div className="container-shell flex gap-5 pb-4 text-sm md:hidden"><Link href="/#products" onClick={() => setOpen(false)}>Shop</Link><Link href="/#categories" onClick={() => setOpen(false)}>Categories</Link><Link href="/admin/login">Admin</Link></div>}
  </header>;
}
