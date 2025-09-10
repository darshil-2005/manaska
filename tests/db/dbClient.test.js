import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { pool, db } from '../../db/db.js'
import {users} from '../../db/schema.js'


beforeAll(async () => {
  await db.delete(users).execute(); // clean DB
});

afterAll(async () => {
  await pool.end(); // close pool
});


describe('DB Client', () => {
    it('should insert a user', async () => {
    const result = await db.insert(users).values({
      name: 'Test User',
      email: 'test@example.com',
      username: 'test'
    }).returning();

    expect(result.length).toBe(1);
    expect(result[0].name).toBe('Test User');
  });

  it('should fetch the inserted user', async () => {
    const result = await db.select().from(users);
    expect(result.length).toBe(1);
    expect(result[0].email).toBe('test@example.com');
  });
});