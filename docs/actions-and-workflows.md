---
id: actions-and-workflows
title: Actions & Workflows
sidebar_position: 7
---

# Actions & Workflows

## Actions

An **action** is the smallest unit of work in Wynbench. Each action is provided by a plugin and represents a single operation on a connection — sending a message, making an HTTP call, querying a database, and so on.

### Action descriptor

```csharp
public record ActionDescriptor(
    string Id,           // e.g. "msmq.send"
    string DisplayName,  // shown in the UI
    string Description,
    IReadOnlyList<ParameterDescriptor> Parameters,
    IReadOnlyList<OutputDescriptor> Outputs
);
```

### Example actions

| Plugin | Action ID | What it does |
|--------|-----------|-------------|
| MSMQ | `msmq.send` | Sends a message to a queue |
| MSMQ | `msmq.receive` | Receives the next message from a queue |
| HTTP | `http.get` | Performs a GET request |
| HTTP | `http.post` | Performs a POST request with a body |

---

## Workflows

A **workflow** is an ordered, directed graph of actions connected by transitions. Transitions can carry conditions, enabling branching and error-handling logic.

### Workflow definition (JSON)

```json
{
  "id": "process-order",
  "name": "Process Incoming Order",
  "trigger": {
    "type": "connection.message",
    "connectionId": "orders-queue"
  },
  "steps": [
    {
      "id": "step-1",
      "actionId": "msmq.receive",
      "connectionId": "orders-queue",
      "parameters": {},
      "transitions": [
        { "to": "step-2", "condition": "success" },
        { "to": "step-error", "condition": "failure" }
      ]
    },
    {
      "id": "step-2",
      "actionId": "http.post",
      "connectionId": "erp-api",
      "parameters": {
        "path": "/orders",
        "body": "{{step-1.outputs.messageBody}}"
      },
      "transitions": [
        { "to": null, "condition": "success" }
      ]
    },
    {
      "id": "step-error",
      "actionId": "http.post",
      "connectionId": "notify-webhook",
      "parameters": {
        "path": "/alerts",
        "body": "{\"error\": \"Order processing failed\"}"
      }
    }
  ]
}
```

---

## Triggers

Workflows are started by a **trigger**. Built-in trigger types:

| Trigger type | Description |
|-------------|-------------|
| `manual` | Started by an API call or UI button |
| `schedule` | Runs on a cron schedule |
| `connection.message` | Fires when a message arrives on a connection |
| `connection.state` | Fires when a connection changes state |
| `webhook` | Fires when the agent receives a POST to a dedicated URL |

---

## Template expressions

Step parameters support template expressions using `{{ }}` syntax:

```
{{step-1.outputs.messageBody}}   ← output of a previous step
{{env.MY_VAR}}                   ← environment variable
{{now}}                          ← current UTC timestamp (ISO 8601)
{{workflowId}}                   ← current workflow ID
```

---

## Workflow execution model

```
Trigger fires
     │
     ▼
Engine creates a Run instance
     │
     ▼
Execute Step 1
     │
     ├── success ──▶ Execute Step 2 ──▶ ... ──▶ Run completed
     │
     └── failure ──▶ Execute error step (if defined) ──▶ Run failed
```

Each run is recorded with full input/output data and status, accessible from the **Workflows → Run History** UI panel.
