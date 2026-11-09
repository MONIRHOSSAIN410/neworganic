"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCart } from "@/components/store/cart-provider";
import { api, money } from "@/lib/api";
import type { Order } from "@/lib/types";
import Link from "next/link";
export default function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    note: "",
  });
  const delivery = subtotal === 0 ? 0 : subtotal >= 1500 ? 0 : 60;
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!items.length) return toast.error("Your basket is empty");
    setBusy(true);
    try {
      const order = await api<Order>("/orders", {
        method: "POST",
        body: JSON.stringify({
          customer: {
            name: form.name,
            phone: form.phone,
            address: form.address,
          },
          note: form.note,
          items: items.map((i) => ({
            product: i.product._id,
            quantity: i.quantity,
          })),
        }),
      });
      clear();
      toast.success(`Order ${order.orderNumber} placed successfully`);
      router.push(`/order-success?number=${order.orderNumber}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not place order");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="container-shell py-10">
      <p className="text-xs font-bold tracking-[.2em] text-emerald-700">
        ALMOST THERE
      </p>
      <h1 className="text-3xl font-black">Place your order</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Fill in your delivery details and review your basket.
      </p>
      <div className="mt-8 grid items-start gap-5 lg:grid-cols-[1.25fr_1fr]">
        <form onSubmit={submit} className="panel space-y-5">
          <h2 className="text-lg font-bold">Delivery information</h2>
          <div>
            <label className="label">Full name</label>
            <input
              required
              className="field"
              placeholder="Your full name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Mobile number</label>
            <input
              required
              pattern="^[0-9+\\- ]{10,16}$"
              className="field"
              placeholder="01XXXXXXXXX"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Delivery address</label>
            <textarea
              required
              rows={3}
              className="field"
              placeholder="House, road, area, district"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Order note (optional)</label>
            <textarea
              rows={2}
              className="field"
              placeholder="Any delivery instructions?"
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
            />
          </div>
          <div className="rounded-xl bg-emerald-50 p-4 text-emerald-950 dark:bg-emerald-950 dark:text-emerald-100">
            <b className="text-sm">Cash on Delivery</b>
            <p className="mt-1 text-xs">
              Pay when your order arrives. Online payment is not enabled.
            </p>
          </div>
          <button
            disabled={busy || !items.length}
            className="btn-primary w-full disabled:opacity-50"
          >
            {busy
              ? "Placing order…"
              : `Confirm order · ${money(subtotal + delivery)}`}
          </button>
        </form>
        <aside className="panel">
          <div className="flex justify-between">
            <h2 className="text-lg font-bold">Your basket</h2>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs text-emerald-800">
              {items.length} items
            </span>
          </div>
          {!items.length ? (
            <div className="py-10 text-center text-sm text-muted-foreground">
              Your basket is empty.
              <Link
                href="/#products"
                className="mt-3 block font-bold text-emerald-700"
              >
                Browse products
              </Link>
            </div>
          ) : (
            <div className="mt-5 space-y-3">
              {items.map((i) => (
                <div
                  key={i.product._id}
                  className="flex justify-between gap-3 text-sm"
                >
                  <span>
                    {i.product.name} × {i.quantity}
                  </span>
                  <b>{money(i.product.price * i.quantity)}</b>
                </div>
              ))}
            </div>
          )}
          <div className="mt-6 space-y-3 border-t pt-5 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <b>{money(subtotal)}</b>
            </div>
            <div className="flex justify-between">
              <span>Delivery</span>
              <b>{delivery ? money(delivery) : subtotal ? "Free" : "—"}</b>
            </div>
            <div className="flex justify-between border-t pt-4 text-base">
              <b>Total</b>
              <b>{money(subtotal + delivery)}</b>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
