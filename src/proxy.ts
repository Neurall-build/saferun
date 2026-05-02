import { Hono } from 'hono';
import { WebSocketServer, WebSocket } from 'ws';
import { createServer } from 'http';
import { logSession, getRules } from './db.js';

interface ProxyOptions {
  port: number;
  targetUrl: string;
  enableDashboard: boolean;
  config: any;
}

interface MCPMessage {
  jsonrpc: string;
  id?: number | string;
  method: string;
  params?: any;
}

interface Rule {
  category: string;
  pattern: string;
  action: 'allow' | 'block' | 'warn';
}

export function startProxy(options: ProxyOptions): void {
  const app = new Hono();
  const wss = new WebSocketServer({ noServer: true });
  
  // Dashboard clients
  const dashboardClients: Set<WebSocket> = new Set();
  
  // Risk level determination
  function assessRisk(method: string): { level: string; matchedRule: Rule | null } {
    const rules = getRules() as Rule[];
    
    for (const rule of rules) {
      if (rule.pattern === '*') {
        return { level: rule.category === 'WRITE' ? 'medium' : 'low', matchedRule: rule };
      }
      if (method.toLowerCase().includes(rule.pattern.toLowerCase())) {
        return { level: rule.category === 'ADMIN' ? 'high' : rule.category === 'WRITE' ? 'medium' : 'low', matchedRule: rule };
      }
    }
    return { level: 'low', matchedRule: null };
  }
  
  // Broadcast to dashboard
  function broadcastToDashboard(data: any): void {
    const message = JSON.stringify(data);
    dashboardClients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }
  
  // Handle MCP proxy requests
  app.post('/mcp', async (c) => {
    const body = await c.req.json() as MCPMessage;
    const startTime = Date.now();
    
    // Assess risk
    const { level, matchedRule } = assessRisk(body.method);
    
    // Determine action
    let action = 'allowed';
    if (matchedRule?.action === 'block') {
      action = 'blocked';
      
      // Broadcast blocked action
      broadcastToDashboard({
        type: 'block',
        method: body.method,
        params: body.params,
        risk: level,
        timestamp: new Date().toISOString()
      });
      
      return c.json({
        jsonrpc: '2.0',
        id: body.id,
        error: { code: -32000, message: `SafeRun blocked: ${body.method} matches rule "${matchedRule?.name}"` }
      });
    }
    
    // Forward to target MCP server
    try {
      const targetResponse = await fetch(options.targetUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      const result = await targetResponse.json();
      const duration = Date.now() - startTime;
      
      // Log session
      logSession({
        method: body.method,
        params: JSON.stringify(body.params),
        result: JSON.stringify(result),
        error: result.error ? JSON.stringify(result.error) : null,
        duration,
        risk_level: level,
        action_taken: action
      });
      
      // Broadcast to dashboard
      broadcastToDashboard({
        type: 'call',
        method: body.method,
        params: body.params,
        result: result,
        risk: level,
        action,
        duration,
        timestamp: new Date().toISOString()
      });
      
      return c.json(result);
    } catch (error: any) {
      logSession({
        method: body.method,
        params: JSON.stringify(body.params),
        result: null,
        error: error.message,
        duration: Date.now() - startTime,
        risk_level: level,
        action_taken: 'error'
      });
      
      return c.json({
        jsonrpc: '2.0',
        id: body.id,
        error: { code: -32603, message: `Proxy error: ${error.message}` }
      });
    }
  });
  
  // Dashboard WebSocket
  app.get('/ws', async (c) => {
    // Upgrade to WebSocket
    const sock = new WebSocket('');
    wss.handleUpgrade(c.req.raw, c.req.raw as any, sock);
    
    dashboardClients.add(sock);
    sock.on('close', () => dashboardClients.delete(sock));
  });
  
  // Dashboard HTML
  app.get('/', async (c) => {
    return c.html(`
<!DOCTYPE html>
<html>
<head>
  <title>SafeRun Dashboard</title>
  <style>
    body { font-family: monospace; background: #0a0a0a; color: #00ff00; padding: 20px; }
    h1 { color: #ff6b6b; }
    .call { border: 1px solid #333; padding: 10px; margin: 5px 0; border-radius: 5px; }
    .blocked { border-color: #ff0000; background: rgba(255,0,0,0.1); }
    .allowed { border-color: #00ff00; }
    .high { border-color: #ffaa00; }
    pre { background: #111; padding: 10px; overflow-x: auto; }
  </style>
</head>
<body>
  <h1>🛡️ SafeRun Dashboard</h1>
  <p>Monitoring MCP traffic...</p>
  <div id="calls"></div>
  <script>
    const ws = new WebSocket('ws://' + location.host + '/ws');
    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      const div = document.createElement('div');
      div.className = 'call ' + data.action;
      div.innerHTML = '<strong>' + data.action.toUpperCase() + '</strong>: ' + data.method + 
        ' <span style="color:#' + (data.risk === 'high' ? 'ffaa00' : data.risk === 'medium' ? 'ff6b6b' : '00ff00') + '">[' + data.risk + ']</span>' +
        '<br><small>' + (data.duration ? data.duration + 'ms' : '') + '</small>';
      document.getElementById('calls').prepend(div);
    };
  </script>
</body>
</html>
    `);
  });
  
  // HTTP server
  const server = createServer(app.fetch);
  server.listen(options.port, () => {
    console.log('✓ Proxy listening on http://localhost:' + options.port);
    console.log('✓ Forwarding to: ' + options.targetUrl);
    if (options.enableDashboard) {
      console.log('✓ Dashboard: http://localhost:' + options.port + '/');
    }
  });
}