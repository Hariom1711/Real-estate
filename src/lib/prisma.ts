// import { PrismaClient } from '@prisma/client';
// import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

// const prismaClientSingleton = () => {
//   const dbUrl = process.env.DATABASE_URL || "file:./prisma/dev.db";
//   const adapter = new PrismaBetterSqlite3({ url: dbUrl });
//   return new PrismaClient({ adapter });
// };

// declare global {
//   var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
// }

// const prisma = globalThis.prisma ?? prismaClientSingleton();

// export default prisma;

// if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;