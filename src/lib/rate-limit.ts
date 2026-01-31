import prisma from '@/lib/db'

/**
 * Simple rate limiting
 * @param key - Unique identifier (e.g., email address)
 * @param limit - Max attempts allowed
 * @param windowSeconds - Time window in seconds
 * @returns true if allowed, false if rate limited
 */
export async function checkRateLimit(key: string, limit: number, windowSeconds: number): Promise<boolean> {
    const now = new Date()
    const expiresAt = new Date(now.getTime() + windowSeconds * 1000)

    // Find existing rate limit entry
    const rateLimit = await prisma.rateLimit.findUnique({
        where: { key }
    })

    if (rateLimit) {
        // Entry expired, delete and allow
        if (rateLimit.expiresAt < now) {
            await prisma.rateLimit.delete({ where: { key } })
            await prisma.rateLimit.create({
                data: { key, count: 1, expiresAt }
            })
            return true
        }

        // Limit exceeded - reject
        if (rateLimit.count >= limit) {
            return false
        }

        // Increment counter
        await prisma.rateLimit.update({
            where: { key },
            data: { count: { increment: 1 } }
        })
    } else {
        // Create new entry
        await prisma.rateLimit.create({
            data: { key, count: 1, expiresAt }
        })
    }

    return true // Allowed
}

/**
 * Get remaining time until rate limit expires
 * @param key - Unique identifier
 * @returns Seconds remaining or null if not rate limited
 */
export async function getRateLimitInfo(key: string): Promise<number | null> {
    const rateLimit = await prisma.rateLimit.findUnique({
        where: { key }
    })

    if (!rateLimit) return null

    const now = new Date()
    if (rateLimit.expiresAt < now) return null

    return Math.ceil((rateLimit.expiresAt.getTime() - now.getTime()) / 1000)
}
