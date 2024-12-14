import express, { Request, Response } from 'express';
import { UUIDTypes, validate as uuidValidate } from 'uuid';
import { writeStats, setStatPrivacy } from './db/stats';
export const router = express.Router();

export type StatArray = { uuid: UUIDTypes; value: string; }[];
export type PublicSettings = { stat: string; public: boolean; }[];

router.post('/stats', async (req: Request, res: Response) => {
  res.contentType("application/json");
  if (req.headers['authorization'] === undefined) {
    res.status(401);
    res.json({ error: "UNAUTHORIZED", message: "No API key was entered." });
    return;
  }
  if (req.headers['authorization'] !== `Bearer ${process.env.API_KEY}`) {
    res.status(403);
    res.json({ error: "FORBIDDEN", message: "An invalid API key was entered." });
    return;
  }
  const body = req.body;
  const serverID: string = body.serverID;
  if (serverID === undefined) {
    res.status(400);
    res.json({ error: "INVALID_BODY", message: "An invalid server ID was entered." });
    return;
  }
  const statID: string = body.statID;
  if (statID === undefined) {
    res.status(400);
    res.json({ error: "INVALID_BODY", message: "An invalid stat ID was entered." });
    return;
  }
  const records: StatArray = body.records;
  if (records === undefined || records === null || records.length === 0) {
    res.status(400);
    res.json({ error: "INVALID_BODY", message: "An invalid records array was entered." });
    return;
  }
  // Records structure verification (I decided to reject the whole request if even one part is invalid)
  for (const record of records) {
    if (record.uuid === undefined || !uuidValidate(record.uuid)) {
      res.status(400);
      res.json({ error: "INVALID_RECORD_UUID", message: "An invalid record UUID was entered." });
      return;
    }
    if (record.value === undefined || typeof record.value !== "string") {
      res.status(400);
      res.json({ error: "INVALID_RECORD_VALUE", message: "An invalid record value was entered." });
      return;
    }
  }

  // Writes the information to the database
  const success: boolean = await writeStats(statID, records);
  if (!success) {
    res.status(500);
    res.json({ error: "UNKNOWN", message: "An unknown error occurred with the database." });
    return;
  }
  res.json({ message: "Stats updated." });
})

router.post('/stats/privacy', async (req: Request, res: Response) => {
  res.contentType("application/json");
  if (req.headers['authorization'] === undefined) {
    res.status(401);
    res.json({ error: "UNAUTHORIZED", message: "No API key was entered." });
    return;
  }
  if (req.headers['authorization'] !== `Bearer ${process.env.API_KEY}`) {
    res.status(403);
    res.json({ error: "FORBIDDEN", message: "An invalid API key was entered." });
    return;
  }
  const body = req.body;
  const serverID: string = body.serverID;
  if (serverID === undefined) {
    res.status(400);
    res.json({ error: "INVALID_BODY", message: "An invalid server ID was entered." });
    return;
  }
  if (body.uuid === undefined || !uuidValidate(body.uuid)) {
    res.status(400);
    res.json({ error: "INVALID_BODY", message: "An invalid UUID was entered." });
    return;
  }
  const settings: PublicSettings = body.settings;
  if (settings === undefined || settings === null || settings.length === 0) {
    res.status(400);
    res.json({ error: "INVALID_BODY", message: "An invalid settings array was entered." });
    return;
  }
  // Settings structure verification (I decided to reject the whole request if even one part is invalid)
  for (const setting of settings) {
    if (setting.stat === undefined || typeof setting.stat !== "string") {
      res.status(400);
      res.json({ error: "INVALID_SETTING_STATID", message: "An invalid setting stat ID was entered (must be a valid string)." });
      return;
    }
    if (setting.public === undefined || typeof setting.public !== "boolean") {
      res.status(400);
      res.json({ error: "INVALID_SETTING_PUBLIC", message: "An invalid setting public value was entered (must be a boolean)." });
      return;
    }
  }

  // Note: Currently, this does not check if a stat is valid.
  // It doesn't break anything this way though, as the "where" matches zero stats if it's invalid.
  const result = await setStatPrivacy(body.uuid, settings);
  if (!result) {
    res.status(500);
    res.json({ error: "UNKNOWN", message: "An unknown error occurred with the database." });
    return;
  }
  res.json({ message: "Privacy settings updated." });
})