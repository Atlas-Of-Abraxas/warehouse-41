import { prisma } from "@/lib/db";
import { formatPrice, CATEGORIES } from "@/lib/utils";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  const where: Record<string, unknown> = {};
  if (params.category) where.category = params.category;

  const products = await prisma.product.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-2">Shop</h1>
      <p className="text-[var(--color-text-secondary)] mb-8">
        Cards, miniatures, RPG books, paints, and accessories.
      </p>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        <a
          href="/shop"
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            !params.category
              ? "bg-[var(--color-accent)] text-white"
              : "bg-[var(--color-bg-card)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] border border-[var(--color-border)]"
          }`}
        >
          All Products
        </a>
        {Object.entries(CATEGORIES).map(([key, label]) => (
          <a
            key={key}
            href={`/shop?category=${key}`}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              params.category === key
                ? "bg-[var(--color-accent)] text-white"
                : "bg-[var(--color-bg-card)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] border border-[var(--color-border)]"
            }`}
          >
            {label}
          </a>
        ))}
      </div>

      {/* Product Grid */}
      {products.length === 0 ? (
        <div className="text-center py-16 text-[var(--color-text-secondary)]">
          <ShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg">No products found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/shop/${product.id}`}
              className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg overflow-hidden hover:border-[var(--color-accent)] transition-colors group"
            >
              <div className="aspect-square bg-[var(--color-bg-secondary)] flex items-center justify-center">
                <ShoppingBag className="w-12 h-12 text-[var(--color-text-secondary)] opacity-20" />
              </div>
              <div className="p-4">
                <span className="text-xs text-[var(--color-accent)]">
                  {CATEGORIES[product.category] || product.category}
                </span>
                <h3 className="font-semibold mt-1 group-hover:text-[var(--color-accent)] transition-colors line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-sm text-[var(--color-text-secondary)] mt-1 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-[var(--color-gold)] font-bold">
                    {formatPrice(product.price)}
                  </span>
                  <span className={`text-xs ${product.stock > 0 ? "text-green-400" : "text-red-400"}`}>
                    {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
