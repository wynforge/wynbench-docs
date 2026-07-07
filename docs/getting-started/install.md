---
id: install
title: Installation
sidebar_position: 1
---

# Installation

This guide sets up a local development environment for the current Wynbench repositories.

## Prerequisites

| Requirement | Version |
|-------------|---------|
| Go | 1.23+ |
| Node.js | 20+ (UI only) |
| Git | Any recent version |

## Clone the repositories

```bash
git clone https://github.com/wynforge/wynbench-agent.git
git clone https://github.com/wynforge/wynbench-ui.git
git clone https://github.com/wynforge/wynbench-docs.git
```

## Install dependencies

### Agent

```bash
cd wynbench-agent
go mod download
```

### UI

```bash
cd ../wynbench-ui
npm install
```

### Docs

```bash
cd ../wynbench-docs
npm install
```

---

## Optional environment configuration

The UI uses this environment variable:

```bash
VITE_WYNBENCH_AGENT_HTTP_URL=http://localhost:8080
```

If unset, the UI defaults to `http://localhost:8080`.

---

## Verify the setup

Run these checks:

```bash
cd ../wynbench-agent
go test ./...

cd ../wynbench-ui
npm run build

cd ../wynbench-docs
npm run typecheck
```

---

## Next step

[Run the Agent →](./run-agent)
