# Start-Client.ps1
# Start the Vite dev server for the client only (useful if you want vite standalone)
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$root = (Resolve-Path (Join-Path $scriptDir "..")).ProviderPath.TrimEnd('\')

$clientCmd = "cd `"$root\client`"; npx vite --host"
Write-Host "Starting Vite dev server for client..."
Start-Process -FilePath "powershell" -ArgumentList "-NoExit","-Command",$clientCmd
Write-Host "Vite started in a new window."
