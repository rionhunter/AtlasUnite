# Start-Server.ps1
# Start only the Node server (server + vite middleware) in a new PowerShell window
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$root = (Resolve-Path (Join-Path $scriptDir "..")).ProviderPath.TrimEnd('\')

$serverCmd = "cd `"$root`"; `$env:NODE_ENV='development'; npx tsx server/index.ts"
Write-Host "Starting Node server..."
Start-Process -FilePath "powershell" -ArgumentList "-NoExit","-Command",$serverCmd
Write-Host "Node server started in a new window."
