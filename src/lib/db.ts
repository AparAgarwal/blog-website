import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
    let dbUrl = process.env.DATABASE_URL || '';
    
    // Automatically add settings for Neon Serverless databases to handle cold starts
    if (dbUrl && dbUrl.includes('neon.tech')) {
        const urlObj = new URL(dbUrl);
        if (!urlObj.searchParams.has('connect_timeout')) {
            urlObj.searchParams.set('connect_timeout', '20'); // 20s timeout for cold start wake-ups
        }
        if (dbUrl.includes('-pooler') && !urlObj.searchParams.has('pgbouncer')) {
            urlObj.searchParams.set('pgbouncer', 'true');
        }
        dbUrl = urlObj.toString();
    }

    return new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
        // Connection pooling optimizations
        datasourceUrl: dbUrl,
    });
};

declare global {
    var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;
