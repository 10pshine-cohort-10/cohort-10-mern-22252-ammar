import http from "http";
import app from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";
import { connectDatabase, disconnectDatabase } from "./config/database.js";

const server = http.createServer(app);

const startServer = async () => {
  try {
    await connectDatabase();

    server.listen(env.PORT, () => {
      logger.info(`Notes App Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
    });
  } catch (error) {
    logger.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

const gracefulShutdown = (signal) => {
  logger.info("Received " + signal + ". Shutting down gracefully...");
  server.close(() => {
    void (async () => {
      try {
        logger.info("HTTP server closed.");
        await disconnectDatabase();
        process.exit(0);
      } catch (error) {
        logger.error("Error during graceful shutdown: " + error.message);
        process.exit(1);
      }
    })();
  });
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

startServer();

export { server };

