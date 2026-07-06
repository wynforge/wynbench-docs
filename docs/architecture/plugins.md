---
id: plugins
title: Plugins
sidebar_position: 3
---

# Plugin Architecture

Plugins are the extensibility mechanism of Wynbench. Each plugin is a .NET class library that implements the `IProtocolPlugin` interface, providing one or more **connection types** and **actions**.

---

## Plugin contract

```csharp
namespace Wynbench.Plugin.Abstractions;

/// <summary>
/// Entry point for a Wynbench protocol plugin.
/// </summary>
public interface IProtocolPlugin
{
    /// <summary>Display name shown in the UI.</summary>
    string Name { get; }

    /// <summary>Semantic version string, e.g. "1.2.0".</summary>
    string Version { get; }

    /// <summary>
    /// Validates <paramref name="config"/> and creates a new connection instance.
    /// </summary>
    IConnection CreateConnection(ConnectionConfig config);

    /// <summary>
    /// Returns metadata for every action this plugin exposes.
    /// </summary>
    IReadOnlyList<ActionDescriptor> GetActions();
}
```

---

## Plugin discovery

```
agent/
  plugins/
    Wynbench.Plugin.Msmq.dll          ← auto-discovered
    Wynbench.Plugin.Http.dll
    Wynbench.Plugin.Amqp.dll
```

The agent scans `pluginsPath` on startup. Any `.dll` that contains a class implementing `IProtocolPlugin` is loaded.

---

## Bundled plugins

| Plugin | Protocol | Notes |
|--------|----------|-------|
| `Wynbench.Plugin.Msmq` | Microsoft Message Queue | See [MSMQ Shim](../msmq-shim) |
| `Wynbench.Plugin.Http` | HTTP/HTTPS REST | Supports OAuth2, API keys |
| `Wynbench.Plugin.Amqp` | AMQP 0-9-1 (RabbitMQ) | Planned |
| `Wynbench.Plugin.Smtp` | SMTP email | Planned |

---

## Isolation model

Each plugin assembly is loaded into a dedicated `AssemblyLoadContext`:

```
Agent Process
│
├── Default ALC  (agent core)
├── Plugin ALC: Msmq
│   └── Wynbench.Plugin.Msmq.dll
│   └── System.Messaging.dll  (plugin-specific deps)
└── Plugin ALC: Http
    └── Wynbench.Plugin.Http.dll
```

This prevents version conflicts between plugins and the agent core.

---

## See also

- [Plugin Development Guide](../plugin-development) — step-by-step guide to building a plugin.
- [MSMQ Shim](../msmq-shim) — details on the MSMQ protocol adapter.
