import { describe, expect } from '@jest/globals';
import supertest from 'supertest';
import { app, server } from '../src/app.ts';

describe("GET /player/(uuid)", () => {
  it("should return data on a player", async () => {
    const testUUID = "b876ec32-e396-476b-a115-8438d83c67d4"; // Technoblade's UUID, Rest in Peace <3
    const res = await supertest(app).get(`/player/${testUUID}`);
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.text).uuid).toBe(testUUID);
    expect(JSON.parse(res.text).error).toBeUndefined();
  });
});

afterAll(async () => {
  await server.close();
});
