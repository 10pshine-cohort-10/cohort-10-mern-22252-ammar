import dns from "dns";
import mongoose from "mongoose";
import { env } from "./env.js";
import { logger } from "./logger.js";

// Ensure Node.js resolves MongoDB Atlas SRV records reliably across all Wi-Fi / ISP networks
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
  logger.warn("Could not set custom DNS servers: " + (e instanceof Error ? e.message : String(e)));
}

export const connectDatabase = async () => {
  try {
    const conn = await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    logger.error(`MongoDB Connection Error: ${error instanceof Error ? error.message : String(error)}`);
    // If not connected, do not allow queries to hang silently for 10s
    if (env.isProduction) {
      process.exit(1);
    }
  }
};

export const disconnectDatabase = async () => {
  try {
    await mongoose.connection.close();
    logger.info("MongoDB connection closed.");
  } catch (error) {
    logger.error(`Error closing MongoDB connection: ${error instanceof Error ? error.message : String(error)}`);
  }
};
