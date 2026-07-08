---
id: agent
title: Agent
sidebar_position: 1
---

# Agent Architecture

The Wynbench agent is a Go HTTP service that provides the backend runtime for connections, actions, and workflows.

It is responsible for:

- Registering plugins at process startup
- Managing in-memory connection and workflow stores
- Persisting connections and workflows to a local config file
- Executing actions and workflows through the engine
- Exposing a JSON HTTP API used by the UI

---

## Internal structure

```
cmd/server/main.go
│
├── core.Register(http, sql)
├── core.ConnectionStore
├── core.WorkflowStore
├── core.Engine
└── api.Server + routes
```

---

## Plugin model

Plugins implement the shared `core.Plugin` interface:

```go
type Plugin interface {
  Name() string
  Configure(cfg map[string]any) error
  Execute(action Action) (Result, error)
}
```

Built-in plugins are registered in `cmd/server/main.go`. Additional plugins can be added by implementing the same interface and registering them at startup.

---

## Workflow engine

Workflows are executed as ordered step lists:

```
[Action A]
  │
  └── (on success) ──▶ [Action B]
```

The engine stops on the first failed step and returns an aggregated `WorkflowRun` payload.

---

## HTTP API

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | Agent health and version |
| `GET` | `/connections` | List connections |
| `POST` | `/connections` | Create a connection |
| `DELETE` | `/connections/{id}` | Delete a connection |
| `POST` | `/actions/execute` | Execute one action |
| `GET` | `/workflows` | List stored workflows |
| `POST` | `/workflows` | Create a workflow |
| `PUT` | `/workflows/{id}` | Update a workflow |
| `DELETE` | `/workflows/{id}` | Delete a workflow |
| `POST` | `/workflows/run` | Execute inline or stored workflow |
| `GET` | `/kafka/messages` | Preview Kafka topic messages |
| `GET` | `/config/export` | Export persisted connections/workflows |
| `POST` | `/config/import` | Import persisted connections/workflows |
| `GET` | `/config/path` | Get persisted config file path |

---

## Runtime defaults

- Default address: `:8080`
- CORS headers enabled for local browser clients
- In-memory stores only (no persistence layer)
