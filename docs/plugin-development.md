---
id: plugin-development
title: Plugin Development Guide
sidebar_position: 8
---

# Plugin Development Guide

This guide walks through building a Wynbench protocol plugin from scratch. Plugins are .NET 8 class libraries that implement the `IProtocolPlugin` interface.

---

## 1. Create the project

```bash
dotnet new classlib -n Wynbench.Plugin.MyProtocol --framework net8.0
cd Wynbench.Plugin.MyProtocol
dotnet add package Wynbench.Plugin.Abstractions
```

---

## 2. Implement `IProtocolPlugin`

```csharp
using Wynbench.Plugin.Abstractions;

namespace Wynbench.Plugin.MyProtocol;

public class MyProtocolPlugin : IProtocolPlugin
{
    public string Name => "MyProtocol";
    public string Version => "1.0.0";

    public IConnection CreateConnection(ConnectionConfig config)
    {
        // Validate required fields
        if (!config.TryGetValue("serverUrl", out var serverUrl))
            throw new ArgumentException("'serverUrl' is required");

        return new MyProtocolConnection(serverUrl);
    }

    public IReadOnlyList<ActionDescriptor> GetActions() =>
    [
        new ActionDescriptor(
            Id: "myprotocol.send",
            DisplayName: "Send Message",
            Description: "Sends a message to the remote server.",
            Parameters:
            [
                new ParameterDescriptor("payload", "string", required: true,
                    description: "The message payload to send.")
            ],
            Outputs: [new OutputDescriptor("statusCode", "int")]
        ),
    ];
}
```

---

## 3. Implement `IConnection`

```csharp
using Wynbench.Plugin.Abstractions;

namespace Wynbench.Plugin.MyProtocol;

public class MyProtocolConnection : IConnection
{
    private readonly string _serverUrl;
    private ConnectionState _state = ConnectionState.Disconnected;

    public MyProtocolConnection(string serverUrl)
    {
        _serverUrl = serverUrl;
    }

    public ConnectionState State => _state;

    public async Task ConnectAsync(CancellationToken cancellationToken = default)
    {
        // TODO: open transport to _serverUrl
        _state = ConnectionState.Connected;
        await Task.CompletedTask;
    }

    public async Task DisconnectAsync(CancellationToken cancellationToken = default)
    {
        // TODO: close transport
        _state = ConnectionState.Disconnected;
        await Task.CompletedTask;
    }

    public async Task<ActionResult> ExecuteActionAsync(
        string actionId,
        IDictionary<string, object> parameters,
        CancellationToken cancellationToken = default)
    {
        return actionId switch
        {
            "myprotocol.send" => await SendAsync(parameters, cancellationToken),
            _ => ActionResult.Failure($"Unknown action: {actionId}")
        };
    }

    private async Task<ActionResult> SendAsync(
        IDictionary<string, object> parameters,
        CancellationToken cancellationToken)
    {
        var payload = parameters["payload"].ToString()!;

        // TODO: transmit payload
        await Task.CompletedTask;

        return ActionResult.Success(new Dictionary<string, object>
        {
            ["statusCode"] = 200
        });
    }
}
```

---

## 4. Deploy the plugin

1. Build the plugin:

```bash
dotnet build --configuration Release
```

2. Copy the output DLL to the agent's `plugins/` directory:

```powershell
Copy-Item bin\Release\net8.0\Wynbench.Plugin.MyProtocol.dll `
    C:\Wynbench\agent\plugins\
```

3. Restart the agent. The new plugin should appear in the agent log:

```
[INFO] Loaded plugin: MyProtocol (v1.0.0)
```

---

## 5. Best practices

- **Validate config eagerly** in `CreateConnection` and throw descriptive `ArgumentException` messages — these are surfaced in the UI.
- **Never throw from `ExecuteActionAsync`** — return `ActionResult.Failure(message)` instead.
- **Implement `IAsyncDisposable`** on your connection to clean up resources when the agent shuts down.
- **Avoid static mutable state** — multiple connection instances of the same plugin type may run concurrently.
- **Target `net8.0`** and avoid depending on types from `System.Messaging` directly; use the MSMQ shim if you need queuing.

---

## 6. Testing your plugin

```csharp
[Fact]
public async Task SendAsync_ReturnsSuccess()
{
    var plugin = new MyProtocolPlugin();
    var connection = plugin.CreateConnection(new ConnectionConfig
    {
        ["serverUrl"] = "http://localhost:9999"
    });

    await connection.ConnectAsync();

    var result = await connection.ExecuteActionAsync("myprotocol.send",
        new Dictionary<string, object> { ["payload"] = "hello" });

    Assert.True(result.Succeeded);
}
```

---

## See also

- [Plugin Architecture](./architecture/plugins)
- [MSMQ Shim](./msmq-shim) — reference implementation
