# Rafi Codes
Welcome to my personal portfolio! This website serves as a showcase for my projects and a way to contact me.

[Click here to check it out live!](https://rafi-codes.dev)

![Rafi Codes](image.png)

## Tech Stack
- **Next.js 16** — React framework (App Router, Turbopack).
- **React 19** — Latest version of React. Comes with performance optimizations.
- **MongoDB** — Data storage for skills & work experience.
- **Three.js / React Three Fiber** — 3D ambient background.
- **Framer Motion** — Page transitions and loading animations.
- **Googleapis & Nodemailer** — Gmail OAuth2 email delivery through the contact form.
- **Serwist** — PWA support.
- **Vercel Analytics & Speed Insights** — Performance monitoring.

## Pages
| Route       | Description                                                       |
| ----------- | ----------------------------------------------------------------- |
| `/`         | Home — Terminal-style welcome with typing effect & live clock.    |
| `/about`    | Résumé — Skills and work experience are fetched from MongoDB.     |
| `/projects` | Project - Showcase of all projects.                               |
| `/contact`  | Contact - Form with Gmail delivery and reCAPTCHA spam protection  |

## Core Project Structure
```
src/
├── app/            # App Router pages & API routes.
│   ├── about/      # Résumé page.
│   ├── contact/    # Contact page.
│   ├── projects/   # Projects page.
│   ├── api/contact # Endpoint for contact form.
│   └── layout.js   # Root layout.
├── components/     # Reusable UI components.
├── hooks/          # Custom React hooks.
├── styles/         # CSS modules (global, component, page).
└── utils/          # Utilities (e.g. DatabaseService).
```

## Features
- 💬 **Contact Form** — Sends emails via Gmail OAuth2, protected with reCAPTCHA Enterprise.
- 📈 **Live Interactive Environment** — Home page displays the current date & time inside an interactive terminal.
- 🎨 **3D Ambient Background** — Developed with React Three Fiber.
- 📱 **PWA** — Install as an app and experience mobile first design.
- 🔍 **SEO** — Sitemap, robots, manifest, and Open Graph metadata.

## Coming Soon
- Stay tuned for more features! This README will be updated with every new feature release.

---
© Rafi Codes. All rights reserved.
