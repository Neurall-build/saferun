interface Rule {
  name: string;
  category: 'READ' | 'WRITE' | 'ADMIN';
  pattern: string;
  action: 'allow' | 'block' | 'warn';
}

interface Config {
  port: number;
  targetUrl: string;
  dashboard: boolean;
  rules: Rule[];
}

export const defaultConfig: Config = {
  port: 3000,
  targetUrl: 'http://localhost:3001',
  dashboard: true,
  rules: [
    { name: 'Block DROP TABLE', category: 'WRITE', pattern: 'DROP TABLE', action: 'block' },
    { name: 'Block DELETE FILE', category: 'WRITE', pattern: 'DELETE', action: 'block' },
    { name: 'Block DROP DATABASE', category: 'ADMIN', pattern: 'DROP DATABASE', action: 'block' },
    { name: 'Warn DELETE operations', category: 'WRITE', pattern: 'delete', action: 'warn' },
    { name: 'Block truncate', category: 'WRITE', pattern: 'truncate', action: 'block' },
    { name: 'Allow all READ operations', category: 'READ', pattern: '*', action: 'allow' },
  ]
};

export function loadConfig(): Config {
  try {
    const fs = require('fs');
    if (fs.existsSync('.saferun.json')) {
      return { ...defaultConfig, ...JSON.parse(fs.readFileSync('.saferun.json', 'utf8')) };
    }
  } catch (e) {
    console.error('Error loading config:', e);
  }
  return defaultConfig;
}