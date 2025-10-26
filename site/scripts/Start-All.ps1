# Start-All.ps1
# Starts Django (backend) and Node server (server + vite middleware) in separate PowerShell windows

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$root = (Resolve-Path (Join-Path $scriptDir "..")).ProviderPath.TrimEnd('\')

Write-Host "Project root: $root"

# Build command strings for new PowerShell windows. Escape $ so they evaluate in the new process.
$djangoCmd = "cd `"$root\backend`"; `$env:DJANGO_SETTINGS_MODULE='atlas_unite.settings'; python -m django runserver 0.0.0.0:8000"
$serverCmd = "cd `"$root`"; `$env:NODE_ENV='development'; npx tsx server/index.ts"

Write-Host "Starting Django in a new PowerShell window..."
Start-Process -FilePath "powershell" -ArgumentList "-NoExit","-Command",$djangoCmd

Start-Sleep -Seconds 2

Write-Host "Starting Node server (server + vite middleware) in a new PowerShell window..."
Start-Process -FilePath "powershell" -ArgumentList "-NoExit","-Command",$serverCmd

Write-Host "Launched processes. Check the new windows for logs."
