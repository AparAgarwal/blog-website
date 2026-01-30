import prisma from '@/lib/db'

/**
 * Rate limiting with exponential backoff
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

    // Check if limit exceeded
    if (rateLimit) {
        // Entry expired, delete and allow
        if (rateLimit.expiresAt < now) {
            await prisma.rateLimit.delete({ where: { key } })
            await prisma.rateLimit.create({
                data: { key, count: 1, expiresAt }
            })
            return true
        }
        
        // Limit exceeded - apply exponential backoff
        if (rateLimit.count >= limit) {
            // Extend expiration time with exponential backoff
            // Each additional attempt doubles the wait time
            const attempts = rateLimit.count - limit + 1
            const backoffMultiplier = Math.min(Math.pow(2, attempts), 32) // Cap at 32x
            const newExpiresAt = new Date(now.getTime() + (windowSeconds * backoffMultiplier * 1000))
            
            await prisma.rateLimit.update({
                where: { key },
                data: { 
                    count: { increment: 1 },
                    expiresAt: newExpiresAt
                }
            })
            
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

    // Periodically clean up expired entries (10% chance)
    if (Math.random() < 0.1) {
        // Run cleanup in background, don't await
        prisma.rateLimit.deleteMany({
            where: { expiresAt: { lt: now } }
        }).catch(() => {}) // Silently fail cleanup
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
