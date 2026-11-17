"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Leaf, ShieldCheck, Truck, HeartHandshake, Search, X, Sparkles, Tag } from "lucide-react";
import { api } from "@/lib/api";
import type { Category, Product, Banner, SiteSettings } from "@/lib/types";
import { ProductCard } from "@/components/store/product-card";

const defaultSlides = [
  {
    eyebrow: "GOOD FOOD, GOOD MOOD",
    title: "Nature's best,",
    accent: "delivered fresh.",
    copy: "Shop honest ingredients, organic pantry essentials and everyday goodness for your family.",
    bg: "from-[#f1f7e9] to-[#e4efd5]",
    link: "#products",
    image: "",
  },
  {
    eyebrow: "FRESH FROM THE FARM",
    title: "Eat well,",
    accent: "feel wonderful.",
    copy: "Thoughtfully selected everyday essentials, delivered right to your doorstep.",
    bg: "from-[#edf7ee] to-[#dcefe0]",
    link: "#products",
    image: "",
  },
  {
    eyebrow: "A BETTER WAY TO SHOP",
    title: "Simple choices,",
    accent: "healthier living.",
    copy: "Discover quality groceries and pantry favourites at friendly prices.",
    bg: "from-[#f5f4e7] to-[#e9edcf]",
    link: "#products",
    image: "",
  },
];

let cachedProducts: Product[] | null = null;
let cachedCategories: Category[] | null = null;

function HomeContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>(cachedProducts || []);
  const [categories, setCategories] = useState<Category[]>(cachedCategories || []);
  const [banners, setBanners] = useState<any[]>(defaultSlides);
  const [slide, setSlide] = useState(0);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(!cachedProducts || cachedProducts.length === 0);

  // Sync search from URL query parameter (from Header search bar)
  useEffect(() => {
    const q = searchParams.get("search");
    if (q) {
      setSearch(q);
    }
  }, [searchParams]);

  useEffect(() => {
    // 1. Fetch products independently and quickly
    api<Product[]>("/products")
      .then((data) => {
        const list = data || [];
        setProducts(list);
        cachedProducts = list;
        setLoading(false);
      })
      .catch(() => {
        if (!cachedProducts) setProducts([]);
        setLoading(false);
      });

    // 2. Fetch categories independently
    api<Category[]>("/categories")
      .then((data) => {
        const cats = data || [];
        setCategories(cats);
        cachedCategories = cats;
      })
      .catch(() => {});

    // 3. Fetch banners & settings without blocking products
    Promise.all([
      api<Banner[]>("/banners").catch(() => []),
      api<SiteSettings>("/settings").catch(() => null),
    ]).then(([bannerData, settingsData]) => {
      const slides: any[] = [];
      if (settingsData && settingsData.heroImage) {
        slides.push({
          eyebrow: settingsData.heroSubtitle || "",
          title: settingsData.heroTitle || "",
          accent: settingsData.heroAccent || "",
          copy: settingsData.heroCopy || "",
          bg: "from-[#f1f7e9] to-[#e4efd5]",
          link: settingsData.heroLink || "#products",
          image: settingsData.heroImage,
          showHeroText: !!settingsData.showHeroText,
        });
      }

      if (bannerData && bannerData.length > 0) {
        bannerData.forEach((b) => {
          slides.push({
            eyebrow: b.subtitle || "",
            title: b.title || "",
            accent: b.accent || "",
            copy: b.copy || "",
            bg: b.bgGradient || "from-[#f1f7e9] to-[#e4efd5]",
            link: b.link || "#products",
            image: b.image || "",
            showHeroText: !b.image,
          });
        });
      }

      if (slides.length > 0) {
        setBanners(slides);
      }
    });
  }, []);

  useEffect(() => {
    if (!banners.length) return;
    const timer = setInterval(() => setSlide((s) => (s + 1) % banners.length), 6000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const visible = products.filter((p) => {
    const matchesCat =
      filter === "all" ||
      (typeof p.category === "object" ? p.category?._id === filter : p.category === filter);
    const matchesSearch =
      !search.trim() || p.name.toLowerCase().includes(search.trim().toLowerCase());
    return matchesCat && matchesSearch;
  });

  const current = banners[slide] || banners[0] || defaultSlides[0];

  return (
    <div className="container-shell">
      {/* Hero Banner / Slider */}
      <section className="relative mt-4 sm:mt-5 overflow-hidden rounded-2xl sm:rounded-3xl border border-border/50 shadow-none transition-all duration-700">
        {current.image ? (
          /* Full Hero Section Banner Image (No Shadow) */
          <div className="relative w-full aspect-[2.3/1] sm:aspect-[2.7/1] md:aspect-[3.1/1] lg:aspect-[3.5/1] min-h-[170px] sm:min-h-[250px] md:min-h-[310px] lg:min-h-[360px] overflow-hidden rounded-2xl sm:rounded-3xl bg-muted shadow-none">
            <Link href={current.link || "#products"} className="block relative w-full h-full">
              <Image
                src={current.image}
                alt={current.title || "Hero banner"}
                fill
                unoptimized
                referrerPolicy="no-referrer"
                className="object-cover rounded-2xl sm:rounded-3xl"
                priority
              />
              {current.showHeroText && (
                <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent flex flex-col justify-center px-6 sm:px-12 text-white">
                  {current.eyebrow && (
                    <span className="inline-flex rounded-full border border-white/30 bg-white/20 px-2.5 py-0.5 text-[9px] sm:text-[10px] font-bold tracking-widest uppercase w-fit mb-2">
                      {current.eyebrow}
                    </span>
                  )}
                  <h1 className="text-xl sm:text-3xl md:text-5xl font-black leading-tight max-w-xl">
                    {current.title} {current.accent && <span className="text-lime-300">{current.accent}</span>}
                  </h1>
                  {current.copy && (
                    <p className="mt-2 text-xs sm:text-sm text-slate-200 max-w-md line-clamp-2">
                      {current.copy}
                    </p>
                  )}
                  <div className="mt-4">
                    <span className="btn-primary !bg-emerald-600 hover:!bg-emerald-700 !shadow-none text-xs sm:text-sm inline-flex items-center gap-1.5">
                      Shop products <ArrowRight size={14} className="shrink-0" />
                    </span>
                  </div>
                </div>
              )}
            </Link>
          </div>
        ) : (
          /* Default Text-Based Hero Section (When no banner image, No Shadow) */
          <div className={`relative px-5 py-8 sm:px-10 sm:py-14 bg-gradient-to-r ${current.bg} rounded-2xl sm:rounded-3xl shadow-none overflow-hidden`}>
            <div className="pointer-events-none absolute -right-10 -top-20 h-48 w-48 sm:h-64 sm:w-64 rounded-full border-[16px] sm:border-[24px] border-white/30" />
            <AnimatePresence mode="wait">
              <motion.div
                key={slide}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3 }}
                className="relative max-w-xl z-10"
              >
                <span className="inline-flex rounded-full border border-emerald-200 bg-white/80 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[9px] sm:text-[10px] font-bold tracking-widest text-emerald-800 uppercase shadow-none">
                  {current.eyebrow}
                </span>
                <h1 className="mt-3 sm:mt-4 text-2xl sm:text-4xl lg:text-5xl font-black leading-[1.15] tracking-tight text-slate-950">
                  {current.title}
                  {current.accent && (
                    <>
                      <br />
                      <span className="text-emerald-700">{current.accent}</span>
                    </>
                  )}
                </h1>
                {current.copy && (
                  <p className="mt-2.5 sm:mt-4 max-w-md text-xs sm:text-sm leading-5 sm:leading-6 text-slate-700">
                    {current.copy}
                  </p>
                )}
                <div className="mt-4 sm:mt-6 flex flex-wrap items-center gap-3">
                  <Link href={current.link || "#products"} className="btn-primary !shadow-none">
                    Shop products <ArrowRight size={15} className="shrink-0" />
                  </Link>
                </div>
                <div className="mt-4 sm:mt-6 flex flex-wrap gap-4 sm:gap-5 text-[11px] font-semibold text-emerald-900">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck size={14} className="shrink-0 text-emerald-700" /> Quality checked
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Truck size={14} className="shrink-0 text-emerald-700" /> Quick delivery
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        {banners.length > 1 && (
          <div className="absolute bottom-3 right-4 sm:bottom-4 sm:right-6 z-20 flex gap-1.5 sm:gap-2">
            {banners.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setSlide(i)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  i === slide ? "w-6 sm:w-7 bg-emerald-600" : "w-2 bg-emerald-950/40 dark:bg-white/40"
                }`}
              />
            ))}
          </div>
        )}
      </section>

      {/* Feature Badges */}
      <section className="mt-4 sm:mt-5 grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
        {[
          ["Naturally selected", "Thoughtfully sourced everyday goods", Leaf],
          ["Quality you trust", "Carefully checked before delivery", ShieldCheck],
          ["Made for your home", "Good ingredients, better living", HeartHandshake],
        ].map(([title, copy, Icon]: any) => (
          <div key={title} className="flex items-center gap-3 rounded-2xl border bg-card p-3.5 sm:p-4 shadow-sm">
            <span className="rounded-xl bg-emerald-50 p-2 sm:p-2.5 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400 shrink-0">
              <Icon size={19} className="shrink-0" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-bold text-foreground truncate">{title}</p>
              <p className="mt-0.5 text-[10px] text-muted-foreground truncate">{copy}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Categories Bar */}
      <section id="categories" className="pt-8 sm:pt-12">
        <p className="text-[10px] font-bold tracking-[.25em] text-emerald-700 uppercase">
          Browse by category
        </p>
        <h2 className="mt-1 text-xl sm:text-2xl font-black">Find your favourites</h2>
        <div className="mt-3 sm:mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-none sm:flex-wrap">
          <button
            onClick={() => setFilter("all")}
            className={`shrink-0 inline-flex items-center gap-1.5 rounded-full border px-3.5 sm:px-4 py-1.5 sm:py-2 text-xs font-semibold transition ${
              filter === "all"
                ? "bg-emerald-700 text-white shadow-sm"
                : "bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            <Sparkles size={13} className="shrink-0" />
            <span>All Products</span>
          </button>
          {categories.map((c) => (
            <button
              key={c._id}
              onClick={() => setFilter(c._id)}
              className={`shrink-0 inline-flex items-center gap-1.5 rounded-full border px-3.5 sm:px-4 py-1.5 sm:py-2 text-xs font-semibold transition ${
                filter === c._id
                  ? "bg-emerald-700 text-white shadow-sm"
                  : "bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              {c.image ? (
                <span className="relative h-4 w-4 shrink-0 overflow-hidden rounded-full border">
                  <Image
                    src={c.image}
                    alt={c.name}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </span>
              ) : (
                <Tag size={13} className="shrink-0" />
              )}
              <span>{c.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Products Grid & Fixed Search Section */}
      <section id="products" className="scroll-mt-24 pt-8 sm:pt-10">
        <div className="mb-5 sm:mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-[10px] font-bold tracking-[.25em] text-emerald-700 uppercase">
              Fresh picks for you
            </p>
            <h2 className="text-xl sm:text-2xl font-black">Shop our products</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Find your everyday fresh favourites in one place.
            </p>
          </div>

          {/* Fixed Centered Search Icon & Responsive Input */}
          <div className="relative w-full sm:w-72">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none shrink-0"
            />
            <input
              type="text"
              className="field !pl-10 !pr-10 !py-2 text-xs rounded-full border shadow-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              style={{ paddingLeft: "38px", paddingRight: "38px" }}
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5"
              >
                <X size={14} className="shrink-0" />
              </button>
            )}
          </div>
        </div>

        {loading ? (
          /* Animated Product Skeleton Grid for Instant Responsive Feedback */
          <div className="grid grid-cols-2 gap-2.5 sm:gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
              <div key={n} className="rounded-2xl border bg-card p-3 animate-pulse shadow-none">
                <div className="h-36 sm:h-44 w-full rounded-xl bg-muted" />
                <div className="mt-3 h-4 w-3/4 rounded bg-muted" />
                <div className="mt-2 h-3 w-1/2 rounded bg-muted" />
                <div className="mt-4 flex items-center justify-between">
                  <div className="h-5 w-16 rounded bg-muted" />
                  <div className="h-8 w-8 rounded-full bg-muted" />
                </div>
              </div>
            ))}
          </div>
        ) : visible.length > 0 ? (
          <div className="grid grid-cols-2 gap-2.5 sm:gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {visible.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        ) : (
          <div className="panel py-14 text-center text-sm text-muted-foreground">
            <p className="font-bold text-base text-foreground mb-1">No products found</p>
            <p className="text-xs mb-4">
              {search
                ? `No products match "${search}". Try searching something else.`
                : "Add products from the admin dashboard to display them here."}
            </p>
            {search && (
              <button
                onClick={() => setSearch("")}
                className="btn-secondary text-xs"
              >
                Clear search filter
              </button>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="container-shell py-20 text-center text-muted-foreground">Loading store...</div>}>
      <HomeContent />
    </Suspense>
  );
}
