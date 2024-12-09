import { validate as uuidValidate } from 'uuid';
import express, { Request, Response } from 'express';
import escapeHtml from 'escape-html';
const router = express.Router();

router.get('/:id', (req: Request, res: Response) => {
  const player: string = req.params.id
  res.contentType("application/json");
  if (!uuidValidate(player)) {
    res.status(400);
    res.send(JSON.stringify({ error: "INVALID_UUID", message: "An invalid UUID was entered." }));
    return;
  }
  res.send(JSON.stringify({ uuid: escapeHtml(player) }));
})

module.exports = router;