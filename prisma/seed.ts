/* eslint-disable @typescript-eslint/no-require-imports */
import { createHash } from "crypto";

// Dynamic require to handle Prisma v7 client location
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const { PrismaClient } = require("@prisma/client") as any;
const db = new PrismaClient();

function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

async function main() {
  const admin = await db.user.upsert({
    where: { email: "admin@orbitaisystems.com" },
    update: {},
    create: {
      email: "admin@orbitaisystems.com",
      password: hashPassword("admin123"),
      name: "Admin",
      role: "ADMIN",
    },
  });

  console.log("Created admin user:", admin.email);
  console.log("Default password: admin123 — CHANGE THIS IMMEDIATELY IN PRODUCTION");
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
