import { createAdminClient } from "@/utils/supabase/admin";
import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp"]);
const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

/**
 * Admin-only image upload. Gated by /api/admin/* middleware (must be a
 * logged-in admin and same-origin). Writes to Supabase Storage using the
 * server-side service role key.
 *
 * Request: multipart/form-data with a single "file" field.
 *          Optional "folder" field (default "products") so the same endpoint
 *          can serve other content types later (events, gallery, etc.).
 *
 * Response: { url, path, contentType, size }
 */
export async function POST(request: NextRequest) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Expected multipart/form-data" }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }
  if (file.size === 0) {
    return NextResponse.json({ error: "Empty file" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: `File too large (max ${MAX_BYTES / 1024 / 1024} MB)` },
      { status: 413 }
    );
  }
  if (!ALLOWED.has(file.type)) {
    return NextResponse.json(
      { error: "Only JPG, PNG, and WEBP images are allowed" },
      { status: 415 }
    );
  }

  const folder = sanitiseFolder(form.get("folder"));
  const ext = EXT[file.type];
  const path = `${folder}/${Date.now()}-${randomUUID()}.${ext}`;

  const bucket = bucketForKey(form.get("bucket"));
  if (!bucket) {
    return NextResponse.json(
      { error: "Storage bucket env var not configured" },
      { status: 500 }
    );
  }
  let supabase;
  try {
    supabase = createAdminClient();
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Supabase not configured";
    return NextResponse.json({ error: msg }, { status: 500 });
  }

  const buf = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(path, buf, {
      contentType: file.type,
      cacheControl: "31536000, immutable",
      upsert: false,
    });

  if (uploadError) {
    return NextResponse.json(
      { error: `Upload failed: ${uploadError.message}` },
      { status: 500 }
    );
  }

  const { data: pub } = supabase.storage.from(bucket).getPublicUrl(path);

  return NextResponse.json({
    url: pub.publicUrl,
    path,
    contentType: file.type,
    size: file.size,
  });
}

function sanitiseFolder(raw: FormDataEntryValue | null): string {
  if (typeof raw !== "string" || !raw) return "products";
  // Only allow simple slugs to avoid path-traversal or odd keys.
  const cleaned = raw.toLowerCase().replace(/[^a-z0-9_-]/g, "");
  return cleaned || "products";
}

/** Map a small allow-list key to the actual bucket name from env. */
function bucketForKey(raw: FormDataEntryValue | null): string | null {
  const key = typeof raw === "string" ? raw.trim().toLowerCase() : "shop";
  if (key === "content") return process.env.SUPABASE_CONTENT_BUCKET || null;
  // Default: shop catalog
  return process.env.SUPABASE_SHOP_BUCKET || null;
}
