# 复制 Next.js standalone 产物到 D:\pixtale\pixtale，并带上外层 node.exe。

$Root = Split-Path -Parent $PSScriptRoot
$Base = "D:\pixtale"
$Out = Join-Path $Base "pixtale"

if (-not (Test-Path (Join-Path $Root ".next\standalone\server.js"))) {
  throw "Missing .next/standalone/server.js. Run npm run build first."
}

# 调用 robocopy；Mirror 时同步删除目标中的多余文件。
function Invoke-Robocopy([string]$Src, [string]$Dest, [bool]$Mirror = $false) {
  New-Item -ItemType Directory -Force -Path $Dest | Out-Null
  $flag = if ($Mirror) { "/MIR" } else { "/E" }
  & robocopy $Src $Dest $flag /R:2 /W:1 /MT:8 /NFL /NDL /NJH /NJS /NP
  if ($LASTEXITCODE -gt 7) {
    throw "robocopy failed ($LASTEXITCODE): $Src -> $Dest"
  }
}

Invoke-Robocopy (Join-Path $Root ".next\standalone") $Out $true
Invoke-Robocopy (Join-Path $Root ".next\static") (Join-Path $Out ".next\static")
Invoke-Robocopy (Join-Path $Root "public") (Join-Path $Out "public")
Invoke-Robocopy (Join-Path $Root "node_modules\@img\sharp-win32-x64") (Join-Path $Out "node_modules\@img\sharp-win32-x64")
Copy-Item (Join-Path $Root "scripts\start.bat") (Join-Path $Out "start.bat") -Force

$NodeExe = Join-Path $Base "node.exe"
if (-not (Test-Path $NodeExe)) {
  throw "Missing $NodeExe. Place node.exe in $Base first."
}
Copy-Item $NodeExe (Join-Path $Out "node.exe") -Force

Write-Host "Bundle complete: $Out"
