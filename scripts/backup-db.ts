
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting database backup...');

    const posts = await prisma.post.findMany();
    // const admins = await prisma.admin.findMany();
    // const rateLimits = await prisma.rateLimit.findMany();

    const data = {
        posts,
        // admins,
        // rateLimits,
    };

    const backupPath = path.join(process.cwd(), 'prisma', 'seed-data.json');

    fs.writeFileSync(backupPath, JSON.stringify(data, null, 2));

    console.log(`Backup completed successfully to ${backupPath}`);
    console.log(`Backed up ${posts.length} posts.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
