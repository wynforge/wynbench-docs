---
id: install
title: Installation
sidebar_position: 1
---

# Installation

This guide walks you through installing the Wynbench agent and UI on a development machine.

## Prerequisites

| Requirement | Version |
|-------------|---------|
| Windows OS | 10 / 11 / Server 2019+ |
| .NET Runtime | 8.0+ |
| Node.js | 20+ (UI only) |
| Git | Any recent version |

:::tip
For a quick evaluation you can use the pre-built release package from the [Releases](https://github.com/oswryn/wynbench-docs) page and skip straight to [Run the Agent](./run-agent).
:::

---

## Option 1 — Install from the release package

1. Download the latest `wynbench-<version>.zip` from the GitHub Releases page.
2. Extract the archive to a location of your choice, e.g. `C:\Wynbench`.
3. Verify the layout looks like:

```
C:\Wynbench\
  agent\
    WynbenchAgent.exe
    plugins\
  ui\
    index.html
    ...
  config\
    agent.json
```

4. Continue to [Run the Agent](./run-agent).

---

## Option 2 — Build from source

### Clone the repository

```bash
git clone https://github.com/oswryn/wynbench.git
cd wynbench
```

### Build the agent

```bash
dotnet build src/WynbenchAgent/WynbenchAgent.csproj --configuration Release
```

The compiled binary will be placed in `artifacts/agent/`.

### Build the UI

```bash
cd src/WynbenchUI
npm install
npm run build
```

The compiled SPA will be placed in `artifacts/ui/`.

### Build the plugins

```bash
dotnet build src/Plugins/Wynbench.Plugin.Msmq --configuration Release
# Repeat for other plugins as needed
```

---

## Configuration

Before running, review `config/agent.json`:

```json
{
  "listenPort": 5050,
  "pluginsPath": "./plugins",
  "logLevel": "Information",
  "connections": []
}
```

| Field | Description |
|-------|-------------|
| `listenPort` | TCP port the agent's HTTP API listens on |
| `pluginsPath` | Relative path to the plugins directory |
| `logLevel` | Verbosity: `Trace`, `Debug`, `Information`, `Warning`, `Error` |
| `connections` | Pre-configured connection definitions (can also be added via the UI) |

---

## Next step

[Run the Agent →](./run-agent)
