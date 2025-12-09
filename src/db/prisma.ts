import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

declare global {
  // Prevent multiple instances in dev (Next.js HMR)
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const isProd = process.env.NODE_ENV === 'production';

// Create "pg" pool from DATABASE_URL available at runtime (.env/.env.local)
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  // ssl: { rejectUnauthorized: false }, // uncomment if your DB requires SSL
});

// Step 1: derive the PrismaClient constructor argument type
type PrismaClientConfig = ConstructorParameters<typeof PrismaClient>[0];

// Step 2: use the derived type instead of "any"
const clientOptions: PrismaClientConfig = {
  log: isProd ? [] : ['warn', 'error'],
  // Required for engineType="client"
  adapter: new PrismaPg(pool),
};

export const prisma =
  globalThis.prisma ??
  new PrismaClient(clientOptions);

if (!isProd) {
  globalThis.prisma = prisma;
}