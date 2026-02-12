"use client";

import { useEffect, useState } from "react";
import { formatPrice, CATEGORIES } from "@/lib/utils";
import { Pencil, Trash2, Plus, X } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  featured: boolean;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    const res = await fetch("/api/products");
    setProducts(await res.json());
  }

  async function handleSave(data: Omit<Product, "id">) {
    if (editing) {
      await fetch(`/api/products/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } else {
      await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    }
    setEditing(null);
    setShowForm(false);
    fetchProducts();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this product?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    fetchProducts();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Manage Products</h1>
        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {showForm && (
        <ProductForm
          initial={editing}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditing(null); }}
        />
      )}

      <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border)]">
              <th className="text-left p-4 text-[var(--color-text-secondary)]">Name</th>
              <th className="text-left p-4 text-[var(--color-text-secondary)]">Category</th>
              <th className="text-left p-4 text-[var(--color-text-secondary)]">Price</th>
              <th className="text-left p-4 text-[var(--color-text-secondary)]">Stock</th>
              <th className="text-left p-4 text-[var(--color-text-secondary)]">Featured</th>
              <th className="text-right p-4 text-[var(--color-text-secondary)]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-[var(--color-border)] last:border-0">
                <td className="p-4 font-medium">{p.name}</td>
                <td className="p-4 text-[var(--color-text-secondary)]">{CATEGORIES[p.category] || p.category}</td>
                <td className="p-4 text-[var(--color-gold)]">{formatPrice(p.price)}</td>
                <td className="p-4">{p.stock}</td>
                <td className="p-4">{p.featured ? "Yes" : "No"}</td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => { setEditing(p); setShowForm(true); }}
                    className="text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] mr-2"
                  >
                    <Pencil className="w-4 h-4 inline" />
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="text-[var(--color-text-secondary)] hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4 inline" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ProductForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: Product | null;
  onSave: (data: Omit<Product, "id">) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initial?.name || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [price, setPrice] = useState(initial?.price?.toString() || "");
  const [category, setCategory] = useState(initial?.category || "MTG_SINGLES");
  const [stock, setStock] = useState(initial?.stock?.toString() || "0");
  const [featured, setFeatured] = useState(initial?.featured || false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave({
      name,
      description,
      price: parseFloat(price),
      category,
      stock: parseInt(stock),
      featured,
    });
  }

  const inputClass = "w-full bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-[var(--color-text-primary)] focus:border-[var(--color-accent)] focus:outline-none";

  return (
    <form onSubmit={handleSubmit} className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">{initial ? "Edit Product" : "New Product"}</h2>
        <button type="button" onClick={onCancel} className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Name</label>
          <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass}>
            {Object.entries(CATEGORIES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Price</label>
          <input type="number" step="0.01" required value={price} onChange={(e) => setPrice(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Stock</label>
          <input type="number" required value={stock} onChange={(e) => setStock(e.target.value)} className={inputClass} />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Description</label>
          <textarea required value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className={inputClass} />
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} id="featured" />
          <label htmlFor="featured" className="text-sm">Featured product</label>
        </div>
      </div>
      <button type="submit" className="mt-4 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white px-6 py-2 rounded-lg font-medium transition-colors">
        {initial ? "Update Product" : "Create Product"}
      </button>
    </form>
  );
}
