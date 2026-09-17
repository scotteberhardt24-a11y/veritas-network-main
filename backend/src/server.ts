import http from "http";

import app from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./utils/logger.js";

const server = http.createServer(app);

const port = Number(process.env.PORT) || Number(env.PORT) || 8080;

server.listen(port, "0.0.0.0", () => {
  logger.info(`🚀 Veritas backend running on http://0.0.0.0:${port}`);
});
