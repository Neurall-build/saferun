#!/usr/bin/env bun

import { Command } from 'commander';
import { startProxy } from './proxy.js';
import { initDatabase } from './db.js';
import { loadConfig, defaultConfig } from './config.js';

const program = new Command();

program
  .name('saferun')
  .description('Stop letting your AI agents raw-dog your systems. A secure testing proxy for MCP-powered AI agents.')
  .version('0.1.0');

program
  .command('start')
  .description('Start the SafeRun proxy server')
  .option('-p, --port <port>', 'Port to listen on', '3000')
  .option('-t, --target <url>', 'Target MCP server URL', 'http://localhost:3001')
  .option('-d, --dashboard', 'Enable dashboard', true)
  .action(async (options) => {
    console.log('🛡️  SafeRun v0.1.0 - MCP Security Proxy');
    console.log('─'.repeat(50));
    
    // Initialize database
    await initDatabase();
    console.log('✓ Database initialized');
    
    // Load config
    const config = loadConfig();
    console.log(`✓ Config loaded (${config.rules.length} rules)`);
    
    // Start proxy
    await startProxy({
      port: parseInt(options.port),
      targetUrl: options.target,
      enableDashboard: options.dashboard !== false,
      config
    });
  });

program
  .command('init')
  .description('Initialize SafeRun in current directory')
  .action(() => {
    console.log('📁 Creating SafeRun config...');
    // Create default config file
    const fs = require('fs');
    fs.writeFileSync('.saferun.json', JSON.stringify(defaultConfig, null, 2));
    console.log('✓ Created .saferun.json');
  });

program
  .command('rules')
  .description('List current security rules')
  .action(() => {
    const config = loadConfig();
    console.log('\n📋 Security Rules:');
    console.log('─'.repeat(40));
    config.rules.forEach((rule: any, i: number) => {
      console.log(`${i + 1}. [${rule.category}] ${rule.action}: ${rule.pattern}`);
    });
  });

program.parse();