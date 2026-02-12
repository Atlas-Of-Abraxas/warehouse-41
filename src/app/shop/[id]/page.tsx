import { prisma } from "@/lib/db";
import { formatPrice, CATEGORIES } from "@/lib/utils";
import { ShoppingBag, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import AddToCartButton from "./AddToCartButton";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });

  if (!product) notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <Link
        href="/shop"
        className="inline-flex items-center gap-1 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] mb-8"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Shop
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="aspect-square bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg flex items-center justify-center">
          <ShoppingBag className="w-24 h-24 text-[var(--color-text-secondary)] opacity-20" />
        </div>

        {/* Product Info */}
        <div>
          <span className="text-sm text-[var(--color-accent)]">
            {CATEGORIES[product.category] || product.category}
          </span>
          <h1 className="text-3xl font-bold mt-2">{product.name}</h1>
          <p className="text-3xl text-[var(--color-gold)] font-bold mt-4">
            {formatPrice(product.price)}
          </p>

          <div className="mt-4">
            <span className={`text-sm ${product.stock > 0 ? "text-green-400" : "text-red-400"}`}>
              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </span>
          </div>

          <p className="text-[var(--color-text-secondary)] mt-6 leading-relaxed">
            {product.description}
          </p>

          <AddToCartButton product={product} />
        </div>
      </div>
    </div>
  );
}
