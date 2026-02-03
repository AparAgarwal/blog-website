
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting database restore...');

    const backupPath = path.join(process.cwd(), 'prisma', 'seed-data.json');
    if (!fs.existsSync(backupPath)) {
        console.error('Backup file not found at', backupPath);
        process.exit(1);
    }

    const rawData = fs.readFileSync(backupPath, 'utf-8');
    const data = JSON.parse(rawData);

    console.log('Clearing existing posts...');
    await prisma.post.deleteMany({});
    // await prisma.admin.deleteMany({});
    // await prisma.rateLimit.deleteMany({});

    console.log(`Restoring ${data.posts.length} posts...`);
    for (const post of data.posts) {
        await prisma.post.create({
            data: {
                ...post,
                nextPostId: undefined,
            },
        });
    }

    for (const post of data.posts) {
        if (post.nextPostId) {
            await prisma.post.update({
                where: { id: post.id },
                data: {
                    nextPost: {
                        connect: { id: post.nextPostId },
                    },
                },
            });
        }
    }

    // console.log(`Restoring ${data.admins.length} admins...`);
    // for (const admin of data.admins) {
    //     await prisma.admin.create({
    //         data: admin,
    //     });
    // }

    // if (data.rateLimits?.length) {
    //     console.log(`Restoring ${data.rateLimits.length} rate limits...`);
    //     for (const rateLimit of data.rateLimits) {
    //         await prisma.rateLimit.create({
    //             data: rateLimit,
    //         });
    //     }
    // }

    console.log('Restore completed successfully.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
