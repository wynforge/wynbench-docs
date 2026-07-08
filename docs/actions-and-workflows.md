---
id: actions-and-workflows
title: Actions & Workflows
sidebar_position: 7
---

# Actions & Workflows

## Actions

An **action** is the smallest executable unit in Wynbench. Actions are dispatched to a plugin by name.

### Action payload schema

```json
{
  "plugin": "http",
  "connection_id": "local-http",
  "params": {
    "url": "https://example.com",
    "method": "GET"
  }
}
```

### Example actions

| Plugin | Action ID | What it does |
|--------|-----------|-------------|
| HTTP | `http` | Performs HTTP requests based on `params.url`, `params.method`, and optional `params.body` |
| SQL (stub) | `sql` | Validates `params.query` and returns a stub result |

Execute an action:

```powershell
Invoke-RestMethod http://localhost:8080/actions/execute -Method Post -ContentType 'application/json' -Body '{"plugin":"http","params":{"url":"https://example.com","method":"GET"}}'
```

---

## Workflows

A **workflow** is an ordered list of steps. Each step has a name and an embedded action.

### Workflow definition (JSON)

```json
{
  "name": "smoke-test",
  "steps": [
    {
      "name": "fetch-homepage",
      "action": {
        "plugin": "http",
        "connection_id": "local-http",
        "params": {
          "url": "https://example.com",
          "method": "GET"
        }
      }
    },
    {
      "name": "run-query",
      "action": {
        "plugin": "sql",
        "params": {
          "query": "SELECT 1"
        }
      }
    }
  ]
}
```

---

## Running a stored workflow

Send a stored workflow ID when the workflow already exists in the in-memory workflow store:

```json
{ "id": "stored-workflow-id" }
```

---

## Stored workflow management

Wynbench also supports creating, listing, updating, and deleting stored workflows through the API.

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/workflows` | List stored workflows |
| `POST` | `/workflows` | Create a new workflow |
| `PUT` | `/workflows/{id}` | Update an existing workflow |
| `DELETE` | `/workflows/{id}` | Delete a workflow |

Stored workflows are persisted to the agent's local config file, so they can be restored when the agent restarts.

---

## Workflow execution model

```
Receive request
     │
     ▼
Validate workflow payload
     │
     ▼
Execute step 1
     │
  ├── success ──▶ Execute step 2 ──▶ ... ──▶ Run completed
     │
  └── failure ──▶ Stop execution and return failed run
```

The response includes `workflow_id`, a `results` array, and the overall `success` value.
