import { Database as SqlJsDatabase } from 'sql.js';
import { getDatabase, persistDatabase } from '../config/database';
import {
  ServiceRow,
  Service,
  CreateServiceInput,
  UpdateServiceInput,
  ListServicesParams,
  PaginationMeta,
  ServiceTotals,
  toService,
} from '../models/Service';
import { ApiError } from '../utils/ApiError';

/** Column list — avoids SELECT * for maintainability */
const SERVICE_COLUMNS = 'id, title, description, location, type, image_url, created_at, updated_at';

/**
 * Helper to run a query and return all result rows as typed objects.
 * sql.js returns results as arrays of values with column metadata.
 */
function queryAll<T = Record<string, unknown>>(db: SqlJsDatabase, sql: string, params: unknown[] = []): T[] {
  const stmt = db.prepare(sql);
  stmt.bind(params);

  const rows: T[] = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject() as T);
  }
  stmt.free();
  return rows;
}

/**
 * Helper to run a query and return the first row as a typed object, or null.
 */
function queryOne<T = Record<string, unknown>>(db: SqlJsDatabase, sql: string, params: unknown[] = []): T | null {
  const stmt = db.prepare(sql);
  stmt.bind(params);

  let row: T | null = null;
  if (stmt.step()) {
    row = stmt.getAsObject() as T;
  }
  stmt.free();
  return row;
}

/**
 * Helper to run a modification query (INSERT, UPDATE, DELETE).
 */
function runSql(db: SqlJsDatabase, sql: string, params: unknown[] = []): void {
  db.run(sql, params);
}

/**
 * Escape SQL LIKE wildcard characters (%, _) in user input.
 * Without this, searching for "%" would match all rows.
 */
function escapeLike(value: string): string {
  return value.replace(/[%_]/g, '\\$&');
}

// ─── Public API (functional) ──────────────────────────────────────────────────

/**
 * List services with pagination, filtering, and search.
 * Also computes type totals in a single pass.
 */
export async function listServices(params: ListServicesParams): Promise<{
  data: Service[];
  pagination: PaginationMeta;
  totals: ServiceTotals;
}> {
  const db = await getDatabase();
  const { page, limit, type, search } = params;
  const offset = (page - 1) * limit;

  // Build dynamic WHERE clause
  const conditions: string[] = [];
  const queryParams: unknown[] = [];

  if (type) {
    conditions.push('type = ?');
    queryParams.push(type);
  }

  if (search) {
    conditions.push("(title LIKE ? ESCAPE '\\' OR location LIKE ? ESCAPE '\\')");
    const searchPattern = `%${escapeLike(search)}%`;
    queryParams.push(searchPattern, searchPattern);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  // Count total matching records
  const countResult = queryOne<{ count: number }>(db, `SELECT COUNT(*) as count FROM services ${whereClause}`, queryParams);
  const total = countResult?.count ?? 0;

  // Fetch paginated results
  const rows = queryAll<ServiceRow>(
    db,
    `SELECT ${SERVICE_COLUMNS} FROM services ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
    [...queryParams, limit, offset]
  );

  // Compute type totals (unfiltered — always shows global counts)
  const totalsRows = queryAll<{ type: string; count: number }>(db, 'SELECT type, COUNT(*) as count FROM services GROUP BY type');

  const totals: ServiceTotals = { all: 0, ambulance: 0, doctor: 0 };
  for (const row of totalsRows) {
    if (row.type === 'ambulance') totals.ambulance = row.count;
    if (row.type === 'doctor') totals.doctor = row.count;
    totals.all += row.count;
  }

  const totalPages = Math.ceil(total / limit);

  return {
    data: rows.map(toService),
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
    totals,
  };
}

/** Get a single service by ID */
export async function getServiceById(id: number): Promise<Service> {
  const db = await getDatabase();
  const row = queryOne<ServiceRow>(db, `SELECT ${SERVICE_COLUMNS} FROM services WHERE id = ?`, [id]);

  if (!row) {
    throw ApiError.notFound(`Service with id ${id} not found`);
  }

  return toService(row);
}

/** Create a new service */
export async function createService(input: CreateServiceInput): Promise<Service> {
  const db = await getDatabase();

  runSql(
    db,
    'INSERT INTO services (title, description, location, type, image_url) VALUES (?, ?, ?, ?, ?)',
    [input.title, input.description, input.location, input.type, input.imageUrl || null]
  );

  // Get the last inserted ID
  const result = queryOne<{ id: number }>(db, 'SELECT last_insert_rowid() as id');
  const lastId = result?.id ?? 0;

  // Persist changes to disk
  persistDatabase();

  return getServiceById(lastId);
}

/** Update an existing service */
export async function updateService(id: number, input: UpdateServiceInput): Promise<Service> {
  const db = await getDatabase();

  // Verify the service exists first
  await getServiceById(id);

  // Build dynamic SET clause — only update provided fields
  const setClauses: string[] = [];
  const updateParams: unknown[] = [];

  if (input.title !== undefined) {
    setClauses.push('title = ?');
    updateParams.push(input.title);
  }
  if (input.description !== undefined) {
    setClauses.push('description = ?');
    updateParams.push(input.description);
  }
  if (input.location !== undefined) {
    setClauses.push('location = ?');
    updateParams.push(input.location);
  }
  if (input.type !== undefined) {
    setClauses.push('type = ?');
    updateParams.push(input.type);
  }
  if (input.imageUrl !== undefined) {
    setClauses.push('image_url = ?');
    updateParams.push(input.imageUrl || null);
  }

  // Always update updated_at
  setClauses.push("updated_at = datetime('now')");

  runSql(
    db,
    `UPDATE services SET ${setClauses.join(', ')} WHERE id = ?`,
    [...updateParams, id]
  );

  // Persist changes to disk
  persistDatabase();

  return getServiceById(id);
}

/** Delete a service by ID */
export async function deleteService(id: number): Promise<void> {
  const db = await getDatabase();

  // Verify it exists first
  await getServiceById(id);

  runSql(db, 'DELETE FROM services WHERE id = ?', [id]);

  // Persist changes to disk
  persistDatabase();
}
