import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { User } from "../models/User.js";
import { logger } from "../config/logger.js";

/** @type {import("express").RequestHandler} */
export const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.slice(7)
    : req.cookies?.token;

  if (!token) {
    logger.warn({ ip: req.ip, path: req.originalUrl }, "Unauthorized access: No token provided");
    return res.status(401).json({
      success: false,
      statusCode: 401,
      message: "Authentication token is required",
    });
  }

  let userId;
  try {
    const payload = jwt.verify(token, env.JWT_SECRET);
    if (typeof payload !== "object" || typeof payload.id !== "string" || !payload.id) {
      throw new Error("Invalid token payload");
    }
    userId = payload.id;
  } catch (error) {
    logger.warn({ err: error instanceof Error ? error.message : String(error) }, "Token verification failed");
    return res.status(401).json({
      success: false,
      statusCode: 401,
      message: "Invalid or expired token",
    });
  }

  try {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      logger.warn({ userId }, "Unauthorized access: User no longer exists");
      return res.status(401).json({
        success: false,
        statusCode: 401,
        message: "User session expired",
      });
    }

    req.user = user;
    return next();
  } catch (error) {
    logger.error({ err: error instanceof Error ? error.message : String(error) }, "Database error during authentication");
    return next(error);
  }
};