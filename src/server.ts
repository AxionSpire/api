import express, { Request, Response } from 'express';
import { UUIDTypes, validate as uuidValidate } from 'uuid';
export const router = express.Router();

type StatArray = { uuid: UUIDTypes; value: string }[];

router.post('/stats', (req: Request, res: Response) => {
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
    if (record.value === undefined) {
      res.status(400);
      res.json({ error: "INVALID_RECORD_VALUE", message: "An invalid record value was entered." });
      return;
    }
  }

  // TEMPORARY, REMOVE WHEN DATABASE IS USED
  for (const record of records) {
    console.log(`[server] ${serverID} - ${statID} - ${record.uuid}: ${record.value}`);
  }

  res.json({ message: "Stats updated." });
})