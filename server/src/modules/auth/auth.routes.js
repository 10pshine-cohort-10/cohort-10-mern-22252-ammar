import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../../models/User.js";
import { env } from "../../config/env.js";
import { logger } from "../../config/logger.js";
import { authenticate } from "../../middleware/authenticate.js";

export const authRouter = express.Router();

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
};

/**
 * POST /api/v1/auth/signup
 */
authRouter.post("/signup", async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    logger.info({ email }, "User registration attempt started");

    if (!name || !email || !password) {
      logger.warn({ email }, "Registration failed: Missing required fields");
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Name, email, and password are required",
      });
    }

    // Password criteria check
    const hasMinLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);

    if (!hasMinLength || !hasUpper || !hasLower || !hasNumber || !hasSpecial) {
      logger.warn({ email }, "Registration failed: Password does not meet security complexity criteria");
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      logger.warn({ email: normalizedEmail }, "Registration rejected: Email already registered");
      return res.status(409).json({
        success: false,
        statusCode: 409,
        message: "An account with this email already exists",
      });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      avatarUrl: "",
    });

    logger.info({ userId: newUser._id.toString(), email: normalizedEmail }, "User registered successfully");

    return res.status(201).json({
      success: true,
      statusCode: 201,
      message: "Account created successfully. Please sign in to continue.",
      data: {
        user: {
          id: newUser._id.toString(),
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          avatarUrl: newUser.avatarUrl,
          status: newUser.status,
          createdAt: newUser.createdAt,
        },
      },
    });
  } catch (error) {
    logger.error({ err: error, email }, "Unexpected error occurred during signup");
    return next(error);
  }
});

/**
 * POST /api/v1/auth/login
 */
authRouter.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  try {
    logger.info({ email }, "User login attempt started");

    if (!email || !password) {
      logger.warn({ email }, "Login failed: Missing email or password");
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail }).select("+password");

    if (!user) {
      logger.warn({ email: normalizedEmail }, "Login failed: User not found");
      return res.status(401).json({
        success: false,
        statusCode: 401,
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      logger.warn({ userId: user._id.toString(), email: normalizedEmail }, "Login failed: Incorrect password attempt");
      return res.status(401).json({
        success: false,
        statusCode: 401,
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user._id);

    const userResponse = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl,
      status: user.status,
      createdAt: user.createdAt,
    };

    logger.info({ userId: user._id.toString(), email: normalizedEmail }, "User logged in successfully");

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Login successful",
      data: {
        token,
        user: userResponse,
      },
    });
  } catch (error) {
    logger.error({ err: error, email }, "Unexpected error occurred during login");
    return next(error);
  }
});

/**
 * GET /api/v1/auth/me
 */
authRouter.get("/me", authenticate, (req, res) => {
  return res.status(200).json({
    success: true,
    statusCode: 200,
    message: "Current user profile fetched",
    data: req.user,
  });
});

/**
 * PUT /api/v1/auth/profile
 */
authRouter.put("/profile", authenticate, async (req, res, next) => {
  try {
    const { name, avatarUrl } = req.body;
    const updateData = {};
    if (name) updateData.name = name.trim();
    if (typeof avatarUrl === "string") updateData.avatarUrl = avatarUrl.trim();

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password");

    logger.info({ userId: req.user._id }, "User profile updated successfully");

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    logger.error({ err: error }, "Failed to update profile");
    return next(error);
  }
});
