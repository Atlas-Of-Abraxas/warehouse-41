"use client";

import { useEffect, useState } from "react";
import { formatPrice, CATEGORIES, CONDITIONS, PRODUCT_TYPES, SOLD_OUT_DISPLAY_HOURS } from "@/lib/utils";
import { Pencil, Trash2, Plus, X, Upload } from "lucide-react";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  featured: boolean;
  archived: boolean;
  image: string;
  images: string[];
  sku: string | null;
  productType: string;
  lotSize: number | null;
  condition: string | null;
  era: string | null;
  tags: string[];
  weight: number | null;
  tcgPlayerProductId: string | null;
  soldOutAt: string | null;
}

type ProductInput = Omit<Product, "id" | "soldOutAt">;

function storefrontStatus(p: Product): { label: string; cls: string } {
  if (p.archived) return { label: "Archived", cls: "text-[var(--color-text-muted)]" };
  if (p.stock > 0) return { label: "Live", cls: "text-green-400" };
  if (p.soldOutAt) {
    const ageH = (Date.now() - new Date(p.soldOutAt).getTime()) / 3_600_000;
    if (ageH < SOLD_OUT_DISPLAY_HOURS) return { label: `Sold out · ${Math.ceil(SOLD_OUT_DISPLAY_HOURS - ageH)}h left`, cls: "text-red-400" };
    return { label: "Hidden (sold)", cls: "text-[var(--color-text-muted)]" };
  }
  return { label: "Hidden (no stock)", cls: "text-[var(--color-text-muted)]" };
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { fetchProducts(); }, []);

  async function fetchProducts() {
    const res = await fetch("/api/products");
    setProducts(await res.json());
  }

  async function handleSave(data: ProductInput) {
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
    if (!confirm("Delete this product? (Archive is usually safer.)")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    fetchProducts();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
        <h1 className="text-3xl font-bold">Manage Products</h1>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/products/import"
            className="border border-[var(--color-border)] hover:border-[var(--color-accent)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1 transition-colors"
          >
            <Upload className="w-4 h-4" /> Import CSV
          </Link>
          <button
            onClick={() => { setEditing(null); setShowForm(true); }}
            className="bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>
      </div>

      {showForm && (
        <ProductForm
          initial={editing}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditing(null); }}
        />
      )}

      <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg overflow-x-auto">
        <table className="w-full text-sm min-w-[900px]">
          <thead>
            <tr className="border-b border-[var(--color-border)]">
              <th className="text-left p-4 text-[var(--color-text-secondary)]">Name</th>
              <th className="text-left p-4 text-[var(--color-text-secondary)]">SKU</th>
              <th className="text-left p-4 text-[var(--color-text-secondary)]">Category</th>
              <th className="text-left p-4 text-[var(--color-text-secondary)]">Price</th>
              <th className="text-left p-4 text-[var(--color-text-secondary)]">Stock</th>
              <th className="text-left p-4 text-[var(--color-text-secondary)]">Status</th>
              <th className="text-right p-4 text-[var(--color-text-secondary)]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const st = storefrontStatus(p);
              return (
                <tr key={p.id} className="border-b border-[var(--color-border)] last:border-0">
                  <td className="p-4 font-medium">
                    {p.name}
                    {p.featured && <span className="ml-2 text-xs text-[var(--color-accent)]">★</span>}
                  </td>
                  <td className="p-4 text-[var(--color-text-secondary)] font-mono text-xs">{p.sku || "—"}</td>
                  <td className="p-4 text-[var(--color-text-secondary)]">{CATEGORIES[p.category] || p.category}</td>
                  <td className="p-4 text-[var(--color-gold)]">{formatPrice(p.price)}</td>
                  <td className="p-4">{p.stock}</td>
                  <td className={`p-4 ${st.cls}`}>{st.label}</td>
                  <td className="p-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => { setEditing(p); setShowForm(true); }}
                      className="text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] mr-2"
                      aria-label="Edit"
                    >
                      <Pencil className="w-4 h-4 inline" />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="text-[var(--color-text-secondary)] hover:text-red-400"
                      aria-label="Delete"
                    >
                      <Trash2 className="w-4 h-4 inline" />
                    </button>
                  </td>
                </tr>
              );
            })}
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
  onSave: (data: ProductInput) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initial?.name || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [price, setPrice] = useState(initial?.price?.toString() || "");
  const [category, setCategory] = useState(initial?.category || "MTG_SINGLES");
  const [stock, setStock] = useState(initial?.stock?.toString() || "0");
  const [featured, setFeatured] = useState(initial?.featured || false);
  const [archived, setArchived] = useState(initial?.archived || false);
  const [sku, setSku] = useState(initial?.sku || "");
  const [productType, setProductType] = useState(initial?.productType || "SINGLE");
  const [lotSize, setLotSize] = useState(initial?.lotSize?.toString() || "");
  const [condition, setCondition] = useState(initial?.condition || "");
  const [era, setEra] = useState(initial?.era || "");
  const [tagsInput, setTagsInput] = useState((initial?.tags || []).join(", "));
  const [image, setImage] = useState(initial?.image || "");
  const [imagesInput, setImagesInput] = useState((initial?.images || []).join("\n"));
  const [weight, setWeight] = useState(initial?.weight?.toString() || "");
  const [tcgPlayerProductId, setTcgPlayerProductId] = useState(initial?.tcgPlayerProductId || "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const tags = tagsInput.split(",").map((t) => t.trim()).filter(Boolean);
    const images = imagesInput.split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
    onSave({
      name,
      description,
      price: parseFloat(price),
      category,
      stock: parseInt(stock, 10),
      featured,
      archived,
      sku: sku.trim() || null,
      productType,
      lotSize: productType === "LOT" && lotSize ? parseInt(lotSize, 10) : null,
      condition: condition || null,
      era: era.trim() || null,
      tags,
      image: image.trim() || "/images/placeholder.jpg",
      images,
      weight: weight ? parseFloat(weight) : null,
      tcgPlayerProductId: tcgPlayerProductId.trim() || null,
    });
  }

  const inputClass = "w-full bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-[var(--color-text-primary)] focus:border-[var(--color-accent)] focus:outline-none";

  return (
    <form onSubmit={handleSubmit} className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">{initial ? "Edit Product" : "New Product"}</h2>
        <button type="button" onClick={onCancel} className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]" aria-label="Close">
          <X className="w-5 h-5" />
        </button>
      </div>

      <fieldset className="border border-[var(--color-border)] rounded-md p-4">
        <legend className="px-2 text-xs uppercase tracking-wider text-[var(--color-text-muted)]">Core</legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
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
            <label className="block text-sm text-[var(--color-text-secondary)] mb-1">SKU <span className="text-xs text-[var(--color-text-muted)]">(optional)</span></label>
            <input type="text" value={sku} onChange={(e) => setSku(e.target.value)} className={inputClass} placeholder="W41-KT-001" />
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
        </div>
      </fieldset>

      <fieldset className="mt-4 border border-[var(--color-border)] rounded-md p-4">
        <legend className="px-2 text-xs uppercase tracking-wider text-[var(--color-text-muted)]">Inventory detail</legend>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Type</label>
            <select value={productType} onChange={(e) => setProductType(e.target.value)} className={inputClass}>
              {Object.entries(PRODUCT_TYPES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-[var(--color-text-secondary)] mb-1">
              Lot size {productType === "LOT" ? "" : <span className="text-xs text-[var(--color-text-muted)]">(LOT only)</span>}
            </label>
            <input
              type="number"
              value={lotSize}
              onChange={(e) => setLotSize(e.target.value)}
              disabled={productType !== "LOT"}
              className={`${inputClass} disabled:opacity-50`}
              placeholder="e.g. 30"
            />
          </div>
          <div>
            <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Condition</label>
            <select value={condition} onChange={(e) => setCondition(e.target.value)} className={inputClass}>
              <option value="">— none —</option>
              {Object.entries(CONDITIONS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Era <span className="text-xs text-[var(--color-text-muted)]">(optional)</span></label>
            <input type="text" value={era} onChange={(e) => setEra(e.target.value)} className={inputClass} placeholder="Rogue Trader, 2nd Ed…" />
          </div>
          <div>
            <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Weight <span className="text-xs text-[var(--color-text-muted)]">(grams)</span></label>
            <input type="number" step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm text-[var(--color-text-secondary)] mb-1">TCGPlayer ID <span className="text-xs text-[var(--color-text-muted)]">(optional)</span></label>
            <input type="text" value={tcgPlayerProductId} onChange={(e) => setTcgPlayerProductId(e.target.value)} className={inputClass} />
          </div>
          <div className="md:col-span-3">
            <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Tags <span className="text-xs text-[var(--color-text-muted)]">(comma-separated)</span></label>
            <input type="text" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} className={inputClass} placeholder="Space Marines, OOP, Citadel metal" />
          </div>
        </div>
      </fieldset>

      <fieldset className="mt-4 border border-[var(--color-border)] rounded-md p-4">
        <legend className="px-2 text-xs uppercase tracking-wider text-[var(--color-text-muted)]">Photos</legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Primary image URL</label>
            <input type="text" value={image} onChange={(e) => setImage(e.target.value)} className={inputClass} placeholder="/uploads/foo.jpg" />
          </div>
          <div>
            <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Additional image URLs <span className="text-xs text-[var(--color-text-muted)]">(one per line)</span></label>
            <textarea value={imagesInput} onChange={(e) => setImagesInput(e.target.value)} rows={3} className={inputClass} />
          </div>
        </div>
        <p className="mt-2 text-xs text-[var(--color-text-muted)]">
          URL entry is the placeholder pending the Supabase uploader. Paste any already-hosted image URLs for now.
        </p>
      </fieldset>

      <div className="mt-4 flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
          Featured
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={archived} onChange={(e) => setArchived(e.target.checked)} />
          Archived (hide from storefront)
        </label>
      </div>

      <button type="submit" className="mt-6 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white px-6 py-2 rounded-lg font-medium transition-colors">
        {initial ? "Update Product" : "Create Product"}
      </button>
    </form>
  );
}
