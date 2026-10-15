# Registers pull-backups.ps1 as a daily task for the current user.
# StartWhenAvailable: if the PC was off at 09:00, it runs at the next login.
$ErrorActionPreference = 'Stop'

$script = Join-Path $PSScriptRoot 'pull-backups.ps1'
$action = New-ScheduledTaskAction -Execute 'powershell.exe' `
    -Argument "-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$script`""
$trigger = New-ScheduledTaskTrigger -Daily -At '09:00'
$settings = New-ScheduledTaskSettingsSet -StartWhenAvailable `
    -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries

Register-ScheduledTask -TaskName 'Homelab backup pull' -Force `
    -Description 'Copies encrypted homelab backups from the server.' `
    -Action $action -Trigger $trigger -Settings $settings | Out-Null

Write-Output "Registered 'Homelab backup pull' (daily 09:00). Test it now with:"
Write-Output "  Start-ScheduledTask -TaskName 'Homelab backup pull'"
