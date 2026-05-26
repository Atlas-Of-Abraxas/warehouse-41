import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type Variant = "primary" | "solid" | "quiet";

const base =
  "inline-flex items-center justify-center gap-2 text-sm font-medium rounded-sm transition-colors";

const variants: Record<Variant, string> = {
  primary:
    "px-5 py-2.5 border border-[var(--color-accent)] text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-[var(--color-bg-primary)]",
  solid:
    "px-5 py-2.5 bg-[var(--color-accent)] text-[var(--color-bg-primary)] hover:bg-[var(--color-accent-hover)]",
  quiet:
    "px-5 py-2.5 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] underline underline-offset-4 decoration-[var(--color-border-bright)] hover:decoration-[var(--color-accent)]",
};

type CommonProps = { variant?: Variant; className?: string; children: ReactNode };

export function ButtonLink({
  href,
  variant = "primary",
  className = "",
  children,
  ...rest
}: CommonProps & { href: string } & Omit<ComponentPropsWithoutRef<typeof Link>, "href" | "className">) {
  return (
    <Link href={href} className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </Link>
  );
}

export function Button({
  variant = "primary",
  className = "",
  children,
  ...rest
}: CommonProps & ComponentPropsWithoutRef<"button">) {
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
}
