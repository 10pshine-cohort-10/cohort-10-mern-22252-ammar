import dns from "dns";
import mongoose from "mongoose";
import { env } from "./env.js";
import { logger } from "./logger.js";

// Optional custom DNS servers (set via CUSTOM_DNS in .env if ISP/router blocks SRV queries)
if (process.env.CUSTOM_DNS) {
  try {
    const servers = process.env.CUSTOM_DNS.split(",").map((s) => s.trim()).filter(Boolean);
    if (servers.length > 0) {
      dns.setServers(servers);
      logger.info(`Custom DNS servers configured: ${servers.join(", ")}`);
    }
  } catch (e) {
    logger.warn("Could not set custom DNS servers: " + (e instanceof Error ? e.message : String(e)));
  }
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
    // Rethrow to stop server startup when database connection cannot be established
    throw error;
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
