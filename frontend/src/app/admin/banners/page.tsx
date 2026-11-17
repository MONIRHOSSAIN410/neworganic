"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Trash2, Pencil, X, Upload, CheckCircle2, XCircle } from "lucide-react";
import { api } from "@/lib/api";
import type { Banner } from "@/lib/types";
import { toast } from "sonner";

const blankBanner = {
  title: "",
  subtitle: "SPECIAL OFFER",
  accent: "Delivered Fresh",
  copy: "Shop honest ingredients, organic pantry essentials and everyday goodness for your family.",
  image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=900",
  link: "#products",
  bgGradient: "from-[#f1f7e9] to-[#e4efd5]",
  isActive: true,
  order: 0,
};

const gradients = [
  { label: "Soft Green (ডিফল্ট সবুজ)", value: "from-[#f1f7e9] to-[#e4efd5]" },
  { label: "Fresh Mint (তাজা পুদিনা)", value: "from-[#edf7ee] to-[#dcefe0]" },
  { label: "Warm Honey (উষ্ণ সোনালী)", value: "from-[#f5f4e7] to-[#e9edcf]" },
  { label: "Golden Sun (উজ্জ্বল হলুদ)", value: "from-[#fef9c3] to-[#fef08a]" },
  { label: "Light Emerald (হালকা পান্না)", value: "from-[#ecfdf5] to-[#d1fae5]" },
];

