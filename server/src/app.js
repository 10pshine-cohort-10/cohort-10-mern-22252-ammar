import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";

export const app = express();

// Security and utility middleware
app.use(helmet());
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser(env.COOKIE_SECRET));

// Health check endpoint
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    success: true,
    statusCode: 200,
    message: "Server is running smoothly",
    data: {
      status: "healthy",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      environment: env.NODE_ENV,
    },
  });
});

// Root API welcome
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Notes App API is active",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    message: `Resource not found on endpoint: ${req.originalUrl}`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  logger.error(`[${req.method}] ${req.url} >> Error:: ${message}`);
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    ...(env.isDevelopment && { stack: err.stack }),
  });
});

export default app;
