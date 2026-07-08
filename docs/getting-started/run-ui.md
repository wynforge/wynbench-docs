---
id: run-ui
title: Run the UI
sidebar_position: 3
---

# Run the UI

The Wynbench UI is a React single-page application (SPA) that connects to a running agent over HTTP.

## Prerequisites

- The agent must already be [running](./run-agent) on `http://localhost:8080` (or your configured port).
- Node.js 20+ installed (for local dev server).

---

## Development server

Clone the repository and start the Vite dev server:

```bash
cd wynbench-ui
npm install
npm run dev
```

The dev server starts at `http://localhost:5173`.

---

## Connecting to the agent

Set `VITE_WYNBENCH_AGENT_HTTP_URL` if your agent is not on the default address:

```bash
VITE_WYNBENCH_AGENT_HTTP_URL=http://localhost:8080
```

If unset, the UI defaults to `http://localhost:8080`.

---

## UI overview

```
┌──────────────────────────────────────────────────────┐
│  Sidebar [ Connections | Actions | Workflows | Results ]
├─────────────────────┬────────────────────────────────┤
│   Navigation        │   Page content panel           │
│                     │                                │
│  ▸ Connections      │   Forms + execution results    │
│  ▸ Actions          │                                │
│  ▸ Workflows        │                                │
└─────────────────────┴────────────────────────────────┘
```

| Section | Purpose |
|---------|---------|
| **Connections** | Create, inspect, and delete stored agent connections |
| **Actions** | Execute one action against a selected plugin/connection |
| **Workflows** | Run ordered multi-step workflow payloads |
| **Results** | Review successful runs and errors |

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---------|-------------|-----|
| "Unable to connect" | Agent not running | Start the agent first |
| CORS errors in browser console | Agent not reachable or wrong port | Check the `go run ./cmd/server -addr ...` value |
| Empty connection selector | No saved connections | Create a connection from the Connections page first |
