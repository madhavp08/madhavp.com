# Decisions

## 2026-08-18 — Use adammaj.com as the bible

The site copies the structure, look, and patterns from [adam-maj/adammaj.com](https://github.com/adam-maj/adammaj.com) and [adammaj.com](https://adammaj.com/). We keep the sidebar layout, Lora type, MDX home page, 3D bookshelf, and the same main routes: home, reading, writing, drawings, and deep dives. We do not copy Adam Majmudar's bio, books, essays, drawings, social links, tweets, or analytics.

## 2026-08-18 — Pages Router and Chakra, on a newer Next

The bible is Next.js Pages Router with Chakra UI. We keep that instead of moving to the App Router, because the constitution says to copy a working pattern from the bible. We bumped Next from 13.1.1 to 15.5.18 so the app can run on Node 22 and stay on a patched, still-supported line. Pages Router still works there. Fonts come from `next/font` instead of the removed `@next/font` package. React stays on 18 because Chakra UI v2 does not support React 19. Package versions around Chakra, MDX, and next-mdx-remote were moved just enough to work with that Next version.

Chakra's `useDimensions` hook is gone in the version we installed. An early bookshelf used a ResizeObserver to replace it. That custom measuring and scroll loop was later removed in favor of native overflow scrolling.

TypeScript `target` is ES2022 instead of the bible's ES5 so Next 15 typechecking can use modern JS.

The bible's `next.d.ts` imported removed Next internals. Layout typing now uses a small `NextPageWithLayout` declaration and a local `AppPropsWithLayout` in `_app.tsx`.

## 2026-08-18 — Identity lives in one file

Name, description, nav, and social links live in `lib/site.ts`. Layout and SEO read from there so later bio and link changes do not require hunting through pages. The home page copy still lives in `pages/index.mdx`, matching the bible.

Until a real bio exists, the home page uses the name Madhav P. and empty "I'll put this here" lines. That follows the constitution: do not invent personal facts.

Social links are an empty list, so the "FIND ME ON" block is hidden until real URLs are added.

## 2026-08-18 — No analytics, engineering, or Adam assets

PostHog and Google Analytics from the bible are left out. The constitution defaults to no analytics suite.

The engineering section, tweet embeds, GitHub cards, personal media list, sitemap script, and Adam's drawing images are left out. They are his content, and engineering is not in the main nav.

## 2026-08-18 — Stand-in books and writing, empty drawings and deep dives

Reading needs books or the bookshelf looks broken. Three clearly labeled sample books with local SVG covers exist only so the shelf and notes pages work. They are not a real reading list and should be replaced.

Writing has one stub post so the route works. Drawings and deep dives are empty arrays. Those pages stay in the nav because they are part of the site we plan to fill in, not pages we do not intend to ship.

## 2026-08-18 — Art replaces reading, writing, drawings, and deep dives

The bible's extra sections are not part of this site. Nav is Home and Art. Art reuses the 3D shelf, with one row each for books, movies, and music. Clicking an item opens it on the shelf and shows a cover plus a personal note below. That is a deviation from the bible's single reading shelf and from keeping writing, drawings, and deep dives.

Content lives in `content/art/{books,movies,music}` as MDX, same idea as the bible's book files. Sample items are stand-ins only, not a real list of taste. Piece types live in `lib/art.ts` so the Art page can render without pulling Node `fs` into the browser; file loading lives in `lib/art-content.ts`.

## 2026-08-18 — Speed and reliability, then a smaller codebase

The constitution now says never to compromise or forget about speed and reliability. The Art shelves dropped the custom scroll loop, paper SVG filter, and generate-content step. Native overflow scrolling is simpler and less likely to break. MDX files are read at build time, so `index.json` and `scripts/generate-content.mjs` are gone. Unused `react-icons` is gone too.

## 2026-08-18 — Art fits on a 14-inch MacBook Pro with no scrolling

The Art page must not scroll on a 14-inch MacBook Pro. Shelf size is viewport-relative so three rows stay on one screen, and it shrinks further when a piece is open so the cover and note still fit. The bible's `10em` bottom padding is gone because it forced a scrollbar. Notes on Art should stay short enough for that single screen.

## 2026-08-18 — The section is Favorites, not Art

The nav label and route are Favorites at `/favorites`. `/art` redirects there so old links still work. Content files stay under `content/art` because that is just the folder on disk.

## 2026-08-18 — Home copy comes from the resume

The homepage and social links use facts from Madhav's resume: name, UMD CS and math [expected May 2028], internships at Sardine and Easy Dynamics, recent projects, interests, GitHub, and LinkedIn. Phone number and email stay off the public site. Favorites shelves are still stand-ins because the resume does not name specific books, movies, or albums.

No scrolling should be required is now an explicit constitution rule. After every change, commit and push to GitHub.

## 2026-08-18 — Favorites match the bible shelf, and scrolling is allowed

The no-scroll rule made the shelves too small. Constitution now prefers the bible's size and spacing; the page may scroll. Shelves use the original 220px 3D spines, paper texture, and side arrows. Each row has twelve stand-in items so it reads as a full shelf until real books, movies, and albums replace them.

## 2026-08-18 — Opening a favorite is client-side

Clicking a spine was laggy because each click loaded a new page and every closed book still ran paper filters and cover images. Notes now load with the Favorites page. Clicks only update the URL in the browser. Filters and covers render for the open item.

## 2026-08-18 — Home is a normal Next.js page

The homepage is `pages/index.tsx` at `/`, and sidebar Home uses a Next.js link so it always routes to that page.

## 2026-08-18 — Contact me on, including Gmail

The sidebar contact block is labeled Contact me on. Gmail, GitHub, and LinkedIn are listed. Email is on the public site because Madhav asked for Gmail there.

## 2026-08-18 — Favorites live in one JSON file

Books, movies, and albums are listed in `content/favorites.json`. Covers can be an Open Library ISBN (`isbn:978...`), a local file, or a URL. How to add and remove items is in `content/HOW_TO.md`.

## 2026-08-18 — Tighter Favorites spacing

Favorites still uses the bible shelf size, with less page padding and row gap so the three shelves need less leftover scroll.

## 2026-08-18 — Domain and Vercel wait until the site runs locally

madhavp.com is on GoDaddy and should deploy on Vercel from main. That wiring comes after `yarn dev` and `yarn build` work, so a broken first deploy does not become the production baseline.
