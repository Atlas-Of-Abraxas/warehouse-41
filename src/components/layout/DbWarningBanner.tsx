export function DbWarningBanner() {
  return (
    <div
      className="bg-amber-950/80 border-b border-amber-700/50 text-amber-100 text-center text-sm py-3 px-4"
      role="status"
    >
      Database unreachable or misconfigured. Set{" "}
      <code className="text-amber-200">DATABASE_URL</code> in{" "}
      <code className="text-amber-200">.env</code> locally, or in Vercel → Environment Variables.
      Use Supabase&apos;s pooled URI for serverless. If you see TLS / certificate errors locally
      (e.g. corporate proxy), add{" "}
      <code className="text-amber-200">SKIP_DB_SSL_VERIFY=1</code> to{" "}
      <code className="text-amber-200">.env</code> for dev only.
    </div>
  );
}
