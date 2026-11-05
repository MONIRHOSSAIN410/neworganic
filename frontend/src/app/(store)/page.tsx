"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Leaf, ShieldCheck, Truck, HeartHandshake, Search } from "lucide-react";
import { api } from "@/lib/api";
import type { Category, Product } from "@/lib/types";
import { ProductCard } from "@/components/store/product-card";

const slides = [
  { eyebrow: "GOOD FOOD, GOOD MOOD", title: "Nature's best,", accent: "delivered fresh.", copy: "Shop honest ingredients, organic pantry essentials and everyday goodness for your family.", bg: "from-[#f1f7e9] to-[#e4efd5]" },
  { eyebrow: "FRESH FROM THE FARM", title: "Eat well,", accent: "feel wonderful.", copy: "Thoughtfully selected everyday essentials, delivered right to your doorstep.", bg: "from-[#edf7ee] to-[#dcefe0]" },
  { eyebrow: "A BETTER WAY TO SHOP", title: "Simple choices,", accent: "healthier living.", copy: "Discover quality groceries and pantry favourites at friendly prices.", bg: "from-[#f5f4e7] to-[#e9edcf]" }
];
export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [slide, setSlide] = useState(0);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  useEffect(() => { api<Product[]>("/products").then(setProducts).catch(() => setProducts([])); api<Category[]>("/categories").then(setCategories).catch(() => setCategories([])); }, []);
  useEffect(() => { const timer = setInterval(() => setSlide(s => (s + 1) % slides.length), 5000); return () => clearInterval(timer); }, []);
  const visible = products.filter(p => (filter === "all" || (typeof p.category === "object" && p.category._id === filter)) && p.name.toLowerCase().includes(search.toLowerCase()));
  const current = slides[slide];
  return <div className="container-shell">
    <section className={`relative mt-5 overflow-hidden rounded-3xl bg-gradient-to-r ${current.bg} px-7 py-12 sm:px-12 sm:py-16`}>
      <div className="pointer-events-none absolute -right-10 -top-20 h-64 w-64 rounded-full border-[28px] border-white/40"/>
      <AnimatePresence mode="wait"><motion.div key={slide} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:.35}} className="relative max-w-xl">
        <span className="inline-flex rounded-full border border-emerald-200 bg-white/70 px-3 py-1 text-[10px] font-bold tracking-widest text-emerald-800">{current.eyebrow}</span>
        <h1 className="mt-4 text-4xl font-black leading-[1.05] tracking-tight text-slate-950 sm:text-5xl">{current.title}<br/><span className="text-emerald-700">{current.accent}</span></h1>
        <p className="mt-4 max-w-md text-sm leading-6 text-slate-600">{current.copy}</p>
        <Link href="#products" className="btn-primary mt-5">Shop products <ArrowRight size={16}/></Link>
        <div className="mt-6 flex gap-5 text-[11px] font-semibold text-emerald-900"><span className="flex items-center gap-1"><ShieldCheck size={14}/> Quality checked</span><span className="flex items-center gap-1"><Truck size={14}/> Quick delivery</span></div>
      </motion.div></AnimatePresence>
      <div className="absolute bottom-5 right-6 flex gap-2">{slides.map((_,i)=><button key={i} aria-label={`Go to slide ${i+1}`} onClick={()=>setSlide(i)} className={`h-2 rounded-full transition-all ${i===slide?"w-7 bg-emerald-700":"w-2 bg-emerald-900/30"}`}/>)}</div>
    </section>
    <section className="mt-5 grid gap-3 sm:grid-cols-3">
      {[["Naturally selected","Thoughtfully sourced everyday goods",Leaf],["Quality you trust","Carefully checked before delivery",ShieldCheck],["Made for your home","Good ingredients, better living",HeartHandshake]].map(([title,copy,Icon]: any)=><div key={title} className="flex items-center gap-3 rounded-2xl border bg-card p-4"><span className="rounded-xl bg-emerald-50 p-2 text-emerald-800"><Icon size={19}/></span><div><p className="text-xs font-bold">{title}</p><p className="mt-1 text-[10px] text-muted-foreground">{copy}</p></div></div>)}
    </section>
    <section id="categories" className="pt-12">
      <p className="text-[10px] font-bold tracking-[.25em] text-emerald-700">BROWSE BY CATEGORY</p><h2 className="mt-1 text-2xl font-black">Find your favourites</h2>
      <div className="mt-4 flex flex-wrap gap-2"><button onClick={()=>setFilter("all")} className={`rounded-full border px-4 py-2 text-xs ${filter==="all"?"bg-emerald-700 text-white":"bg-card"}`}>All</button>{categories.map(c=><button key={c._id} onClick={()=>setFilter(c._id)} className={`rounded-full border px-4 py-2 text-xs ${filter===c._id?"bg-emerald-700 text-white":"bg-card"}`}>{c.name}</button>)}</div>
    </section>
    <section id="products" className="scroll-mt-24 pt-9">
      <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><p className="text-[10px] font-bold tracking-[.25em] text-emerald-700">FRESH PICKS FOR YOU</p><h2 className="text-2xl font-black">Shop our products</h2><p className="text-xs text-muted-foreground">Find your everyday favourites in one place.</p></div><label className="relative block sm:w-64"><Search size={15} className="absolute left-3 top-3 text-muted-foreground"/><input className="field pl-9" placeholder="Search products..." value={search} onChange={e=>setSearch(e.target.value)}/></label></div>
      {visible.length ? <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">{visible.map(p=><ProductCard key={p._id} product={p}/>)}</div> : <div className="panel py-12 text-center text-sm text-muted-foreground">No products found. Add products from the admin dashboard.</div>}
    </section>
  </div>;
}
