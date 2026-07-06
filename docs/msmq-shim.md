---
id: msmq-shim
title: MSMQ Shim
sidebar_position: 9
---

# MSMQ Shim

The MSMQ shim (`Wynbench.Plugin.Msmq`) is the built-in protocol adapter that connects Wynbench to **Microsoft Message Queuing (MSMQ)** infrastructure.

---

## Why a shim?

MSMQ (`System.Messaging`) was deprecated in .NET Core and is not available on modern .NET runtimes without an interoperability layer. The shim provides:

1. A thin wrapper around the legacy COM-based MSMQ APIs.
2. An `IProtocolPlugin` implementation so the Wynbench agent can consume it like any other plugin.
3. Optional queue management helpers (create, delete, list queues).

---

## Architecture

```
WynbenchAgent.exe (.NET 8)
        │
        │  IProtocolPlugin interface
        ▼
Wynbench.Plugin.Msmq.dll (.NET 8)
        │
        │  P/Invoke / COM interop
        ▼
mqrt.dll  (MSMQ Windows component)
        │
        ▼
MSMQ Queue Manager (Windows Service)
```

The shim never references `System.Messaging` directly. Instead, it uses P/Invoke to call the underlying `MQSendMessage` / `MQReceiveMessage` Win32 APIs exposed by `mqrt.dll`.

---

## Prerequisites

- Windows with the MSMQ Windows Feature enabled:

```powershell
Enable-WindowsOptionalFeature -Online -FeatureName MSMQ-Server
```

- Queues must already exist (the shim can optionally create them, see configuration).

---

## Configuration

```json
{
  "id": "my-queue",
  "plugin": "Wynbench.Plugin.Msmq",
  "config": {
    "queuePath": ".\\private$\\myqueue",
    "accessMode": "ReadWrite",
    "recoverable": true,
    "timeoutMs": 5000,
    "createIfAbsent": false
  }
}
```

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `queuePath` | string | — | MSMQ path: `machinename\private$\queuename` or `.\private$\queuename` for local |
| `accessMode` | enum | `ReadWrite` | `Send`, `Receive`, or `ReadWrite` |
| `recoverable` | bool | `true` | Whether messages are written to disk (recoverable) |
| `timeoutMs` | int | `5000` | Receive timeout in milliseconds |
| `createIfAbsent` | bool | `false` | Create the queue if it doesn't exist |

---

## Supported actions

### `msmq.send`

Sends a text message to the configured queue.

```json
{
  "actionId": "msmq.send",
  "parameters": {
    "body": "Hello, queue!",
    "label": "Optional label",
    "correlationId": "{{step-0.outputs.messageId}}"
  }
}
```

**Outputs:**

| Name | Type | Description |
|------|------|-------------|
| `messageId` | string | The MSMQ-assigned message identifier |

---

### `msmq.receive`

Receives and removes the next message from the queue (blocks until timeout).

```json
{
  "actionId": "msmq.receive",
  "parameters": {
    "timeoutMs": 3000
  }
}
```

**Outputs:**

| Name | Type | Description |
|------|------|-------------|
| `messageId` | string | MSMQ message identifier |
| `label` | string | Message label |
| `body` | string | Message body text |
| `sentAt` | string | ISO 8601 timestamp of when the message was sent |

---

### `msmq.peek`

Reads the next message without removing it.

---

## Example workflow

```json
{
  "id": "relay-to-erp",
  "trigger": { "type": "schedule", "cron": "*/5 * * * *" },
  "steps": [
    {
      "id": "read-queue",
      "actionId": "msmq.receive",
      "connectionId": "orders-queue",
      "transitions": [
        { "to": "forward-to-erp", "condition": "success" }
      ]
    },
    {
      "id": "forward-to-erp",
      "actionId": "http.post",
      "connectionId": "erp-api",
      "parameters": {
        "path": "/orders/inbound",
        "body": "{{read-queue.outputs.body}}"
      }
    }
  ]
}
```

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---------|-------------|-----|
| `MQOpenQueue: 0xC00E0003` | Queue does not exist | Create the queue or set `createIfAbsent: true` |
| `Access denied` | Insufficient MSMQ permissions | Grant the service account read/write on the queue |
| Timeout on receive | No messages in queue | Normal if queue is empty; increase `timeoutMs` or use a trigger |
| Plugin not loaded | MSMQ not installed | Run `Enable-WindowsOptionalFeature` |
