import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

import { router as player } from "./player";

dotenv.config();

export const app: Express = express();
const port = process.env.PORT || 6677;

app.get("/", (req: Request, res: Response) => {
  res.contentType("application/json");
  res.send(JSON.stringify({
    welcome: "Welcome to the AxionSpire API!", 
    accessing_on: req.hostname,
    github_repo: "https://github.com/AxionSpire/api",
  }));
});

app.use("/player", player);

if (process.env.NODE_ENV !== "test") { startServer(); }

export function startServer() {
  return app.listen(port, () => {
    console.log(`[server] Server is running at http://localhost:${port}`);
  });
}