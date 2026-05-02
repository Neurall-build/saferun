# SafeRun 🛡️

> "Stop letting your AI agents raw-dog your systems"

A secure testing proxy and flight simulator for AI agents using the Model Context Protocol (MCP).

## What is SafeRun?

SafeRun is a middleman proxy that sits between your AI agent and MCP servers. It intercepts, logs, and gives you control over every tool call your AI wants to make.

## Why do you need it?

- **Dangerous actions** - AI agents with `DROP TABLE` or `DELETE FILE` permissions can cause real damage
- **Cost** - Testing AI workflows repeatedly burns API credits
- **Non-deterministic** - When prompts change, tool-calling logic can break without warning

## Features

- 🔒 **Live Intercept Mode** - Watch in real-time, block or allow before execution
- 📊 **Session Recording** - Log all tool calls to local SQLite database
- 🎭 **Simulation Mode** - Dry-run dangerous operations without actually executing
- 🔄 **Replay & Diff** - Re-run identical queries and compare results
- 📋 **Risk Assessment** - Automatic risk level detection (low/medium/high)
- 🌐 **Dashboard** - Web UI for monitoring all MCP traffic

## Quick Start

```bash
# Install
npm install -g @neurall.build/saferun

# Start proxy (default port 3000, forward to MCP server at localhost:3001)
saferun start

# Or with custom options
saferun start --port 8080 --target http://my-mcp-server:3001

# View dashboard
open http://localhost:3000/
```

## How it works

```
AI Agent --> SafeRun Proxy --> MCP Server
              |
              +--> Logs to SQLite
              +--> Shows in Dashboard
              +--> Blocks if risky
```

## Configuration

Create `.saferun.json` to customize rules:

```json
{
  "port": 3000,
  "targetUrl": "http://localhost:3001",
  "rules": [
    { "category": "WRITE", "pattern": "DROP TABLE", "action": "block" },
    { "category": "READ", "pattern": "*", "action": "allow" }
  ]
}
```

## Commands

```bash
saferun start    # Start proxy server
saferun init     # Create default config
saferun rules    # List security rules
```

## Risk Categories

| Category | Description | Default Action |
|----------|-------------|----------------|
| READ     | Non-destructive read operations | Allow |
| WRITE    | Modify data, files, etc. | Warn |
| ADMIN    | Database admin, system-level | Block |

## License

MIT