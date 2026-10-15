$ErrorActionPreference = 'Stop'

$ProjectRoot = Split-Path -Parent $PSScriptRoot
$ServerScript = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot 'local-server.mjs'))
$StateFile = Join-Path $PSScriptRoot '.local-server.json'

if (-not (Test-Path -LiteralPath $StateFile)) {
    exit 0
}

try {
    $SavedState = Get-Content -LiteralPath $StateFile -Raw | ConvertFrom-Json
    $ProcessId = [int]$SavedState.pid
    $Process = Get-CimInstance Win32_Process -Filter "ProcessId = $ProcessId" -ErrorAction SilentlyContinue

    if ($null -ne $Process -and $Process.Name -eq 'node.exe' -and $Process.CommandLine -like "*$ServerScript*") {
        Stop-Process -Id $ProcessId
    }
} finally {
    Remove-Item -LiteralPath $StateFile -Force -ErrorAction SilentlyContinue
}
