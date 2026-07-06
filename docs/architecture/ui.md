---
id: ui
title: UI
sidebar_position: 2
---

# UI Architecture

The Wynbench UI is a React 18 single-page application (SPA) built with Vite. It communicates with the agent exclusively over HTTP REST and a WebSocket event stream.

---

## Technology stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 |
| Bundler | Vite |
| State management | Zustand |
| Workflow canvas | React Flow |
| HTTP client | fetch / Axios |
| Real-time updates | WebSocket |

---

## Component hierarchy

```
<App>
 ├── <NavBar>
 ├── <AgentConnectionGate>   ← blocks render until agent is reachable
 │   ├── <WorkflowsPage>
 │   │   ├── <WorkflowList>
 │   │   └── <WorkflowCanvas>   ← React Flow graph editor
 │   ├── <ConnectionsPage>
 │   │   ├── <ConnectionList>
 │   │   └── <ConnectionForm>
 │   ├── <PluginsPage>
 │   │   └── <PluginCard[]>
 │   └── <LogsPage>
 │       └── <LogStream>        ← WebSocket feed
 └── <StatusBar>
```

---

## State management

Global state is managed with **Zustand** stores:

```typescript
// Example: agent connection store
interface AgentStore {
  url: string;
  status: 'disconnected' | 'connecting' | 'connected' | 'error';
  connect: (url: string) => Promise<void>;
  disconnect: () => void;
}
```

Each resource type (workflows, connections, plugins) has its own slice.

---

## WebSocket event stream

The UI subscribes to the agent WebSocket at `/ws` after connecting. Events are JSON-encoded:

```json
{
  "type": "workflow.run.started",
  "workflowId": "abc-123",
  "timestamp": "2025-01-01T12:00:00Z",
  "payload": {}
}
```

Common event types:

| Event | Description |
|-------|-------------|
| `workflow.run.started` | A workflow run has begun |
| `workflow.run.completed` | A workflow run finished successfully |
| `workflow.run.failed` | A workflow run encountered an error |
| `connection.state.changed` | A connection went online or offline |
| `agent.log` | A log line from the agent |

---

## Building for production

```bash
npm run build
```

The output in `dist/` is a fully static bundle that can be:
- Hosted by the agent itself (place in `wwwroot/`)
- Deployed to any static file host
- Packaged with the Wynbench packager
