import request from 'supertest';
import app from '../app';
import { initializeDatabase, setDatabase, closeDatabase } from '../config/database';
import type { Database as SqlJsDatabase } from 'sql.js';

/**
 * Integration tests for the Service CRUD API.
 * Uses an in-memory SQLite database for test isolation.
 * Each test suite resets the database via beforeEach for independence.
 */

let db: SqlJsDatabase;

/** Seed 3 test records into a fresh database */
function seedTestData(database: SqlJsDatabase): void {
  database.run(
    `INSERT INTO services (title, description, location, type, image_url) VALUES (?, ?, ?, ?, ?)`,
    ['Test Ambulance', 'A test ambulance service description', '123 Test St', 'ambulance', null]
  );
  database.run(
    `INSERT INTO services (title, description, location, type, image_url) VALUES (?, ?, ?, ?, ?)`,
    ['Dr. Test', 'A test doctor service description', '456 Test Ave', 'doctor', 'https://example.com/photo.jpg']
  );
  database.run(
    `INSERT INTO services (title, description, location, type, image_url) VALUES (?, ?, ?, ?, ?)`,
    ['Another Ambulance', 'Another ambulance service description', '789 Test Blvd', 'ambulance', null]
  );
}

beforeEach(async () => {
  // Fresh in-memory database for each test — ensures test independence
  db = await initializeDatabase(':memory:');
  setDatabase(db);
  seedTestData(db);
});

afterAll(() => {
  closeDatabase();
});

// ─── Health Check ───────────────────────────────────────────────────────────

describe('GET /api/health', () => {
  it('should return ok status', async () => {
    const res = await request(app).get('/api/health');

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.timestamp).toBeDefined();
  });
});

// ─── List Services ──────────────────────────────────────────────────────────

describe('GET /api/services', () => {
  it('should return paginated services with totals', async () => {
    const res = await request(app).get('/api/services');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.data.length).toBe(3);
    expect(res.body.pagination).toBeDefined();
    expect(res.body.pagination.total).toBe(3);
    expect(res.body.totals).toBeDefined();
    expect(res.body.totals.all).toBe(3);
    expect(res.body.totals.ambulance).toBe(2);
    expect(res.body.totals.doctor).toBe(1);
  });

  it('should filter by type', async () => {
    const res = await request(app).get('/api/services?type=ambulance');

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(2);
    expect(res.body.data.every((s: { type: string }) => s.type === 'ambulance')).toBe(true);
  });

  it('should search by title', async () => {
    const res = await request(app).get('/api/services?search=Dr.');

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].title).toBe('Dr. Test');
  });

  it('should paginate correctly', async () => {
    const res = await request(app).get('/api/services?page=1&limit=2');

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(2);
    expect(res.body.pagination.page).toBe(1);
    expect(res.body.pagination.limit).toBe(2);
    expect(res.body.pagination.totalPages).toBe(2);
    expect(res.body.pagination.hasNextPage).toBe(true);
    expect(res.body.pagination.hasPrevPage).toBe(false);
  });

  it('should return camelCase field names', async () => {
    const res = await request(app).get('/api/services');

    const service = res.body.data[0];
    expect('imageUrl' in service).toBe(true);
    expect('createdAt' in service).toBe(true);
    expect('updatedAt' in service).toBe(true);
    // Ensure no snake_case keys leak through
    expect('image_url' in service).toBe(false);
    expect('created_at' in service).toBe(false);
  });

  it('should return empty data for page beyond range', async () => {
    const res = await request(app).get('/api/services?page=999');

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(0);
    expect(res.body.pagination.page).toBe(999);
  });

  it('should handle LIKE wildcards in search safely', async () => {
    const res = await request(app).get('/api/services?search=%25');

    expect(res.status).toBe(200);
    // Should NOT return all records — % should be escaped
    expect(res.body.data.length).toBe(0);
  });

  it('should combine search and type filter', async () => {
    const res = await request(app).get('/api/services?search=City&type=ambulance');

    expect(res.status).toBe(200);
    // Only 'Test Ambulance' at '123 Test St' matches — 'Another Ambulance' is at '789 Test Blvd'
    expect(res.body.data.length).toBe(0);

    // Search that actually matches
    const res2 = await request(app).get('/api/services?search=Test+St&type=ambulance');
    expect(res2.status).toBe(200);
    expect(res2.body.data.length).toBe(1);
    expect(res2.body.data[0].title).toBe('Test Ambulance');
  });
});

