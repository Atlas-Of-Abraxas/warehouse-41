"use client";

import * as Sentry from "@sentry/nextjs";
import Link from "next/link";
import { useEffect } from "react";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0f] text-[#e8e8ed] px-6">
        <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
        <p className="text-[#a0a0a8] mb-6 text-center max-w-md">
          An unexpected error occurred. You can try again or return home.
        </p>
        <Link
          href="/"
          className="text-[#c9a227] hover:underline font-medium"
        >
          Back to Warehouse 41
        </Link>
      </body>
    </html>
  );
}
