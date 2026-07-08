---
id: plugins
title: Plugins
sidebar_position: 3
---

# Plugin Architecture

Plugins are the extensibility mechanism of the agent. Each plugin is a Go type that implements `core.Plugin`.

---

## Plugin contract

```go
type Plugin interface {
    Name() string
    Configure(cfg map[string]any) error
    Execute(action Action) (Result, error)
}
```

---

## Registration model

```
cmd/server/main.go
    core.Register(httpplugin.New())
    core.Register(sqlplugin.New())
    core.Register(kafkaplugin.New())
```

Plugins are keyed by `Name()` in a registry map and looked up at action execution time.

---

## Bundled plugins

| Plugin | Protocol | Notes |
|--------|----------|-------|
| `http` | HTTP/HTTPS | Functional plugin for basic GET/POST style requests |
| `sql` | SQL | Stub plugin that validates query payloads and returns placeholder rows |
| `kafka` | Kafka | Produces messages to Kafka topics, with optional Avro schema encoding |

---

## Execution flow

Wynbench executes plugin actions through the Go engine and registry:

```
Action payload
    │
    ▼
Engine resolves plugin by action.plugin
    │
    ▼
Connection config merged into action params (optional)
    │
    ▼
Plugin.Execute(action)
```

The returned `core.Result` is sent back directly through the API layer.

---

## See also

- [Plugin Development Guide](../plugin-development) — step-by-step guide to building a plugin.
