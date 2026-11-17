"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCart } from "@/components/store/cart-provider";
import { api, money } from "@/lib/api";
import type { Order } from "@/lib/types";
import Link from "next/link";
import { MapPin, Truck, CheckCircle2 } from "lucide-react";

export default function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [deliveryArea, setDeliveryArea] = useState<"inside_dhaka" | "outside_dhaka">("inside_dhaka");
  const [manualAreaSelect, setManualAreaSelect] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    note: "",
  });

  // Auto Delivery Charge calculation based on selected or detected area
  const delivery =
    subtotal === 0
      ? 0
      : deliveryArea === "outside_dhaka"
      ? subtotal >= 2500
        ? 0
        : 120
      : subtotal >= 1500
      ? 0
      : 60;

  // Smart Auto-detection when typing address
  function handleAddressChange(val: string) {
    setForm({ ...form, address: val });
    if (manualAreaSelect) return;

    const text = val.toLowerCase();
    const outsideKeywords = [
      "outside", "chittagong", "chattogram", "চট্টগ্রাম", "sylhet", "সিলেট",
      "rajshahi", "রাজশাহী", "khulna", "খুলনা", "barishal", "বরিশাল",
      "rangpur", "রংপুর", "mymensingh", "ময়মনসিংহ", "comilla", "কুমিল্লা",
      "bogura", "bogra", "বগুড়া", "feni", "ফেণী", "noakhali", "নোয়াখালী",
      "cox", "কক্সবাজার", "gazipur", "গাজীপুর", "narayanganj", "নারায়ণগঞ্জ",
      "tangail", "টাঙ্গাইল", "jashore", "যশোর", "bimanbandar", "savar", "সাভার"
    ];
    const insideKeywords = [
      "dhaka", "ঢাকা", "mirpur", "মিরপুর", "dhanmondi", "ধানমন্ডি", "gulshan", "গুলশান",
      "banani", "বনানী", "uttara", "উত্তরা", "mohammadpur", "মোহাম্মদপুর", "badda", "বাড্ডা",
      "bashundhara", "বসুন্ধরা", "motijheel", "মতিঝিল", "malibagh", "মালিবাগ", "rampura", "রামপুরা",
      "farmgate", "ফার্মগেট", "khilgaon", "খিলগাঁও", "lalbagh", "লালবাগ"
    ];

    const hasOutside = outsideKeywords.some((k) => text.includes(k));
    const hasInside = insideKeywords.some((k) => text.includes(k));

    if (hasOutside && !hasInside) {
      setDeliveryArea("outside_dhaka");
    } else if (hasInside) {
      setDeliveryArea("inside_dhaka");
    }
  }

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
          deliveryArea,
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
    <div className="container-shell py-6 sm:py-10">
      <p className="text-xs font-bold tracking-[.2em] text-emerald-700 uppercase">
        Almost There
      </p>
      <h1 className="text-2xl sm:text-3xl font-black">Place your order</h1>
      <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
        Fill in your delivery details and choose your delivery location.
      </p>

      <div className="mt-6 sm:mt-8 grid items-start gap-6 lg:grid-cols-[1.25fr_1fr]">
        <form onSubmit={submit} className="panel space-y-4 sm:space-y-5">
          <h2 className="text-base sm:text-lg font-bold">Delivery information</h2>

          <div>
            <label className="label">Full name (আপনার নাম) *</label>
            <input
              required
              className="field"
              placeholder="যেমন: মোঃ আব্দুল্লাহ"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div>
            <label className="label">Mobile number (মোবাইল নম্বর) *</label>
            <input
              required
              pattern="^[0-9+\\- ]{10,16}$"
              className="field"
              placeholder="01XXXXXXXXX"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>

          {/* Auto Delivery Area Selector */}
          <div>
            <label className="label">Delivery Area (ডেলিভারি এরিয়া নির্বাচন করুন) *</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 mt-1.5">
              {/* Inside Dhaka */}
              <div
                onClick={() => {
                  setDeliveryArea("inside_dhaka");
                  setManualAreaSelect(true);
                }}
                className={`relative flex items-center justify-between p-3 sm:p-3.5 rounded-xl sm:rounded-2xl border-2 cursor-pointer transition ${
                  deliveryArea === "inside_dhaka"
                    ? "border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-100 shadow-sm"
                    : "border-border hover:bg-muted/40"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <MapPin size={18} className="text-emerald-600 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-bold truncate">ঢাকার ভিতরে (Inside Dhaka)</p>
                    <p className="text-[11px] text-muted-foreground">হোম ডেলিভারি চার্জ: ৳৬০</p>
                  </div>
                </div>
                {deliveryArea === "inside_dhaka" && (
                  <CheckCircle2 size={18} className="text-emerald-600 shrink-0 ml-2" />
                )}
              </div>

              {/* Outside Dhaka */}
              <div
                onClick={() => {
                  setDeliveryArea("outside_dhaka");
                  setManualAreaSelect(true);
                }}
                className={`relative flex items-center justify-between p-3 sm:p-3.5 rounded-xl sm:rounded-2xl border-2 cursor-pointer transition ${
                  deliveryArea === "outside_dhaka"
                    ? "border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-100 shadow-sm"
                    : "border-border hover:bg-muted/40"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Truck size={18} className="text-emerald-600 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-bold truncate">ঢাকার বাইরে (Outside Dhaka)</p>
                    <p className="text-[11px] text-muted-foreground">হোম ডেলিভারি চার্জ: ৳১২০</p>
                  </div>
                </div>
                {deliveryArea === "outside_dhaka" && (
                  <CheckCircle2 size={18} className="text-emerald-600 shrink-0 ml-2" />
                )}
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground mt-2">
              💡 ঠিকানা লিখলে স্বয়ংক্রিয়ভাবে ঢাকার ভিতরে বা বাইরে ডেলিভারি চার্জ সিলেক্ট হয়ে যাবে।
            </p>
          </div>

          <div>
            <label className="label">Delivery address (সম্পূর্ণ ঠিকানা) *</label>
            <textarea
              required
              rows={3}
              className="field"
              placeholder="বাড়ি নং, রোড নং, এলাকা, থানা, জেলা (যেমন: ধানমন্ডি, ঢাকা অথবা চকবাজার, চট্টগ্রাম)"
              value={form.address}
              onChange={(e) => handleAddressChange(e.target.value)}
            />
          </div>

          <div>
            <label className="label">Order note (ঐচ্ছিক মন্তব্য)</label>
            <textarea
              rows={2}
              className="field"
              placeholder="ডেলিভারির ব্যাপারে বিশেষ কোনো নির্দেশনা থাকলে লিখুন..."
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
            />
          </div>

          <div className="rounded-xl bg-emerald-50 p-3.5 sm:p-4 text-emerald-950 dark:bg-emerald-950/40 dark:text-emerald-100">
            <b className="text-xs sm:text-sm">ক্যাশ অন ডেলিভারি (Cash on Delivery)</b>
            <p className="mt-1 text-xs text-emerald-900/80 dark:text-emerald-200/80 leading-relaxed">
              পণ্য হাতে পেয়ে দেখে মূল্য পরিশোধ করুন। কোনোরূপ অগ্রিম পেমেন্টের প্রয়োজন নেই।
            </p>
          </div>

          <button
            disabled={busy || !items.length}
            className="btn-primary w-full disabled:opacity-50 py-3 text-sm font-bold"
          >
            {busy
              ? "Placing order…"
              : `অর্ডার নিশ্চিত করুন · ${money(subtotal + delivery)}`}
          </button>
        </form>

        <aside className="panel sticky top-20">
          <div className="flex justify-between items-center border-b pb-3">
            <h2 className="text-base sm:text-lg font-bold">Your basket</h2>
            <span className="rounded-full bg-emerald-50 px-2.5 sm:px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
              {items.length} items
            </span>
          </div>

          {!items.length ? (
            <div className="py-10 text-center text-sm text-muted-foreground">
              Your basket is empty.
              <Link
                href="/#products"
                className="mt-3 block font-bold text-emerald-700 hover:underline"
              >
                Browse products
              </Link>
            </div>
          ) : (
            <div className="mt-4 space-y-3 max-h-60 sm:max-h-72 overflow-y-auto pr-1">
              {items.map((i) => (
                <div
                  key={i.product._id}
                  className="flex justify-between items-center gap-3 text-xs sm:text-sm border-b pb-2 last:border-0"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-foreground truncate">{i.product.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {money(i.product.price)} × {i.quantity} {i.product.unit}
                    </p>
                  </div>
                  <b className="text-xs sm:text-sm shrink-0">{money(i.product.price * i.quantity)}</b>
                </div>
              ))}
            </div>
          )}

          <div className="mt-5 space-y-2.5 sm:space-y-3 border-t pt-4 text-xs sm:text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <b>{money(subtotal)}</b>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <span className="text-muted-foreground">Delivery charge</span>
                <span className="block text-[10px] text-emerald-700 font-semibold">
                  ({deliveryArea === "outside_dhaka" ? "ঢাকার বাইরে" : "ঢাকার ভিতরে"})
                </span>
              </div>
              <b>
                {delivery ? (
                  money(delivery)
                ) : subtotal ? (
                  <span className="text-emerald-700 font-bold">Free</span>
                ) : (
                  "—"
                )}
              </b>
            </div>

            <div className="flex justify-between border-t pt-3 text-sm sm:text-base font-black">
              <span>Total</span>
              <span className="text-emerald-800 dark:text-emerald-400">
                {money(subtotal + delivery)}
              </span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
