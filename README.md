# 🧠 TeamPulse – Sentiment Tracking App

TeamPulse is a team sentiment monitoring app built with **Next.js 15+ App Router**, **Tailwind CSS**, **NextAuth.js**, and **shadcn/ui** components.

It allows teams to track how they feel, visualize sentiment trends, and make informed management decisions.

---

## 🚀 Features

- 🔐 Authentication via **Email + Password** and **Google OAuth**
- 📊 Dashboard for viewing team sentiment
- 📈 Sentiment Trends graph
- 👥 Admin-only settings page
- ⚡️ Tailwind CSS + shadcn/ui styled components
- 📦 Prisma ORM with a PostgreSQL database

---

## 📁 Folder Structure

````bash
app/
├── api/ # API routes
├── auth/ # Goggle Authentication
├── components/ # Shared React components (UI, badges, skeleton, etc.)
├── dashboard/ # Authenticated dashboard route
├── login/ # Login form (credentials + Google)
├── sentiment-trends/ # Trends page
├── admin/ # Admin-only pages
├── teams/[id] # TeamsDetailPage
lib/ # Utilities (e.g., cn, auth config)
prisma/ # Prisma schema
```

---

## ⚙️ Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/tboy4all/TeamPulse.git
cd teampulse
````

### 2. Install Dependencies

npm install

# or

yarn install

### 3. Set Up Environment Variables

Create a .env or edit the .env.example file in the root which look like the following:

DATABASE_URL=""
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=""
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

You can get your Google credentials from https://console.cloud.google.com.

### 4. Setup Prisma (Database)

npx prisma generate
npx prisma migrate dev --name init

Seed the database if needed.

### 5. Run the Dev Server

npm run dev

# or

yarn dev
Visit: http://localhost:3000

## 🧪 Testing Authentication

- Sign in using email/password or click "Sign in with Google"

- If Google login gives OAuthCallback error, double-check your GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and Authorized URLs in Google Console.

- Use /dashboard and /admin/settings to test authenticated/role-based pages.

## 🧩 Technologies Used

- Next.js 15+

- Tailwind CSS V4

- NextAuth.js

- shadcn/ui

- Prisma

- Radix UI

- React Icons
