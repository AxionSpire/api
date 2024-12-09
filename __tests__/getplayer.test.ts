import { describe, expect } from '@jest/globals';
import supertest, { Response } from 'supertest';
import { app } from '../src/app.ts';

describe("GET /player/(uuid) Valid", () => {
  it("should return data on a player", async () => {
    const testUUID: string = "b876ec32-e396-476b-a115-8438d83c67d4"; // Technoblade's UUID, Rest in Peace <3
    const res: Response = await supertest(app).get(`/player/${testUUID}`);
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.text).uuid).toBe(testUUID);
    expect(JSON.parse(res.text).error).toBeUndefined();
  });
});

describe("GET /player/(uuid) Invalid", () => {
  it("should return an invalid UUID error", async () => {
    const res: Response = await supertest(app).get(`/player/invalid_data`);
    expect(res.statusCode).toBe(400);
    expect(JSON.parse(res.text).uuid).toBeUndefined();
    expect(JSON.parse(res.text).error).toBe("INVALID_UUID");
  });
});
