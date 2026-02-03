# Modern Next.js Blog Platform

A production-ready blog with secure admin dashboard, rich MDX content, and optimized performance. Built for personal blogs and technical writing.

## 🚀 Tech Stack

- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript
- **Database**: PostgreSQL (Prisma ORM)
- **Authentication**: NextAuth.js v4 (JWT sessions)
- **Styling**: Vanilla CSS + MDX (Markdown + JSX)

## ✨ Features

- 🔐 **Secure Admin Dashboard** - Middleware-protected routes with rate limiting
- 📝 **Rich Content** - Write posts in MDX with syntax highlighting
- 🎨 **Light/Dark Theme** - Automatic theme switching with CSS variables
- ⚡ **Fast Performance** - ISR caching + static generation (50-200ms response)
- 📱 **Mobile-First Design** - Responsive hamburger menu navigation, smooth animations
- 🛡️ **Enterprise Security** - HSTS, XSS protection, secure sessions
- ♿ **Accessibility** - WCAG compliant with ARIA labels, skip links, and semantic HTML
- 🔍 **SEO Optimized** - Dynamic metadata, Open Graph, Twitter Cards, JSON-LD structured data
- ♾️ **Infinite Scroll** - Optional infinite scroll on archive page with loading states
- 🎯 **Code Quality** - ESLint + Prettier configured for consistent code style

## 🛠️ Setup & Installation

1.  **Clone the repository**

    ```bash
    git clone https://github.com/AparAgarwal/blog-website.git
    cd blog-website
    ```

2.  **Install dependencies**

    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Environment Configuration**
    Create a `.env` file in the root directory:

    ```env
    # Get this from Neon dashboard (https://neon.tech)
    DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"

    # Generate with: openssl rand -base64 32
    NEXTAUTH_SECRET="your-secure-random-secret-key"

    # For local development
    NEXTAUTH_URL="http://localhost:3000"
    ```

4.  **Database Setup**
    Initialize the database and generate the Prisma Client:

    ```bash
    # Generate Prisma Client
    npx prisma generate

    # Push schema to database
    npx prisma db push

    # Seed the database with admin user
    npx prisma db seed
    ```

    **Note**: The seed creates an admin user. Check the console output for credentials.

5.  **Run Development Server**
    ```bash
    npm run dev
    ```
    Access the app at `http://localhost:3000`.

## 🧰 Available Scripts

### Development & Build

- `npm run dev` - Start development server
- `npm run build` - Build production bundle
- `npm run start` - Start production server

### Code Quality

- `npm run lint` - Run ESLint checks
- `npm run lint:fix` - Auto-fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

### Database Management

- `npx prisma generate` - Generate Prisma Client
- `npx prisma db push` - Push schema to database
- `npx prisma db seed` - Seed database with initial data
- `npx prisma studio` - Open Prisma Studio (database GUI)
- `npx tsx scripts/backup-db.ts` - Backup posts to JSON file
- `npx tsx scripts/restore-db.ts` - Restore posts from JSON backup

## 📂 Project Structure

```
├── prisma/
│   ├── schema.prisma   # Database schema (Post, Admin, RateLimit models)
│   ├── seed.ts         # Database seeding script
│   └── migrations/     # Database migrations (if using migrate)
├── src/
│   ├── app/            # Next.js App Router
│   │   ├── admin/      # Admin dashboard routes (Protected)
│   │   ├── api/        # API Routes (Auth, etc.)
│   │   ├── posts/      # Public post views ([slug]) with dynamic metadata
│   │   ├── archive/    # Archive page with infinite scroll
│   │   ├── layout.tsx  # Root layout with metadata and font configuration
│   │   └── layout-client.tsx  # Client-side layout with navigation
│   ├── lib/
│   │   ├── db.ts       # Global PrismaClient instance
│   │   └── rate-limit.ts  # Rate limiting utility
│   ├── components/     # Reusable UI components
│   │   ├── PostList.tsx     # Post list with optional infinite scroll
│   │   ├── PostForm.tsx     # Post creation/editing form
│   │   ├── ThemeToggle.tsx  # Dark/light theme switcher
│   │   ├── Spinner.tsx      # Loading spinner component
│   │   ├── HeroSection.tsx  # Homepage hero section
│   │   ├── CodeBlock.tsx    # Syntax-highlighted code blocks
│   │   └── ...              # Other components
│   ├── middleware.ts   # Authentication protection rules
│   └── types/          # TypeScript type definitions
├── scripts/
│   ├── backup-db.ts    # Database backup script
│   └── restore-db.ts   # Database restore script
├── public/             # Static assets
├── .prettierrc         # Prettier configuration
├── eslint.config.mjs   # ESLint configuration (flat config)
└── next.config.ts      # Next.js configuration
```

