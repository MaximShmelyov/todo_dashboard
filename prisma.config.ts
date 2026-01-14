import { defineConfig } from "@prisma/config";
import path from "node:path";
import dotenv from "dotenv";

/* Load env for Prisma CLI and root env files explicitly */
dotenv.config({ path: path.resolve(process.cwd(), "prisma/.env") });
dotenv.config({ path: path.resolve(process.cwd(), ".env") });
dotenv.config({ path: path.resolve(process.cwd(), ".env.local"), override: true });

export default defineConfig({
  // Optional: explicit schema path (defaults to "prisma/schema.prisma")
  schema: "prisma/schema.prisma",

  // Configure datasource.url for CLI (generate/migrate)
  datasource: {
    url: process.env.DATABASE_URL ?? "",
  },
});
