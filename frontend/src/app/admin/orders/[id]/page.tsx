"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { api, money } from "@/lib/api";
import type { Order } from "@/lib/types";
import { toast } from "sonner";
const statuses = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];
export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [status, setStatus] = useState("");
  const token = () => localStorage.getItem("gb-token") || "";
  useEffect(() => {
    if (!token()) {
      location.href = "/admin/login";
      return;
    }
    api<Order>(`/orders/${id}`, {}, token())
      .then((o) => {
        setOrder(o);
        setStatus(o.status);
      })
      .catch((e) => toast.error(e.message));
  }, [id]);
  async function update() {
    try {
      const o = await api<Order>(
        `/orders/${id}/status`,
        { method: "PATCH", body: JSON.stringify({ status }) },
        token(),
      );
      setOrder(o);
      toast.success("Order status updated");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Update failed");
    }
  }
  if (!order)
    return <p className="text-sm text-muted-foreground">Loading order…</p>;
  return (
    <div>
      <Link
        href="/admin/orders"
        className="mb-5 inline-flex items-center gap-2 text-sm text-muted-foreground"
      >
        <ArrowLeft size={15} /> Back to orders
      </Link>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold tracking-widest text-emerald-700">
            ORDER DETAILS
          </p>
          <h1 className="text-3xl font-black">{order.orderNumber}</h1>
          <p className="text-sm text-muted-foreground">
            {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
        <div className="flex gap-2">
          <select
            className="field"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {statuses.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <button onClick={update} className="btn-primary">
            Update status
          </button>
        </div>
      </div>
      <div className="grid gap-5 lg:grid-cols-[1.3fr_.7fr]">
        <section className="panel">
          <h2 className="font-bold">Items ordered</h2>
          <div className="mt-4 divide-y">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center gap-3 py-4">
                <div className="relative h-14 w-14 overflow-hidden rounded-lg bg-muted">
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="flex-1">
                  <b className="text-sm">{item.name}</b>
                  <p className="text-xs text-muted-foreground">
                    {money(item.price)} × {item.quantity}
                  </p>
                </div>
                <b className="text-sm">{money(item.price * item.quantity)}</b>
              </div>
            ))}
          </div>
        </section>
        <div className="space-y-5">
          <section className="panel">
            <h2 className="font-bold">Customer information</h2>
            <p className="mt-4 text-sm font-semibold">{order.customer.name}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {order.customer.phone}
            </p>
            <p className="mt-2 text-sm">{order.customer.address}</p>
            {order.note && (
              <p className="mt-4 rounded-lg bg-muted p-3 text-xs">
                Note: {order.note}
              </p>
            )}
          </section>
          <section className="panel">
            <h2 className="font-bold">Payment & total</h2>
            <p className="mt-4 text-sm text-muted-foreground">
              Cash on Delivery · Unpaid
            </p>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <b>{money(order.subtotal)}</b>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <b>{money(order.deliveryFee)}</b>
              </div>
              <div className="flex justify-between border-t pt-3 text-base">
                <b>Total</b>
                <b>{money(order.total)}</b>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
