import { prisma, dbQuery } from "@/lib/db";
import { formatPrice, CATEGORIES } from "@/lib/utils";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { DbWarningBanner } from "@/components/layout/DbWarningBanner";
import { SectionHeader } from "@/components/ui/SectionHeader";
import CartLink from "@/components/shop/CartLink";

export const dynamic = "force-dynamic";

const PLACEHOLDER = "/images/placeholder.jpg";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  const where: Record<string, unknown> = {};
  if (params.category) where.category = params.category;

  const productsResult = await dbQuery(() =>
    prisma.product.findMany({ where, orderBy: { createdAt: "desc" } })
  );
  const products = productsResult.ok ? productsResult.data : [];

  return (
    <div className="max-w-6xl mx-auto px-6 md:px-10 py-16 md:py-20">
      {!productsResult.ok && <DbWarningBanner />}

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <SectionHeader eyebrow="Shop" title="Cards, minis, books & supplies." />
        <CartLink />
      </div>

      {/* Category filters */}
      <div className="mt-10 flex flex-wrap gap-2">
        <FilterPill href="/shop" active={!params.category}>
          All products
        </FilterPill>
        {Object.entries(CATEGORIES).map(([key, label]) => (
          <FilterPill key={key} href={`/shop?category=${key}`} active={params.category === key}>
            {label}
          </FilterPill>
        ))}
      </div>

      {/* Product grid */}
      {products.length === 0 ? (
        <div className="mt-16 text-center text-[var(--color-text-secondary)]">
          <ShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg">
            {productsResult.ok
              ? "No products here yet. Check back soon."
              : "The shop will populate once the database is connected."}
          </p>
        </div>
      ) : (
        <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {products.map((product) => {
            const hasImage = product.image && product.image !== PLACEHOLDER;
            return (
              <Link
                key={product.id}
                href={`/shop/${product.id}`}
                className="group rounded-md border border-[var(--color-border)] bg-[var(--color-bg-card)] overflow-hidden hover:border-[var(--color-accent)] transition-colors"
              >
                <div className="aspect-square bg-[var(--color-bg-elevated)] flex items-center justify-center overflow-hidden">
                  {hasImage ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  ) : (
                    <ShoppingBag className="w-10 h-10 text-[var(--color-text-muted)] opacity-30" />
                  )}
                </div>
                <div className="p-4">
                  <p className="eyebrow">{CATEGORIES[product.category] || product.category}</p>
                  <h3 className="mt-1 text-[var(--color-text-primary)] font-medium leading-tight line-clamp-1 group-hover:text-[var(--color-accent)] transition-colors">
                    {product.name}
                  </h3>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-[var(--color-text-primary)]">{formatPrice(product.price)}</span>
                    <span
                      className={`text-xs ${
                        product.stock > 0 ? "text-[var(--color-text-muted)]" : "text-red-400"
                      }`}
                    >
                      {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

function FilterPill({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className={`px-4 py-2 rounded-sm text-sm font-medium transition-colors ${
        active
          ? "bg-[var(--color-accent)] text-[var(--color-bg-primary)]"
          : "bg-[var(--color-bg-card)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] border border-[var(--color-border)]"
      }`}
    >
      {children}
    </a>
  );
}
