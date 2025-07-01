import dotenv from "dotenv";

dotenv.config();

export const config = {
  nodeEnv: process.env["NODE_ENV"] || "development",
  port: parseInt(process.env["PORT"] || "3001", 10),
  corsOrigin: process.env["CORS_ORIGIN"] || "https://nanolearning.nanocode.site",
  logLevel: process.env["LOG_LEVEL"] || "info",
} as const;

export type Config = typeof config;
