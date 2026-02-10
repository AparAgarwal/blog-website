/**
 * SEO utilities and Schema.org structured data generators
 */

const siteConfig = {
    name: 'Apar Agarwal',
    title: 'Apar Agarwal | Engineering Blog',
    description:
        'Engineering insights on backend development, distributed systems, and software architecture. Practical knowledge from real-world experience.',
    url: process.env.NEXTAUTH_URL || 'http://localhost:3000',
    author: 'Apar Agarwal',
    email: 'aparagarwal01@gmail.com',
    twitter: '@aparagarwal13',
    twitterHandle: 'aparagarwal13',
    socialImage: '/og-image.png',
    locale: 'en_US',
};

/**
 * Organization schema for JSON-LD
 */
export function getOrganizationSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: siteConfig.name,
        url: siteConfig.url,
        logo: `${siteConfig.url}/og-image.png`,
        sameAs: [`https://twitter.com/${siteConfig.twitterHandle}`, 'https://github.com/aparagarwal'],
        contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'Email',
            email: siteConfig.email,
        },
    };
}

/**
 * Blog posting schema for JSON-LD
 */
export function getBlogPostingSchema(
    title: string,
    description: string,
    content: string,
    slug: string,
    publishedAt: Date,
    modifiedAt: Date,
    tags?: string
) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: title,
        description,
        image: `${siteConfig.url}${siteConfig.socialImage}`,
        datePublished: publishedAt.toISOString(),
        dateModified: modifiedAt.toISOString(),
        author: {
            '@type': 'Person',
            name: siteConfig.author,
            url: siteConfig.url,
            email: siteConfig.email,
        },
        publisher: {
            '@type': 'Organization',
            name: siteConfig.name,
            logo: {
                '@type': 'ImageObject',
                url: `${siteConfig.url}/og-image.png`,
            },
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `${siteConfig.url}/posts/${slug}`,
        },
        keywords: tags || '',
        articleBody: content,
    };
}

/**
 * Website schema for JSON-LD (includes search action)
 */
export function getWebsiteSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: siteConfig.title,
        description: siteConfig.description,
        url: siteConfig.url,
        potentialAction: {
            '@type': 'SearchAction',
            target: {
                '@type': 'EntryPoint',
                urlTemplate: `${siteConfig.url}/archive?q={search_term_string}`,
            },
            'query-input': 'required name=search_term_string',
        },
    };
}

export default siteConfig;
