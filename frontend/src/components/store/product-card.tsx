"use client";
import Image from "next/image";
import Link from "next/link";
import { Plus, Star } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/lib/types";
import { money } from "@/lib/api";
import { useCart } from "./cart-provider";
export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const category = typeof product.category === "object" ? product.category.name : "Fresh pick";
  return <article className="group rounded-2xl border bg-card p-3 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
    <Link href={`/products/${product._id}`} className="block">
      <div className="relative mb-3 aspect-square overflow-hidden rounded-xl bg-muted">
        <Image src={product.image} alt={product.name} fill sizes="(max-width:640px) 45vw, 220px" className="object-cover transition duration-500 group-hover:scale-105"/>
        {product.isFeatured && <span className="absolute left-2 top-2 rounded-full bg-lime-100 px-2 py-1 text-[10px] font-bold uppercase text-lime-800">Popular</span>}
      </div>
      <p className="text-[10px] font-bold uppercase tracking-wide text-emerald-700">{category}</p>
      <h3 className="mt-1 line-clamp-2 min-h-10 text-sm font-bold">{product.name}</h3>
    </Link>
    <div className="mt-2 flex items-center gap-1 text-amber-500"><Star size={12} fill="currentColor"/><span className="text-xs text-muted-foreground">Fresh choice</span></div>
    <div className="mt-2 flex items-center justify-between"><div><p className="font-extrabold">{money(product.price)}</p><p className="text-[10px] text-muted-foreground">per {product.unit}</p></div><button aria-label={`Add ${product.name} to basket`} onClick={() => { add(product); toast.success("Added to basket"); }} className="rounded-full bg-emerald-700 p-2 text-white transition hover:bg-emerald-800"><Plus size={17}/></button></div>
  </article>;
}
