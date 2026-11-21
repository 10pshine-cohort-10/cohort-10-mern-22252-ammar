import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { User } from "../models/User.js";
import { logger } from "../config/logger.js";

/**
 * Authentication Middleware
 * Verifies JWT token from Authorization header or signed cookies
 */
export const authenticate = async (req, res, next) => {
  try {
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

    const decoded = jwt.verify(token, env.JWT_SECRET);
    if (!decoded || typeof decoded !== "object" || !decoded.id) {
      logger.warn({ ip: req.ip }, "Unauthorized access: Invalid token payload");
      return res.status(401).json({
        success: false,
        statusCode: 401,
        message: "Invalid or expired token",
      });
    }

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      logger.warn({ userId: decoded.id }, "Unauthorized access: User no longer exists");
      return res.status(401).json({
        success: false,
        statusCode: 401,
        message: "User session expired",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    logger.warn({ err: error.message }, "Authentication failure");
    return res.status(401).json({
      success: false,
      statusCode: 401,
      message: "Invalid or expired token",
    });
  }
};
