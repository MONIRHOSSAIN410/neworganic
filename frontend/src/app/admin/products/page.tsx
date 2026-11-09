"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Trash2, Pencil, X, Upload } from "lucide-react";
import { api, money } from "@/lib/api";
import type { Category, Product } from "@/lib/types";
import { toast } from "sonner";

const blank = {
  name: "",
  description: "",
  category: "",
  image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600",
  price: "",
  compareAtPrice: "",
  unit: "kg",
  stock: "0",
  sku: "",
  isFeatured: false,
};

export default function ProductsAdmin() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cats, setCats] = useState<Category[]>([]);
  const [form, setForm] = useState<any>(blank);
  const [editing, setEditing] = useState<string | null>(null);
  const [show, setShow] = useState(false);

  const token = () => localStorage.getItem("gb-token") || "";

  async function load() {
    try {
      const [p, c] = await Promise.all([
        api<Product[]>("/products?limit=200"),
        api<Category[]>("/categories?all=true"),
      ]);
      setProducts(p);
      setCats(c);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not load");
    }
  }

  useEffect(() => {
    if (!token()) {
      location.href = "/admin/login";
      return;
    }
    load();
  }, []);

  function start(p?: Product) {
    setEditing(p?._id || null);
    setForm(
      p
        ? {
            name: p.name,
            description: p.description,
            category:
              typeof p.category === "object" ? p.category._id : p.category,
            image: p.image,
            price: String(p.price),
            compareAtPrice: String(p.compareAtPrice || ""),
            unit: p.unit,
            stock: String(p.stock),
            sku: p.sku || "",
            isFeatured: p.isFeatured,
          }
        : blank,
    );
    setShow(true);
  }

  // ফাইল সিলেক্ট করে Base64 কনভার্ট করার ফাংশন
  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size should be less than 2MB");
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
    try {
      const body = {
        ...form,
        price: Number(form.price),
        compareAtPrice: Number(form.compareAtPrice || 0),
        stock: Number(form.stock),
      };
      await api(
        `/products${editing ? `/${editing}` : ""}`,
        { method: editing ? "PATCH" : "POST", body: JSON.stringify(body) },
        token(),
      );
      toast.success(editing ? "Product updated" : "Product created");
      setShow(false);
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    }
  }

  async function del(id: string) {
    if (!confirm("Delete this product?")) return;
    try {
      await api(`/products/${id}`, { method: "DELETE" }, token());
      toast.success("Product deleted");
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Delete failed");
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold tracking-widest text-emerald-700">
            CATALOGUE
          </p>
          <h1 className="text-3xl font-black">Products</h1>
          <p className="text-sm text-muted-foreground">
            Add, edit and manage your store products.
          </p>
        </div>
        <button onClick={() => start()} className="btn-primary">
          <Plus size={16} /> Add product
        </button>
      </div>

      {show && (
        <form onSubmit={save} className="panel mb-6">
          <div className="mb-5 flex justify-between">
            <h2 className="font-bold">
              {editing ? "Edit product" : "Add new product"}
            </h2>
            <button type="button" onClick={() => setShow(false)}>
              <X size={18} />
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Product name</label>
              <input
                required
                className="field"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Category</label>
              <select
                required
                className="field"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                <option value="">Select category</option>
                {cats.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Image Upload Input & Preview Section */}
            <div className="sm:col-span-2">
              <label className="label mb-1 block">Product Image</label>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <label className="flex flex-1 w-full items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 p-4 cursor-pointer hover:bg-muted/50 transition">
                  <Upload size={18} className="text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">
                    Upload image from Desktop
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
                {form.image && (
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border">
                    <Image
                      src={form.image}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
              <input
                type="text"
                placeholder="Or paste image URL"
                className="field mt-2"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="label">Description</label>
              <textarea
                rows={3}
                className="field"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>

            {[
              ["Price (৳)", "price"],
              ["Compare at price (৳)", "compareAtPrice"],
              ["Unit", "unit"],
              ["Stock quantity", "stock"],
              ["SKU", "sku"],
            ].map(([label, key]) => (
              <div key={key}>
                <label className="label">{label}</label>
                <input
                  className="field"
                  required={key === "price"}
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                />
              </div>
            ))}

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(e) =>
                  setForm({ ...form, isFeatured: e.target.checked })
                }
              />{" "}
              Mark as popular / featured
            </label>
          </div>
          <button className="btn-primary mt-5">
            {editing ? "Save changes" : "Create product"}
          </button>
        </form>
      )}

      <div className="panel overflow-x-auto">
        <table className="w-full min-w-[650px] text-left text-sm">
          <thead className="text-xs text-muted-foreground">
            <tr>
              <th className="pb-4">Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-t">
                <td className="py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-11 w-11 overflow-hidden rounded-lg bg-muted">
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <b>{p.name}</b>
                  </div>
                </td>
                <td>
                  {typeof p.category === "object" ? p.category.name : "—"}
                </td>
                <td>{money(p.price)}</td>
                <td>{p.stock}</td>
                <td>
                  <div className="flex gap-2">
                    <button onClick={() => start(p)} className="icon-button">
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => del(p._id)}
                      className="icon-button text-red-500"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!products.length && (
          <p className="py-10 text-center text-sm text-muted-foreground">
            No products yet. Add your first product.
          </p>
        )}
      </div>
    </div>
  );
}