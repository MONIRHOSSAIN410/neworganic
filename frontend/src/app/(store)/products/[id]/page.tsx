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
    <div className="container-shell py-10">
      <Link
        href="/"
        className="mb-7 inline-flex items-center gap-2 text-sm text-muted-foreground"
      >
        <ArrowLeft size={16} /> Back to store
      </Link>
      <div className="grid gap-9 md:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-3xl bg-muted">
          <Image
            src={p.image}
            alt={p.name}
            fill
            className="object-cover"
            sizes="(max-width:768px) 100vw, 50vw"
          />
        </div>
        <div className="py-3">
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-700">
            {typeof p.category === "object"
              ? p.category.name
              : "Fresh groceries"}
          </p>
          <h1 className="mt-3 text-3xl font-black">{p.name}</h1>
          <p className="mt-4 text-2xl font-black">
            {money(p.price)}{" "}
            <span className="text-sm font-normal text-muted-foreground">
              / {p.unit}
            </span>
          </p>
          <p className="mt-6 leading-7 text-muted-foreground">
            {p.description ||
              "Freshly selected quality product for your everyday needs."}
          </p>
          <p className="mt-5 text-sm">
            Availability:{" "}
            <span
              className={
                p.stock > 0 ? "font-semibold text-emerald-700" : "text-red-500"
              }
            >
              {p.stock > 0 ? `${p.stock} in stock` : "Out of stock"}
            </span>
          </p>
          <div className="mt-7 flex items-center gap-3">
            <div className="flex items-center rounded-xl border">
              <button
                className="p-3"
                onClick={() => setQty(Math.max(1, qty - 1))}
              >
                <Minus size={15} />
              </button>
              <span className="min-w-8 text-center text-sm">{qty}</span>
              <button
                className="p-3"
                onClick={() => setQty(Math.min(p.stock, qty + 1))}
              >
                <Plus size={15} />
              </button>
            </div>
            <button
              disabled={!p.stock}
              className="btn-primary flex-1 disabled:opacity-50"
              onClick={() => {
                for (let i = 0; i < qty; i++) add(p);
                toast.success("Added to basket");
              }}
            >
              <ShoppingBasket size={17} /> Add to basket
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
