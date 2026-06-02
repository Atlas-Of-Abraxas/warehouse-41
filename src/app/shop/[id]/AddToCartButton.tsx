"use client";

import { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
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
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <button
      onClick={handleAdd}
      disabled={product.stock === 0}
      className="mt-8 w-full bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] disabled:opacity-50 disabled:cursor-not-allowed text-[var(--color-bg-primary)] py-3 rounded-sm font-medium flex items-center justify-center gap-2 transition-colors"
    >
      {product.stock === 0 ? (
        "Out of stock"
      ) : added ? (
        <>
          <Check className="w-5 h-5" /> Added to cart
        </>
      ) : (
        <>
          <ShoppingCart className="w-5 h-5" /> Add to cart
        </>
      )}
    </button>
  );
}
