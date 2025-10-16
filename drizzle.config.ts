import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config(); // Load .env file

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL || "",
  },
});