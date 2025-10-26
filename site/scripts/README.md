# Launch scripts

This `scripts/` folder contains convenient launch scripts for both Windows PowerShell and Unix-like shells (bash/WSL/macOS/Linux).

Files added

- `Start-All.ps1` — PowerShell: launch Django and Node server in separate new PowerShell windows.
- `Start-Django.ps1` — PowerShell: launch Django only in a new window.
- `Start-Server.ps1` — PowerShell: launch Node server (server + vite middleware) in a new window.
- `Start-Client.ps1` — PowerShell: launch Vite dev server for the client in a new window.
- `start-all.sh` — Bash: starts Django in background and then runs the Node dev server (keeps Node in foreground).
- `start-server.sh` — Bash: start Node dev server only.
- `start-client.sh` — Bash: starts Vite dev server for the client only.

Usage

PowerShell (Windows):

Open PowerShell and run (from project root or the `scripts/` directory):

```powershell
# start both servers (opens new windows)
.\scripts\Start-All.ps1

# start only Django in a new window
.\scripts\Start-Django.ps1

# start only Node server in a new window
.\scripts\Start-Server.ps1

# start vite client in a new window
.\scripts\Start-Client.ps1
```

Bash / WSL / macOS / Linux:

Make scripts executable and run:

```bash
chmod +x scripts/*.sh
# start both servers
scripts/start-all.sh
# start server only
scripts/start-server.sh
# start client only
scripts/start-client.sh
```

Notes and assumptions

- The Node dev entry is defined in the root `package.json` as `dev: "NODE_ENV=development tsx server/index.ts"`. The bash scripts use `npm run dev` which relies on inline env assignment — this works on Unix-like shells.
- PowerShell scripts set environment variables in the new shell before starting the process so the server runs in development mode.
- Django is started via `python -m django runserver 0.0.0.0:8000` and uses `DJANGO_SETTINGS_MODULE=atlas_unite.settings`.
- If you prefer logs aggregated in a single terminal, run `scripts/start-server.sh` in one shell and `scripts/start-all.sh` will background Django and keep Node logs in foreground.

If you'd like these scripts to use terminal multiplexers (tmux), Windows Terminal profiles, or to integrate with `concurrently`/`npm` scripts instead, tell me which you prefer and I can wire them up.
