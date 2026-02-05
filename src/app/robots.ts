import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

    return {
        rules: [
            {
                userAgent: ['Googlebot', 'Googlebot-Image', 'Googlebot-Mobile'],
                allow: '/',
                disallow: ['/admin/', '/api/'],
                crawlDelay: 0,
            },
            {
                userAgent: ['Bingbot'],
                allow: '/',
                disallow: ['/admin/', '/api/'],
                crawlDelay: 1,
            },
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/admin/', '/api/', '/login', '/__*'],
                crawlDelay: 1,
            },
        ],
        sitemap: [`${baseUrl}/sitemap.xml`],
        host: baseUrl,
    };
}
