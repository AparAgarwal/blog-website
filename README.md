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
- 📱 **Mobile-First Design** - Responsive layout with CSS Grid/Flexbox
- 🛡️ **Enterprise Security** - HSTS, XSS protection, secure sessions

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
│   │   ├── posts/      # Public post views ([slug])
│   │   └── layout.tsx  # Root layout with ThemeProvider
│   ├── lib/
│   │   └── db.ts       # Global PrismaClient instance
│   ├── components/     # Reusable UI components
│   └── middleware.ts   # Authentication protection rules
├── public/             # Static assets
└── next.config.ts      # Next.js configuration
```

## 📝 Content Management

Posts are stored in PostgreSQL and rendered with MDX for safe, rich content. Create, edit, and publish posts through the admin dashboard at `/admin`.

## 🔐 Security

Enterprise-grade security built-in:
- **Middleware Protection** - All admin routes protected at HTTP level
- **Rate Limiting** - Exponential backoff after 5 failed login attempts
- **Strong Passwords** - Minimum 12 characters required
- **Secure Sessions** - JWT with 30-day expiration, HttpOnly cookies
- **Security Headers** - HSTS, X-Frame-Options, CSP, and more

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

## 🤝 Contributing

Contributions welcome! Feel free to open issues or submit pull requests.

## 📄 License

MIT License - See [LICENSE](./LICENSE) for details.

---

**Built with ❤️ using Next.js 16, Prisma, and PostgreSQL**
