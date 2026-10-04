# Mesh-AI demo

A clickable prototype of **Mesh-AI**, the search and answer service for [The Global Health Network](https://tghn.org/) (TGHN). It runs on sample data, so anyone can try the approved design without a backend.

## What it shows

- **Home:** one search box with multi-select filters and an answer format choice, your three most recent sessions, and example questions.
- **Results:** one bar pinned at the top (the follow-up box, Filters with a count, New search, All sessions). Below it, a session timeline in the left margin, the answer format switch, a written answer that streams in after the resources appear, the applied filters, and the numbered sources the answer cites.
- **All sessions:** every session saved in this browser, grouped by date, with search, sorting, each session's queries, and Clear all sessions.
- **Filters dialog:** eight filters, each multi-select. A result matches any choice within a filter, and every filter in use.

### Session rules

| Action | Effect |
| --- | --- |
| Search from the home page | Starts a new session (query 1) |
| Ask a follow-up in the top bar | Adds a query to the end of the session, read against the query on screen; filters and format carry over unless the follow-up asks for a format |
| Change filters on the results page | Adds a query that re-runs the question on screen with the new filters |
| Switch answer format | Re-formats the query on screen; no new query |
| Select a query in the timeline | Shows it as it was |
| New search (+) or Edit | Opens the home page; searching there starts a new session |

## Stack

React 19 and TypeScript, built with Vite. Tailwind CSS v4 for styling, with Radix primitives (dialog, tooltip, checkbox) in the shadcn/ui style. React Router (hash routes), Zustand (sessions, saved to `localStorage`), TanStack Query (search), Sonner (toasts), Lucide icons. Source Sans 3 and Source Serif 4 are bundled, so nothing loads from Google Fonts. End-to-end tests use Playwright.

## Getting started

Requires Node.js 22 or later.

```bash
npm install
npm run dev          # http://localhost:5173
```

## Builds

| Command | Output | Use it for |
| --- | --- | --- |
| `npm run build` | `dist/` | Static hosting: S3 with CloudFront, GitHub Pages, any web server |
| `npm run build:single` | `dist-single/index.html` | One self-contained file you can email or double-click |

Routes use the URL hash (`#/s/ses_abc/2`), so both builds work from a file or a static host without rewrite rules.

To host on S3: `aws s3 sync dist/ s3://YOUR_BUCKET --delete`, then serve the bucket through CloudFront.

## Connecting the real service

All data goes through one interface, `MeshApi` in `src/api/client.ts`:

- `understand(text, onScreen, session)` returns the answer format, topic and, for follow-ups, a standalone rewrite.
- `search(topic, filters)` returns numbered resources.
- `streamAnswer(request)` streams markdown with `[n]` citation markers.

By default the app uses the sample implementation in `src/api/mock/`. To use a real backend, set `VITE_API_URL`:

```bash
VITE_API_URL=https://api.example.org npm run dev
```

`src/api/http.ts` calls `POST /understand`, `POST /search` and `POST /answer` (a streamed text response). These endpoints are a proposal matching the design doc; the UI does not change when they replace the mock.

## Project structure

```
src/
  api/            types, the MeshApi interface, the HTTP client, and the sample-data mock
    mock/         sample resources, sample answers (markdown with [n] citations), query rules
  components/
    layout/       home header, pinned top bar, brand, footer
    home/         composer, recent sessions, examples
    results/      session timeline, question header, format switch, answer, filters applied, resources
    sessions/     a session row on All sessions
    filters/      the Filters dialog
    ui/           buttons, icon buttons, tooltip, checkbox, filter chip
  hooks/          session actions (the rules above), search, answer streaming
  lib/            filters, dates, formats, utilities
  pages/          Home, Results, All sessions
  store/          the session store (Zustand, saved in the browser) with sample sessions
  styles/         Tailwind theme tokens and bundled fonts
e2e/              Playwright tests
```

## Tests

```bash
npx playwright install chromium   # first time only
npm run build
npm run test:e2e
```

The tests cover home, starting a session, follow-ups, the timeline, filter changes, format switching, All sessions and persistence, on desktop and phone sizes.

## Sample data

The prototype has sample answers for three topics: a malaria vaccine trial in coastal Kenya, engagement with clinical trials, and involving schools. Questions on other topics show the malaria example with a note saying so. Word and PDF downloads and "Show more resources" are not active.

On first visit you see four sample sessions. Sessions you start are saved in your browser only.
