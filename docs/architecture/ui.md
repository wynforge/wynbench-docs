---
id: ui
title: UI
sidebar_position: 2
---

# UI Architecture

The Wynbench UI is a React single-page application built with Vite and TypeScript. It communicates with the agent over HTTP JSON endpoints.

---

## Technology stack

| Layer | Technology |
|-------|-----------|
| Framework | React |
| Bundler | Vite |
| State management | React context + reducer |
| Routing | react-router-dom |
| HTTP client | fetch |

---

## Component hierarchy

```
<App>
 ├── <StoreProvider>
 │   ├── <Sidebar>
 │   └── Routes
 │       ├── <ConnectionsPage>
 │       ├── <ActionsPage>
 │       ├── <WorkflowsPage>
 │       └── <ResultsPage>
```

---

## State management

Global state is managed through a typed context (`StoreProvider`):

```typescript
interface StoreState {
  connections: ConnectionRecord[];
  results: AgentResult[];
  agentStatus: 'checking' | 'online' | 'offline';
}
```

The provider performs an initial health check and exposes helper actions for appending results and managing connections.

---

## API interaction pattern

Each page sends explicit requests to the agent API:

| Page | API usage |
|------|-----------|
| Connections | `GET/POST/DELETE /connections` |
| Actions | `POST /actions/execute` |
| Workflows | `POST /workflows/run` |
| Results | Displays in-memory result history |

---

## Building for production

```bash
npm run build
```

The output in `dist/` is a fully static bundle that can be:
- Hosted by any static web server
- Served behind a reverse proxy with the agent API
