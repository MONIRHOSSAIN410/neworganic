"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBasket, Sun, Moon, Menu, Search, PhoneCall, X, MapPin, ShoppingBag, Tags, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useCart } from "./cart-provider";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import type { SiteSettings } from "@/lib/types";

export function Header() {
  const { count } = useCart();
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [logo, setLogo] = useState("/image/savory.jpg");
  const [hotline, setHotline] = useState("01758749698");
  const [address, setAddress] = useState("Khilkhet, Dhaka 1229");
  const router = useRouter();

  useEffect(() => {
    api<SiteSettings>("/settings")
      .then((res) => {
        if (res.shopLogo) setLogo(res.shopLogo);
        if (res.hotline) setHotline(res.hotline);
        if (res.address) setAddress(res.address);
      })
      .catch(() => {});
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/?search=${encodeURIComponent(searchQuery.trim())}#products`);
    setShowSearch(false);
  }

  return (
    <>
      {/* Top Hotline & Address Bar */}
      <div className="bg-emerald-800 text-white text-[11px] sm:text-xs py-1.5 px-3 border-b border-emerald-700/50">
        <div className="container-shell flex flex-col sm:flex-row items-center justify-between gap-1 text-center sm:text-left">
          <div className="flex items-center gap-1.5 font-medium">
            <MapPin size={13} className="text-lime-300 shrink-0" />
            <span className="truncate">ঠিকানা: {address}</span>
          </div>
          <div className="flex items-center gap-3 sm:gap-4 text-emerald-100">
            <a
              href={`tel:${hotline.replace(/[^0-9+]/g, "")}`}
              className="inline-flex items-center gap-1.5 font-bold hover:text-white transition-colors"
            >
              <PhoneCall size={12} className="text-lime-300 shrink-0" />
              <span>হটলাইন: {hotline}</span>
            </a>
            <span className="hidden sm:inline text-emerald-300/60">|</span>
            <span className="hidden sm:inline text-[11px]">সারাদেশে দ্রুত হোম ডেলিভারি</span>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
        <div className="container-shell flex h-14 sm:h-16 items-center justify-between gap-3 sm:gap-4">
          {/* Savory Nest Brand Logo & Text */}
          <Link
            href="/"
            className="group flex items-center gap-2 sm:gap-2.5 transition-transform duration-300 hover:scale-[1.02] shrink-0"
          >
            <div className="relative h-9 w-9 sm:h-11 sm:w-11 shrink-0 overflow-hidden rounded-full border-2 border-emerald-500/30 shadow-md transition-all duration-300 group-hover:border-emerald-500 group-hover:shadow-emerald-500/20">
              <Image
                src={logo}
                alt="Savory Nest Logo"
                fill
                unoptimized
                referrerPolicy="no-referrer"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-xl font-black tracking-tight text-emerald-800 dark:text-emerald-400 leading-tight">
                Savory <span className="text-emerald-600 dark:text-emerald-300 font-extrabold">Nest</span>
              </span>
              <span className="text-[8px] sm:text-[9px] uppercase tracking-wider font-semibold text-muted-foreground hidden xs:block">
                Fresh & Organic
              </span>
            </div>
          </Link>

          {/* Desktop Search Bar (Shown on md and up) */}
          <form
            onSubmit={handleSearch}
            className="relative hidden md:flex items-center flex-1 max-w-xs lg:max-w-md mx-2"
          >
            <Search
              size={15}
              className="absolute left-3 text-muted-foreground pointer-events-none shrink-0"
            />
            <input
              type="text"
              placeholder="পণ্য সার্চ করুন / Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border bg-muted/60 py-2 !pl-10 !pr-9 text-xs outline-none transition focus:border-emerald-600 focus:bg-background focus:ring-1 focus:ring-emerald-600"
              style={{ paddingLeft: "38px", paddingRight: "34px" }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
                className="absolute right-2.5 text-muted-foreground hover:text-foreground p-0.5"
              >
                <X size={13} className="shrink-0" />
              </button>
            )}
          </form>

          {/* Desktop Navigation Links (Shown on md and up) */}
          <nav className="hidden md:flex items-center gap-5 lg:gap-7 text-sm font-semibold">
            <Link href="/#products" className="hover:text-primary transition-colors">
              Shop
            </Link>
            <Link href="/categories" className="hover:text-primary transition-colors">
              Categories
            </Link>
            <Link href="/admin/login" className="hover:text-primary transition-colors">
              Admin
            </Link>
          </nav>

          {/* Action Buttons: Mobile Search, Theme Toggle, Basket, Mobile Hamburger */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Mobile Search Button (Hidden on md and up) */}
            <button
              aria-label="Toggle search"
              onClick={() => {
                setShowSearch(!showSearch);
                if (open) setOpen(false);
              }}
              className="icon-button md:hidden"
            >
              {showSearch ? <X size={18} className="shrink-0" /> : <Search size={18} className="shrink-0" />}
            </button>

            {/* Theme Toggle */}
            <button
              aria-label="Toggle theme"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="icon-button"
            >
              {theme === "dark" ? <Sun size={18} className="shrink-0" /> : <Moon size={18} className="shrink-0" />}
            </button>

            {/* Shopping Basket */}
            <Link href="/cart" className="btn-primary !px-2.5 sm:!px-3 !py-2 text-xs sm:text-sm">
              <ShoppingBasket size={17} className="shrink-0" />
              <span className="hidden sm:inline">Basket</span>
              <span className="rounded-full bg-white/25 px-1.5 sm:px-2 py-0.5 text-[11px] font-bold">
                {count}
              </span>
            </Link>

            {/* Mobile Hamburger Menu (STRICTLY HIDDEN on md and up) */}
            <button
              className="icon-button md:hidden"
              onClick={() => {
                setOpen(!open);
                if (showSearch) setShowSearch(false);
              }}
              aria-label="Open menu"
            >
              {open ? <X size={19} className="shrink-0" /> : <Menu size={19} className="shrink-0" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar Drawer */}
        {showSearch && (
          <div className="container-shell pb-3 md:hidden border-t pt-2.5">
            <form onSubmit={handleSearch} className="relative flex items-center">
              <Search
                size={16}
                className="absolute left-3 text-muted-foreground pointer-events-none shrink-0"
              />
              <input
                type="text"
                autoFocus
                placeholder="পণ্য সার্চ করুন / Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border bg-muted/60 py-2 !pl-10 !pr-10 text-xs outline-none transition focus:border-emerald-600 focus:bg-background"
                style={{ paddingLeft: "38px", paddingRight: "36px" }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 text-muted-foreground hover:text-foreground p-0.5"
                >
                  <X size={15} className="shrink-0" />
                </button>
              )}
            </form>
          </div>
        )}

        {/* Mobile Nav Links */}
        {open && (
          <div className="container-shell flex flex-col gap-1 pb-4 md:hidden border-t pt-3 bg-background">
            <Link
              href="/#products"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-muted font-medium transition text-sm text-foreground"
            >
              <ShoppingBag size={16} className="shrink-0 text-emerald-700" />
              <span>Shop Products</span>
            </Link>
            <Link
              href="/categories"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-muted font-medium transition text-sm text-foreground"
            >
              <Tags size={16} className="shrink-0 text-emerald-700" />
              <span>Categories</span>
            </Link>
            <Link
              href="/admin/login"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-muted font-medium transition text-sm text-foreground"
            >
              <ShieldCheck size={16} className="shrink-0 text-emerald-700" />
              <span>Admin Panel</span>
            </Link>
            <div className="pt-2 border-t mt-1 text-xs text-muted-foreground flex items-center justify-between px-3">
              <span>হটলাইন: {hotline}</span>
              <a href={`tel:${hotline.replace(/[^0-9+]/g, "")}`} className="text-emerald-700 font-bold inline-flex items-center gap-1">
                <PhoneCall size={12} className="shrink-0" /> কল করুন
              </a>
            </div>
            <div className="text-[11px] text-muted-foreground px-3 flex items-center gap-1 pt-1">
              <MapPin size={12} className="text-emerald-700 shrink-0" />
              <span>{address}</span>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
