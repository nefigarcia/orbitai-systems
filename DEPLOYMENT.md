# Orbit DataWorks — Deployment Guide

## Prerequisites

- Node.js 20+
- Remote MySQL database (PlanetScale, Railway, Aiven, or any MySQL host)
- Resend account (resend.com)
- OpenAI API key
- Vercel account

---

## 1. Environment Setup

Copy `.env.example` to `.env.local` and fill in all values:

```bash
cp .env.example .env.local
```

Required variables:
```
DATABASE_URL=mysql://user:pass@host:3306/orbitai_db
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32
NEXTAUTH_URL=https://your-domain.com
RESEND_API_KEY=re_xxxxx
RESEND_FROM_EMAIL=noreply@yourdomain.com
NOTIFICATION_EMAIL=hello@yourdomain.com
OPENAI_API_KEY=sk-xxxxx
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_AURIVA_URL=https://auriva.im
```

---

## 2. Database Setup

Push the schema to your MySQL database:

```bash
npx prisma db push
```

Run the seed to create the admin user:

```bash
npm run db:seed
```

Default credentials (change immediately):
- Email: admin@orbitaisystems.com
- Password: admin123

---

## 3. Local Development

```bash
npm install
npm run dev
```

Open: http://localhost:3000

Admin panel: http://localhost:3000/admin

---

## 4. Vercel Deployment

1. Push to GitHub
2. Import repo in Vercel
3. Add all environment variables in Vercel dashboard
4. Set `DATABASE_URL` to your remote MySQL connection string
5. Deploy

Vercel will automatically:
- Run `prisma generate` via the `postinstall` script
- Build the Next.js app

---

## 5. Generate NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

---

## 6. Admin Password Change

After first deployment, update the admin password:

```sql
UPDATE users 
SET password = SHA2('your-new-password', 256) 
WHERE email = 'admin@orbitaisystems.com';
```

Or modify `prisma/seed.ts` with your desired password before seeding.
