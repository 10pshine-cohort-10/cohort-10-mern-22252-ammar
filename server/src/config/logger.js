import pino from "pino";
import { env } from "./env.js";

export const logger = pino({
  level: env.isTest ? "silent" : env.isDevelopment ? "debug" : "info",
  timestamp: pino.stdTimeFunctions.isoTime,
});

