---
id: packager
title: Packager
sidebar_position: 4
---

# Packager Architecture

The Wynbench packager is a command-line tool that assembles the agent, UI, and selected plugins into a single, self-contained deployment archive.

---

## What it produces

```
wynbench-1.0.0.zip
│
├── agent/
│   ├── WynbenchAgent.exe
│   ├── WynbenchAgent.dll
│   ├── appsettings.json
│   └── plugins/
│       ├── Wynbench.Plugin.Msmq.dll
│       └── Wynbench.Plugin.Http.dll
│
├── ui/
│   ├── index.html
│   └── assets/
│
├── config/
│   └── agent.json          ← templated from packaging manifest
│
└── install.ps1             ← optional installer script
```

---

## Packaging manifest

A `wynbench.pack.json` file controls what gets included:

```json
{
  "version": "1.0.0",
  "agent": {
    "configuration": "./config/agent.json"
  },
  "ui": {
    "include": true,
    "sourceDir": "./artifacts/ui"
  },
  "plugins": [
    "Wynbench.Plugin.Msmq",
    "Wynbench.Plugin.Http"
  ]
}
```

---

## Running the packager

```powershell
dotnet tool run wynbench-pack --manifest wynbench.pack.json --output ./dist
```

Or via the convenience script:

```powershell
.\scripts\pack.ps1 -Version 1.0.0 -Plugins Msmq,Http
```

---

## Output options

| Flag | Description |
|------|-------------|
| `--output` | Directory to write the archive to |
| `--format zip` | Package as a zip archive (default) |
| `--format dir` | Leave as an unzipped directory |
| `--include-installer` | Include `install.ps1` Windows Service installer |
| `--no-ui` | Exclude the UI bundle (agent-only deployment) |

---

## CI/CD integration

The packager runs as a GitHub Actions step:

```yaml
- name: Package Wynbench
  run: dotnet tool run wynbench-pack --manifest wynbench.pack.json --output artifacts/
```

The resulting archive is uploaded as a release asset.

---

## See also

- [Packaging & Deployment overview](../packaging-and-deployment)
