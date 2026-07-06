---
id: overview
title: Overview
sidebar_position: 1
---

# Wynbench Overview

Wynbench is an **intelligent workflow automation platform** designed to connect disparate systems, execute multi-step actions, and surface real-time operational insight through a visual UI.

It is composed of four main parts that work together:

| Component | Role |
|-----------|------|
| **Agent** | Headless runtime that manages connections and executes workflows |
| **UI** | Browser-based designer and monitoring dashboard |
| **Plugins** | Protocol adapters that extend the agent's connectivity |
| **Packager** | Build tool that bundles the platform for deployment |

---

## What problems does Wynbench solve?

- **Legacy system integration** — connect MSMQ, COM-based services, and proprietary protocols alongside modern REST and message-bus systems.
- **Workflow automation** — model multi-step business processes as directed graphs of actions and conditionals.
- **Operational visibility** — monitor live workflow state, message throughput, and error conditions from a single dashboard.
- **Reproducible deployments** — the packager produces a self-contained archive that can be installed on any supported Windows host.

---

## High-level architecture diagram

```
┌─────────────────────────────────────────────────┐
│                  Wynbench UI                    │
│  (React SPA — workflow designer & dashboard)    │
└───────────────────┬─────────────────────────────┘
                    │ WebSocket / REST
┌───────────────────▼─────────────────────────────┐
│                 Wynbench Agent                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐  │
│  │ Workflow  │  │Connection│  │  Plugin Host │  │
│  │ Engine   │  │ Manager  │  │              │  │
│  └──────────┘  └────┬─────┘  └──────┬───────┘  │
└───────────────────  │  ─────────────│───────────┘
                      │               │
           ┌──────────▼───────────────▼──────────┐
           │           Plugin Modules             │
           │  MSMQ Shim │ HTTP │ AMQP │  ...     │
           └──────────────────────────────────────┘
```

---

## Next steps

- [Install Wynbench](./getting-started/install) — set up the platform on your machine.
- [Architecture deep-dive](./architecture/agent) — understand each component in detail.
- [Plugin development guide](./plugin-development) — build your own protocol adapter.
