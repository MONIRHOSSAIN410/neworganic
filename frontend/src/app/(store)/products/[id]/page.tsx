"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Plus, Minus, ShoppingBasket } from "lucide-react";
import { api, money } from "@/lib/api";
import type { Product } from "@/lib/types";
import { useCart } from "@/components/store/cart-provider";
import { toast } from "sonner";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [p, setP] = useState<Product | null>(null);
  const [qty, setQty] = useState(1);
  const { add } = useCart();

  useEffect(() => {
    api<Product>(`/products/${id}`)
      .then(setP)
      .catch(() => setP(null));
  }, [id]);

  if (!p)
    return (
      <div className="container-shell py-20 text-center text-muted-foreground">
        Product not found or still loading.
      </div>
    );

  return (
    <div className="container-shell py-6 sm:py-10">
      <Link
        href="/"
        className="mb-5 sm:mb-7 inline-flex items-center gap-2 text-xs sm:text-sm text-muted-foreground hover:text-foreground transition"
      >
        <ArrowLeft size={16} className="shrink-0" /> Back to store
      </Link>
      <div className="grid gap-6 md:gap-9 md:grid-cols-2 items-start">
        <div className="relative aspect-square overflow-hidden rounded-2xl sm:rounded-3xl bg-muted shadow-sm">
          <Image
            src={p.image || "/image/savory.jpg"}
            alt={p.name}
            fill
            unoptimized
            referrerPolicy="no-referrer"
            className="object-cover"
            sizes="(max-width:768px) 100vw, 50vw"
          />
        </div>
        <div className="py-1 sm:py-3">
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-700">
            {typeof p.category === "object"
              ? p.category.name
              : "Fresh groceries"}
          </p>
          <h1 className="mt-2 sm:mt-3 text-2xl sm:text-3xl font-black">{p.name}</h1>
          <div className="mt-3 sm:mt-4 flex flex-wrap items-baseline gap-2 sm:gap-3">
            <span className="text-2xl sm:text-3xl font-black text-emerald-800 dark:text-emerald-400">
              {money(p.price)}
            </span>
            {p.compareAtPrice && p.compareAtPrice > p.price && (
              <>
                <span className="text-base sm:text-lg text-muted-foreground line-through">
                  {money(p.compareAtPrice)}
                </span>
                <span className="rounded-full bg-red-600 px-2 sm:px-2.5 py-0.5 text-[11px] sm:text-xs font-black text-white">
                  Save {money(p.compareAtPrice - p.price)} ({Math.round(((p.compareAtPrice - p.price) / p.compareAtPrice) * 100)}% OFF)
                </span>
              </>
            )}
            <span className="text-xs sm:text-sm font-normal text-muted-foreground">
              / {p.unit}
            </span>
          </div>
          <p className="mt-4 sm:mt-6 text-sm leading-6 sm:leading-7 text-muted-foreground">
            {p.description ||
              "Freshly selected quality product for your everyday needs."}
          </p>
          <p className="mt-4 sm:mt-5 text-xs sm:text-sm">
            Availability:{" "}
            <span
              className={
                p.stock > 0 ? "font-semibold text-emerald-700" : "text-red-500 font-semibold"
              }
            >
              {p.stock > 0 ? `${p.stock} in stock` : "Out of stock"}
            </span>
          </p>
          <div className="mt-6 sm:mt-7 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex items-center justify-between sm:justify-start rounded-xl border bg-card p-1">
              <button
                className="p-2 sm:p-2.5 hover:bg-muted rounded-lg transition"
                onClick={() => setQty(Math.max(1, qty - 1))}
                aria-label="Decrease quantity"
              >
                <Minus size={15} className="shrink-0" />
              </button>
              <span className="min-w-10 text-center text-sm font-bold">{qty}</span>
              <button
                className="p-2 sm:p-2.5 hover:bg-muted rounded-lg transition"
                onClick={() => setQty(Math.min(p.stock || 99, qty + 1))}
                aria-label="Increase quantity"
              >
                <Plus size={15} className="shrink-0" />
              </button>
            </div>
            <button
              disabled={!p.stock}
              className="btn-primary flex-1 py-3 text-sm disabled:opacity-50"
              onClick={() => {
                for (let i = 0; i < qty; i++) add(p);
                toast.success(`${p.name} added to basket`);
              }}
            >
              <ShoppingBasket size={17} className="shrink-0" /> Add to basket
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
