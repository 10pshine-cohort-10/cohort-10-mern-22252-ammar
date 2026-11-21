// @ts-check
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure .env is loaded from server root regardless of where process is started
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

/** @typedef {"development" | "production" | "test" | (string & {})} NodeEnvironment */
/**
 * @typedef {object} EnvironmentConfig
 * @property {number} PORT
 * @property {NodeEnvironment} NODE_ENV
 * @property {string} MONGODB_URI
 * @property {string} JWT_SECRET
 * @property {string} JWT_EXPIRES_IN
 * @property {string} CLIENT_URL
 * @property {string} COOKIE_SECRET
 * @property {boolean} isProduction
 * @property {boolean} isDevelopment
 * @property {boolean} isTest
 */

const requiredEnvVars = ["JWT_SECRET"];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.warn("[Config Warning]: Environment variable " + envVar + " is not defined. Using default fallback for development.");
  }
}

/** @type {NodeEnvironment} */
const NODE_ENV = (process.env.NODE_ENV || "development").toLowerCase();

/** @type {EnvironmentConfig} */
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
