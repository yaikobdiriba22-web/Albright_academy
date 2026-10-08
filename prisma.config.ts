import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Use DIRECT_URL when provided for migrations; otherwise fall back
    // to DATABASE_URL so Prisma Client generation works on Vercel
    // without requiring a separate DIRECT_URL environment variable.
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? "",
  },
});
