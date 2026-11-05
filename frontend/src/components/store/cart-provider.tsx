"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { CartItem, Product } from "@/lib/types";
type CartContextType = { items: CartItem[]; add: (p: Product) => void; change: (id: string, n: number) => void; remove: (id: string) => void; clear: () => void; count: number; subtotal: number };
const CartContext = createContext<CartContextType | null>(null);
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  useEffect(() => { try { setItems(JSON.parse(localStorage.getItem("greenbasket-cart") || "[]")); } catch {} }, []);
  useEffect(() => { localStorage.setItem("greenbasket-cart", JSON.stringify(items)); }, [items]);
  const value = useMemo(() => ({
    items,
    add: (product: Product) => setItems(old => { const found = old.find(i => i.product._id === product._id); return found ? old.map(i => i.product._id === product._id ? { ...i, quantity: i.quantity + 1 } : i) : [...old, { product, quantity: 1 }]; }),
    change: (id: string, n: number) => setItems(old => old.map(i => i.product._id === id ? { ...i, quantity: Math.max(1, n) } : i)),
    remove: (id: string) => setItems(old => old.filter(i => i.product._id !== id)),
    clear: () => setItems([]),
    count: items.reduce((s, i) => s + i.quantity, 0),
    subtotal: items.reduce((s, i) => s + i.product.price * i.quantity, 0)
  }), [items]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
export function useCart() { const value = useContext(CartContext); if (!value) throw new Error("useCart must be used inside CartProvider"); return value; }