## 📝 Content Management

Posts are stored in PostgreSQL and rendered with MDX for safe, rich content. Create, edit, and publish posts through the admin dashboard at `/admin`.

### Data Backup & Restore

The project includes built-in scripts for backing up and restoring your blog data:

#### 📦 Backup Your Data

Create a JSON backup of all posts to preserve your content:

```bash
npx tsx scripts/backup-db.ts
```

This will:

- Export all posts to `prisma/seed-data.json`
- Preserve post relationships (linked posts)
- Output backup statistics (number of posts backed up)

**When to use:**

- Before major database migrations
- Before deploying significant changes
- As part of regular backup strategy
- Before testing destructive operations

#### 🔄 Restore Your Data

Restore posts from your backup file:

```bash
npx tsx scripts/restore-db.ts
```

This will:

- Clear all existing posts from the database
- Import posts from `prisma/seed-data.json`
- Restore post relationships and linked posts
- Display restore progress and statistics

**⚠️ Warning:** This operation will **delete all existing posts** before restoring. Make sure you have a current backup before running this command.

**Use cases:**

- Recovering from accidental data deletion
- Migrating between databases
- Restoring to a previous state
- Setting up a development environment with production data

## 🔐 Security & Accessibility

**Enterprise-grade security:**

- **Middleware Protection** - All admin routes protected at HTTP level
- **Rate Limiting** - Exponential backoff after 5 failed login attempts
- **Strong Passwords** - Minimum 12 characters required
- **Secure Sessions** - JWT with 30-day expiration, HttpOnly cookies
- **Security Headers** - HSTS, X-Frame-Options, CSP, and more

**WCAG Accessibility:**

- **Semantic HTML** - Proper heading hierarchy, article tags, navigation landmarks
- **ARIA Labels** - Comprehensive labeling for screen readers
- **Skip Links** - Jump to main content functionality
- **Keyboard Navigation** - Full keyboard accessibility for mobile menu
- **Screen Reader Support** - Proper roles and live regions for dynamic content

Admin features: Dashboard (`/admin`), Password change (`/admin/settings`), Explicit logout.

## 🚀 Deployment

Deploy to **Vercel + Neon PostgreSQL** (both 100% free, no credit card):

1. **Create Database** - Sign up at [neon.tech](https://neon.tech), create project, copy connection string
2. **Push to GitHub** - Commit your code to a GitHub repository
3. **Deploy to Vercel** - Import repo at [vercel.com](https://vercel.com), set environment variables
4. **Configure Domain** - (Optional) Add custom domain in Vercel settings

**📖 Full guide with troubleshooting:** [DEPLOYMENT.md](./DEPLOYMENT.md)

## 📚 Documentation

- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Complete deployment guide with custom domain setup
- **[package.json](./package.json)** - All dependencies and scripts

## 🎨 Key Technical Features

### Responsive Navigation

- Mobile-first hamburger menu with smooth animations
- Body scroll lock when menu is open
- Click-outside-to-close functionality
- Accessible with ARIA attributes

### SEO & Metadata

- Dynamic Open Graph and Twitter Card metadata for all pages
- JSON-LD structured data for blog posts
- Canonical URLs and proper meta descriptions
- Sitemap-ready structure

### Performance Optimizations

- Intersection Observer API for scroll animations
- Optional infinite scroll with loading states
- Image optimization with Next.js Image component
- Font preloading and display swap

### Code Quality

- TypeScript strict mode enabled
- ESLint with flat config format
- Prettier for consistent formatting
- Comprehensive error handling

## 🤝 Contributing

Contributions welcome! Feel free to open issues or submit pull requests.

## 📄 License

MIT License - See [LICENSE](./LICENSE) for details.

---

**Built with ❤️ using Next.js 16, Prisma, and PostgreSQL**
