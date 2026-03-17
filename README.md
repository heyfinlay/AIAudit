# Company Audit Platform (MVP)

A premium consultant-focused web app for auditing businesses and identifying inefficiencies, AI opportunities, automation opportunities, lead handling weaknesses, and growth gaps.

## Stack
- React + TypeScript-style architecture (Vite)
- TailwindCSS
- Supabase-ready SQL schema/migrations in `supabase/`

## Features delivered
- Auth entry screen (demo sign-in)
- App shell with sidebar and workflow sections
- Audits dashboard with filters and search
- Create-audit flow with prospecting mode (`Pre-Audit`) and full audits
- Website/business analysis checklist scaffolding by industry
- Deterministic scoring framework across 12 categories
- Recommendation engine structure with priority and impact metadata
- Value estimation engine with transparent assumptions
- Client report view with white-label branding placeholders
- Internal consultant notes area
- Multi-company comparison view
- Settings/admin foundation for branding/config placeholders
- Seeded demo audits: mortgage broker + accounting firm

## Local run
```bash
npm run dev
```

## Checks
```bash
npm run lint
npm run typecheck
npm run build
```

## Notes
- Current auth is demo-only UI; replace with Supabase Auth in next phase.
- Website live crawl is staged; current version supports manual/structured review (v1), with architecture ready for v2 crawl hooks.
