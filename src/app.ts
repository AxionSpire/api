import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { Server } from "http";

const player = require("./player");

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 6677;

app.get("/", (req: Request, res: Response) => {
  res.send("AxionSpire API Server");
});

app.use("/player", player);

const server: Server = app.listen(port, () => {
  console.log(`[server] Server is running at http://localhost:${port}`);
});

module.exports = { app, server };