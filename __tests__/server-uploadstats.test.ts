import { describe, expect } from '@jest/globals';
import supertest, { Response } from 'supertest';
import { app } from '../src/app.ts';

describe("POST /server/stats Valid", () => {
  it("should upload a statistic for players", async () => {
    const res: Response = await supertest(app).post(`/server/stats`).send({
      serverID: "api-test-env",
      statID: "balance",
      records: [
        {
          "uuid": "b876ec32-e396-476b-a115-8438d83c67d4", // Technoblade's UUID, Rest in Peace <3
          "value": "100"
        }
      ]
    }).set("authorization", `Bearer ${process.env.API_KEY}`);
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.text).message).toBe("Stats updated.");
    expect(JSON.parse(res.text).error).toBeUndefined();
  });
});

describe("POST /server/stats Invalid Key", () => {
  it("should return an unauthorized error", async () => {
    const res: Response = await supertest(app).post(`/server/stats`).send({
      serverID: "api-test-env",
      statID: "balance",
      records: [
        {
          "uuid": "b876ec32-e396-476b-a115-8438d83c67d4", // Technoblade's UUID, Rest in Peace <3
          "value": "100"
        }
      ]
    });
    expect(res.statusCode).toBe(401);
    expect(JSON.parse(res.text).error).toBe("UNAUTHORIZED");
  });
  it("should return a forbidden error", async () => {
    const res: Response = await supertest(app).post(`/server/stats`).send({
      serverID: "api-test-env",
      statID: "balance",
      records: [
        {
          "uuid": "b876ec32-e396-476b-a115-8438d83c67d4", // Technoblade's UUID, Rest in Peace <3
          "value": "100"
        }
      ]
    }).set("authorization", `Bearer invalid-data`);
    expect(res.statusCode).toBe(403);
    expect(JSON.parse(res.text).error).toBe("FORBIDDEN");
  });
});

describe("POST /server/stats Invalid Body", () => {
  it("should return an invalid server ID error", async () => {
    const res: Response = await supertest(app).post(`/server/stats`).send({
      statID: "balance",
      records: [
        {
          "uuid": "b876ec32-e396-476b-a115-8438d83c67d4", // Technoblade's UUID, Rest in Peace <3
          "value": "100"
        }
      ]
    }).set("authorization", `Bearer ${process.env.API_KEY}`);
    expect(res.statusCode).toBe(400);
    expect(JSON.parse(res.text).error).toBe("INVALID_BODY");
  });
  it("should return an invalid stat ID error", async () => {
    const res: Response = await supertest(app).post(`/server/stats`).send({
      serverID: "api-test-env",
      records: [
        {
          "uuid": "b876ec32-e396-476b-a115-8438d83c67d4", // Technoblade's UUID, Rest in Peace <3
          "value": "100"
        }
      ]
    }).set("authorization", `Bearer ${process.env.API_KEY}`);
    expect(res.statusCode).toBe(400);
    expect(JSON.parse(res.text).error).toBe("INVALID_BODY");
  });
  it("should return an invalid records error (no field)", async () => {
    const res: Response = await supertest(app).post(`/server/stats`).send({
      serverID: "api-test-env",
      statID: "balance",
    }).set("authorization", `Bearer ${process.env.API_KEY}`);
    expect(res.statusCode).toBe(400);
    expect(JSON.parse(res.text).error).toBe("INVALID_BODY");
  });
  it("should return an invalid records error (empty)", async () => {
    const res: Response = await supertest(app).post(`/server/stats`).send({
      serverID: "api-test-env",
      statID: "balance",
      records: [ ]
    }).set("authorization", `Bearer ${process.env.API_KEY}`);
    expect(res.statusCode).toBe(400);
    expect(JSON.parse(res.text).error).toBe("INVALID_BODY");
  });
});

describe("POST /server/stats Invalid Record", () => {
  it("should return an invalid record uuid error", async () => {
    const res: Response = await supertest(app).post(`/server/stats`).send({
      serverID: "api-test-env",
      statID: "balance",
      records: [
        {
          "uuid": "invalid-data",
          "value": "100"
        }
      ]
    }).set("authorization", `Bearer ${process.env.API_KEY}`);
    expect(res.statusCode).toBe(400);
    expect(JSON.parse(res.text).error).toBe("INVALID_RECORD_UUID");
  });
  it("should return an invalid record value error", async () => {
    const res: Response = await supertest(app).post(`/server/stats`).send({
      serverID: "api-test-env",
      statID: "balance",
      records: [
        {
          "uuid": "b876ec32-e396-476b-a115-8438d83c67d4", // Technoblade's UUID, Rest in Peace <3
        }
      ]
    }).set("authorization", `Bearer ${process.env.API_KEY}`);
    expect(res.statusCode).toBe(400);
    expect(JSON.parse(res.text).error).toBe("INVALID_RECORD_VALUE");
  });
});