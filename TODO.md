# SafeRun - Production Ready To-Do List

## Project Overview
- **Name:** SafeRun
- **Tagline:** "Stop letting your AI agents raw-dog your systems"
- **Type:** MCP Proxy / Testing Tool for AI Agents
- **Tech Stack:** Bun + Hono + SQLite + TypeScript
- **Distribution:** npm (@neurall.build/saferun)

---

## Phase 1: Foundation (Day 1-2)

### 1.1 Project Setup
- [ ] Create GitHub repo: `Neurall-build/saferun`
- [ ] Initialize npm package: `@neurall.build/saferun`
- [ ] Setup Bun project structure
- [ ] Add TypeScript configuration
- [ ] Setup eslint/prettier
- [ ] Add CI/CD (GitHub Actions)

### 1.2 Core Interceptor
- [ ] Build Bun + Hono proxy server
- [ ] Implement JSON-RPC passthrough
- [ ] Add request/response logging to SQLite
- [ ] Create basic CLI: `safurun start --port 3000`
- [ ] Add graceful shutdown handling

### 1.3 Configuration System
- [ ] Create config file structure (~/.safurun/config.json)
- [ ] Implement rule engine (WRITE/READ/ADMIN categories)
- [ ] Add rule matching (regex support)
- [ ] Create CLI commands:
  - [ ] `safurun config add-rule`
  - [ ] `safurun config list-rules`
  - [ ] `safurun config remove-rule`

---

## Phase 2: Dashboard & Monitoring (Day 3)

### 2.1 Live Dashboard
- [ ] Setup WebSocket for real-time updates
- [ ] Create dashboard UI (HTML + vanilla JS)
- [ ] Display live request stream
- [ ] Show block/allow buttons per request
- [ ] Add session timer and cost tracker

### 2.2 Risk Detection
- [ ] Pre-built dangerous operation patterns:
  - DELETE, DROP, TRUNCATE, rm -rf
  - CREATE DATABASE, DROP TABLE
  - sudo, chmod 777
- [ ] Auto-tag operations by risk category
- [ ] Visual indicators (red/yellow/green)

---

## Phase 3: Replay & Diff Engine (Day 4-5)

### 3.1 Session Replay
- [ ] Implement session recording (SQLite)
- [ ] Create replay CLI command
- [ ] Add timestamp and latency display
- [ ] Show full request/response diff

### 3.2 Diff Engine
- [ ] JSON diff comparison
- [ ] Detect structural changes in tool calls
- [ ] Highlight breaking changes
- [ ] Generate diff report (text + HTML)

### 3.3 Regression Testing
- [ ] Implement prompt change detection
- [ ] Compare old vs new tool-call patterns
- [ ] Flag regressions automatically
- [ ] Save baseline for future comparisons

---

## Phase 4: Safe Simulation (Day 6)

### 4.1 Mock Engine
- [ ] Build dry-run mode
- [ ] Implement response mocking
- [ ] Add success/failure simulation
- [ ] Create custom mock responses

### 4.2 Cost Simulation
- [ ] Track API call costs per session
- [ ] Estimate costs for replay scenarios
- [ ] Display savings report
- [ ] Add cost alerts threshold

---

## Phase 5: Launch Ready (Day 7)

### 5.1 Documentation
- [ ] Write comprehensive README.md
- [ ] Create usage examples
- [ ] Add architecture diagram
- [ ] Write CONTRIBUTING.md
- [ ] Create CHANGELOG.md

### 5.2 Distribution
- [ ] Publish to npm (@neurall.build/saferun)
- [ ] Create GitHub Releases
- [ ] Add license (MIT)
- [ ] Setup npm badges

### 5.3 Launch Assets
- [ ] Record terminal demo video
- [ ] Create Product Hunt draft
- [ ] Write Hacker News launch post
- [ ] Draft Twitter/X announcement
- [ ] Create demo screenshots

---

## Post-Launch Ideas (Pro Features)

- [ ] Web dashboard (React)
- [ ] Cloud sync for sessions
- [ ] Team collaboration
- [ ] Custom profiles (banking, ecommerce)
- [ ] Integration with Claude/Copilot
- [ ] Rate limiting features
- [ ] API access for CI/CD

---

## References
- Original spec: /home/workspace/Ideas/MCP-Testbench-2026.md
- Project location: /home/workspace/Projects/SafeRun/
