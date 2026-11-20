import dotenv from "dotenv";

dotenv.config();

const requiredEnvVars = ["JWT_SECRET"];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.warn(`[Config Warning]: Environment variable ${envVar} is not defined. Using default fallback for development.`);
  }
}

const NODE_ENV = (process.env.NODE_ENV || "development").toLowerCase();

export const env = {
  PORT: parseInt(process.env.PORT || "5000", 10),
  NODE_ENV,
  MONGODB_URI: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/notes_app",
  JWT_SECRET: process.env.JWT_SECRET || "fallback_dev_secret_replace_in_prod",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "1d",
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",
  COOKIE_SECRET: process.env.COOKIE_SECRET || "fallback_dev_cookie_secret",
  isProduction: NODE_ENV === "production",
  isDevelopment: NODE_ENV === "development",
  isTest: NODE_ENV === "test",
};

