import { describe, expect } from '@jest/globals';
import { app, startServer } from '../src/app.ts';
import supertest, { Response } from 'supertest';
import { Server } from 'http';

describe("GET /", () => {
  it("should listen on port 6677 and return a welcome message, with a valid key", async () => {
    const server: Server = startServer();
    const res: Response = await supertest(app).get(`/`).set("authorization", `Bearer ${process.env.API_KEY}`);
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.text).welcome).toBe("Welcome to the AxionSpire API!");
    expect(JSON.parse(res.text).server).toBe("AxionSpire API");
    expect(JSON.parse(res.text).auth_valid).toBe(true);
    server.close();
  });
  it("should return a welcome message, with an invalid key", async () => {
    const res: Response = await supertest(app).get(`/`).set("authorization", `Bearer test-invalid`);
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.text).welcome).toBe("Welcome to the AxionSpire API!");
    expect(JSON.parse(res.text).server).toBe("AxionSpire API");
    expect(JSON.parse(res.text).auth_valid).toBe(false);
  });
});