# 📚 Smart Bookmark Manager

A modern, production-ready bookmark management application built with Next.js 14+, TypeScript, Tailwind CSS, and Supabase. Features Google OAuth authentication, real-time synchronization across tabs, and a beautiful glassmorphism UI.

![Next.js](https://img.shields.io/badge/Next.js-14+-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=flat-square&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Enabled-green?style=flat-square&logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=flat-square&logo=tailwind-css)

---

## ✨ Features

- 🔐 **Google OAuth Authentication** - Secure, passwordless login
- ⚡ **Real-time Sync** - Changes appear instantly across all open tabs
- 🎨 **Modern UI** - Glassmorphism design with smooth animations
- 🔒 **Private Bookmarks** - Each user's data is completely isolated
- 🗑️ **Soft Delete** - Bookmarks can be recovered (data preserved)
- 📱 **Fully Responsive** - Works on desktop, tablet, and mobile
- 🌙 **Dark Mode Ready** - Beautiful in both light and dark themes
- 🚀 **Production Ready** - Deployed on Vercel with full error handling

---

## 🏗️ Architecture

### Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | Next.js 14+ (App Router) | React framework with server components |
| **Language** | TypeScript | Type safety and better DX |
| **Styling** | Tailwind CSS v4 | Utility-first CSS framework |
| **Authentication** | Supabase Auth | Google OAuth integration |
| **Database** | Supabase (PostgreSQL) | Real-time database with user isolation |
| **Real-time** | Supabase Realtime | WebSocket-based live updates |
| **Deployment** | Vercel | Serverless deployment platform |

### Project Structure

```
bookmark-manager/
├── app/                          # Next.js App Router
│   ├── auth/callback/           # OAuth callback handler
│   ├── dashboard/               # Protected dashboard (main app)
│   ├── login/                   # Login page
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Landing page
│   └── globals.css              # Global styles
├── components/                   # React components
│   ├── AddBookmarkModal.tsx     # Modal for adding bookmarks
│   ├── AuthButton.tsx           # Google OAuth button
│   ├── BookmarkCard.tsx         # Individual bookmark display
│   ├── BookmarkList.tsx         # Grid of bookmarks
│   ├── EmptyState.tsx           # Empty state UI
│   ├── Loader.tsx               # Loading spinner
│   └── Navbar.tsx               # Navigation with auth status
├── lib/                          # Utilities and configurations
│   ├── supabaseClient.ts        # Browser Supabase client
│   ├── supabaseServer.ts        # Server Supabase client
│   ├── supabaseMiddleware.ts    # Session refresh utilities
│   ├── types.ts                 # TypeScript type definitions
│   └── utils.ts                 # Helper functions
├── middleware.ts                 # Route protection
└── .env.local                    # Environment variables
```

### Data Flow

```
User Action → Supabase Client → PostgreSQL Database
                                      ↓
                              Realtime Broadcast
                                      ↓
                          All Connected Clients Update
```

### Security Model

- **Application-Level Security**: All queries filtered by `user_id`
- **No RLS**: Using app-level filtering instead of Row Level Security
- **Session Management**: HTTP-only cookies via Supabase Auth
- **Route Protection**: Middleware guards protected routes
- **Soft Deletes**: Data preserved with `is_deleted` flag

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase account ([supabase.com](https://supabase.com))
- A Google Cloud account (for OAuth credentials)

### Step 1: Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd bookmark-manager

# Install dependencies
npm install
```

### Step 2: Set Up Supabase

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Click "New Project"
   - Choose a name and database password

2. **Get Your Credentials**
   - Go to Settings → API
   - Copy the **Project URL**
   - Copy the **anon/public key**

3. **Create the Database Table**

   Run this SQL in Supabase SQL Editor:

   ```sql
   CREATE TABLE public.sbookmarktbl (
       bookmark_id BIGSERIAL PRIMARY KEY,
       user_id TEXT NOT NULL,
       url TEXT NOT NULL,
       title TEXT DEFAULT 'NA',
       description TEXT DEFAULT 'NA',
       favicon_url TEXT DEFAULT 'NA',
       is_favorite BOOLEAN DEFAULT FALSE,
       is_archived BOOLEAN DEFAULT FALSE,
       is_deleted BOOLEAN DEFAULT FALSE,
       click_count BIGINT DEFAULT 0,
       folder_name TEXT DEFAULT 'General',
       tags TEXT DEFAULT 'NA',
       visibility TEXT DEFAULT 'private',
       created_at DOUBLE PRECISION DEFAULT EXTRACT(EPOCH FROM CURRENT_TIMESTAMP),
       updated_at DOUBLE PRECISION DEFAULT EXTRACT(EPOCH FROM CURRENT_TIMESTAMP),
       
       CONSTRAINT chk_url_not_empty CHECK (length(trim(url)) > 0),
       CONSTRAINT chk_visibility CHECK (visibility IN ('private','public','shared'))
   );

   -- Create indexes for performance
   CREATE INDEX idx_bookmark_user ON public.sbookmarktbl(user_id);
   CREATE INDEX idx_bookmark_created ON public.sbookmarktbl(created_at);
   CREATE INDEX idx_bookmark_deleted ON public.sbookmarktbl(user_id, is_deleted);
   CREATE UNIQUE INDEX uq_user_url ON public.sbookmarktbl(user_id, url) 
       WHERE is_deleted = FALSE;
   ```

4. **Enable Realtime**

   ```sql
   ALTER PUBLICATION supabase_realtime ADD TABLE public.sbookmarktbl;
   ```

### Step 3: Configure Google OAuth

1. **Google Cloud Console**
   - Go to [console.cloud.google.com](https://console.cloud.google.com)
   - Create a new project or select existing
   - Enable "Google+ API"
   - Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
   - Application type: "Web application"
   - Add authorized redirect URI: `https://YOUR-PROJECT.supabase.co/auth/v1/callback`
   - Copy **Client ID** and **Client Secret**

2. **Supabase Dashboard**
   - Go to Authentication → Providers
   - Enable "Google"
   - Paste your Client ID and Client Secret
   - Save

### Step 4: Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### Step 5: Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Step 6: Test the Application

1. Click "Sign In" → "Continue with Google"
2. Authorize with your Google account
3. You'll be redirected to the dashboard
4. Add a bookmark using the "Add Bookmark" button
5. Open the dashboard in another tab
6. Add another bookmark - it should appear in both tabs instantly!

---

## 🐛 Problems Faced & Solutions

### Problem 1: Database Schema Mismatch

**Issue**: Table was created in `smartbookmark` schema, but Supabase queries default to `public` schema.

**Error**: `relation "smartbookmark.sbookmarktbl" does not exist`

**Solution**: 
```sql
ALTER TABLE smartbookmark.sbookmarktbl SET SCHEMA public;
```

**Lesson**: Always create tables in the `public` schema for Supabase projects unless you have specific schema requirements.

---

### Problem 2: Realtime Not Working Across Tabs

**Issue**: Adding a bookmark in one tab didn't update other open tabs.

**Root Cause**: Table was not added to the `supabase_realtime` publication.

**Solution**:
```sql
ALTER PUBLICATION supabase_realtime ADD TABLE public.sbookmarktbl;
```

**Debugging Steps**:
1. Added subscription status monitoring
2. Logged all realtime events
3. Verified table was in publication
4. Confirmed schema name matched table location

**Lesson**: Supabase Realtime requires explicit table publication. Always verify with:
```sql
SELECT * FROM pg_publication_tables WHERE pubname = 'supabase_realtime';
```

---

### Problem 3: Tailwind CSS v4 Syntax Errors

**Issue**: Build errors with `@tailwind` directives and `@apply` utilities.

**Error**: `Cannot apply unknown utility class`

**Solution**: Updated `globals.css` to use Tailwind v4 syntax:
```css
/* Old (v3) */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* New (v4) */
@import "tailwindcss";
```

Replaced `@apply` directives with standard CSS.

**Lesson**: Tailwind v4 has breaking changes. Always check the version and use appropriate syntax.

---

### Problem 4: Static Pre-rendering of Dynamic Route

**Issue**: Dashboard was being pre-rendered at build time, causing auth errors.

**Error**: "The path /dashboard is marked as static"

**Solution**: Added dynamic export to force runtime rendering:
```typescript
export const dynamic = 'force-dynamic';
```

**Lesson**: Personalized routes (requiring auth, user-specific data) must be dynamically rendered.

---

### Problem 5: Transient Realtime Connection Errors

**Issue**: Console showed `CHANNEL_ERROR` even though realtime was working.

**Root Cause**: Supabase WebSocket temporarily disconnects and reconnects (normal behavior).

**Solution**: Changed error logging to warning:
```typescript
if (status === 'CHANNEL_ERROR') {
    console.warn('⚠️ Realtime connection error (will auto-reconnect)');
}
```

**Lesson**: WebSocket connections can have transient errors. Monitor for `SUBSCRIBED` status, not just errors.

---

## 🔒 Security Features

- ✅ All database queries filtered by `user_id`
- ✅ No cross-user data access possible
- ✅ HTTP-only cookies for session storage
- ✅ Middleware protects all authenticated routes
- ✅ Soft deletes preserve data integrity
- ✅ Environment variables for sensitive credentials
- ✅ No hardcoded secrets in codebase

---

## 📊 Database Schema

```sql
sbookmarktbl
├── bookmark_id (BIGSERIAL PRIMARY KEY)
├── user_id (TEXT) - Links to Supabase Auth
├── url (TEXT) - Bookmark URL
├── title (TEXT) - Page title
├── description (TEXT) - Optional description
├── favicon_url (TEXT) - Auto-fetched favicon
├── is_deleted (BOOLEAN) - Soft delete flag
├── tags (TEXT) - Comma-separated tags
├── created_at (DOUBLE PRECISION) - Unix timestamp
└── updated_at (DOUBLE PRECISION) - Unix timestamp
```

**Indexes**:
- `idx_bookmark_user` on `user_id`
- `idx_bookmark_created` on `created_at`
- `idx_bookmark_deleted` on `(user_id, is_deleted)`
- `uq_user_url` UNIQUE on `(user_id, url)` WHERE `is_deleted = FALSE`

---

## 🚀 Deployment to Vercel

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo>
git push -u origin main
```

### Step 2: Import to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Click "Deploy"

### Step 3: Update Supabase Settings

1. Go to Supabase → Authentication → URL Configuration
2. Add your Vercel domain:
   - Site URL: `https://your-app.vercel.app`
   - Redirect URLs: `https://your-app.vercel.app/auth/callback`

### Step 4: Test Production

1. Visit your Vercel URL
2. Test Google OAuth login
3. Add/delete bookmarks
4. Verify realtime works in production

---


## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Powered by [Supabase](https://supabase.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Inspired by Linear, Vercel, and Raycast designs

---

**Made with ❤️ using Next.js, TypeScript, and Supabase**
