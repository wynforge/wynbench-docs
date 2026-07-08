---
id: plugin-development
title: Plugin Development Guide
sidebar_position: 8
---

# Plugin Development Guide

This guide walks through building a Wynbench protocol plugin for the Go agent. Plugins are Go types that implement the `core.Plugin` interface and are registered with the agent at startup.

---

## 1. Create the project

Create a new Go module for your plugin. In the Wynbench repo, plugin packages typically live under `plugins/`.

```bash
mkdir -p plugins/myprotocol
cd plugins/myprotocol
go mod init github.com/wynforge/wynbench-agent/plugins/myprotocol
go get github.com/wynforge/wynbench-agent/core
```

---

## 2. Implement `core.Plugin`

Create a plugin type that satisfies the `core.Plugin` interface.

```go
package myprotocol

import (
    "github.com/wynforge/wynbench-agent/core"
)

type Plugin struct{}

func New() *Plugin {
    return &Plugin{}
}

func (p *Plugin) Name() string {
    return "myprotocol"
}

func (p *Plugin) Configure(cfg map[string]any) error {
    // Validate connection config here.
    if _, ok := cfg["serverUrl"].(string); !ok {
        return nil
    }
    return nil
}

func (p *Plugin) Execute(action core.Action) (core.Result, error) {
    switch action.Plugin {
    case "myprotocol.send":
        return p.send(action)
    default:
        return core.Result{Success: false, Error: "unknown action"}, nil
    }
}

func (p *Plugin) send(action core.Action) (core.Result, error) {
    payload, ok := action.Params["payload"].(string)
    if !ok || payload == "" {
        return core.Result{Success: false, Error: "missing payload"}, nil
    }

    // TODO: send payload using action params + connection config.

    return core.Result{Success: true, Data: map[string]any{"statusCode": 200}}, nil
}
```

---

## 3. Register the plugin

Import and register your plugin in `cmd/server/main.go`:

```go
import (
    "github.com/wynforge/wynbench-agent/core"
    myprotocol "github.com/wynforge/wynbench-agent/plugins/myprotocol"
)

func main() {
    core.Register(myprotocol.New())
    // ...
}
```

Plugins are discovered by name at runtime through the Go plugin registry.

---

## 4. Deploy the plugin

1. Build the agent with your plugin package included:

```bash
go build ./cmd/server
```

2. Restart the agent. Your plugin will be available when the agent starts and registers it in `cmd/server/main.go`.

---

## 5. Best practices

- **Validate config in `Configure`** and return an error if required values are missing.
- **Return failures in `core.Result`** instead of panicking.
- **Avoid global mutable state** because the agent can execute multiple actions concurrently.
- **Keep plugin logic stateless** where possible and rely on `action.Params` plus connection config.

---

## 6. Testing your plugin

Use normal Go tests for your plugin implementation.

```go
package myprotocol_test

import (
    "testing"

    "github.com/wynforge/wynbench-agent/plugins/myprotocol"
    "github.com/wynforge/wynbench-agent/core"
)

func TestSendAction(t *testing.T) {
    plugin := myprotocol.New()

    result, err := plugin.Execute(core.Action{
        Plugin: "myprotocol.send",
        Params: map[string]any{"payload": "hello"},
    })
    if err != nil {
        t.Fatalf("unexpected error: %v", err)
    }
    if !result.Success {
        t.Fatalf("expected success, got: %s", result.Error)
    }
}
```

---

## See also

- [Plugin Architecture](./architecture/plugins)
