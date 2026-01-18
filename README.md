# SiteBazaar — Website Marketplace (Frontend Only)

SiteBazaar is a colorful, modern marketplace UI for buying & selling websites.
It includes simulated auctions/bidding, search/filter/sort, favorites, recently viewed, and a dashboard — all persisted with localStorage.

## Tech Stack
- Next.js (App Router)
- React + TypeScript
- Tailwind CSS
- shadcn/ui (Radix + Tailwind)
- Sonner for toasts

## Features
- Multi-page routing (Home, Marketplace, Listing Detail, Auction, Sell, Dashboard)
- Marketplace browse pipeline: search, filters, sorting, skeleton loaders, empty states
- Listing detail with mock gallery, seller card, score badges
- Auction bidding flow (frontend-simulated): countdown UI, min increment validation, bid history
- localStorage persistence: favorites, bids, recently viewed, last used filters
- Accessibility-first UI: semantic headings, focus-visible states, keyboard-friendly controls
- SEO basics: metadata per page + OpenGraph defaults

## Getting Started
```bash
npm install
npm run dev
```

## Hiring Manager Checklist ✅
- App Router with multiple routes and shared layout
- Reusable component system (buttons/cards/badges/dialog/toast/skeleton)
- Search + filter + sort pipeline (real UI complexity)
- Form validation + conditional fields (auction toggle)
- Local persistence (favorites, bids, drafts, recents)
- A11y: focus states, semantic headings, skip link
- UX polish: skeletons, empty states, success/error states
- Clean code structure (lib/ separation, UI components)
- Production-ready deploy (Vercel)
