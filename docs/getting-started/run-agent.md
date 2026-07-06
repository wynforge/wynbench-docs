---
id: run-agent
title: Run the Agent
sidebar_position: 2
---

# Run the Agent

The Wynbench agent is a headless .NET process that manages connections, loads plugins, and executes workflows.

## Start the agent

Navigate to the agent directory and run:

```powershell
cd C:\Wynbench\agent
.\WynbenchAgent.exe
```

On first run you should see output similar to:

```
[INFO] Wynbench Agent v1.0.0 starting...
[INFO] Loading plugins from: .\plugins
[INFO] Loaded plugin: Wynbench.Plugin.Msmq (v1.0.0)
[INFO] Loaded plugin: Wynbench.Plugin.Http (v1.0.0)
[INFO] Agent HTTP API listening on http://localhost:5050
[INFO] Agent ready.
```

---

## Agent lifecycle

```
Start
  │
  ▼
Load configuration (agent.json)
  │
  ▼
Discover & initialise plugins
  │
  ▼
Start HTTP API server
  │
  ▼
Connect to pre-configured connections
  │
  ▼
Execute scheduled / triggered workflows
  │
  ▼
Idle — awaiting UI commands or triggers
```

---

## Running as a Windows Service

For production use, install the agent as a Windows Service:

```powershell
sc.exe create WynbenchAgent `
  binPath= "C:\Wynbench\agent\WynbenchAgent.exe --service" `
  start= auto `
  DisplayName= "Wynbench Agent"

sc.exe start WynbenchAgent
```

To stop and remove:

```powershell
sc.exe stop WynbenchAgent
sc.exe delete WynbenchAgent
```

---

## Health check

Once running, verify the agent is healthy:

```powershell
Invoke-RestMethod http://localhost:5050/health
```

Expected response:

```json
{
  "status": "Healthy",
  "version": "1.0.0",
  "plugins": ["Msmq", "Http"],
  "connections": []
}
```

---

## Next step

[Run the UI →](./run-ui)
