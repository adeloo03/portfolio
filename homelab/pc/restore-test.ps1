# Restore test: pulls the newest backup, decrypts it HERE (the key never leaves
# this PC) and streams it straight into restore-test.sh on the server. Nothing
# decrypted is written to disk on either side outside the test's temp folder.
$ErrorActionPreference = 'Stop'

$s = Import-PowerShellDataFile (Join-Path $PSScriptRoot 'settings.psd1')

& (Join-Path $PSScriptRoot 'pull-backups.ps1')
if ($LASTEXITCODE -ne 0) { throw 'pull failed, not testing a stale backup' }

$latest = Get-ChildItem $s.LocalDir -Filter 'homelab-*.tar.gz.age' |
    Sort-Object Name -Descending | Select-Object -First 1
if (-not $latest) { throw "no backups in $($s.LocalDir)" }
Write-Output "Testing $($latest.Name)"

# Windows PowerShell re-encodes bytes piped between native programs, which
# corrupts binary data. cmd.exe pipes raw bytes, so the pipe runs there.
$remote = "bash $($s.RemoteRepo)/scripts/restore-test.sh -"
cmd /c "age -d -i `"$($s.AgeKey)`" `"$($latest.FullName)`" | ssh -o BatchMode=yes $($s.Server) `"$remote`""
if ($LASTEXITCODE -ne 0) {
    Write-Output 'RESTORE TEST FAILED - see output above.'
    exit 1
}
