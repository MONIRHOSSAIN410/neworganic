"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Star } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/lib/types";
import { money } from "@/lib/api";
import { useCart } from "./cart-provider";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const [imgSrc, setImgSrc] = useState(product.image || "/image/savory.jpg");
  const category = typeof product.category === "object" ? product.category?.name : "Fresh pick";
  const hasDiscount = Boolean(product.compareAtPrice && product.compareAtPrice > product.price);
  const discountPercent = hasDiscount
    ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)
    : 0;

  return (
    <article className="group relative flex flex-col justify-between rounded-xl sm:rounded-2xl border bg-card p-2.5 sm:p-3 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <Link href={`/products/${product._id}`} className="block">
        <div className="relative mb-2.5 sm:mb-3 aspect-square overflow-hidden rounded-lg sm:rounded-xl bg-muted">
          <Image
            src={imgSrc}
            alt={product.name}
            fill
            unoptimized
            referrerPolicy="no-referrer"
            onError={() => setImgSrc("/image/savory.jpg")}
            sizes="(max-width:640px) 45vw, 220px"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
          {product.isFeatured && (
            <span className="absolute left-1.5 top-1.5 sm:left-2 sm:top-2 rounded-full bg-lime-100 px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase text-lime-800 shadow-sm">
              Popular
            </span>
          )}
          {hasDiscount && (
            <span className="absolute right-1.5 top-1.5 sm:right-2 sm:top-2 rounded-full bg-red-600 px-1.5 py-0.5 text-[9px] sm:text-[10px] font-black text-white shadow-sm">
              -{discountPercent}%
            </span>
          )}
        </div>
        <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wide text-emerald-700 truncate">
          {category}
        </p>
        <h3 className="mt-1 line-clamp-2 min-h-8 sm:min-h-10 text-xs sm:text-sm font-bold text-foreground">
          {product.name}
        </h3>
      </Link>

      <div className="mt-1.5 sm:mt-2">
        <div className="flex items-center gap-1 text-amber-500">
          <Star size={11} fill="currentColor" className="shrink-0" />
          <span className="text-[10px] sm:text-[11px] text-muted-foreground">Fresh choice</span>
        </div>

        <div className="mt-2 flex items-center justify-between gap-1.5">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline gap-1">
              <span className="text-xs sm:text-base font-extrabold text-foreground truncate">
                {money(product.price)}
              </span>
              {hasDiscount && (
                <span className="text-[10px] sm:text-xs text-muted-foreground line-through font-normal">
                  {money(product.compareAtPrice!)}
                </span>
              )}
            </div>
            <p className="text-[9px] sm:text-[10px] text-muted-foreground">per {product.unit}</p>
          </div>

          <button
            aria-label={`Add ${product.name} to basket`}
            onClick={() => {
              add(product);
              toast.success(`${product.name} added to basket`);
            }}
            className="shrink-0 rounded-full bg-emerald-700 p-1.5 sm:p-2 text-white transition hover:bg-emerald-800 active:scale-95"
          >
            <Plus size={16} className="shrink-0" />
          </button>
        </div>
      </div>
    </article>
  );
}
