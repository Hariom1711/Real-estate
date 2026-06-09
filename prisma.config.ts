import { defineConfig, env } from "prisma/config";
import "dotenv/config";

const dbUrl = env("DATABASE_URL") || "file:./prisma/dev.db";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: dbUrl,
  },
  migrations: {
    seed: 'npx tsx ./prisma/seed.ts',
  },
});
