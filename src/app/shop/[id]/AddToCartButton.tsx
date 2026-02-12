"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  image: string;
}

export default function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart();

  return (
    <button
      onClick={() =>
        addItem({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1,
        })
      }
      disabled={product.stock === 0}
      className="mt-8 w-full bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
    >
      <ShoppingCart className="w-5 h-5" />
      {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
    </button>
  );
}
