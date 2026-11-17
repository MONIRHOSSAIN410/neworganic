"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ArrowRight, Truck } from "lucide-react";
import { useCart } from "@/components/store/cart-provider";
import { api, money } from "@/lib/api";
import type { SiteSettings } from "@/lib/types";

export default function CartPage() {
  const { items, change, remove, subtotal } = useCart();
  const [area, setArea] = useState<"inside_dhaka" | "outside_dhaka">("inside_dhaka");
  const [rates, setRates] = useState({ inside: 80, outside: 140 });

  useEffect(() => {
    api<SiteSettings>("/settings")
      .then((res) => {
        if (res) {
          setRates({
            inside: Number(res.deliveryInsideDhaka) || 80,
            outside: Number(res.deliveryOutsideDhaka) || 140,
          });
        }
      })
      .catch(() => {});
  }, []);

  const delivery =
    subtotal === 0
      ? 0
      : area === "outside_dhaka"
      ? subtotal >= 2500
        ? 0
        : rates.outside
      : subtotal >= 1500
      ? 0
      : rates.inside;

  return (
    <div className="container-shell py-6 sm:py-10">
      <p className="text-xs font-bold tracking-[.2em] text-emerald-700 uppercase">
        Your Selection
      </p>
      <h1 className="text-2xl sm:text-3xl font-black">Your basket</h1>

      {!items.length ? (
        <div className="panel mt-6 sm:mt-7 py-12 sm:py-16 text-center">
          <p className="text-base sm:text-lg font-bold">Your basket is empty.</p>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 mb-5">
            Discover our fresh and organic collection.
          </p>
          <Link href="/#products" className="btn-primary">
            Browse products
          </Link>
        </div>
      ) : (
        <div className="mt-6 sm:mt-7 grid gap-6 lg:grid-cols-[1.5fr_1fr] items-start">
          <div className="panel space-y-4">
            {items.map(({ product, quantity }) => (
              <div
                key={product._id}
                className="flex items-center gap-3 sm:gap-4 border-b pb-4 last:border-0"
              >
                <div className="relative h-16 w-16 sm:h-20 sm:w-20 shrink-0 overflow-hidden rounded-xl bg-muted shadow-sm">
                  <Image
                    src={product.image || "/image/savory.jpg"}
                    alt={product.name}
                    fill
                    unoptimized
                    referrerPolicy="no-referrer"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/products/${product._id}`}
                    className="font-bold text-xs sm:text-sm hover:text-emerald-700 transition block truncate"
                  >
                    {product.name}
                  </Link>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {money(product.price)} · {product.unit}
                    {product.compareAtPrice && product.compareAtPrice > product.price && (
                      <span className="ml-1.5 line-through text-[11px]">
                        {money(product.compareAtPrice)}
                      </span>
                    )}
                  </p>
                  <div className="mt-2.5 flex items-center gap-2 sm:gap-3">
                    <div className="flex items-center rounded-lg border bg-card">
                      <button
                        className="p-1.5 sm:p-2 hover:bg-muted transition"
                        onClick={() => change(product._id, quantity - 1)}
                        aria-label="Decrease quantity"
                      >
                        <Minus size={13} className="shrink-0" />
                      </button>
                      <span className="min-w-6 text-center text-xs font-bold">
                        {quantity}
                      </span>
                      <button
                        className="p-1.5 sm:p-2 hover:bg-muted transition"
                        onClick={() => change(product._id, quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        <Plus size={13} className="shrink-0" />
                      </button>
                    </div>
                    <button
                      onClick={() => remove(product._id)}
                      className="text-red-500 hover:text-red-700 p-1.5 rounded transition"
                      aria-label="Remove item"
                    >
                      <Trash2 size={16} className="shrink-0" />
                    </button>
                  </div>
                </div>
                <b className="text-xs sm:text-sm font-extrabold shrink-0">
                  {money(product.price * quantity)}
                </b>
              </div>
            ))}
          </div>

          <aside className="panel h-fit space-y-4">
            <h2 className="text-base sm:text-lg font-bold border-b pb-3">Order summary</h2>

            {/* Delivery Area Selection in Cart */}
            <div>
              <p className="text-xs font-semibold mb-2 text-muted-foreground flex items-center gap-1.5">
                <Truck size={14} className="text-emerald-700 shrink-0" />
                ডেলিভারি এলাকা নির্বাচন করুন:
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setArea("inside_dhaka")}
                  className={`rounded-xl border p-2 text-center font-semibold transition ${
                    area === "inside_dhaka"
                      ? "border-emerald-600 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200 shadow-sm"
                      : "hover:bg-muted text-muted-foreground"
                  }`}
                >
                  ঢাকার ভিতরে
                  <span className="block text-[10px] font-bold text-emerald-700">৳{rates.inside}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setArea("outside_dhaka")}
                  className={`rounded-xl border p-2 text-center font-semibold transition ${
                    area === "outside_dhaka"
                      ? "border-emerald-600 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200 shadow-sm"
                      : "hover:bg-muted text-muted-foreground"
                  }`}
                >
                  ঢাকার বাইরে
                  <span className="block text-[10px] font-bold text-emerald-700">৳{rates.outside}</span>
                </button>
              </div>
            </div>

            <div className="space-y-2.5 text-xs sm:text-sm border-t pt-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <b>{money(subtotal)}</b>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Delivery</span>
                <b>{delivery ? money(delivery) : subtotal ? <span className="text-emerald-700 font-bold">Free</span> : "—"}</b>
              </div>
              <div className="flex justify-between border-t pt-3 text-sm sm:text-base font-bold">
                <b>Total</b>
                <b className="text-emerald-800 dark:text-emerald-400">
                  {money(subtotal + delivery)}
                </b>
              </div>
            </div>

            <Link href="/checkout" className="btn-primary w-full py-3 text-sm">
              Proceed to checkout <ArrowRight size={16} className="shrink-0" />
            </Link>

            <p className="text-center text-[10px] sm:text-[11px] text-muted-foreground leading-relaxed">
              ঢাকার ভিতরে ৳১,৫০০+ এবং ঢাকার বাইরে ৳২,৫০০+ অর্ডারে ফ্রি ডেলিভারি!
            </p>
          </aside>
        </div>
      )}
    </div>
  );
}
