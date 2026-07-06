# College Path — Web

A web version of College Path: profile → matching → results → favorites,
built with Next.js. Same matching logic as the iOS app (`lib/matchEngine.js`
is a direct port of `CollegeMatchEngine.swift` — same acceptance-rate tiers,
same GPA/test percentile bands, same rule that sub-12%-acceptance schools
are never "Match" or "Safety," only "Reach" at best).

## What's real vs. what's a placeholder

- **Matching logic**: real, ported line-for-line in spirit from your Swift engine.
- **67 colleges**: real data, extracted directly from your `CollegeDatabase.swift`.
- **6,000+ colleges**: real, but requires you to add a free College Scorecard
  API key (see below) — without one, it falls back to the 67 local colleges,
  same fallback behavior as the iOS app.
- **Profile/Favorites storage**: uses browser `localStorage`, not encrypted.
  This is NOT the same privacy tier as the iOS app's Keychain-based
  SecureStorage. Fine for a single-device personal tool; if this ever needs
  to hold real student data across devices/accounts, it needs a real backend
  with auth and encryption at rest — don't treat this as FERPA-equivalent yet.

## Local development

```bash
npm install
npm run dev
```

Visit http://localhost:3000

## Getting the full 6,000+ college database (free, ~2 minutes)

1. Go to https://api.data.gov/signup — it's free, instant, no credit card.
2. Copy the API key they email you.
3. Locally: create a file named `.env.local` in the project root with:
   ```
   COLLEGE_SCORECARD_API_KEY=your_key_here
   ```
4. On Vercel: Project → Settings → Environment Variables → add
   `COLLEGE_SCORECARD_API_KEY` with the same value, then redeploy.

Without this key, the site still works — it just uses the 67 local colleges
instead of the full public dataset.

## Deploying to Vercel (free)

1. Push this folder to a GitHub repository.
2. Go to vercel.com, "Add New Project," import that GitHub repo.
3. Vercel auto-detects Next.js — no config needed. Click Deploy.
4. (Optional but recommended) Add the `COLLEGE_SCORECARD_API_KEY` environment
   variable in Vercel's project settings before or after the first deploy.

That's it — you'll get a live URL like `college-path-web.vercel.app`.

## What's intentionally NOT in this version yet

To keep this a real, working first version instead of an unfinished big one,
this does not yet include: AI Advisor, Essay Tracker, Deadline Tracker,
Counselor Mode, Net Price Calculator, or the other iOS-only features. The
core loop (profile → matching → results → favorites → search) is complete
and tested. Everything else can be added incrementally on top of this same
structure — `lib/matchEngine.js` and `lib/store.js` are built to be reused
by future pages the same way.
