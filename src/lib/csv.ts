/**
 * Minimal RFC-4180-ish CSV parser. Handles:
 *  - quoted fields with commas / newlines
 *  - escaped quotes via ""
 *  - CRLF and LF line endings
 *
 * Returns rows as arrays of strings. Empty trailing line is ignored.
 */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          cell += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        cell += c;
      }
      continue;
    }
    if (c === '"' && cell === "") {
      inQuotes = true;
      continue;
    }
    if (c === ",") {
      row.push(cell);
      cell = "";
      continue;
    }
    if (c === "\r") continue;
    if (c === "\n") {
      row.push(cell);
      // Skip blank lines
      if (!(row.length === 1 && row[0] === "")) rows.push(row);
      row = [];
      cell = "";
      continue;
    }
    cell += c;
  }
  if (cell !== "" || row.length > 0) {
    row.push(cell);
    if (!(row.length === 1 && row[0] === "")) rows.push(row);
  }
  return rows;
}

/** Build header → index map from the first row, lower-casing and trimming names. */
export function headerIndex(headerRow: string[]): Map<string, number> {
  const m = new Map<string, number>();
  headerRow.forEach((h, i) => m.set(h.trim().toLowerCase(), i));
  return m;
}

/** Pull a cell out of a row by header name (case-insensitive); empty if missing. */
export function cell(row: string[], headers: Map<string, number>, name: string): string {
  const i = headers.get(name.toLowerCase());
  if (i === undefined) return "";
  return (row[i] ?? "").trim();
}

/** Split a multi-value cell on pipe; trim and drop empties. */
export function multi(value: string): string[] {
  if (!value) return [];
  return value
    .split("|")
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Parse a boolean-ish CSV cell: yes/y/true/1 → true, otherwise false (empty → false). */
export function bool(value: string): boolean {
  const v = value.trim().toLowerCase();
  return v === "yes" || v === "y" || v === "true" || v === "1";
}
