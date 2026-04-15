@AGENTS.md

# Deployment

This project deploys via **Firebase App Hosting** connected to GitHub. To deploy, just push to `main` — Firebase builds and deploys automatically.

## Rules

- **Deploy = `git push origin main`**. Nothing else needed.
- **DO NOT** add `output: "export"` to `next.config.ts` — Firebase App Hosting requires SSR mode.
- **DO NOT** add `basePath` to `next.config.ts` — Firebase serves from root `/`.
- **DO NOT** add `images: { unoptimized: true }` — only needed for static export.
- **DO NOT** create GitHub Actions/Pages workflows, or use Vercel/Netlify/Firebase CLIs.
- **DO NOT** create or modify `.github/workflows/` files for deployment.

## Why

Firebase App Hosting runs `next build` in SSR mode and serves the app from its own domain. Setting `output: "export"` causes the Firebase build to fail silently — the live site stays stuck on the last successful build with no visible error in git.
