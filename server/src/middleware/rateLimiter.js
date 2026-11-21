import rateLimit from "express-rate-limit";


export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return standard `RateLimit-*` headers
  legacyHeaders: false, // Disable legacy `X-RateLimit-*` headers
  message: {
    success: false,
    statusCode: 429,
    message: "Too many requests from this IP, please try again after 15 minutes.",
  },
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    statusCode: 429,
    message: "Too many authentication attempts from this IP. Please try again after 15 minutes.",
  },
});
