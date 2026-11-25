import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

// Load .env from the server root, regardless of the process working directory.
dotenv.config({ path: path.resolve(dirname, "../../.env") });

if (!process.env.JWT_SECRET?.trim()) {
  throw new Error("Fatal: JWT_SECRET environment variable must be defined and non-empty.");
}

const NODE_ENV = (process.env.NODE_ENV || "development").toLowerCase();

export const env = {
  PORT: parseInt(process.env.PORT || "5000", 10),
  NODE_ENV,
  MONGODB_URI: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/notes_app",
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "1d",
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",
  COOKIE_SECRET: process.env.COOKIE_SECRET || "fallback_dev_cookie_secret",
  isProduction: NODE_ENV === "production",
  isDevelopment: NODE_ENV === "development",
  isTest: NODE_ENV === "test",
};