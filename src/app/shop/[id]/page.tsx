import { prisma, dbQuery } from "@/lib/db";
import { formatPrice, CATEGORIES } from "@/lib/utils";
import { ShoppingBag, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import AddToCartButton from "./AddToCartButton";
import CartLink from "@/components/shop/CartLink";

export const dynamic = "force-dynamic";

const PLACEHOLDER = "/images/placeholder.jpg";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const productResult = await dbQuery(() => prisma.product.findUnique({ where: { id } }));
  const product = productResult.ok ? productResult.data : null;

  if (!product) notFound();

  const hasImage = product.image && product.image !== PLACEHOLDER;

  return (
    <div className="max-w-6xl mx-auto px-6 md:px-10 py-12 md:py-16">
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/shop"
          className="inline-flex items-center gap-1 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to shop
        </Link>
        <CartLink />
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12">
        {/* Image */}
        <div className="aspect-square rounded-md border border-[var(--color-border)] bg-[var(--color-bg-card)] flex items-center justify-center overflow-hidden">
          {hasImage ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <ShoppingBag className="w-24 h-24 text-[var(--color-text-muted)] opacity-20" />
          )}
        </div>

        {/* Info */}
        <div>
          <p className="eyebrow">{CATEGORIES[product.category] || product.category}</p>
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl md:text-4xl text-[var(--color-text-primary)] leading-tight">
            {product.name}
          </h1>
          <p className="mt-4 text-2xl text-[var(--color-accent)]">{formatPrice(product.price)}</p>

          <p className="mt-4 text-sm">
            {product.stock > 0 ? (
              <span className="text-[var(--color-text-secondary)]">{product.stock} in stock</span>
            ) : (
              <span className="text-red-400">Out of stock</span>
            )}
          </p>

          <p className="mt-6 text-[var(--color-text-secondary)] leading-relaxed">
            {product.description}
          </p>

          <AddToCartButton
            product={{
              id: product.id,
              name: product.name,
              price: product.price,
              stock: product.stock,
              image: product.image,
            }}
          />
        </div>
      </div>
    </div>
  );
}
