"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Sliders, Upload, Save, CheckCircle2, Store, PhoneCall, MapPin, Facebook, Trash2, Eye } from "lucide-react";
import { api } from "@/lib/api";
import type { SiteSettings } from "@/lib/types";
import { toast } from "sonner";

export default function SettingsAdmin() {
  const [form, setForm] = useState<SiteSettings>({
    shopName: "Savory Nest",
    shopLogo: "/image/savory.jpg",
    heroImage: "",
    showHeroText: false,
    heroTitle: "Nature's best,",
    heroAccent: "delivered fresh.",
    heroSubtitle: "GOOD FOOD, GOOD MOOD",
    heroCopy: "Shop honest ingredients, organic pantry essentials and everyday goodness for your family.",
    heroLink: "#products",
    hotline: "01758749698",
    address: "Khilkhet, Dhaka 1229",
    facebookLink: "https://www.facebook.com/savorynestbd",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const token = () => localStorage.getItem("gb-token") || "";

  useEffect(() => {
    if (!token()) {
      location.href = "/admin/login";
      return;
    }
    api<SiteSettings>("/settings")
      .then((data) => {
        if (data) setForm((prev) => ({ ...prev, ...data }));
      })
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, []);

  function handleImageUpload(field: "shopLogo" | "heroImage", e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      toast.error("Image size should be less than 3MB");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, [field]: reader.result as string }));
    };
    reader.readAsDataURL(file);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await api(
        "/settings",
        {
          method: "POST",
          body: JSON.stringify(form),
        },
        token()
      );
      toast.success("Settings updated successfully! Homepage & Shop images are updated.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="panel py-12 text-center text-sm text-muted-foreground">
        Loading store settings...
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sliders size={20} className="text-emerald-700 shrink-0" />
            <p className="text-xs font-bold tracking-widest text-emerald-700 uppercase">
              Store Configuration
            </p>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">Shop & Hero Settings</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Change your shop logo, hero section image, banner texts, and contact info directly from here.
          </p>
        </div>
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="btn-primary"
        >
          <Save size={16} className="shrink-0" />
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <form onSubmit={save} className="space-y-6 max-w-4xl">
        {/* 1. Hero Section Image & Banner Content */}
        <section className="panel space-y-4 border-2 border-emerald-600/20 shadow-sm">
          <div className="border-b pb-3 flex items-center justify-between">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                🎨
              </span>
              Hero Section Image & Content (হোমপেজ ব্যানার)
            </h2>
            <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
              Live on Homepage
            </span>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="label mb-0">Hero Section Image (হিরো সেকশনের মূল ছবি)</label>
              {form.heroImage && (
                <button
                  type="button"
                  onClick={() => {
                    setForm({ ...form, heroImage: "" });
                    toast.success("Hero image removed. Click 'Save Changes' to update.");
                  }}
                  className="inline-flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700 hover:underline cursor-pointer"
                >
                  <Trash2 size={13} className="shrink-0" />
                  <span>Delete Image (ছবি ডিলিট করুন)</span>
                </button>
              )}
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <label className="flex flex-1 w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-emerald-600/30 p-4 cursor-pointer hover:bg-muted/50 transition">
                <Upload size={18} className="text-emerald-700 shrink-0" />
                <span className="text-sm font-semibold text-emerald-800 dark:text-emerald-400">
                  Upload Hero image from computer
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageUpload("heroImage", e)}
                />
              </label>
              {form.heroImage && (
                <div className="relative group shrink-0">
                  <div className="relative h-24 w-40 overflow-hidden rounded-xl border bg-muted shadow-sm">
                    <Image
                      src={form.heroImage}
                      alt="Hero Preview"
                      fill
                      unoptimized
                      referrerPolicy="no-referrer"
                      className="object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setForm({ ...form, heroImage: "" });
                      toast.success("Hero image removed. Click 'Save Changes' to update.");
                    }}
                    className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1.5 shadow-md transition flex items-center justify-center cursor-pointer"
                    title="Delete hero image (ছবি মুছে ফেলুন)"
                  >
                    <Trash2 size={13} className="shrink-0" />
                  </button>
                </div>
              )}
            </div>
            <input
              type="text"
              placeholder="অথবা সরাসরি ছবির লিঙ্ক (URL) পেস্ট করুন"
              className="field mt-2 text-xs"
              value={form.heroImage}
              onChange={(e) => setForm({ ...form, heroImage: e.target.value })}
            />
            {form.heroImage ? (
              <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 text-xs">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-foreground">
                  <input
                    type="checkbox"
                    className="rounded border-emerald-600 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                    checked={!!form.showHeroText}
                    onChange={(e) => setForm({ ...form, showHeroText: e.target.checked })}
                  />
                  <span>ব্যানার ছবির ওপর টেক্সট/শিরোনাম দেখান (Show text overlay on banner)</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setForm({ ...form, heroImage: "" });
                    toast.success("Hero image removed. Click 'Save Changes' to update.");
                  }}
                  className="inline-flex items-center gap-1 font-bold text-red-600 hover:text-red-700"
                >
                  <Trash2 size={12} className="shrink-0" /> ছবি ডিলিট করুন
                </button>
              </div>
            ) : (
              <p className="text-[11px] text-muted-foreground mt-1">
                💡 ছবি আপলোড করলে হোম পেজে সম্পূর্ণ হিরো সেকশন জুড়ে ব্যানারটি কোনো শ্যাডো ছাড়া স্পষ্টভাবে দেখা যাবে।
              </p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 pt-2 border-t">
            <div>
              <label className="label">Hero Title (মূল শিরোনাম)</label>
              <input
                className="field"
                value={form.heroTitle}
                onChange={(e) => setForm({ ...form, heroTitle: e.target.value })}
                placeholder="যেমন: Nature's best,"
              />
            </div>
            <div>
              <label className="label">Hero Accent (হাইলাইট টেক্সট)</label>
              <input
                className="field"
                value={form.heroAccent}
                onChange={(e) => setForm({ ...form, heroAccent: e.target.value })}
                placeholder="যেমন: delivered fresh."
              />
            </div>
            <div>
              <label className="label">Eyebrow / Subtitle (ছোট শিরোনাম)</label>
              <input
                className="field"
                value={form.heroSubtitle}
                onChange={(e) => setForm({ ...form, heroSubtitle: e.target.value })}
                placeholder="GOOD FOOD, GOOD MOOD"
              />
            </div>
            <div>
              <label className="label">Button Link (ক্লিক লিংক)</label>
              <input
                className="field"
                value={form.heroLink}
                onChange={(e) => setForm({ ...form, heroLink: e.target.value })}
                placeholder="#products"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Hero Description (বর্ণনা)</label>
              <textarea
                rows={2}
                className="field"
                value={form.heroCopy}
                onChange={(e) => setForm({ ...form, heroCopy: e.target.value })}
                placeholder="Shop honest ingredients, organic pantry essentials..."
              />
            </div>
          </div>
        </section>

        {/* 2. Shop Logo & Identity */}
        <section className="panel space-y-4">
          <div className="border-b pb-3">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <Store size={18} className="text-emerald-700 shrink-0" />
              Shop Logo & Identity (দোকানের লোগো ও নাম)
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 items-center">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="label mb-0">Shop Logo Image (লোগো ছবি পরিবর্তন)</label>
                {form.shopLogo && form.shopLogo !== "/image/savory.jpg" && (
                  <button
                    type="button"
                    onClick={() => {
                      setForm({ ...form, shopLogo: "/image/savory.jpg" });
                      toast.success("Logo reset to default. Click 'Save Changes' to update.");
                    }}
                    className="inline-flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700 hover:underline cursor-pointer"
                  >
                    <Trash2 size={12} className="shrink-0" />
                    <span>Reset Logo (লোগো রিসেট)</span>
                  </button>
                )}
              </div>
              <div className="flex items-center gap-3">
                <label className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-dashed border-emerald-600/30 p-3.5 cursor-pointer hover:bg-muted/50 transition">
                  <Upload size={16} className="text-emerald-700 shrink-0" />
                  <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-400">
                    Upload new shop logo
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload("shopLogo", e)}
                  />
                </label>
                {form.shopLogo && (
                  <div className="relative group shrink-0">
                    <div className="relative h-14 w-14 overflow-hidden rounded-full border-2 border-emerald-500/40 bg-muted shadow-md">
                      <Image
                        src={form.shopLogo}
                        alt="Shop Logo Preview"
                        fill
                        unoptimized
                        referrerPolicy="no-referrer"
                        className="object-cover"
                      />
                    </div>
                    {form.shopLogo !== "/image/savory.jpg" && (
                      <button
                        type="button"
                        onClick={() => {
                          setForm({ ...form, shopLogo: "/image/savory.jpg" });
                          toast.success("Logo reset to default. Click 'Save Changes' to update.");
                        }}
                        className="absolute -top-1 -right-1 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 shadow transition flex items-center justify-center cursor-pointer"
                        title="Reset logo"
                      >
                        <Trash2 size={11} className="shrink-0" />
                      </button>
                    )}
                  </div>
                )}
              </div>
              <input
                type="text"
                placeholder="অথবা লোগোর সরাসরি URL পেস্ট করুন"
                className="field mt-2 text-xs"
                value={form.shopLogo}
                onChange={(e) => setForm({ ...form, shopLogo: e.target.value })}
              />
            </div>

            <div>
              <label className="label">Shop Name (দোকানের নাম)</label>
              <input
                className="field"
                value={form.shopName}
                onChange={(e) => setForm({ ...form, shopName: e.target.value })}
                placeholder="Savory Nest"
              />
            </div>
          </div>
        </section>

        {/* 3. Contact & Social Info */}
        <section className="panel space-y-4">
          <div className="border-b pb-3">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <PhoneCall size={18} className="text-emerald-700 shrink-0" />
              Contact & Social Info (যোগাযোগ ও ফেসবুক লিংক)
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="label flex items-center gap-1.5">
                <PhoneCall size={13} className="text-emerald-700 shrink-0" />
                Hotline (হটলাইন)
              </label>
              <input
                className="field"
                value={form.hotline}
                onChange={(e) => setForm({ ...form, hotline: e.target.value })}
                placeholder="01758749698"
              />
            </div>

            <div>
              <label className="label flex items-center gap-1.5">
                <MapPin size={13} className="text-emerald-700 shrink-0" />
                Address (ঠিকানা)
              </label>
              <input
                className="field"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="Khilkhet, Dhaka 1229"
              />
            </div>

            <div>
              <label className="label flex items-center gap-1.5">
                <Facebook size={13} className="text-[#1877F2] shrink-0" />
                Facebook Link
              </label>
              <input
                className="field"
                value={form.facebookLink}
                onChange={(e) => setForm({ ...form, facebookLink: e.target.value })}
                placeholder="https://www.facebook.com/savorynestbd"
              />
            </div>
          </div>
        </section>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary py-3 px-8 text-sm font-bold shadow-md"
          >
            <CheckCircle2 size={16} className="shrink-0" />
            {saving ? "Saving changes..." : "Save All Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
