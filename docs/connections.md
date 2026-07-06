---
id: connections
title: Connections
sidebar_position: 6
---

# Connections

A **connection** is a named, configured instance of a protocol plugin. Connections represent live sessions to external systems — a queue manager, an HTTP endpoint, an SMTP server, and so on.

---

## Concepts

| Term | Definition |
|------|-----------|
| **Plugin** | The protocol adapter (e.g. MSMQ, HTTP) |
| **Connection** | A named, configured instance of a plugin |
| **Connection state** | `Disconnected` → `Connecting` → `Connected` → `Error` |
| **Connection config** | Key/value parameters specific to the plugin |

A single plugin can have multiple connections. For example, you might have two MSMQ connections pointing at different queue managers.

---

## Connection lifecycle

```
Create connection (via UI or agent.json)
        │
        ▼
   Validate config
        │
        ▼
   Plugin initialises transport
        │
        ▼
   State: Connected
        │
        ├─── (normal operation)
        │
        └─── (transport error) ──▶ State: Error ──▶ Auto-retry
```

---

## Defining connections in agent.json

Pre-configure connections so the agent creates them on startup:

```json
{
  "connections": [
    {
      "id": "orders-queue",
      "plugin": "Wynbench.Plugin.Msmq",
      "config": {
        "queuePath": ".\\private$\\orders",
        "accessMode": "ReadWrite"
      }
    },
    {
      "id": "erp-api",
      "plugin": "Wynbench.Plugin.Http",
      "config": {
        "baseUrl": "https://erp.example.com/api",
        "authType": "ApiKey",
        "apiKeyHeader": "X-Api-Key",
        "apiKeyValue": "${ERP_API_KEY}"
      }
    }
  ]
}
```

:::tip Environment variables
Use `${VAR_NAME}` placeholders in connection config values to inject secrets from environment variables at runtime.
:::

---

## Creating connections via the UI

1. Open the **Connections** page in the UI.
2. Click **New Connection**.
3. Select a plugin from the dropdown.
4. Fill in the plugin-specific fields.
5. Click **Test** to verify connectivity.
6. Click **Save**.

---

## Connection config reference by plugin

### HTTP Plugin

```json
{
  "baseUrl": "https://api.example.com",
  "authType": "None | ApiKey | ****** BasicAuth | OAuth2ClientCredentials",
  "timeoutSeconds": 30
}
```

### MSMQ Plugin

```json
{
  "queuePath": ".\\private$\\myqueue",
  "accessMode": "Send | Receive | ReadWrite",
  "recoverable": true
}
```

---

## Monitoring connection health

The agent exposes connection state via the REST API and the WebSocket event stream:

```powershell
Invoke-RestMethod http://localhost:5050/api/connections
```

```json
[
  {
    "id": "orders-queue",
    "plugin": "Wynbench.Plugin.Msmq",
    "state": "Connected",
    "connectedAt": "2025-01-01T08:00:00Z"
  }
]
```
