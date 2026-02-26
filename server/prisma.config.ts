import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // This satisfies the TS string | undefined error
    url: process.env.DATABASE_URL as string,
  },
});