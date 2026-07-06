---
id: agent
title: Agent
sidebar_position: 1
---

# Agent Architecture

The Wynbench agent is the headless runtime at the heart of the platform. It is a .NET 8 host process responsible for:

- Loading and hosting plugin modules
- Managing named connection instances
- Executing workflow definitions
- Exposing an HTTP + WebSocket API for the UI

---

## Internal structure

```
WynbenchAgent.exe
│
├── Configuration Loader      ← reads agent.json
├── Plugin Host               ← discovers & loads .dll plugins
│   └── IProtocolPlugin[]     ← one per loaded plugin
├── Connection Manager        ← lifecycle of connection instances
│   └── IConnection[]         ← active connections
├── Workflow Engine           ← parses & runs workflow graphs
│   ├── Trigger Evaluator
│   ├── Action Dispatcher
│   └── State Store           ← in-memory + optional persistence
└── HTTP API (ASP.NET Core)
    ├── REST  /api/...
    └── WebSocket  /ws
```

---

## Plugin loading

On startup the agent scans the `pluginsPath` directory for assemblies that export one or more `IProtocolPlugin` implementations:

```csharp
// Plugin contract (simplified)
public interface IProtocolPlugin
{
    string Name { get; }
    string Version { get; }

    IConnection CreateConnection(ConnectionConfig config);
    IReadOnlyList<ActionDescriptor> GetActions();
}
```

Plugins are loaded into isolated `AssemblyLoadContext` instances so that conflicting dependency versions cannot cause runtime errors.

---

## Workflow engine

Workflows are represented as directed acyclic graphs (DAGs):

```
[Trigger]
    │
    ▼
[Action A]
    │
    ├── (on success) ──▶ [Action B]
    │
    └── (on failure) ──▶ [Notify]
```

Each node in the graph is an **action** provided by a plugin. The engine evaluates nodes depth-first, passing outputs from one action as inputs to the next.

---

## HTTP API

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | Agent health and version |
| `GET` | `/api/plugins` | List loaded plugins |
| `GET` | `/api/connections` | List connection instances |
| `POST` | `/api/connections` | Create a new connection |
| `GET` | `/api/workflows` | List workflow definitions |
| `POST` | `/api/workflows/{id}/run` | Trigger a workflow manually |
| `WS` | `/ws` | Real-time event stream |

---

## Configuration reference

```json
{
  "listenPort": 5050,
  "pluginsPath": "./plugins",
  "logLevel": "Information",
  "connections": [],
  "persistence": {
    "enabled": false,
    "provider": "sqlite",
    "connectionString": "Data Source=wynbench.db"
  }
}
```
