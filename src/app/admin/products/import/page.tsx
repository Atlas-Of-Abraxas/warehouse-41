"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Upload, FileText, AlertCircle, Check, Download } from "lucide-react";
import { CATEGORIES, CONDITIONS, PRODUCT_TYPES } from "@/lib/utils";
import { parseCsv, headerIndex, cell as readCell, multi, bool } from "@/lib/csv";

interface ParsedRow {
  line: number; // CSV line number (header = 1, first data row = 2)
  parseError?: string;
  data?: Record<string, unknown>;
}

const TEMPLATE_HEADERS = [
  "sku",
  "name",
  "description",
  "price",
  "category",
  "stock",
  "productType",
  "lotSize",
  "condition",
  "era",
  "tags",
  "weight",
  "image",
  "images",
  "featured",
  "archived",
  "tcgPlayerProductId",
];

const TEMPLATE_EXAMPLE = [
  [
    "W41-KT-0001",
    "Kill Team: Phobos Strike Team (sealed)",
    "Brand-new sealed box. 6 Space Marine Infiltrators / Incursors with full Kill Team rules.",
    "59.99",
    "KILL_TEAM",
    "3",
    "SINGLE",
    "",
    "SEALED",
    "Current",
    "Space Marines|Sealed",
    "",
    "",
    "",
    "true",
    "false",
    "",
  ],
  [
    "W41-MET-0042",
    "Citadel Metal Space Marine Captain (RT-era)",
    "Vintage Rogue Trader-era Citadel metal. Stripped, primed, ready to paint.",
    "35.00",
    "METAL_MINIATURES",
    "1",
    "SINGLE",
    "",
    "STRIPPED",
    "Rogue Trader",
    "Space Marines|OOP|Citadel metal",
    "55",
    "",
    "",
    "false",
    "false",
    "",
  ],
  [
    "W41-BITS-0117",
    "Space Marine bits — 30+ piece lot",
    "Mix of arms, legs, torsos, and shoulder pads from multiple kits. Clipped from sprues.",
    "25.00",
    "BITS",
    "1",
    "LOT",
    "30",
    "MINT",
    "",
    "Space Marines|Lot|Clipped",
    "",
    "",
    "",
    "false",
    "false",
    "",
  ],
];

function buildTemplateCsv(): string {
  const escape = (s: string) =>
    /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  const lines = [TEMPLATE_HEADERS.join(",")];
  for (const row of TEMPLATE_EXAMPLE) {
    lines.push(row.map(escape).join(","));
  }
  return lines.join("\n") + "\n";
}

function rowToProduct(row: string[], headers: Map<string, number>): { ok: true; data: Record<string, unknown> } | { ok: false; error: string } {
  const get = (k: string) => readCell(row, headers, k);

  const name = get("name");
  const description = get("description");
  const priceStr = get("price");
  const category = get("category");
  const stockStr = get("stock");

  if (!name) return { ok: false, error: "Missing name" };
  if (!description) return { ok: false, error: "Missing description" };
  if (!priceStr) return { ok: false, error: "Missing price" };
  if (!category) return { ok: false, error: "Missing category" };
  if (!stockStr) return { ok: false, error: "Missing stock" };

  const price = parseFloat(priceStr);
  if (isNaN(price)) return { ok: false, error: `Invalid price "${priceStr}"` };
  const stock = parseInt(stockStr, 10);
  if (isNaN(stock)) return { ok: false, error: `Invalid stock "${stockStr}"` };

  const productType = get("productType") || "SINGLE";
  const lotSizeStr = get("lotSize");
  const lotSize = lotSizeStr ? parseInt(lotSizeStr, 10) : null;
  if (lotSizeStr && lotSize !== null && isNaN(lotSize)) {
    return { ok: false, error: `Invalid lotSize "${lotSizeStr}"` };
  }

  const weightStr = get("weight");
  const weight = weightStr ? parseFloat(weightStr) : null;
  if (weightStr && weight !== null && isNaN(weight)) {
    return { ok: false, error: `Invalid weight "${weightStr}"` };
  }

  return {
    ok: true,
    data: {
      sku: get("sku") || null,
      name,
      description,
      price,
      category,
      stock,
      productType,
      lotSize,
      condition: get("condition") || null,
      era: get("era") || null,
      tags: multi(get("tags")),
      weight,
      image: get("image") || "",
      images: multi(get("images")),
      featured: bool(get("featured")),
      archived: bool(get("archived")),
      tcgPlayerProductId: get("tcgPlayerProductId") || null,
    },
  };
}

