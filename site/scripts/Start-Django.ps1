# Start-Django.ps1
# Start only the Django backend in a new PowerShell window
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$root = (Resolve-Path (Join-Path $scriptDir "..")).ProviderPath.TrimEnd('\')

$djangoCmd = "cd `"$root\backend`"; `$env:DJANGO_SETTINGS_MODULE='atlas_unite.settings'; python -m django runserver 0.0.0.0:8000"
Write-Host "Starting Django..."
Start-Process -FilePath "powershell" -ArgumentList "-NoExit","-Command",$djangoCmd
Write-Host "Django started in a new window."
