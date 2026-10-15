# Copies every backup this PC does not have yet from the server, then keeps the
# newest $Keep locally. Pull, not push: the server holds no credentials for
# this PC. Registered as a daily task by register-task.ps1.
$ErrorActionPreference = 'Stop'

$s = Import-PowerShellDataFile (Join-Path $PSScriptRoot 'settings.psd1')
$log = Join-Path $s.LocalDir 'pull.log'
New-Item -ItemType Directory -Force -Path $s.LocalDir | Out-Null

function Write-Log([string]$message) {
    $line = '{0:u} {1}' -f (Get-Date), $message
    Add-Content -Path $log -Value $line
    Write-Output $line
}

try {
    $remote = ssh -o BatchMode=yes $s.Server "ls -1 $($s.RemoteDir)/homelab-*.tar.gz.age"
    if ($LASTEXITCODE -ne 0 -or -not $remote) { throw "could not list backups on $($s.Server)" }

    $copied = 0
    foreach ($path in @($remote)) {
        $name = Split-Path $path -Leaf
        if (Test-Path (Join-Path $s.LocalDir $name)) { continue }
        scp -q -o BatchMode=yes "$($s.Server):$path" $s.LocalDir
        if ($LASTEXITCODE -ne 0) { throw "scp failed for $name" }
        $copied++
    }

    $all = Get-ChildItem $s.LocalDir -Filter 'homelab-*.tar.gz.age' | Sort-Object Name -Descending
    $all | Select-Object -Skip $s.Keep | Remove-Item

    $newest = ($all | Select-Object -First 1).Name
    Write-Log "ok: copied $copied, newest $newest"
}
catch {
    Write-Log "FAILED: $_"
    exit 1
}
