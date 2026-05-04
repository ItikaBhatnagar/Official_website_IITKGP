const { PrismaClient } = require("@prisma/client");

// Re-use the same instance in development (avoids too many connections)
const globalForPrisma = globalThis;

const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

module.exports = { prisma };