// ─── Get Service by ID ──────────────────────────────────────────────────────

describe('GET /api/services/:id', () => {
  it('should return a single service', async () => {
    const res = await request(app).get('/api/services/1');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe(1);
    expect(res.body.data.title).toBe('Test Ambulance');
  });

  it('should return 404 for non-existent service', async () => {
    const res = await request(app).get('/api/services/999');

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });

  it('should return 400 for invalid ID', async () => {
    const res = await request(app).get('/api/services/abc');

    expect(res.status).toBe(400);
  });
});

// ─── Create Service ─────────────────────────────────────────────────────────

describe('POST /api/services', () => {
  it('should create a new service', async () => {
    const newService = {
      title: 'New Hospital',
      description: 'A brand new hospital service',
      location: '999 New Street',
      type: 'doctor',
    };

    const res = await request(app).post('/api/services').send(newService);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe('New Hospital');
    expect(res.body.data.type).toBe('doctor');
    expect(res.body.data.id).toBeDefined();
    expect(res.body.data.imageUrl).toBeNull();
  });

  it('should create a service with an image URL', async () => {
    const res = await request(app).post('/api/services').send({
      title: 'Image Service',
      description: 'A service with an image URL provided',
      location: '100 Image Ave',
      type: 'ambulance',
      imageUrl: 'https://example.com/ambulance.jpg',
    });

    expect(res.status).toBe(201);
    expect(res.body.data.imageUrl).toBe('https://example.com/ambulance.jpg');
  });

  it('should reject missing required fields', async () => {
    const res = await request(app).post('/api/services').send({
      title: 'Incomplete',
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('should reject invalid type', async () => {
    const res = await request(app).post('/api/services').send({
      title: 'Bad Type',
      description: 'A description that is long enough',
      location: 'Location',
      type: 'pharmacy',
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should reject title shorter than 2 characters', async () => {
    const res = await request(app).post('/api/services').send({
      title: 'A',
      description: 'A valid description here',
      location: 'A valid location',
      type: 'doctor',
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should reject non-HTTP image URLs', async () => {
    const res = await request(app).post('/api/services').send({
      title: 'XSS Test',
      description: 'Testing protocol validation',
      location: 'Location',
      type: 'doctor',
      imageUrl: 'javascript:alert(1)',
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

// ─── Update Service ─────────────────────────────────────────────────────────

describe('PUT /api/services/:id', () => {
  it('should update an existing service', async () => {
    const res = await request(app).put('/api/services/1').send({
      title: 'Updated Ambulance',
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe('Updated Ambulance');
    expect(res.body.data.description).toBe('A test ambulance service description'); // unchanged
  });

  it('should update the type field', async () => {
    const res = await request(app).put('/api/services/1').send({
      type: 'doctor',
    });

    expect(res.status).toBe(200);
    expect(res.body.data.type).toBe('doctor');
  });

  it('should return 404 for non-existent service', async () => {
    const res = await request(app).put('/api/services/999').send({
      title: 'Ghost',
    });

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });

  it('should return 400 for invalid ID', async () => {
    const res = await request(app).put('/api/services/abc').send({
      title: 'Invalid',
    });

    expect(res.status).toBe(400);
  });
});

// ─── Delete Service ─────────────────────────────────────────────────────────

describe('DELETE /api/services/:id', () => {
  it('should delete an existing service', async () => {
    const res = await request(app).delete('/api/services/1');

    expect(res.status).toBe(204);

    // Verify it's gone
    const getRes = await request(app).get('/api/services/1');
    expect(getRes.status).toBe(404);
  });

  it('should return 404 for non-existent service', async () => {
    const res = await request(app).delete('/api/services/999');

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it('should return 400 for invalid ID', async () => {
    const res = await request(app).delete('/api/services/abc');

    expect(res.status).toBe(400);
  });
});
