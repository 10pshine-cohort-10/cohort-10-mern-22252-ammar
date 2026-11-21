// @ts-nocheck
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { User } from "../models/User.js";
import { logger } from "../config/logger.js";

/**
 * @typedef {import("express").Request} Request
 * @typedef {import("express").Response} Response
 * @typedef {import("express").NextFunction} NextFunction
 */

/**
 * Authentication Middleware
 * Verifies JWT token from Authorization header or signed cookies
 * Passes database/internal errors to next(error) rather than returning 401
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export const authenticate = async (req, res, next) => {
  let token = null;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    logger.warn({ ip: req.ip, path: req.originalUrl }, "Unauthorized access: No token provided");
    return res.status(401).json({
      success: false,
      statusCode: 401,
      message: "Authentication token is required",
    });
  }

  /** @type {any} */
  let decoded;
  try {
    decoded = jwt.verify(token, env.JWT_SECRET);
  } catch (jwtError) {
    logger.warn({ err: jwtError instanceof Error ? jwtError.message : String(jwtError) }, "Token verification failed");
    return res.status(401).json({
      success: false,
      statusCode: 401,
      message: "Invalid or expired token",
    });
  }

  if (!decoded || typeof decoded !== "object" || !decoded.id) {
    logger.warn({ ip: req.ip }, "Unauthorized access: Invalid token payload");
    return res.status(401).json({
      success: false,
      statusCode: 401,
      message: "Invalid or expired token",
    });
  }

  try {
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      logger.warn({ userId: decoded.id }, "Unauthorized access: User no longer exists");
      return res.status(401).json({
        success: false,
        statusCode: 401,
        message: "User session expired",
      });
    }

    /** @type {any} */ (req).user = user;
    next();
  } catch (dbError) {
    logger.error({ err: dbError instanceof Error ? dbError.message : String(dbError) }, "Database error during authentication");
    // Forward database errors to global error handler instead of returning 401
    next(dbError);
  }
};
