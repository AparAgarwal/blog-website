import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    // Require both email and password to be set
    if (!adminEmail || !adminPassword) {
        console.error('ERROR: ADMIN_EMAIL and ADMIN_PASSWORD must be set in environment variables');
        console.error('Please set these in your .env file before running seed.');
        process.exit(1);
    }

    // Validate password strength
    if (adminPassword.length < 12) {
        console.error('ERROR: ADMIN_PASSWORD must be at least 12 characters long');
        process.exit(1);
    }

    // Check for common weak passwords
    const weakPasswords = ['password', '123456', 'admin', 'qwerty', 'letmein'];
    if (weakPasswords.some((weak) => adminPassword.toLowerCase().includes(weak))) {
        console.error('ERROR: ADMIN_PASSWORD is too weak. Please use a strong, unique password.');
        process.exit(1);
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await prisma.admin.upsert({
        where: { email: adminEmail },
        update: { password: hashedPassword },
        create: {
            email: adminEmail,
            password: hashedPassword,
        },
    });
    console.log(`✅ Admin user ${adminEmail} seeded successfully.`);
    console.log('⚠️  Keep your credentials secure!');

    const posts = [
        {
            title: 'Building a Modern Blog Platform with Vibe Coding',
            excerpt:
                'How I built a production-ready Next.js blog by following intuition, embracing flow state, and letting the code guide me through the journey.',
            content: `
## I Built My Blog by Following the Vibes (And It Actually Works)

You know that feeling when you sit down to code and everything just *flows*? That's vibe coding. No rigid specs, no upfront architecture diagrams, just you, your editor, and the gentle hum of intuition guiding your fingers across the keyboard.


It was 11 PM on a Thursday. I opened VS Code with zero plan, zero wireframes, and zero architecture diagrams. Just a wild idea: *What if I stopped overthinking and just... coded?*

Two days later, I had a fully functional blog platform running in production. No burnout. No decision paralysis. Just pure flow.

This is the story of how I built my blog platform—not through meticulous planning, but by vibing my way to a production-ready Next.js application.

### The Vision (Sort Of)

I didn't start with a detailed spec. I just knew I wanted:
- A blog where I could write
- An admin panel to manage posts
- Something that felt modern and fast
- Dark mode, because obviously

That's it. No user stories. No wireframes. Just vibes.

### The Journey Begins

I fired up a new Next.js 16 project. The App Router felt right—Server Components, streaming, all that good stuff. TypeScript? Of course. The red squiggles are part of the vibe; they keep you honest.

\`\`\`node
npx create-next-app@latest blog-site --typescript --app --tailwind
\`\`\`

Wait, TailwindCSS? Nah. The vibe told me to go with vanilla CSS this time. Sometimes you just need to write your own styles and feel the cascade. I removed Tailwind and created a \`globals.css\` with CSS variables for theming:

\`\`\`css
:root {
  --background: #ffffff;
  --foreground: #0a0a0a;
  --accent: #0070f3;
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0a0a;
    --foreground: #ededed;
  }
}
\`\`\`

Pure vibes. Let the browser do the theme switching automatically.  
**Vibe check:** 10/10. Already felt more connected to the code.

#### Database decisions

I needed to store posts somewhere. The vibe whispered "Prisma + PostgreSQL." Simple, elegant, type-safe.

No over-engineering. Just the essentials. The index? I added that later when I *felt* the queries getting slow. That's vibe coding—optimize when the pain is real, not when you imagine it might be.

#### The Content Experience

For writing, I needed something better than plain HTML. MDX came calling. With \`next-mdx-remote\`, I could write in Markdown but sprinkle in React components when needed:

\`\`\`tsx
import { MDXRemote } from 'next-mdx-remote/rsc'
import rehypeHighlight from 'rehype-highlight'
import remarkGfm from 'remark-gfm'

const content = await MDXRemote({
  source: post.content,
  options: {
    mdxOptions: {
      rehypePlugins: [rehypeHighlight],
      remarkPlugins: [remarkGfm],
    },
  },
})
\`\`\`

Syntax highlighting? Handled. GitHub-flavoured markdown? Done. The vibe was strong.

### Authentication without the Pain

This is when things got weird (in a good way).

I started building the admin panel and realized I didn't need API routes. Server Actions just... made sense. Delete a post? It's just a function. No REST architecture, no GraphQL schemas, no overthinking.

\`\`\`typescript
async function deletePost(id: string) {
  // Just... delete it
}
\`\`\`

By now, the vibe had its own momentum. The blog was telling me what it wanted to become.
Every decision was instant. No analysis paralysis. Just "does this feel right? Yes? Ship it."

#### The Aesthetic Vibe

Dark mode wasn't just a feature—it was a *vibe*. I built a theme toggle that felt right:

\`\`\`typescript
const toggleTheme = () => {
  const html = document.documentElement
  const newTheme = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'
  html.setAttribute('data-theme', newTheme)
  localStorage.setItem('theme', newTheme)
}
\`\`\`

Smooth transitions, CSS variables, system preference detection. It just *felt good*.

### The Results

After vibing my way through development, I ended up with:

- 🔐 **Secure admin dashboard** with rate limiting and middleware protection
- 📝 **Rich MDX content** with syntax highlighting
- 🎨 **Beautiful dark mode** that respects system preferences
- 📱 **Mobile-responsive** with smooth animations

### Lesson Learned

- **Flow state is a superpower**  
When you're vibing, you write better code than when you're following a rigid plan. Because you're *present* with the code.

- **Done is better than perfect**  
My blog isn't perfect. But it's *real*, it's *live*, and I actually finished it instead of abandoning it in planning hell.

Trust me. The vibe knows what it's doing.

And if you feel stuck, remember: every line of code is a vibe check. If it feels wrong, it probably is. If it feels right, it probably is.

Now if you'll excuse me, I have more vibes to code. ✌️

> *Built with: Next.js, React, TypeScript, Prisma, PostgreSQL, NextAuth.js, MDX, and pure vibes ✨*

*P.S. - This entire blog post? Written in the same blog platform I vibe-coded.*
            `,
            slug: 'building-a-modern-blog-platform-with-vibe-coding',
            tags: 'Next.js, TypeScript, Vibe Coding, Web Development, Featured',
            published: true,
            createdAt: new Date('2026-02-01'),
        },
        {
            title: 'Designing Rate Limiting for a Node.js API',
            excerpt:
                'A deep dive into implementing distributed rate limiting using Redis and sliding window counters to protect your backend.',
            content: `
## The Thundering Herd

When you expose a public API, it's only a matter of time before someone (accidentally or maliciously) hammers your endpoints.

### Why Token Bucket?

I chose the **Token Bucket** algorithm over Fixed Window because it allows for bursts of traffic while maintaining a steady average rate.

\`\`\`typescript
interface RateLimitConfig {
  windowSize: number; // in seconds
  maxRequests: number;
}

// Pseudo-code for Redis Lua script
const luaScript = \`
  local key = KEYS[1]
  local window = ARGV[1]
  
  local current = redis.call("INCR", key)
  if current == 1 then
    redis.call("EXPIRE", key, window)
  end
  
  return current
\`
\`\`\`

### Distributed Systems

When running multiple Node.js instances, local memory stores won't cut it. Redis provides the atomic operations needed to synchronize counters across your cluster.
            `,
            slug: 'rate-limiting-node-api',
            tags: 'Node.js, Redis, System Design',
            published: true,
            createdAt: new Date('2026-01-29'),
        },
        {
            title: 'Why My First Cache Invalidation Strategy Failed',
            excerpt:
                'Cache invalidation is one of the two hardest problems in CS. Here is how I messed it up and what I learned about event-driven invalidation.',
            content: `
## The Stale Data Nightmare

I thought I could just set a TTL (Time To Live) of 5 minutes and call it a day. I was wrong.

### The Problem with TTL

TTL is **eventually consistent**, but for a payment system, "eventual" isn't good enough. A user would update their credit card, but the checkout page would still show the old one for 4 minutes and 59 seconds.

### The Fix: Event-Driven Invalidation

We moved to an active invalidation strategy using Postgres triggers and a pub/sub mechanism.

\`\`\`javascript
// When a user updates their profile...
await db.users.update(id, data);
await cache.del(\`user:\${id}\`);
await pubsub.publish('user-updated', { id });
\`\`\`

This ensures that *immediately* after a write, the next read will fetch fresh data from the DB.
            `,
            slug: 'cache-invalidation-mistakes',
            tags: 'Caching, Architecture, Backend',
            published: true,
            createdAt: new Date('2026-01-28'),
        },
        {
            title: 'Notes on Consistent Hashing',
            excerpt:
                'Understanding how to distribute data across a changing set of servers without remapping the entire world.',
            content: `
## The Rebalancing Act

Standard modulo hashing (\`hash(key) % n\`) breaks everything when \`n\` changes. If you add a server, almost every key gets remapped.

### The Ring

Consistent hashing maps both servers and keys to a circle (0 to 2^32 - 1).

1.  Hash your servers to points on the ring.
2.  Hash your key to a point on the ring.
3.  Walk clockwise to find the first server.

### Virtual Nodes

To prevent hotspots where one server handles too much of the ring, we use **Virtual Nodes**. Each physical server effectively exists at multiple points on the ring.

> "Consistent hashing allows us to add or remove nodes with minimal disruption."

This is the backbone of systems like DynamoDB and Cassandra.
            `,
            slug: 'consistent-hashing-notes',
            tags: 'Algorithms, Distributed Systems',
            published: true,
            createdAt: new Date('2026-01-25'),
        },
        {
            title: 'Rust Web Tooling: The New Standard',
            excerpt:
                'Why the JavaScript ecosystem is rewriting everything in Rust, and why it matters for your build times.',
            content: `
## Speed Matters

Tools like **SWC** and **Turbopack** are proving that native code is the future of JS tooling.

\`\`\`bash
# Typical build time
Webpack: 45s
Turbopack: 2s
\`\`\`

The difference isn't just nice-to-have; it changes how you develop. Instant feedback loops keep you in the flow state.
            `,
            slug: 'rust-web-tooling',
            tags: 'Rust, Tooling, Performance',
            published: true,
            createdAt: new Date('2026-01-20'),
        },
        {
            title: 'Rethinking Data Fetching with React Server Components',
            excerpt:
                "Server Components are the biggest shift in React since Hooks. Here's why they matter and how they change the mental model of building apps.",
            content: `
## The Waterfall Problem

Traditional React apps often suffer from "request waterfalls" where child components wait for parents to finish fetching before they can start their own.

### Enter Server Components

With RSC, we can fetch data directly on the server, right next to the database.

\`\`\`tsx
export default async function Page() {
  const data = await db.post.findMany();
  return <PostList posts={data} />;
}
\`\`\`

No more \`useEffect\`, no more loading spinners for simple data. It just renders.
            `,
            slug: 'react-server-components',
            tags: 'React, Next.js, Frontend',
            published: true,
            createdAt: new Date('2026-01-18'),
        },
        {
            title: 'Database Indexing 101: Optimizing Your Queries',
            excerpt:
                'A slow query is often just a missing index away from being instant. Learn the basics of B-Trees and how to analyze query plans.',
            content: `
## Anatomy of an Index

Think of an index like the index at the back of a textbook. Instead of reading every page to find "Photosynthesis", you look it up and go straight to page 42.

### B-Trees

Most relational databases use B-Trees. They keep data sorted, allowing for \`O(log n)\` lookups instead of \`O(n)\` full table scans.

\`\`\`sql
CREATE INDEX idx_published_created 
ON Post(published, createdAt DESC);
\`\`\`

Always check your \`EXPLAIN ANALYZE\` output!
            `,
            slug: 'database-indexing-101',
            tags: 'SQL, Database, Performance',
            published: true,
            createdAt: new Date('2026-01-15'),
        },
        {
            title: 'Why We Moved to a Monorepo',
            excerpt:
                'Managing multiple repositories became a nightmare of version mismatches and duplicated code. Here is how a monorepo saved our sanity.',
            content: `
## The Dependency Hell

We used to have 15 different repos. Sharing types between the backend and frontend required publishing a private npm package, which took 10 minutes to propagate.

### Enter TurboRepo

We switched to a monorepo managed by TurboRepo. Now, changes to shared libraries are instantly available to all apps.

> "Code sharing should be frictionless."

We reduced our CI times by 60% using caching and parallel execution.
            `,
            slug: 'moving-to-monorepo',
            tags: 'DevOps, Architecture, Productivity',
            published: true,
            createdAt: new Date('2026-01-10'),
        },
        {
            title: "It's Always DNS: A Debugging Story",
            excerpt:
                "A mysterious outage that wasn't a code bug, but a misunderstood TTL record. A cautionary tale about the internet's phonebook.",
            content: `
## The Outage

At 3 AM, our load balancer started returning 502s. The application servers were healthy. The database was fine.

### The Culprit

We had migrated to a new ingress provider but forgot to lower the TTL (Time To Live) on our DNS records before the switch.

Some ISPs were caching the old IP address for 24 hours.

**Lesson learned:** Always lower your TTL to 60 seconds at least 48 hours before a major migration.
            `,
            slug: 'always-dns',
            tags: 'Networking, Debugging, Post-mortem',
            published: true,
            createdAt: new Date('2026-01-05'),
        },
    ];

    for (const post of posts) {
        await prisma.post.upsert({
            where: { slug: post.slug },
            update: post,
            create: post,
        });
    }
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
