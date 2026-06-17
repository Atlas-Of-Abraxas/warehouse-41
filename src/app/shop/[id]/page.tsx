import { prisma, dbQuery } from "@/lib/db";
import { formatPrice, CATEGORIES, CONDITIONS, SOLD_OUT_DISPLAY_HOURS } from "@/lib/utils";
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
  if (product.archived) notFound();

  // After the 12h sold-out window, the page disappears from the storefront.
  if (product.stock <= 0 && product.soldOutAt) {
    const ageMs = Date.now() - new Date(product.soldOutAt).getTime();
    if (ageMs > SOLD_OUT_DISPLAY_HOURS * 60 * 60 * 1000) notFound();
  }

  const hasImage = product.image && product.image !== PLACEHOLDER;
  const soldOut = product.stock <= 0;

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

          {/* Inventory metadata */}
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm text-[var(--color-text-secondary)]">
            {product.condition && (
              <span>
                <span className="text-[var(--color-text-muted)]">Condition:</span>{" "}
                <span className="text-[var(--color-text-primary)]">
                  {CONDITIONS[product.condition] || product.condition}
                </span>
              </span>
            )}
            {product.productType === "LOT" && product.lotSize && (
              <span>
                <span className="text-[var(--color-text-muted)]">Lot of:</span>{" "}
                <span className="text-[var(--color-text-primary)]">{product.lotSize}</span>
              </span>
            )}
            {product.era && (
              <span>
                <span className="text-[var(--color-text-muted)]">Era:</span>{" "}
                <span className="text-[var(--color-text-primary)]">{product.era}</span>
              </span>
            )}
          </div>

          {product.tags && product.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {product.tags.map((t) => (
                <span
                  key={t}
                  className="text-xs px-2 py-0.5 rounded-sm border border-[var(--color-border)] text-[var(--color-text-secondary)]"
                >
                  {t}
                </span>
              ))}
            </div>
          )}

          <p className="mt-4 text-sm">
            {soldOut ? (
              <span className="text-red-400 font-medium">Sold out</span>
            ) : (
              <span className="text-[var(--color-text-secondary)]">{product.stock} in stock</span>
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
