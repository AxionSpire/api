import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

import { router as player } from "./player";
import { router as server } from "./server";

dotenv.config();

export const app: Express = express();
const port = process.env.PORT || 6677;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.contentType("application/json");
  res.json({
    welcome: "Welcome to the AxionSpire API!", 
    accessing_on: req.hostname,
    github_repo: "https://github.com/AxionSpire/api",
  });
});

app.use("/player", player);
app.use("/server", server);

if (process.env.NODE_ENV !== "test") { startServer(); }

export function startServer() {
  return app.listen(port, () => {
    console.log(`[server] Server is running at http://localhost:${port}`);
  });
}