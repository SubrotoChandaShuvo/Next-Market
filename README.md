# Next Market — Verified Modern E-Commerce Marketplace

Next Market is a production-grade digital marketplace web application built with **Next.js 15 (App Router)**, **TypeScript**, **React 19**, **Vanilla CSS Design Tokens**, and **Firebase Authentication**.

---

## 🌟 Key Application Architecture & Highlights

1. **Hydration-Mismatch Free State Management**:
   - Central `ProductContext` with localStorage persistence that initializes synchronously with safe seed data and synchronizes on client mount.
   - Dual-mode `AuthContext` supporting real Firebase Authentication (Email/Password + Google Popup) with persistent local session caching to ensure zero auth flicker on page refreshes.

2. **Eight Core Routes**:
   - `/` — Landing Page with **exactly seven** structured sections.
   - `/products` — Marketplace catalog with real-time text search, category pills, price range bounds, multi-attribute sorting, and full reset.
   - `/products/[id]` — Dynamic product showcase handling both valid IDs and graceful, accessible "Product Not Found" fallback views for invalid IDs.
   - `/add-product` — Protected merchant form with field-level validation and image URL presets.
   - `/manage-products` — Protected inventory dashboard with live inventory metrics, view navigation, and an accessible delete confirmation modal.
   - `/login` — Secure email/password and Google login with quick 1-click QA demo presets.
   - `/register` — Account registration with password verification and Google authentication.
   - `/profile` — Authenticated user profile and seller metrics dashboard.

3. **Landing Page Structure (Exactly 7 Semantic Sections)**:
   - Section 1: `landing-hero` — Hero banner with live marketplace stats and quick explore CTAs.
   - Section 2: `landing-categories` — Interactive department catalog showcase.
   - Section 3: `landing-featured` — Spotlight selections with direct product links.
   - Section 4: `landing-why-us` — Escrow protection, identity verification, and 30-day return pillars.
   - Section 5: `landing-flash-deals` — Promotional seasonal discounts and merchant coupon claim.
   - Section 6: `landing-testimonials` — Customer reviews and community seller feedback.
   - Section 7: `landing-newsletter` — Email dispatch subscription with instant confirmation feedback.

4. **Zero Broken Links & Strict Accessibility**:
   - No dead buttons or placeholder `href="#"` links anywhere in the application.
   - Full keyboard navigation, `focus-visible` rings, form `<label htmlFor="...">` associations, and modal `aria-*` attributes.
   - Mobile-tested with zero horizontal overflow at 375px/414px viewports.

---

## 🚀 Local Development Setup

### 1. Prerequisites
- Node.js >= 18.18.0 (Node.js 20 or 24 recommended)
- npm >= 9.0

### 2. Installation
```bash
git clone https://github.com/SubrotoChandaShuvo/Next-Market.git
cd "Next Market"
npm install
```

### 3. Environment Variables Setup
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Configure your Firebase client keys in `.env.local`:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

> **Note on Offline Development / Demo Testing**:
> If Firebase credentials are not yet configured or if external Firebase networks are blocked in your testing environment, Next Market automatically operates in **graceful fallback mode** with built-in persistent demo seller/buyer accounts (`subroto@nextmarket.com` / `jordan@nextmarket.com`).

### 4. Running the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔒 Firebase Configuration Guide

1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click **Create a project** and name it `next-market` (or your choice).
3. In the Project Overview, click the **Web icon (`</>`)** to register a web app.
4. Copy the `firebaseConfig` properties into your `.env.local` file.
5. In the left sidebar, navigate to **Build > Authentication**:
   - Click **Get Started**.
   - Under the **Sign-in method** tab, enable:
     - **Email/Password** (Enable 'Email/Password', leave 'Email link' disabled).
     - **Google** (Enable, set project public-facing name, and configure support email).
   - Under **Authorized domains**, ensure `localhost` and your deployment domain (e.g. `your-app.vercel.app`) are listed.

---

## 📦 Deployment Instructions

### Deploying to Vercel (Recommended)
1. Push your repository to GitHub:
   ```bash
   git add .
   git commit -m "Production release: Next Market full suite"
   git push origin main
   ```
2. Log into [Vercel](https://vercel.com/) and click **Add New > Project**.
3. Import the `Next-Market` repository.
4. Under **Environment Variables**, add each variable from `.env.local`:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
5. Click **Deploy**. Vercel will run `npm run build` and provision your production URL.

### Deploying to Firebase App Hosting / Hosting
1. Install Firebase CLI:
   ```bash
   npx -y firebase-tools@latest login
   npx -y firebase-tools@latest init
   ```
2. Choose **Hosting** (or **App Hosting** for Next.js SSR).
3. Run:
   ```bash
   npm run build
   npx -y firebase-tools@latest deploy
   ```

---

## 🧪 Verification & Quality Assurance Commands

Run the full testing and validation suite:

```bash
# 1. Type checking
npx tsc --noEmit

# 2. Linting
npm run lint

# 3. Production Build
npm run build

# 4. Start Production Server
npm start
```
