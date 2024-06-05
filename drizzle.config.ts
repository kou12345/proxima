import type { Config } from "drizzle-kit";

export default {
  schema: "./src/schema/*",
  out: "./supabase/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
} as Config;
