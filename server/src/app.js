import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";
import { generalLimiter } from "./middleware/rateLimiter.js";
import { requestLogger } from "./middleware/requestLogger.js";
import { authRouter } from "./modules/auth/auth.routes.js";
import { notesRouter } from "./modules/notes/notes.routes.js";

export const app = express();

// Security headers with Helmet
app.use(helmet());

// Cross-Origin Resource Sharing
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  })
);

// Body Parsers with payload size limits to protect against DoS
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser(env.COOKIE_SECRET));

// Pino HTTP request logging middleware for all incoming requests
app.use(requestLogger);

// Global Rate Limiting across all endpoints
app.use(generalLimiter);

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

// Authentication Routes (strict rate limiting is mounted on /login and /signup inside auth.routes.js)
app.use("/api/v1/auth", authRouter);

// Notes CRUD Routes
app.use("/api/v1/notes", notesRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    message: `Resource not found on endpoint: ${req.originalUrl}`,
  });
});

// Global Error Handler
/** @type {import("express").ErrorRequestHandler} */
const errorHandler = (err, req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  logger.error({ err, path: req.originalUrl, method: req.method }, `Error handling request: ${message}`);
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    ...(env.isDevelopment && { stack: err.stack }),
  });
  return;
};

app.use(errorHandler);

export default app;
