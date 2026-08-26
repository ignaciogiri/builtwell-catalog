import { config } from "dotenv";
import type { Config } from "drizzle-kit";

config({ path: [".env.local", ".env"] });

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error("DATABASE_URL is not set");
}

export default {
  schema: "./lib/db/schema.ts",
  out: "./lib/db/migrations",
  dialect: "postgresql",
  dbCredentials: { url },
} satisfies Config;
