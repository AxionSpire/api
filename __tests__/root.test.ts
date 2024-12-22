import { describe, expect } from '@jest/globals';
import { app, startServer } from '../src/app.ts';
import supertest, { Response } from 'supertest';
import { Server } from 'http';

describe("GET /", () => {
  it("should listen on port 6677 and return a welcome message", async () => {
    const server: Server = startServer();
    const res: Response = await supertest(app).get(`/`);
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.text).welcome).toBe("Welcome to the AxionSpire API!");
    expect(JSON.parse(res.text).server).toBe("AxionSpire API");
    server.close();
  });
});