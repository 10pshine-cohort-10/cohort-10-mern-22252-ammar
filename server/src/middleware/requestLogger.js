import pinoHttp from "pino-http";
import { logger } from "../config/logger.js";

/**
 * Pino HTTP request logger middleware
 * Logs incoming HTTP requests and response status codes
 * Sanitizes sensitive fields like passwords, tokens, and authorization headers
 */
export const requestLogger = pinoHttp({
  logger,
  autoLogging: true,
  serializers: {
    req(req) {
      return {
        id: req.id,
        method: req.method,
        url: req.url,
        query: req.query,
        remoteAddress: req.remoteAddress,
      };
    },
    res(res) {
      return {
        statusCode: res.statusCode,
      };
    },
  },
  customLogLevel: function (req, res, err) {
    if (res.statusCode >= 500 || err) {
      return "error";
    }
    if (res.statusCode >= 400) {
      return "warn";
    }
    return "info";
  },
});
