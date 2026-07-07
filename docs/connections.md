---
id: connections
title: Connections
sidebar_position: 6
---

# Connections

A **connection** is a saved configuration object used when executing actions and workflow steps.

---

## Concepts

| Term | Definition |
|------|-----------|
| **Plugin** | The protocol adapter (`http`, `sql`, or custom) |
| **Connection** | An object with `id`, `name`, `protocol`, and `config` |
| **Connection config** | Key/value parameters merged into action params |

Connections are stored in-memory in the agent and can be listed, created, and deleted through the API.

---

## Connection schema

```json
{
  "id": "local-http",
  "name": "Local HTTP target",
  "protocol": "http",
  "config": {
    "url": "https://example.com"
  }
}
```

---

## API endpoints

| Method | Path | Description |
|------|------|-------------|
| `POST` | `/connections` | Create a connection |
| `GET` | `/connections` | List all connections |
| `DELETE` | `/connections/{id}` | Delete a connection |

### Create connection example

```json
{
  "id": "local-http",
  "name": "Local HTTP target",
  "protocol": "http",
  "config": {
    "url": "https://example.com",
    "method": "GET"
  }
}
```

---

## Creating connections via the UI

1. Open the **Connections** page in the UI.
2. Enter an ID, display name, and protocol.
3. Provide JSON-backed config values through the form fields.
4. Click **Create connection**.

---

## Config examples by protocol

### HTTP Plugin

```json
{
  "url": "https://api.example.com/health",
  "method": "GET"
}
```

### SQL Plugin (stub)

```json
{
  "dsn": "server=localhost;database=demo"
}
```

---

## Listing connections

Use the REST API to inspect current connection objects:

```powershell
Invoke-RestMethod http://localhost:8080/connections
```

```json
[
  {
    "id": "local-http",
    "name": "Local HTTP target",
    "protocol": "http",
    "config": {
      "url": "https://example.com"
    }
  }
]
```
