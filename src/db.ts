import Database from 'better-sqlite3';
import { join } from 'path';

let db: Database.Database;

export interface SessionRecord {
  id: number;
  timestamp: string;
  method: string;
  params: string;
  result: string;
  error: string | null;
  duration: number;
  risk_level: string;
  action_taken: string;
}

export function initDatabase(): void {
  const dbPath = join(process.cwd(), 'saferun.db');
  db = new Database(dbPath);
  
  db.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
      method TEXT NOT NULL,
      params TEXT,
      result TEXT,
      error TEXT,
      duration INTEGER,
      risk_level TEXT DEFAULT 'low',
      action_taken TEXT DEFAULT 'allowed'
    );
    
    CREATE TABLE IF NOT EXISTS rules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      pattern TEXT NOT NULL,
      action TEXT NOT NULL,
      enabled INTEGER DEFAULT 1
    );
    
    CREATE TABLE IF NOT EXISTS mocks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      method TEXT NOT NULL,
      mock_response TEXT NOT NULL,
      condition TEXT
    );
  `);
  
  // Insert default rules if none exist
  const count = db.prepare('SELECT COUNT(*) as c FROM rules').get() as { c: number };
  if (count.c === 0) {
    const insertRule = db.prepare('INSERT INTO rules (name, category, pattern, action) VALUES (?, ?, ?, ?)');
    insertRule.run('Block DROP TABLE', 'WRITE', 'DROP TABLE', 'block');
    insertRule.run('Block DELETE FILE', 'WRITE', 'DELETE', 'block');
    insertRule.run('Block DROP DATABASE', 'ADMIN', 'DROP DATABASE', 'block');
    insertRule.run('Warn DELETE', 'WRITE', 'DELETE', 'warn');
    insertRule.run('Allow READ', 'READ', '*', 'allow');
  }
}

export function logSession(session: Omit<SessionRecord, 'id' | 'timestamp'>): void {
  const stmt = db.prepare(`
    INSERT INTO sessions (method, params, result, error, duration, risk_level, action_taken)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(session.method, session.params, session.result, session.error, session.duration, session.risk_level, session.action_taken);
}

export function getSessions(limit = 50): SessionRecord[] {
  const stmt = db.prepare('SELECT * FROM sessions ORDER BY timestamp DESC LIMIT ?');
  return stmt.all(limit) as SessionRecord[];
}

export function getRules() {
  const stmt = db.prepare('SELECT * FROM rules WHERE enabled = 1');
  return stmt.all();
}