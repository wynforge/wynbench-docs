---
id: run-ui
title: Run the UI
sidebar_position: 3
---

# Run the UI

The Wynbench UI is a React single-page application (SPA) that connects to a running agent over HTTP and WebSocket.

## Prerequisites

- The agent must already be [running](./run-agent) on `http://localhost:5050` (or your configured port).
- Node.js 20+ installed (for local dev server).

---

## Option 1 — Serve the pre-built UI

The agent can host the compiled UI bundle directly. Place the contents of `ui/` inside `agent/wwwroot/`, then open:

```
http://localhost:5050
```

---

## Option 2 — Development server

Clone the repository and start the Vite dev server:

```bash
cd src/WynbenchUI
npm install
npm run dev
```

The dev server starts at `http://localhost:5173` and proxies API calls to `http://localhost:5050`.

---

## Connecting to the agent

On first load the UI will prompt for the agent address:

```
Agent URL:  http://localhost:5050
            [Connect]
```

Enter the address and click **Connect**. A green status indicator confirms the connection.

---

## UI overview

```
┌──────────────────────────────────────────────────────┐
│  Navbar  [ Workflows | Connections | Plugins | Logs ] │
├─────────────────────┬────────────────────────────────┤
│   Sidebar           │   Canvas / Detail panel        │
│                     │                                │
│  ▸ My Workflows     │   (Drag-and-drop workflow      │
│  ▸ Connections      │    designer or live monitor)   │
│  ▸ Plugin Registry  │                                │
└─────────────────────┴────────────────────────────────┘
```

| Section | Purpose |
|---------|---------|
| **Workflows** | Create, edit, and run workflow definitions |
| **Connections** | Manage connection instances per plugin |
| **Plugins** | Browse loaded protocol adapters |
| **Logs** | Real-time agent log stream |

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---------|-------------|-----|
| "Unable to connect" | Agent not running | Start the agent first |
| CORS errors in browser console | Wrong agent URL | Check `listenPort` in `agent.json` |
| Blank canvas | No workflows defined yet | Create a new workflow from the sidebar |
