# 💡 IdeaVault — Frontend Client

IdeaVault is a modern, high-performance web platform designed for tech innovators, developers, and visionaries to post, discover, bookmark, update, and collaborate on startup concepts and technology ideas. Built with **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4**, and authenticated via **Better Auth**, IdeaVault delivers a seamless user interface with dynamic animations and glassmorphism styling.

---

## 🌐 Live URL

- **Frontend Deployment**: [[[https://ideavault-client.vercel.app](https://idea-vault-hasib.vercel.app/)](https://idea-vault-hasib.vercel.app/)](https://ideavault-client.vercel.app) *(or your deployed Vercel domain)*


---

## ✨ Key Features

1. **🔐 Authentication & Session Persistence (Better Auth + Google OAuth)**
   - Full support for Email/Password registration/login and one-click Google Social Login.
   - Built-in session hydration and client-side guards that prevent flashing auth states and maintain seamless navigation across private routes.

2. **💡 Idea Creation, Management & Interactive Editing**
   - Rich forms to submit tech projects with full metadata (tech stack, market demand, vision, funding needs, categories).
   - Dedicated "My Ideas" dashboard allowing users to manage, update/edit, or soft-delete their published concepts in real-time.

3. **🔍 Dynamic Filtering, Categorization & Search**
   - Instant full-text search across titles, taglines, and project goals.
   - Filter concepts by custom categories (AI/ML, Web3, SaaS, Mobile Apps) and timeframe parameters (Past Week, Past Month, Past Year).

4. **🔖 Unified User Interactions (Bookmarks & Community Discussions)**
   - Toggleable bookmarking system to save inspiring ideas directly to a personal dashboard.
   - Live multi-user discussion forums on detailed idea pages with complete support for adding, editing, and deleting comments.

5. **🔥 Bento Grid Trending Showcase & Responsive UI**
   - Visually stunning Bento Grid UI showcasing top-voted and featured startup ideas.
   - Fully responsive design built with Tailwind CSS v4, Lucide React icons, and Swiper.js, supporting both mobile drawer navigation and high-density desktop views.

---

## 🛠️ Tech Stack & Dependencies

- **Framework**: Next.js 16 (App Router) & React 19
- **Styling & UI**: Tailwind CSS v4, `@base-ui/react`, `lucide-react`, `swiper`, `tw-animate-css`
- **Auth & Database**: Better Auth (`better-auth`, `@better-auth/mongo-adapter`), MongoDB
- **Notifications & Utilities**: `react-hot-toast`, `clsx`, `tailwind-merge`

---

## 🚀 Getting Started

### Prerequisites

- Node.js `v18.x` or higher
- npm / yarn / pnpm

### Environment Setup

Create a `.env` file in the `ideavault` root directory:

```env
BETTER_AUTH_SECRET=your_better_auth_secret_here
MONGO_URI=your_mongodb_connection_string
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:5000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### Installation & Local Run

```bash
# Install dependencies
npm install

# Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application in your browser.
