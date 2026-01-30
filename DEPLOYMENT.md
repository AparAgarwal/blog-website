# Deployment Guide - Neon PostgreSQL + Vercel

## Prerequisites
- GitHub account
- Neon account (free tier, no credit card)
- Vercel account (free tier)
- Custom domain (optional)

---

## Step 1: Neon Database Setup

### 1.1 Create Database
1. Go to [Neon](https://neon.tech/) and sign up/login (use GitHub for quick signup)
2. Click **"Create a project"**
3. Name: `blog-database` (or your preferred name)
4. PostgreSQL version: 17 (latest)
5. Region: Choose closest to your target audience
6. Click **"Create project"** (100% free, no credit card required)

### 1.2 Get Connection String
1. After creation, you'll immediately see the connection details
2. Copy the **"Pooled connection"** string (recommended for serverless)
3. Format: `postgresql://username:password@host/database?sslmode=require`
4. **Important**: Save this securely, you'll need it for both local dev and production

### 1.3 Database Features (Free Tier)
- 512 MB storage
- Unlimited projects
- Autosuspend after inactivity (resumes instantly on query)
- Point-in-time restore (7 days)
- No credit card required ✅

---

## Step 2: Local Testing with Neon

### 2.1 Update Local Environment
```bash
# Copy .env.example to .env
cp .env.example .env
```

Edit `.env` and add:
```env
DATABASE_URL="postgresql://...your-neon-connection-string..."
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"
```

### 2.2 Push Schema to Neon
```bash
# Generate Prisma client
npx prisma generate

# Push schema (this creates tables in Neon)
npx prisma db push
```

### 2.3 Seed Database (Create Admin User)
```bash
npx prisma db seed
```

**Important**: Note the admin credentials from seed output!

### 2.4 Test Locally
```bash
npm run dev
```

Visit `http://localhost:3000` and test:
- Homepage loads
- Login to `/admin` with seed credentials
- Create a test post
- View post on homepage

---

## Step 3: GitHub Repository Setup

### 3.1 Initialize Git (if not already done)
```bash
git init
git add .
git commit -m "Initial commit - ready for deployment"
```

### 3.2 Create GitHub Repository
1. Go to [GitHub](https://github.com) → **New Repository**
2. Name: `blog-site` (or your preferred name)
3. **Don't** initialize with README (you already have one)
4. Click **"Create repository"**

### 3.3 Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

---

## Step 4: Vercel Deployment

### 4.1 Import Project
1. Go to [Vercel](https://vercel.com) and login
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Select the `blog-site` repository

### 4.2 Configure Project
- **Framework Preset**: Next.js (auto-detected)
- **Root Directory**: `./` (default)
- **Build Command**: `npm run build` (default)
- **Output Directory**: `.next` (default)

### 4.3 Add Environment Variables
Click **"Environment Variables"** and add:

```env
DATABASE_URL=mysql://...your-planetscale-url...
NEXTAUTH_SECRET=your-32-char-secret
NEXTAUTH_URL=https://your-vercel-app.vercel.app
```

**Important Notes**:
- Use the same `DATABASE_URL` from PlanetScale
- Generate `NEXTAUTH_SECRET`: Run `openssl rand -base64 32` in terminal
- For now, use the Vercel-provided URL (e.g., `https://blog-site-abc123.vercel.app`)
- You'll update `NEXTAUTH_URL` after adding custom domain

### 4.4 Deploy
1. Click **"Deploy"**
2. Wait 2-3 minutes for build to complete
3. Once done, click **"Visit"** to test your site

---

## Step 5: Verify Deployment

Test these critical features:

1. **Homepage**: Should load and show posts
2. **Post Pages**: Click on a post, verify content renders
3. **Admin Login**: Go to `/admin` → Login should work
4. **Admin Dashboard**: Create/edit/delete posts should work
5. **Authentication**: Logout and verify redirect

---

## Step 6: Custom Domain Setup (Optional)

### 6.1 Add Domain in Vercel
1. In Vercel dashboard → Your Project → **"Settings"** → **"Domains"**
2. Click **"Add"**
3. Enter your domain: `yourdomain.com`
4. Click **"Add"**

### 6.2 Configure DNS Records
Go to your domain registrar (Namecheap, GoDaddy, Cloudflare, etc.) and add:

**For Root Domain (yourdomain.com):**
```
Type: A
Name: @
Value: 76.76.21.21
TTL: Auto or 3600
```

**For www Subdomain:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: Auto or 3600
```

### 6.3 Wait for DNS Propagation
- Usually takes 5-30 minutes
- Can take up to 48 hours in rare cases
- Check status in Vercel dashboard

### 6.4 Update NEXTAUTH_URL
1. In Vercel → Project → **"Settings"** → **"Environment Variables"**
2. Edit `NEXTAUTH_URL`:
   ```
   NEXTAUTH_URL=https://yourdomain.com
   ```
3. Click **"Save"**
4. Redeploy: **"Deployments"** → Latest → **"..."** → **"Redeploy"**

### 6.5 SSL Certificate
- Vercel automatically provisions SSL (HTTPS)
- Usually ready within 5-10 minutes
- Verify by visiting `https://yourdomain.com`

---

## Step 7: Post-Deployment Tasks

### 7.1 Create Production Admin User
If you haven't seeded the production database yet:

**Option A: Use Prisma Studio**
```bash
# Connect to production database
npx prisma studio
```

**Option B: Create via API**
Use the seed script or create manually in PlanetScale console.

### 7.2 Security Checklist
- [ ] Verify `.env` is NOT in git (`git ls-files | grep .env` should be empty)
- [ ] Strong `NEXTAUTH_SECRET` (32+ characters)
- [ ] HTTPS enabled on custom domain
- [ ] Test rate limiting on login
- [ ] Review admin password strength

### 7.3 Performance Optimization
- [ ] Test Lighthouse score (aim for 90+)
- [ ] Verify images are optimized
- [ ] Check loading speed with slow 3G throttling
- [ ] Test on mobile devices

---

## Common Issues & Solutions

### Issue: "Database connection error"
**Solution**: 
- Verify `DATABASE_URL` in Vercel environment variables
- Check Neon database is not suspended (it auto-resumes on query)
- Ensure connection string uses "Pooled connection" format
- Verify `?sslmode=require` is at the end of connection string

### Issue: "NextAuth: Session error"
**Solution**:
- Verify `NEXTAUTH_SECRET` is set
- Verify `NEXTAUTH_URL` matches your actual domain
- Clear browser cookies and try again

### Issue: "Build failed - Prisma error"
**Solution**:
- Ensure `postinstall` script is in `package.json`
- Check Vercel build logs for specific Prisma errors
- Verify `@prisma/client` is in `devDependencies`

### Issue: "Custom domain not working"
**Solution**:
- Wait longer (DNS can take time)
- Verify DNS records are correct
- Use [DNS Checker](https://dnschecker.org) to verify propagation
- Try incognito mode or clear cache

---

## Updating Your Site

### For Code Changes:
```bash
git add .
git commit -m "Your change description"
git push
```
Vercel auto-deploys on push to main branch.

### For Database Schema Changes:
```bash
# 1. Create migration locally
npx prisma migrate dev --name your_migration_name

# 2. Test locally
npm run dev

# 3. Push to GitHub
git add .
git commit -m "Database schema update"
git push

# 4. Vercel will auto-deploy with new schema
```

---

## Monitoring & Maintenance

### Vercel Dashboard
- **Analytics**: View traffic, performance metrics
- **Logs**: Debug runtime errors
- **Deployments**: Rollback if needed

### Neon Dashboard
- **Queries**: Monitor query performance
- **Storage**: Track database size (free tier: 512 MB)
- **Branches**: Create dev/staging branches for testing

---

## Cost Breakdown (Free Tiers)

| Service | Free Tier Limits |
|---------|------------------|
| **Vercel** | 100 GB bandwidth/month, Unlimited sites |
| **Neon** | 512 MB storage, Unlimited projects, 191 hours compute/month |
| **Custom Domain** | Purchase required (~$10-15/year) |

**Total Monthly Cost**: $0 (excluding domain registration)

---

## Support & Resources

- **Vercel Docs**: https://vercel.com/docs
- **Neon Docs**: https://neon.tech/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Prisma Docs**: https://www.prisma.io/docs

---

## Next Steps After Deployment

1. **Content Creation**: Start writing blog posts in admin dashboard
2. **SEO**: Add meta descriptions, OG images, sitemap
3. **Analytics**: Integrate Google Analytics or Plausible
4. **Monitoring**: Set up Sentry or similar for error tracking
5. **Backups**: Configure PlanetScale backup retention

---

**Congratulations! Your blog is now live! 🎉**
