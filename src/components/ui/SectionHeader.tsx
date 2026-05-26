import Link from "next/link";

export function SectionHeader({
  eyebrow,
  title,
  link,
  align = "left",
  className = "",
}: {
  eyebrow: string;
  title: string;
  link?: { href: string; label: string };
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={`flex items-end justify-between flex-wrap gap-4 ${
        align === "center" ? "flex-col items-center text-center" : ""
      } ${className}`}
    >
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="mt-3 text-3xl md:text-4xl text-[var(--color-text-primary)] max-w-3xl">
          {title}
        </h2>
      </div>
      {link && (
        <Link
          href={link.href}
          className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-accent-hover)] underline underline-offset-4 decoration-[var(--color-border-bright)] hover:decoration-[var(--color-accent)] transition-colors"
        >
          {link.label} →
        </Link>
      )}
    </div>
  );
}
