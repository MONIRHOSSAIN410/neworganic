"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Trash2, Pencil, Tags, Tag, FolderPlus, Upload, X } from "lucide-react";
import { api } from "@/lib/api";
import type { Category } from "@/lib/types";
import { toast } from "sonner";

export default function CategoriesAdmin() {
  const [cats, setCats] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const token = () => localStorage.getItem("gb-token") || "";

  async function load() {
    try {
      setCats(await api<Category[]>("/categories?all=true"));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not load categories");
    }
  }

  useEffect(() => {
    if (!token()) {
      location.href = "/admin/login";
      return;
    }
    load();
  }, []);

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size should be less than 2MB");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    try {
      await api(
        `/categories${editing ? `/${editing}` : ""}`,
        {
          method: editing ? "PATCH" : "POST",
          body: JSON.stringify({ name, description, image }),
        },
        token(),
      );
      toast.success(editing ? "Category updated successfully" : "Category created successfully");
      setName("");
      setDescription("");
      setImage("");
      setEditing(null);
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    }
  }

  async function del(id: string) {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      await api(`/categories/${id}`, { method: "DELETE" }, token());
      toast.success("Category deleted");
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Delete failed");
    }
  }

  return (
    <div>
      <div className="flex items-center gap-2.5 mb-1">
        <Tags size={24} className="text-emerald-700 shrink-0" />
        <p className="text-xs font-bold tracking-widest text-emerald-700 uppercase">
          Catalogue Organization
        </p>
      </div>
      <h1 className="text-2xl sm:text-3xl font-black">Categories</h1>
      <p className="mb-6 text-xs sm:text-sm text-muted-foreground">
        Create, organize and manage product categories with icons and images.
      </p>

      <div className="grid gap-6 lg:grid-cols-[.9fr_1.1fr] items-start">
        {/* Form Card */}
        <form onSubmit={save} className="panel h-fit space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h2 className="font-bold flex items-center gap-2 text-base">
              <FolderPlus size={18} className="text-emerald-700 shrink-0" />
              {editing ? "Edit Category" : "Add New Category"}
            </h2>
            {editing && (
              <button
                type="button"
                onClick={() => {
                  setEditing(null);
                  setName("");
                  setDescription("");
                  setImage("");
                }}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                <X size={14} className="shrink-0" /> Cancel edit
              </button>
            )}
          </div>

          <div>
            <label className="label">Category name (ক্যাটাগরির নাম) *</label>
            <div className="relative">
              <Tag size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground shrink-0 pointer-events-none" />
              <input
                required
                className="field !pl-10"
                style={{ paddingLeft: "40px" }}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="যেমন: Organic Spices, Fresh Fruits"
              />
            </div>
          </div>

          <div>
            <label className="label">Description (বিবরণ - ঐচ্ছিক)</label>
            <textarea
              className="field"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="ক্যাটাগরি সম্পর্কে সংক্ষিপ্ত বিবরণ..."
            />
          </div>

          {/* Category Icon / Image */}
          <div>
            <label className="label">Category Icon / Image (আইকন বা ছবি)</label>
            <div className="flex items-center gap-3">
              <label className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-dashed border-emerald-600/30 p-3 cursor-pointer hover:bg-muted/50 transition">
                <Upload size={16} className="text-emerald-700 shrink-0" />
                <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-400">
                  Upload icon / image
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
              {image && (
                <div className="relative group shrink-0">
                  <div className="relative h-12 w-12 overflow-hidden rounded-xl border bg-muted shadow-sm">
                    <Image
                      src={image}
                      alt="Category Icon Preview"
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setImage("")}
                    className="absolute -top-1.5 -right-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 shadow transition flex items-center justify-center cursor-pointer"
                    title="Remove category icon"
                  >
                    <Trash2 size={10} className="shrink-0" />
                  </button>
                </div>
              )}
            </div>
            {image && (
              <button
                type="button"
                onClick={() => setImage("")}
                className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700 cursor-pointer"
              >
                <Trash2 size={11} className="shrink-0" />
                <span>Remove Icon / Image (ছবি মুছে ফেলুন)</span>
              </button>
            )}
            <input
              type="text"
              placeholder="অথবা সরাসরি ছবির লিঙ্ক (URL) পেস্ট করুন"
              className="field mt-2 text-xs"
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
          </div>

          <div className="pt-2">
            <button className="btn-primary w-full py-2.5">
              <Plus size={16} className="shrink-0" />
              {editing ? "Update Category" : "Save Category"}
            </button>
          </div>
        </form>

        {/* Categories List */}
        <div className="panel">
          <div className="flex items-center justify-between border-b pb-3 mb-4">
            <h2 className="font-bold text-base flex items-center gap-2">
              <Tags size={18} className="text-emerald-700 shrink-0" />
              All Categories
            </h2>
            <span className="text-xs font-bold rounded-full bg-emerald-50 px-2.5 py-0.5 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
              {cats.length} Total
            </span>
          </div>

          {!cats.length ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              No categories created yet.
            </p>
          ) : (
            <div className="divide-y max-h-[500px] overflow-y-auto pr-1">
              {cats.map((c) => (
                <div
                  key={c._id}
                  className="flex items-center justify-between gap-3 py-3.5 first:pt-0 last:pb-0"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {c.image ? (
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl border bg-muted shadow-sm">
                        <Image
                          src={c.image}
                          alt={c.name}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/50">
                        <Tag size={18} className="shrink-0" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <b className="text-sm block truncate text-foreground">{c.name}</b>
                      <p className="text-xs text-muted-foreground truncate">
                        {c.description || "No description"}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-1.5 shrink-0">
                    <button
                      className="icon-button"
                      aria-label="Edit category"
                      onClick={() => {
                        setEditing(c._id);
                        setName(c.name);
                        setDescription(c.description || "");
                        setImage(c.image || "");
                      }}
                    >
                      <Pencil size={14} className="shrink-0 text-emerald-700" />
                    </button>
                    <button
                      className="icon-button text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                      aria-label="Delete category"
                      onClick={() => del(c._id)}
                    >
                      <Trash2 size={14} className="shrink-0" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
