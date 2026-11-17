"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Tags, Tag, ArrowRight, ShoppingBag, Sparkles } from "lucide-react";
import { api } from "@/lib/api";
import type { Category, Product } from "@/lib/types";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api<Category[]>("/categories").catch(() => []),
      api<Product[]>("/products").catch(() => []),
    ]).then(([cats, prods]) => {
      setCategories(cats || []);
      setProducts(prods || []);
      setLoading(false);
    });
  }, []);

  function getProductCount(catId: string) {
    return products.filter((p) => {
      if (typeof p.category === "object" && p.category) {
        return p.category._id === catId;
      }
      return p.category === catId;
    }).length;
  }

  return (
    <div className="container-shell py-8 sm:py-12">
      {/* Page Header */}
      <div className="mb-8 max-w-2xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 mb-3">
          <Tags size={14} className="shrink-0" />
          <span>ক্যাটালগ ও ক্যাটাগরি</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-foreground">
          All Categories
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-muted-foreground">
          Explore our wide selection of fresh, organic and premium food products by category.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="panel h-48 animate-pulse bg-muted/60" />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="panel py-16 text-center">
          <Tag size={40} className="mx-auto text-muted-foreground/50 mb-3" />
          <h3 className="text-base font-bold text-foreground">কোনো ক্যাটাগরি পাওয়া যায়নি</h3>
          <p className="text-xs text-muted-foreground mt-1">
            শীঘ্রই নতুন ক্যাটাগরি যুক্ত করা হবে।
          </p>
          <Link href="/" className="btn-primary mt-4 inline-flex">
            হোমপেজে ফিরে যান
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5 sm:gap-6">
          {categories.map((cat) => {
            const count = getProductCount(cat._id);
            return (
              <Link
                key={cat._id}
                href={`/#products`}
                className="group panel flex flex-col justify-between overflow-hidden p-4 sm:p-5 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-600 hover:shadow-xl"
              >
                <div>
                  <div className="relative mb-3 flex h-24 sm:h-32 w-full items-center justify-center overflow-hidden rounded-xl bg-emerald-50 dark:bg-emerald-950/30">
                    {cat.image ? (
                      <Image
                        src={cat.image}
                        alt={cat.name}
                        fill
                        unoptimized
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <Tag
                        size={36}
                        className="text-emerald-700 dark:text-emerald-400 transition-transform duration-300 group-hover:scale-110"
                      />
                    )}
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-foreground group-hover:text-emerald-700 transition-colors">
                    {cat.name}
                  </h3>
                  {cat.description && (
                    <p className="mt-1 line-clamp-2 text-[11px] sm:text-xs text-muted-foreground">
                      {cat.description}
                    </p>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between border-t pt-3 text-[11px] sm:text-xs font-semibold text-muted-foreground group-hover:text-emerald-700">
                  <span className="flex items-center gap-1">
                    <ShoppingBag size={12} className="shrink-0" />
                    {count} {count === 1 ? "item" : "items"}
                  </span>
                  <span className="inline-flex items-center gap-0.5 group-hover:translate-x-1 transition-transform text-emerald-700">
                    Browse <ArrowRight size={13} className="shrink-0" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
