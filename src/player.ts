import { validate as uuidValidate } from 'uuid';
import express, { Request, Response } from 'express';
import escapeHtml from 'escape-html';
export const router = express.Router();

export type UserStats = { statID: string, value: string, timestamp: Date, public: boolean }[];
export type UserError = { error: string, message: string }
type StatResponse = UserStats | UserError;

router.get('/:id', async (req: Request, res: Response) => {
  const player: string = req.params.id
  res.contentType("application/json");
  if (!uuidValidate(player)) {
    res.status(400);
    res.json({ error: "INVALID_UUID", message: "An invalid UUID was provided. Be sure the UUID contains dashes." });
    return;
  }
  const stats: StatResponse = await readStats
  res.json({ uuid: escapeHtml(player) });
})
