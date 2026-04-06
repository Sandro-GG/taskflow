import { jest, describe, it, expect, beforeAll } from '@jest/globals';
import type { Express } from 'express';

jest.unstable_mockModule('../db.js', () => ({
  client: {
    task: {
      findMany: jest.fn(),
      create: jest.fn(),
    }
  }
}));

let app: Express;
let mockFindMany: ReturnType<typeof jest.fn>;

beforeAll(async () => {
  const appModule = await import('../index.js');
  const dbModule = await import('../db.js');
  app = appModule.app as Express;
  mockFindMany = dbModule.client.task.findMany as ReturnType<typeof jest.fn>;
});

describe('GET /tasks', () => {
  it('should return an array of tasks', async () => {
    const request = (await import('supertest')).default;
    mockFindMany.mockResolvedValue([
      { id: '1', title: 'Test', description: 'Desc', status: 'TO_DO', createdAt: new Date(), updatedAt: new Date() }
    ]);
    const res = await request(app).get('/tasks');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe('POST /tasks', () => {
  it('should return 400 if title is missing', async () => {
    const request = (await import('supertest')).default;
    const res = await request(app).post('/tasks').send({ description: 'Desc' });
    expect(res.status).toBe(400);
  });
});