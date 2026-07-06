---
id: packaging-and-deployment
title: Packaging & Deployment
sidebar_position: 10
---

# Packaging & Deployment

This page covers the high-level process of packaging Wynbench for production and the deployment options available.

---

## Overview

```
Source code
    │
    ▼
CI build (dotnet build / npm run build)
    │
    ▼
Wynbench Packager
    │
    ├─ Agent binary
    ├─ UI bundle
    ├─ Selected plugins
    └─ Configuration template
    │
    ▼
wynbench-<version>.zip
    │
    ▼
Target host (Windows)
    │
    ├─ Extract archive
    ├─ Edit config/agent.json
    └─ Run install.ps1 (optional Windows Service installer)
```

---

## Building a release

### 1. Run CI or build locally

```powershell
# Build agent
dotnet publish src/WynbenchAgent -c Release -o artifacts/agent

# Build UI
cd src/WynbenchUI && npm ci && npm run build
Copy-Item dist/* ../artifacts/ui/

# Build plugins
dotnet publish src/Plugins/Wynbench.Plugin.Msmq -c Release -o artifacts/agent/plugins
dotnet publish src/Plugins/Wynbench.Plugin.Http  -c Release -o artifacts/agent/plugins
```

### 2. Run the packager

```powershell
dotnet tool run wynbench-pack \
  --manifest wynbench.pack.json \
  --version 1.2.0 \
  --output dist/
```

This produces `dist/wynbench-1.2.0.zip`.

---

## Deployment options

### Standalone executable

Unzip the archive and run the agent directly:

```powershell
Expand-Archive wynbench-1.2.0.zip -DestinationPath C:\Wynbench
cd C:\Wynbench\agent
.\WynbenchAgent.exe
```

### Windows Service

Use the included installer script:

```powershell
cd C:\Wynbench
.\install.ps1 -ServiceName WynbenchAgent -Port 5050
```

The script:
1. Creates a Windows Service under the Local System account.
2. Sets the service to auto-start on boot.
3. Opens the configured port in Windows Firewall.

### Docker (Windows containers)

```dockerfile
FROM mcr.microsoft.com/dotnet/runtime:8.0-windowsservercore-ltsc2022
WORKDIR /app
COPY agent/ .
EXPOSE 5050
ENTRYPOINT ["WynbenchAgent.exe"]
```

```powershell
docker build -t wynbench-agent:1.2.0 .
docker run -p 5050:5050 wynbench-agent:1.2.0
```

:::caution
MSMQ requires direct access to the Windows MSMQ service and is **not supported inside a Docker container**. Use the standalone or Windows Service deployment model when the MSMQ plugin is required.
:::

---

## Configuration in production

Sensitive values (API keys, passwords) should **never** be stored in `agent.json`. Use environment variable placeholders:

```json
{
  "connections": [
    {
      "id": "erp-api",
      "plugin": "Wynbench.Plugin.Http",
      "config": {
        "baseUrl": "https://erp.example.com/api",
        "apiKeyValue": "${ERP_API_KEY}"
      }
    }
  ]
}
```

Set the environment variable before starting the agent:

```powershell
[System.Environment]::SetEnvironmentVariable(
  "ERP_API_KEY", "super-secret",
  [System.EnvironmentVariableTarget]::Machine
)
```

---

## Health monitoring

The agent exposes a health endpoint suitable for load balancers and monitoring tools:

```
GET http://<host>:5050/health
```

Integrate with your monitoring system:

```yaml
# Example: Prometheus scrape config
scrape_configs:
  - job_name: wynbench
    static_configs:
      - targets: ['wynbench-host:5050']
    metrics_path: /metrics
```

---

## See also

- [Packager Architecture](./architecture/packager)
- [Getting Started — Install](./getting-started/install)
