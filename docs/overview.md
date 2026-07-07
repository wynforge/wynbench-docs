---
id: overview
title: Overview
sidebar_position: 1
---

# Wynbench Overview

Wynbench is a lightweight workflow execution stack composed of a Go agent, a React UI, and a Docusaurus documentation site.

It is composed of three repositories that work together:

| Component | Role |
|-----------|------|
| **wynbench-agent** | Go backend runtime with plugin registry, connection store, action execution, and workflow execution |
| **wynbench-ui** | Browser SPA for creating connections, running actions/workflows, and reviewing results |
| **wynbench-docs** | Docusaurus docs aligned to the current agent/UI contract |

---

## What Wynbench supports today

- **Protocol plugins** with a small core interface (`Name`, `Configure`, `Execute`).
- **Connections** stored in-memory and reusable by actions/workflows.
- **Single action execution** through `POST /actions/execute`.
- **Workflow execution** through `POST /workflows/run` for inline or stored workflow IDs.
- **Health probing** through `GET /health`.

---

## High-level architecture diagram

```
┌───────────────────────────────┐
│          Wynbench UI          │
│       (React + Vite SPA)      │
└───────────────┬───────────────┘
        │ HTTP JSON
┌───────────────▼───────────────┐
│        Wynbench Agent         │
│  API + stores + engine +      │
│      in-process plugins       │
└───────────────┬───────────────┘
        │
    ┌───────▼────────┐
    │ HTTP / SQL /   │
    │ other plugins  │
    └────────────────┘
```

---

## Next steps

- [Install Wynbench](./getting-started/install) to set up a local development environment.
- [Run the Agent](./getting-started/run-agent) to start the API server.
- [Run the UI](./getting-started/run-ui) to connect and execute actions/workflows.
