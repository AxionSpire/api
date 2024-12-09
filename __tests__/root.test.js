import { describe, expect } from '@jest/globals';
import { app, startServer } from '../src/app.ts';
import supertest from 'supertest';

describe("GET /", () => {
  it("should listen on port 6677 and return a welcome message", async () => {
    const server = startServer();
    const res = await supertest(app).get(`/`);
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.text).welcome).toBe("Welcome to the AxionSpire API!");
    server.close();
  });
});