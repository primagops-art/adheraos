param(
    [ValidateSet('site', 'portal')]
    [string]$Page = 'portal'
)

$ErrorActionPreference = 'Stop'

$ProjectRoot = Split-Path -Parent $PSScriptRoot
$ServerScript = Join-Path $PSScriptRoot 'local-server.mjs'
$StateFile = Join-Path $PSScriptRoot '.local-server.json'
$LogFile = Join-Path $PSScriptRoot '.local-server.log'
$ErrorLogFile = Join-Path $PSScriptRoot '.local-server-error.log'
$NodeCommand = Get-Command node -ErrorAction SilentlyContinue

function Show-LauncherError([string]$Message) {
    Add-Type -AssemblyName PresentationFramework
    [System.Windows.MessageBox]::Show(
        $Message,
        'AdheraOS - abertura local',
        [System.Windows.MessageBoxButton]::OK,
        [System.Windows.MessageBoxImage]::Error
    ) | Out-Null
}

function Test-AdheraServer([int]$Port) {
    try {
        $Response = Invoke-WebRequest -Uri "http://127.0.0.1:$Port/__adhera_health" -UseBasicParsing -TimeoutSec 1
        return $Response.StatusCode -eq 200 -and $Response.Headers['X-Adhera-Local-Server'] -eq '1'
    } catch {
        return $false
    }
}

function Get-FreePort {
    foreach ($Candidate in 4173..4182) {
        $Listener = $null
        try {
            $Listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, $Candidate)
            $Listener.Start()
            return $Candidate
        } catch {
            continue
        } finally {
            if ($null -ne $Listener) {
                $Listener.Stop()
            }
        }
    }

    throw 'Nenhuma porta local livre foi encontrada entre 4173 e 4182.'
}

try {
    if ($null -eq $NodeCommand) {
        throw 'O Node.js não foi encontrado. Instale o Node.js LTS e tente novamente.'
    }

    $Port = $null

    if (Test-Path -LiteralPath $StateFile) {
        try {
            $SavedState = Get-Content -LiteralPath $StateFile -Raw | ConvertFrom-Json
            $SavedPort = [int]$SavedState.port

            if (Test-AdheraServer $SavedPort) {
                $Port = $SavedPort
            }
        } catch {
            $Port = $null
        }
    }

    if ($null -eq $Port) {
        $Port = Get-FreePort
        $QuotedServerScript = '"' + $ServerScript + '"'
        $Process = Start-Process -FilePath $NodeCommand.Source `
            -ArgumentList @($QuotedServerScript, '--port', $Port) `
            -WorkingDirectory $ProjectRoot `
            -WindowStyle Hidden `
            -RedirectStandardOutput $LogFile `
            -RedirectStandardError $ErrorLogFile `
            -PassThru

        @{ pid = $Process.Id; port = $Port } | ConvertTo-Json | Set-Content -LiteralPath $StateFile -Encoding UTF8

        $Started = $false
        foreach ($Attempt in 1..40) {
            Start-Sleep -Milliseconds 250
            if (Test-AdheraServer $Port) {
                $Started = $true
                break
            }
        }

        if (-not $Started) {
            $Details = if (Test-Path -LiteralPath $ErrorLogFile) {
                (Get-Content -LiteralPath $ErrorLogFile -Raw).Trim()
            } else {
                ''
            }
            throw "O servidor local não iniciou. $Details"
        }
    }

    $Path = if ($Page -eq 'portal') { '/acesso' } else { '/' }
    Start-Process "http://127.0.0.1:$Port$Path"
} catch {
    Show-LauncherError $_.Exception.Message
    exit 1
}
