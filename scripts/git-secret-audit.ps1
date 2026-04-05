# Scans all Git revisions for common secret-like strings. Exit 1 if suspicious hits outside .env.example placeholders.
# Run from repo root: pwsh -File scripts/git-secret-audit.ps1

$ErrorActionPreference = "Stop"
$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $repoRoot
if (-not (Test-Path ".git")) {
  Write-Error "Run from repository root (no .git found)."
}

$revs = @(git rev-list --all 2>$null)
if ($revs.Count -eq 0) {
  Write-Host "No commits."
  exit 0
}

$patterns = @(
  @{ Name = "vck_ (Vercel-style key)"; Pattern = "vck_[A-Za-z0-9_-]{20,}" },
  @{ Name = "GitHub PAT ghp_"; Pattern = "ghp_[A-Za-z0-9]{30,}" },
  @{ Name = "GitHub fine-grained pat"; Pattern = "github_pat_[A-Za-z0-9_]{20,}" },
  @{ Name = "OpenAI sk- (live shape)"; Pattern = "sk-[A-Za-z0-9]{40,}" },
  @{ Name = "Stripe live secret"; Pattern = "sk_live_[0-9a-zA-Z]{20,}" },
  @{ Name = "AWS access key id"; Pattern = "AKIA[0-9A-Z]{16}" }
)

$bad = $false
foreach ($p in $patterns) {
  $out = git grep -n -E $p.Pattern $revs 2>$null
  if (-not $out) { continue }
  # Allow obvious placeholders in .env.example
  $suspicious = $out | Where-Object { $_ -notmatch '\.env\.example:.*\.\.\.' -and $_ -notmatch 'sk_test_\.\.\.' -and $_ -notmatch 'whsec_\.\.\.' }
  if ($suspicious) {
    Write-Host "`n=== POSSIBLE HIT: $($p.Name) ===" -ForegroundColor Red
    $suspicious | Select-Object -First 25 | ForEach-Object { Write-Host $_ }
    $bad = $true
  }
}

if ($bad) {
  Write-Host "`nReview matches above. If real secrets: rotate credentials, then use git-filter-repo (see team docs)." -ForegroundColor Yellow
  exit 1
}

Write-Host "Audit OK: no suspicious high-confidence secret patterns in git history (excluding obvious .env.example placeholders)." -ForegroundColor Green
exit 0
