# Pune Realty - Technical Documentation

This document outlines the architecture, database configuration, theme system, and deployment workflow for the Pune Realty Next.js 15 application.

---

## 🚀 Technology Stack & Architecture

- **Framework**: Next.js 16 (App Router)
- **Database ORM**: Prisma 7
- **Database Engine**: PostgreSQL (Neon Serverless)
- **Authentication**: NextAuth.js v5 (Beta)
- **Styling & Theme**: Vanilla CSS with HSL variables + Tailwind CSS, supporting dark/light mode glassmorphic interfaces.

---

## 💾 Database Configuration (Prisma 7)

Prisma 7 introduces a modular database connection engine requiring explicit driver adapters for runtime database access. The project has been configured to connect to PostgreSQL (Neon) using the standard `@prisma/adapter-pg` driver.

### 1. Schema Configuration
- **File**: [prisma/schema.prisma](file:///c:/Users/omhar/Desktop/Real-Estate/prisma/schema.prisma)
- The database provider is configured to `postgresql`:
  ```prisma
  datasource db {
    provider = "postgresql"
  }
  ```

### 2. Client Initialization
- **File**: [src/lib/prisma.ts](file:///c:/Users/omhar/Desktop/Real-Estate/src/lib/prisma.ts)
- Prisma Client is initialized with the `PrismaPg` adapter using `pg`'s connection client.
- Prevents connection pool leaks during development hot-reloads using a global singleton pattern:
  ```typescript
  import { PrismaClient } from '@prisma/client';
  import { PrismaPg } from '@prisma/adapter-pg';

  const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
  };

  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  });

  const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

  export default prisma;
  ```

### 3. Database Seeding
- **File**: [prisma/seed.ts](file:///c:/Users/omhar/Desktop/Real-Estate/prisma/seed.ts)
- Seeds default configurations:
  - Settings (company details, stats, phone numbers)
  - Default Admin user (`admin@punerealty.com` / `admin123`)
  - Gated locations in Pune (Baner, Koregaon Park, Kalyani Nagar, Hinjawadi)
  - Real estate listings (featured apartments, smart flats, office spaces, luxury villas)
- To run migrations/push schema and seed:
  ```bash
  npx prisma db push
  npx prisma db seed
  ```

---

## 🌓 Dark/Light Mode Theme System

The application implements a premium, zero-flash dark/light mode toggle with contrast overrides to ensure absolute legibility.

### 1. Zero-Flash Theme Script
- **File**: [src/app/layout.tsx](file:///c:/Users/omhar/Desktop/Real-Estate/src/app/layout.tsx)
- The theme status is checked directly inside a render-blocking `<script>` tag inside `<head>` to avoid layout/color flashes on mount.
- **Hydration Resolve**: The `<html>` element is configured with `suppressHydrationWarning` to prevent React from throwing mismatch errors due to differences between server-prerendered classes and client-side local storage overrides:
  ```tsx
  export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
      <html lang="en" suppressHydrationWarning className={`${inter.variable} h-full antialiased`}>
        <head>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  try {
                    var theme = localStorage.getItem('theme');
                    if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                      document.documentElement.classList.add('dark');
                    }
                  } catch(e) {}
                })();
              `,
            }}
          />
        </head>
        <body>
          {children}
        </body>
      </html>
    );
  }
  ```

---

## ☁️ Vercel Deployment Workflow

To deploy the application to Vercel, ensure you configure the following settings:

1. **Environment Variables**:
   Add the following in Vercel's Project Settings:
   - `DATABASE_URL`: Your Neon PostgreSQL connection string.
   - `AUTH_SECRET` & `NEXTAUTH_SECRET`: A secure random cryptographic key for authentication session management.

2. **Automated Schema Generation**:
   Ensure Prisma Client compiles during Vercel's deployment phase by verifying your **Build Command** in the Vercel dashboard:
   - Command: `prisma generate && next build` (or verify that a `postinstall` hook runs `prisma generate`).