type ServerResult =
  | { line: number; status: "created" | "updated"; id: string; name: string }
  | { line: number; status: "error"; error: string };

interface ImportResponse {
  summary: { total: number; created: number; updated: number; errored: number };
  results: ServerResult[];
}

export default function ImportProductsPage() {
  const [csvText, setCsvText] = useState("");
  const [importing, setImporting] = useState(false);
  const [response, setResponse] = useState<ImportResponse | null>(null);
  const [networkError, setNetworkError] = useState("");

  const parsed: { rows: ParsedRow[]; headerError?: string } = useMemo(() => {
    if (!csvText.trim()) return { rows: [] };
    const raw = parseCsv(csvText);
    if (raw.length === 0) return { rows: [] };
    const headers = headerIndex(raw[0]);
    const requiredHeaders = ["name", "description", "price", "category", "stock"];
    const missing = requiredHeaders.filter((h) => !headers.has(h));
    if (missing.length > 0) {
      return { rows: [], headerError: `Missing required columns: ${missing.join(", ")}` };
    }

    const rows: ParsedRow[] = [];
    for (let i = 1; i < raw.length; i++) {
      const r = rowToProduct(raw[i], headers);
      rows.push(
        r.ok
          ? { line: i + 1, data: r.data }
          : { line: i + 1, parseError: r.error }
      );
    }
    return { rows };
  }, [csvText]);

  const validRows = parsed.rows.filter((r) => !r.parseError && r.data);
  const parseErrors = parsed.rows.filter((r) => r.parseError);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    file.text().then((t) => setCsvText(t));
  }

  function downloadTemplate() {
    const blob = new Blob([buildTemplateCsv()], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "warehouse41-products-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleImport() {
    if (validRows.length === 0) return;
    setImporting(true);
    setResponse(null);
    setNetworkError("");
    try {
      const res = await fetch("/api/admin/products/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rows: validRows.map((r) => r.data) }),
      });
      const data = (await res.json()) as ImportResponse | { error: string };
      if (!res.ok) {
        setNetworkError(("error" in data && data.error) || "Import failed");
      } else {
        setResponse(data as ImportResponse);
      }
    } catch {
      setNetworkError("Network error. Please try again.");
    } finally {
      setImporting(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <Link
        href="/admin/products"
        className="inline-flex items-center gap-1 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
      >
        <ArrowLeft className="w-4 h-4" /> Back to products
      </Link>

      <h1 className="mt-4 text-3xl font-bold">Import products from CSV</h1>
      <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
        Paste a CSV or upload a .csv file. Existing rows are matched by SKU and updated;
        new rows are created. Up to 1000 rows per import.
      </p>

      {/* Reference panel */}
      <details className="mt-6 rounded-md border border-[var(--color-border)] bg-[var(--color-bg-card)] p-4">
        <summary className="cursor-pointer text-sm font-medium text-[var(--color-text-primary)]">
          CSV format reference
        </summary>
        <div className="mt-4 space-y-3 text-sm text-[var(--color-text-secondary)]">
          <p>
            <strong className="text-[var(--color-text-primary)]">Required:</strong>{" "}
            <code>name</code>, <code>description</code>, <code>price</code>, <code>category</code>,{" "}
            <code>stock</code>.
          </p>
          <p>
            <strong className="text-[var(--color-text-primary)]">Optional:</strong>{" "}
            <code>sku</code> (upsert key), <code>productType</code> (SINGLE | LOT),{" "}
            <code>lotSize</code> (required when LOT), <code>condition</code>,{" "}
            <code>era</code>, <code>tags</code>, <code>weight</code>, <code>image</code>,{" "}
            <code>images</code>, <code>featured</code>, <code>archived</code>,{" "}
            <code>tcgPlayerProductId</code>.
          </p>
          <p>
            <strong className="text-[var(--color-text-primary)]">Multi-value cells:</strong>{" "}
            <code>tags</code> and <code>images</code> are pipe-separated, e.g.{" "}
            <code>Space Marines|OOP|Citadel metal</code>.
          </p>
          <div>
            <strong className="text-[var(--color-text-primary)]">Allowed categories:</strong>
            <div className="mt-1 flex flex-wrap gap-1">
              {Object.entries(CATEGORIES).map(([k, v]) => (
                <code key={k} className="text-xs px-2 py-0.5 rounded-sm border border-[var(--color-border)]" title={v}>
                  {k}
                </code>
              ))}
            </div>
          </div>
          <div>
            <strong className="text-[var(--color-text-primary)]">Allowed conditions:</strong>
            <div className="mt-1 flex flex-wrap gap-1">
              {Object.entries(CONDITIONS).map(([k, v]) => (
                <code key={k} className="text-xs px-2 py-0.5 rounded-sm border border-[var(--color-border)]" title={v}>
                  {k}
                </code>
              ))}
            </div>
          </div>
        </div>
      </details>

      {/* Input */}
      <div className="mt-6 flex flex-wrap gap-3 items-center">
        <label className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md border border-[var(--color-border)] hover:border-[var(--color-accent)] cursor-pointer transition-colors">
          <Upload className="w-4 h-4" /> Upload .csv
          <input type="file" accept=".csv,text/csv" onChange={handleFile} className="hidden" />
        </label>
        <button
          type="button"
          onClick={downloadTemplate}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-accent)] transition-colors"
        >
          <Download className="w-4 h-4" /> Download template
        </button>
        {csvText && (
          <button
            type="button"
            onClick={() => { setCsvText(""); setResponse(null); }}
            className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
          >
            Clear
          </button>
        )}
      </div>

      <textarea
        value={csvText}
        onChange={(e) => setCsvText(e.target.value)}
        rows={10}
        placeholder="Paste CSV content here, or upload a .csv file above."
        className="mt-4 w-full bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-md px-3 py-2 font-mono text-xs text-[var(--color-text-primary)] focus:border-[var(--color-accent)] focus:outline-none"
      />

      {/* Preview */}
      {parsed.headerError && (
        <div className="mt-4 flex items-start gap-2 rounded-md border border-red-400/30 bg-red-400/10 text-red-400 px-4 py-3 text-sm">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{parsed.headerError}</span>
        </div>
      )}

      {parsed.rows.length > 0 && !parsed.headerError && (
        <div className="mt-6">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
            <div className="text-sm text-[var(--color-text-secondary)]">
              <span className="text-[var(--color-text-primary)] font-medium">{validRows.length}</span> valid row{validRows.length === 1 ? "" : "s"}
              {parseErrors.length > 0 && (
                <>
                  ,{" "}
                  <span className="text-red-400 font-medium">{parseErrors.length}</span> parse error{parseErrors.length === 1 ? "" : "s"}
                </>
              )}
            </div>
            <button
              type="button"
              onClick={handleImport}
              disabled={importing || validRows.length === 0}
              className="inline-flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-md bg-[var(--color-accent)] text-[var(--color-bg-primary)] hover:bg-[var(--color-accent-hover)] disabled:opacity-50 transition-colors"
            >
              <FileText className="w-4 h-4" />
              {importing ? "Importing…" : `Import ${validRows.length} row${validRows.length === 1 ? "" : "s"}`}
            </button>
          </div>

          {parseErrors.length > 0 && (
            <div className="mb-4 rounded-md border border-red-400/30 bg-red-400/5 p-4">
              <p className="text-sm font-medium text-red-400 mb-2">Parse errors (fix these in the CSV and re-paste):</p>
              <ul className="text-xs text-[var(--color-text-secondary)] space-y-1 max-h-40 overflow-y-auto">
                {parseErrors.map((r) => (
                  <li key={r.line}>
                    <span className="text-[var(--color-text-muted)]">line {r.line}:</span>{" "}
                    <span className="text-red-400">{r.parseError}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Preview table — first 20 valid rows */}
          <div className="rounded-md border border-[var(--color-border)] bg-[var(--color-bg-card)] overflow-x-auto">
            <table className="w-full text-xs min-w-[800px]">
              <thead>
                <tr className="border-b border-[var(--color-border)]">
                  <th className="text-left p-3 text-[var(--color-text-secondary)]">Line</th>
                  <th className="text-left p-3 text-[var(--color-text-secondary)]">SKU</th>
                  <th className="text-left p-3 text-[var(--color-text-secondary)]">Name</th>
                  <th className="text-left p-3 text-[var(--color-text-secondary)]">Category</th>
                  <th className="text-right p-3 text-[var(--color-text-secondary)]">Price</th>
                  <th className="text-right p-3 text-[var(--color-text-secondary)]">Stock</th>
                  <th className="text-left p-3 text-[var(--color-text-secondary)]">Type</th>
                </tr>
              </thead>
              <tbody>
                {validRows.slice(0, 20).map((r) => {
                  const d = r.data as Record<string, unknown>;
                  return (
                    <tr key={r.line} className="border-b border-[var(--color-border)] last:border-0">
                      <td className="p-3 text-[var(--color-text-muted)]">{r.line}</td>
                      <td className="p-3 font-mono">{(d.sku as string) || "—"}</td>
                      <td className="p-3 text-[var(--color-text-primary)]">{d.name as string}</td>
                      <td className="p-3 text-[var(--color-text-secondary)]">{d.category as string}</td>
                      <td className="p-3 text-right">${(d.price as number).toFixed(2)}</td>
                      <td className="p-3 text-right">{d.stock as number}</td>
                      <td className="p-3 text-[var(--color-text-secondary)]">
                        {d.productType as string}
                        {d.lotSize ? ` × ${d.lotSize}` : ""}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {validRows.length > 20 && (
              <p className="px-3 py-2 text-xs text-[var(--color-text-muted)]">
                … and {validRows.length - 20} more row{validRows.length - 20 === 1 ? "" : "s"}.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Results */}
      {networkError && (
        <div className="mt-6 flex items-start gap-2 rounded-md border border-red-400/30 bg-red-400/10 text-red-400 px-4 py-3 text-sm">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{networkError}</span>
        </div>
      )}

      {response && (
        <div className="mt-6 rounded-md border border-[var(--color-border)] bg-[var(--color-bg-card)] p-5">
          <div className="flex items-center gap-2 text-green-400">
            <Check className="w-5 h-5" />
            <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">Import complete</h2>
          </div>
          <div className="mt-2 flex gap-4 text-sm">
            <span className="text-[var(--color-text-secondary)]">Total: <span className="text-[var(--color-text-primary)]">{response.summary.total}</span></span>
            <span className="text-green-400">Created: {response.summary.created}</span>
            <span className="text-[var(--color-accent)]">Updated: {response.summary.updated}</span>
            {response.summary.errored > 0 && (
              <span className="text-red-400">Errors: {response.summary.errored}</span>
            )}
          </div>

          {response.summary.errored > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-red-400 mb-2">Failed rows:</p>
              <ul className="text-xs text-[var(--color-text-secondary)] space-y-1 max-h-60 overflow-y-auto">
                {response.results
                  .filter((r): r is Extract<ServerResult, { status: "error" }> => r.status === "error")
                  .map((r) => (
                    <li key={r.line}>
                      <span className="text-[var(--color-text-muted)]">line {r.line}:</span>{" "}
                      <span className="text-red-400">{r.error}</span>
                    </li>
                  ))}
              </ul>
            </div>
          )}

          <div className="mt-5 flex gap-3">
            <Link
              href="/admin/products"
              className="inline-flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-md border border-[var(--color-accent)] text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-[var(--color-bg-primary)] transition-colors"
            >
              View products
            </Link>
            <button
              type="button"
              onClick={() => { setCsvText(""); setResponse(null); }}
              className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
            >
              Import another batch
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
