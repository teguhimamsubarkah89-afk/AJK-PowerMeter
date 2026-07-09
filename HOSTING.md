# Hosting Checklist — AJK PowerMeter Dashboard

Before deploying, ensure the following:

- Environment
  - Do NOT commit `.env.local`; keep secrets out of repo.
  - Provide production env vars in hosting provider (e.g., `NEXT_PUBLIC_FIREBASE_API_KEY`, etc.).
- Build & CI
  - Run `npm run build` in CI and ensure it passes.
  - Run `npm run lint` and fix issues automatically where possible.
- Assets & Caching
  - Use hashed filenames produced by Next.js for cache-busting.
  - Set appropriate `Cache-Control` headers for static assets and HTML (CDN rules).
- CDN & Preview
  - Use Vercel/Netlify/Firebase Hosting for preview deploys.
  - Enable preview branches for testing before promoting to production.
- Security
  - Use HTTPS and HSTS.
  - Restrict API keys via Firebase Console (where possible).
- Performance
  - Monitor Largest Contentful Paint (LCP) and reduce heavy client-side JS.
  - Keep bundle sizes minimal and use dynamic imports for heavy components.
- Rollout
  - Use preview URLs or feature flags for UX changes.
  - Keep a rollback plan (previous working commit).

Common Providers
- Vercel: `vercel --prod` or connect GitHub repo and enable automatic builds.
 - Vercel (recommended): connect your GitHub repo to Vercel, set environment variables listed in `.env.production.example`, and enable automatic deployments.
   - Add variables under Project Settings → Environment Variables (Production). Do NOT paste `.env.local` contents.
   - For faster deployments, enable the Vercel Git Integration and Preview Deployments.
- Netlify: connect repo and configure build command `npm run build`.
- Firebase Hosting: `firebase deploy --only hosting` after building production output.

Deploy steps (example: Vercel)
1. Push branch to GitHub.
2. Open Vercel, import project, set `NODE_ENV=production` and provide env vars.
3. Verify preview deployment and test responsiveness across devices.
4. Promote to production.

Post-deploy verification
- Check console for hydration warnings.
- Verify interactive elements (login, logout) work.
- Test on mobile and tablet viewports.

» Contact: R&D — Teguh Imam Subarkah
