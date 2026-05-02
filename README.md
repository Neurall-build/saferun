# SafeRun 🛡️

> **Stop letting your AI agents raw-dog your systems.**

A secure testing proxy and flight simulator for AI agents using the Model Context Protocol (MCP).

[![npm version](https://img.shields.io/npm/v/@neurall.build/saferun?style=flat-square)](https://www.npmjs.com/package/@neurall.build/saferun)
[![GitHub stars](https://img.shields.io/github/stars/Neurall-build/saferun?style=flat-square)](https://github.com/Neurall-build/saferun)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

---

## The Problem

You built an AI agent. It can delete files, drop tables, wipe databases.

You want to test it. But every test run is a potential disaster.

**What could go wrong?**

- `DELETE FROM users WHERE id=1` → oops, deleted ALL users
- `DROP TABLE orders` → there goes 6 months of data
- `rm -rf /` → dev machine gone

AI agents are powerful. Testing them shouldn't be a leap of faith.

---

## The Solution

SafeRun sits between your AI agent and MCP servers. It intercepts every tool call, logs it, assesses the risk, and lets you block dangerous operations before they execute.

**No more blind trust. No more held breath.**

```
┌─────────────┐     SafeRun      ┌─────────────┐
│   AI Agent  │ ──── proxy ──── │ MCP Server  │
│  (Claude,   │  intercepts &   │ (filesystem,│
│  GPT, etc.) │   blocks risky   │  database)  │
└─────────────┘                 └─────────────┘
```

---

## Features

### 🔒 Live Interception Mode
Watch your AI agent in real-time. See every tool call it wants to make.
Click **ALLOW** or **BLOCK** before it executes.

### 📊 Risk Assessment
Every tool call is scored: **LOW** 🟢, **MEDIUM** 🟡, or **HIGH** 🔴
Know exactly what your agent is about to do.

### 🎥 Session Recording
Full JSON-RPC audit trail. Replay, diff, and analyze every session.
Catch regressions before they ship.

### 🧪 Safe Simulation Mode
Mock responses for dangerous actions. Test your agent's logic without touching production.

### 📋 Default Security Rules
Blocks dangerous operations out of the box:
- `DROP TABLE` / `DROP DATABASE`
- `DELETE` without WHERE clause
- File deletions, sudo commands
- And more...

---

## Quick Start

```bash
# Install
npm install -g @neurall.build/saferun

# Start intercepting (AI agent → MCP server)
saferun start --port 3000

# Point your AI agent to SafeRun
export MCP_SERVER_URL="http://localhost:3000"

# Your AI agent now goes through SafeRun
```

Or use npx (no install):

```bash
npx @neurall.build/saferun start --port 3000
```

---

## Usage

### Start SafeRun

```bash
saferun start --port 3000
```

### Connect Your AI Agent

Point your AI agent to: `http://localhost:3000`

### Dashboard

Open `http://localhost:3000/dashboard` to see:
- Live tool calls
- Risk scores
- Block/Allow buttons
- Session history

### CLI Commands

```bash
# Show security rules
saferun rules

# List recent sessions
saferun sessions

# Replay a session
saferun replay <session-id>

# Run in dry-run mode (mock all responses)
saferun start --dry-run
```

---

## Configuration

Create `.saferun.json` in your project:

```json
{
  "rules": [
    { "name": "block-drop", "category": "ADMIN", "pattern": "DROP", "action": "block" },
    { "name": "warn-delete", "category": "WRITE", "pattern": "DELETE", "action": "warn" }
  ],
  "port": 3000,
  "logLevel": "info"
}
```

---

## API Reference

### Start Proxy

```bash
saferun start --port <port> [--dry-run]
```

### WebSocket Dashboard

```
ws://localhost:3000/dashboard
```

### REST API

```
GET  /sessions          # List all sessions
GET  /sessions/:id      # Get session details
POST /rules            # Add a rule
GET  /rules            # List all rules
```

---

## Why SafeRun?

| Feature | SafeRun | Manual Testing | Other Tools |
|---------|---------|---------------|-------------|
| Real-time interception | ✅ | ❌ | ❌ |
| Risk scoring | ✅ | ❌ | ❌ |
| One-click block | ✅ | ❌ | ❌ |
| Session replay | ✅ | ❌ | ❌ |
| Free & open source | ✅ | ✅ | ❌ |
| MCP native | ✅ | ❌ | ❌ |

---

## Roadmap

**v0.2 (Next)**
- Environment-specific rule profiles (dev agent can't reach prod credentials)
- Cost tracking & savings report
- Regression testing alerts

**v0.3**
- Custom profiles (banking, ecommerce, healthcare templates)
- API access for CI/CD pipelines
- Team collaboration features

---

## Community

- ⭐ Star us on [GitHub](https://github.com/Neurall-build/saferun)
- 📦 npm: [@neurall.build/saferun](https://www.npmjs.com/package/@neurall.build/saferun)
- 🐛 Issues: [GitHub Issues](https://github.com/Neurall-build/saferun/issues)

---

## Disclaimer

SafeRun is a testing tool. Don't run it against production without understanding what you're doing. Always review the logs. You're responsible for your own actions.

---

<p align="center">
Made with 🛡️ by <a href="https://github.com/Neurall-build">Neurall</a>
</p>
