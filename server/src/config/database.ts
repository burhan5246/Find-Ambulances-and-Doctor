import initSqlJs, { Database as SqlJsDatabase } from 'sql.js';
import path from 'path';
import fs from 'fs';
import { env } from './env';

/** Resolve the database path relative to process.cwd() (works in both dev and production) */
function resolveDatabasePath(): string {
  const dbPath = path.resolve(process.cwd(), env.DATABASE_PATH);
  const dbDir = path.dirname(dbPath);

  // Ensure the directory exists
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  return dbPath;
}

/**
 * Initialize the SQLite database with the services table.
 * Uses sql.js — a pure JavaScript SQLite implementation (no native deps).
 */
export async function initializeDatabase(dbPath?: string): Promise<SqlJsDatabase> {
  const resolvedPath = dbPath || resolveDatabasePath();
  const SQL = await initSqlJs();
  const isMemory = resolvedPath === ':memory:';

  let db: SqlJsDatabase;

  // Load existing database if it exists, otherwise create new
  if (!isMemory && fs.existsSync(resolvedPath)) {
    const fileBuffer = fs.readFileSync(resolvedPath);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }

  // Create table and indexes
  db.run(`
    CREATE TABLE IF NOT EXISTS services (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      title       TEXT    NOT NULL,
      description TEXT    NOT NULL,
      location    TEXT    NOT NULL,
      type        TEXT    NOT NULL CHECK(type IN ('ambulance', 'doctor')),
      image_url   TEXT,
      created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
      updated_at  TEXT    NOT NULL DEFAULT (datetime('now'))
    );
  `);

  db.run('CREATE INDEX IF NOT EXISTS idx_services_type ON services(type)');
  db.run('CREATE INDEX IF NOT EXISTS idx_services_created_at ON services(created_at DESC)');
  db.run('CREATE INDEX IF NOT EXISTS idx_services_title ON services(title)');

  // Save after schema creation (skip for in-memory)
  if (!isMemory) {
    saveDatabase(db, resolvedPath);
  }

  return db;
}

/** Save the in-memory database to disk */
export function saveDatabase(db: SqlJsDatabase, dbPath?: string): void {
  const resolvedPath = dbPath || resolveDatabasePath();
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(resolvedPath, buffer);
}

/** Singleton database instance for the application */
let dbInstance: SqlJsDatabase | null = null;
let dbPath: string | null = null;
let dbInitPromise: Promise<SqlJsDatabase> | null = null;

/**
 * Get the singleton database instance.
 * Uses a promise-based lock to prevent race conditions during concurrent initialization.
 */
export async function getDatabase(): Promise<SqlJsDatabase> {
  if (dbInstance) return dbInstance;

  // Prevent concurrent initialization — reuse the same promise
  if (!dbInitPromise) {
    dbInitPromise = initializeDatabase().then((db) => {
      dbInstance = db;
      dbPath = resolveDatabasePath();
      return db;
    });
  }

  return dbInitPromise;
}

/** Inject a database instance — used for tests with in-memory databases */
export function setDatabase(db: SqlJsDatabase): void {
  dbInstance = db;
  dbPath = null; // in-memory, no persistence
  dbInitPromise = Promise.resolve(db);
}

/** Save the current database state to disk */
export function persistDatabase(): void {
  if (dbInstance && dbPath) {
    saveDatabase(dbInstance, dbPath);
  }
}

export function closeDatabase(): void {
  if (dbInstance) {
    if (dbPath) {
      persistDatabase();
    }
    dbInstance.close();
    dbInstance = null;
    dbPath = null;
    dbInitPromise = null;
  }
}

export type { SqlJsDatabase };
