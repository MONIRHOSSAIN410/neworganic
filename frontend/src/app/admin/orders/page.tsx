"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, ExternalLink, X } from "lucide-react";
import { api, money } from "@/lib/api";
import type { Order } from "@/lib/types";
import { toast } from "sonner";

const statuses = ["all", "pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

export default function OrdersAdmin() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const token = () => localStorage.getItem("gb-token") || "";

  async function load() {
    try {
      const q = new URLSearchParams();
      if (status !== "all") q.set("status", status);
      if (search.trim()) q.set("search", search.trim());
      setOrders(await api<Order[]>(`/orders?${q}`, {}, token()));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not load orders");
    }
  }

  useEffect(() => {
    if (!token()) {
      location.href = "/admin/login";
      return;
    }
    load();
  }, [status]);

  return (
    <div>
      <p className="text-xs font-bold tracking-widest text-emerald-700 uppercase">SALES</p>
      <h1 className="text-2xl sm:text-3xl font-black">Orders</h1>
      <p className="mb-6 text-xs sm:text-sm text-muted-foreground">
        Review, filter and update customer orders.
      </p>

      <div className="panel">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none shrink-0" />
            <input
              className="field pl-9 pr-9"
              placeholder="Search order, customer or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && load()}
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X size={14} className="shrink-0" />
              </button>
            )}
          </div>

          <div className="flex gap-2">
            <button onClick={load} className="btn-primary flex-1 sm:flex-none">
              Search
            </button>
            <select
              className="field flex-1 sm:w-48"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s === "all" ? "All statuses" : s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
          <table className="w-full min-w-[650px] text-left text-sm">
            <thead className="text-xs text-muted-foreground border-b pb-3">
              <tr>
                <th className="pb-3">Order ID</th>
                <th>Customer</th>
                <th>Phone</th>
                <th>Date</th>
                <th>Total</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id} className="border-t">
                  <td className="py-3.5 font-bold">{o.orderNumber}</td>
                  <td>{o.customer.name}</td>
                  <td>{o.customer.phone}</td>
                  <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td className="font-semibold">{money(o.total)}</td>
                  <td>
                    <span className="rounded-full bg-muted px-2.5 py-1 text-xs capitalize font-medium">
                      {o.status}
                    </span>
                  </td>
                  <td>
                    <Link
                      href={`/admin/orders/${o._id}`}
                      className="inline-flex items-center gap-1 font-semibold text-emerald-700 hover:underline"
                    >
                      Details <ExternalLink size={13} className="shrink-0" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!orders.length && (
            <p className="py-10 text-center text-sm text-muted-foreground">
              No matching orders found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