export default function BannersAdmin() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [form, setForm] = useState<any>(blankBanner);
  const [editing, setEditing] = useState<string | null>(null);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);

  const token = () => localStorage.getItem("gb-token") || "";

  async function load() {
    try {
      setLoading(true);
      const data = await api<Banner[]>("/banners/all", {}, token());
      setBanners(data);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not load banners");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!token()) {
      location.href = "/admin/login";
      return;
    }
    load();
  }, []);

  function start(b?: Banner) {
    if (b) {
      setEditing(b._id);
      setForm({
        title: b.title || "",
        subtitle: b.subtitle || "SPECIAL OFFER",
        accent: b.accent || "",
        copy: b.copy || "",
        image: b.image || "",
        link: b.link || "#products",
        bgGradient: b.bgGradient || "from-[#f1f7e9] to-[#e4efd5]",
        isActive: b.isActive ?? true,
        order: b.order ?? 0,
      });
    } else {
      setEditing(null);
      setForm(blankBanner);
    }
    setShow(true);
  }

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      toast.error("Image size should be less than 3MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev: any) => ({ ...prev, image: reader.result as string }));
    };
    reader.readAsDataURL(file);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return toast.error("Banner title is required");

    try {
      const body = {
        ...form,
        order: Number(form.order) || 0,
      };

      await api(
        `/banners${editing ? `/${editing}` : ""}`,
        {
          method: editing ? "PATCH" : "POST",
          body: JSON.stringify(body),
        },
        token()
      );

      toast.success(editing ? "Banner updated successfully" : "Banner created successfully");
      setShow(false);
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    }
  }

  async function del(id: string) {
    if (!confirm("Are you sure you want to delete this banner?")) return;
    try {
      await api(`/banners/${id}`, { method: "DELETE" }, token());
      toast.success("Banner deleted successfully");
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Delete failed");
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold tracking-widest text-emerald-700">HOMEPAGE</p>
          <h1 className="text-3xl font-black">Banners & Sliders</h1>
          <p className="text-sm text-muted-foreground">
            Add and manage promotional banners displayed on the home page.
          </p>
        </div>
        <button onClick={() => start()} className="btn-primary">
          <Plus size={16} className="shrink-0" /> Add new banner
        </button>
      </div>

      {show && (
        <form onSubmit={save} className="panel mb-8 border-2 border-emerald-500/20 shadow-md">
          <div className="mb-5 flex justify-between items-center border-b pb-3">
            <h2 className="text-lg font-bold text-foreground">
              {editing ? "Edit Banner" : "Add New Promotional Banner"}
            </h2>
            <button
              type="button"
              onClick={() => setShow(false)}
              className="p-1 rounded-lg hover:bg-muted text-muted-foreground"
            >
              <X size={18} className="shrink-0" />
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Banner Title (ব্যানারের শিরোনাম) *</label>
              <input
                required
                className="field"
                placeholder="যেমন: Nature's best, বা তাজা সবজি"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>

            <div>
              <label className="label">Accent Text (হাইলাইট টেক্সট)</label>
              <input
                className="field"
                placeholder="যেমন: delivered fresh বা ২০% ছাড়"
                value={form.accent}
                onChange={(e) => setForm({ ...form, accent: e.target.value })}
              />
            </div>

            <div>
              <label className="label">Eyebrow / Subtitle (ছোট শিরোনাম)</label>
              <input
                className="field"
                placeholder="যেমন: GOOD FOOD, GOOD MOOD"
                value={form.subtitle}
                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
              />
            </div>

            <div>
              <label className="label">Button Link (ক্লিক করলে যেখানে যাবে)</label>
              <input
                className="field"
                placeholder="#products বা /products"
                value={form.link}
                onChange={(e) => setForm({ ...form, link: e.target.value })}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="label">Description / Subtext (বিস্তারিত লেখা)</label>
              <textarea
                rows={2}
                className="field"
                placeholder="Shop honest ingredients, organic pantry essentials..."
                value={form.copy}
                onChange={(e) => setForm({ ...form, copy: e.target.value })}
              />
            </div>

            {/* Banner Background Gradient */}
            <div>
              <label className="label">Background Theme (ব্যাকগ্রাউন্ড কালার)</label>
              <select
                className="field"
                value={form.bgGradient}
                onChange={(e) => setForm({ ...form, bgGradient: e.target.value })}
              >
                {gradients.map((g) => (
                  <option key={g.value} value={g.value}>
                    {g.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Display Order */}
            <div>
              <label className="label">Display Order (সিরিয়াল নম্বর)</label>
              <input
                type="number"
                className="field"
                placeholder="0, 1, 2..."
                value={form.order}
                onChange={(e) => setForm({ ...form, order: e.target.value })}
              />
            </div>

            {/* Image Upload / URL */}
            <div className="sm:col-span-2">
              <label className="label mb-1 block">Banner Image (ব্যানার ছবি - ঐচ্ছিক)</label>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <label className="flex flex-1 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-emerald-600/30 p-4 cursor-pointer hover:bg-muted/50 transition">
                  <Upload size={18} className="text-emerald-700 shrink-0" />
                  <span className="text-sm font-semibold text-emerald-800 dark:text-emerald-400">
                    Upload image from computer
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
                {form.image && (
                  <div className="relative group shrink-0">
                    <div className="relative h-20 w-32 overflow-hidden rounded-xl border shadow-sm">
                      <Image
                        src={form.image}
                        alt="Banner Preview"
                        fill
                        unoptimized
                        referrerPolicy="no-referrer"
                        className="object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, image: "" })}
                      className="absolute -top-1.5 -right-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 shadow transition flex items-center justify-center cursor-pointer"
                      title="Remove image (ছবি মুছে ফেলুন)"
                    >
                      <Trash2 size={12} className="shrink-0" />
                    </button>
                  </div>
                )}
              </div>
              {form.image && (
                <button
                  type="button"
                  onClick={() => setForm({ ...form, image: "" })}
                  className="mt-1.5 inline-flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700 cursor-pointer"
                >
                  <Trash2 size={12} className="shrink-0" />
                  <span>Remove Image (ছবি ডিলিট করুন)</span>
                </button>
              )}
              <input
                type="text"
                placeholder="অথবা ইমেজের সরাসরি লিঙ্ক (URL) পেস্ট করুন"
                className="field mt-2"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="rounded h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                />
                ব্যানারটি সক্রিয় রাখুন (Show on Home Page)
              </label>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button type="submit" className="btn-primary">
              {editing ? "Save changes" : "Create banner"}
            </button>
            <button
              type="button"
              onClick={() => setShow(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Banner List */}
      <div className="space-y-4">
        {loading ? (
          <div className="panel py-10 text-center text-sm text-muted-foreground">
            Loading banners...
          </div>
        ) : !banners.length ? (
          <div className="panel py-12 text-center text-sm text-muted-foreground">
            <p className="font-semibold text-base mb-2">No custom banners added yet.</p>
            <p className="text-xs mb-4">Default store banners are currently active on homepage.</p>
            <button onClick={() => start()} className="btn-primary mx-auto">
              <Plus size={16} className="shrink-0" /> Add your first banner
            </button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {banners.map((b) => (
              <div
                key={b._id}
                className="rounded-2xl border bg-card p-4 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className={`relative h-32 w-full overflow-hidden rounded-xl bg-gradient-to-r ${b.bgGradient || "from-[#f1f7e9] to-[#e4efd5]"} p-3 mb-3 flex items-center`}>
                    {b.image && (
                      <div className="absolute right-2 bottom-0 h-24 w-28 opacity-90 overflow-hidden rounded-lg">
                        <Image
                          src={b.image}
                          alt={b.title}
                          fill
                          unoptimized
                          referrerPolicy="no-referrer"
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="relative z-10 max-w-[65%]">
                      <span className="text-[9px] font-bold tracking-wider uppercase text-emerald-800 bg-white/70 px-1.5 py-0.5 rounded">
                        {b.subtitle || "OFFER"}
                      </span>
                      <h4 className="mt-1 font-black text-sm text-slate-900 leading-tight">
                        {b.title}
                      </h4>
                      {b.accent && (
                        <p className="text-xs font-bold text-emerald-700">{b.accent}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Order:</span>
                      <b>{b.order ?? 0}</b>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <span className={`inline-flex items-center gap-1 font-bold ${b.isActive ? "text-emerald-600" : "text-amber-600"}`}>
                        {b.isActive ? <CheckCircle2 size={13} className="shrink-0" /> : <XCircle size={13} className="shrink-0" />}
                        {b.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    {b.copy && (
                      <p className="text-[11px] text-muted-foreground line-clamp-2 pt-1 border-t">
                        {b.copy}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex gap-2 border-t pt-3">
                  <button
                    onClick={() => start(b)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border py-1.5 text-xs font-semibold hover:bg-muted transition"
                  >
                    <Pencil size={13} className="shrink-0" /> Edit
                  </button>
                  <button
                    onClick={() => del(b._id)}
                    className="inline-flex items-center justify-center rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition"
                  >
                    <Trash2 size={13} className="shrink-0" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
