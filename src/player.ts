import { validate as uuidValidate } from 'uuid';
import express, { Request, Response } from 'express';
import escapeHtml from 'escape-html';
export const router = express.Router();
import { readStats } from './db/stats';

export type UserStats = { statID: string, value: string, timestamp: Date, public: boolean, error?: string }[];
type PublicStat = { [id: string]: { value: string, lastUpdated: Date } };

router.get('/:id', async (req: Request, res: Response) => {
  const player: string = req.params.id;
  res.contentType("application/json");
  if (!uuidValidate(player)) {
    res.status(400);
    res.json({ error: "INVALID_UUID", message: "An invalid UUID was provided. Be sure the UUID contains dashes." });
    return;
  }
  const stats: UserStats | null = await readStats(player);
  if (stats === null) {
    if (process.env.NODE_ENV === "test") {
      res.json({ uuid: escapeHtml(player) });
      return;
    }
    res.status(500);
    res.json({ error: "UNKNOWN", message: "An unknown error occurred with the database." });
    return;
  }

  const publicStats: PublicStat = {};
  for (const stat of stats) {
    if (stat.public) {
      publicStats[stat.statID] = {
        value: stat.value,
        lastUpdated: stat.timestamp
      }
    }
  }

  if (Object.keys(publicStats).length === 0) {
    res.status(404);
    res.json({ error: "NO_PUBLIC_STATS", message: "The requested player has no public stats." });
    return;
  }
  res.json({ uuid: escapeHtml(player), stats: publicStats });
})
