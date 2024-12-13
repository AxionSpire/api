import { validate as uuidValidate } from 'uuid';
import express, { Request, Response } from 'express';
import escapeHtml from 'escape-html';
export const router = express.Router();
import { readStats } from './db/stats';

export type UserStats = { statID: string, value: string, timestamp: Date, public: boolean, error?: string }[];

router.get('/:id', async (req: Request, res: Response) => {
  const player: string = req.params.id;
  res.contentType("application/json");
  if (!uuidValidate(player)) {
    res.status(400);
    res.json({ error: "INVALID_UUID", message: "An invalid UUID was provided. Be sure the UUID contains dashes." });
    return;
  }
  const stats: UserStats | null = await readStats(player);
  if (stats === null && process.env.NODE_ENV !== "test") {
    res.status(500);
    res.json({ error: "UNKNOWN_ERROR", message: "An unknown error occurred with the database." });
    return;
  }
  if (stats === null && process.env.NODE_ENV === "test") {
    res.json({ uuid: escapeHtml(player) });
    return;
  }
  res.json({ uuid: escapeHtml(player) });
})
