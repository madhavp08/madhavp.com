# Constitution

Ground rules for building madhavp.com

## Goal

- Build a personal website for Madhav at madhavp.com
- Treat the inspiration GitHub repo as the bible for structure, look, and patterns
- Prefer copying a working pattern from the bible over inventing a new one
- Keep the project small enough that shipping and iterating stay easy

## How we work

- Keep code simple
- Do not write comments
- Explain thought processes in paragraph format, not as nested bullet essays
- Write every decision into `decisions.md` and keep that file up to date
- Record the why, not just the what
- If we deviate from the inspiration repo, write that deviation into `decisions.md` before changing the code
- Do not add features, libraries, or abstractions that were not asked for
- Ask before inventing personal facts, bio details, or public identity claims
- Never compromise or forget about speed and reliability

## Code

- Prefer the simplest thing that works
- Never trade speed or reliability for extra features
- Match the inspiration repo's stack and file shape when it is reasonable
- One way to do a thing is better than two
- No unused files, dead code, or placeholder pages that we do not plan to ship
- Keep content in one obvious place so copy is easy to update
- Do not comment out code; delete it
- Names should make comments unnecessary

## Product

- This is a personal site, not a product
- Content and clarity beat cleverness
- Pages should load fast and read well on a phone
- Accessibility basics are required: real headings, readable contrast, keyboard-usable links
- If a page needs more than a short explanation to understand, it is too complicated

## Domain and deploys

- madhavp.com is already purchased on GoDaddy
- Host and deploy on Vercel
- Production should update by pushing to the main branch
- Domain, DNS, and Vercel should stay boring: one production domain, no extra environments unless we need them
- Do not break a working deploy to try something fancy

## Scope

- Get a real site live first, then refine
- Default to no: auth, CMS, database, analytics suite, or extra services
- Add a dependency only when the bible uses it or the work is clearly harder without it
- Secrets stay out of git
- Do not commit unless asked