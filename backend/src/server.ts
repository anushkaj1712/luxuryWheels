/**
 * HTTP server bootstrap — loads env (repo root `.env` then `backend/.env`), listens on PORT.
 */

import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { createApp } from "./app";

const rootEnv = path.resolve(process.cwd(), "../.env");
if (fs.existsSync(rootEnv)) {
  dotenv.config({ path: rootEnv });
}
dotenv.config();

const port = Number(process.env.PORT) || 5000;
const app = createApp();

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Drive Luxury Wheels API listening on http://localhost:${port}`);
});
