---
id: run-agent
title: Run the Agent
sidebar_position: 2
---

# Run the Agent

The Wynbench agent is a Go HTTP server that manages connections, executes actions, and runs workflows.

## Start the agent

Navigate to the agent directory and run:

```powershell
cd D:\OpenSource\wynbench-agent
go run ./cmd/server
```

On first run you should see output similar to:

```
wynbench-agent listening on :8080
```

---

## Agent lifecycle

```
Start
  │
  ▼
Register built-in plugins
  │
  ▼
Start HTTP API server
  │
  ▼
Handle connection/action/workflow requests
```

---

## Change the listening address

Use `-addr` to override the default `:8080`:

```powershell
go run ./cmd/server -addr :9090
```

---

## Health check

Once running, verify the agent is healthy:

```powershell
Invoke-RestMethod http://localhost:8080/health
```

Expected response:

```json
{
  "status": "ok",
  "plugins": ["http", "sql"],
  "connections": 0
}
```

---

## Next step

[Run the UI →](./run-ui)
