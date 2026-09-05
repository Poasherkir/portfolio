# Portfolio — Malik Boudine

The source for my personal site: a full-stack and mobile developer portfolio built
around an interactive 3D keyboard where every keycap is a technology I actually
ship with.

Live: **<https://malikboudine.vercel.app>**

Most of the work behind this site is closed — Briefing Point Go, TechSub and
the aviation services all hold real user data. [BAC Archive](https://github.com/Poasherkir/bac-archive)
and [Delivery OS](https://github.com/Poasherkir/delivery-os) are public, and so
is this repo.

---

## Contents

- [What it is](#what-it-is)
- [Stack](#stack)
- [The 3D keyboard](#the-3d-keyboard)
- [Content model](#content-model)
- [Project layout](#project-layout)
- [Running it locally](#running-it-locally)
- [Environment variables](#environment-variables)
- [Contact form](#contact-form)
- [Deployment](#deployment)
- [Notes on things that are easy to get wrong](#notes-on-things-that-are-easy-to-get-wrong)
- [Licence](#licence)

---

## What it is

A Next.js 15 App Router site. One long home page that argues a case in order —
claim, evidence, the single best proof in depth, the rest of the work, what you
can hire, how it gets delivered, what it is built with, who is building it, how
the code is written, objections, ask — plus standalone routes for projects, case
studies, the full stack, an about page, a CV page and contact.

A visitor can stop at any point and have a complete answer up to there. That is
the whole layout rationale.

**Ground rule for the content:** nothing on the site is invented. No fake
testimonials, no client logos I do not have, no estimated metrics. Every figure
traces back to a project README. Where a keycap has no honest "used in" answer,
the field is simply omitted rather than filled with something plausible.

---

## Stack

| Concern | Choice |
| --- | --- |
| Framework | Next.js 15 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS 3.4, CSS custom properties for theming |
| 3D | Spline runtime (`@splinetool/react-spline`), three.js underneath |
| Animation | `motion` (Framer Motion 12) for the page, GSAP + ScrollTrigger for the board |
| Smooth scroll | Lenis |
| Theming | `next-themes`, dark by default |
| Icons | `lucide-react`, plus vendored [Devicon](https://devicon.dev) SVGs (MIT) |
| Mail | Resend, validated with Zod |
| Analytics | `@vercel/analytics` |

No CSS framework beyond Tailwind, no component library beyond a handful of Radix
primitives, no CDN assets. Everything the page needs is in the bundle or in
`public/`.

---

## The 3D keyboard

The centrepiece. A Spline scene loaded through
[`src/components/animated-background.tsx`](src/components/animated-background.tsx),
with the keycaps carrying technologies I actually ship with.

Hover or tap a cap and it lifts and names itself. The board is choreographed
against the page — it moves, turns and dims section by section, and comes apart
into floating caps over the contact section.

The scene, its controller and the media-query hook came from
[ferhatolmez/portfolio](https://github.com/ferhatolmez/portfolio), used with
Ferhat Ölmez's permission. [`NOTICE.md`](NOTICE.md) records what is his, what I
changed, and the fact that the permission was given to me rather than to anyone
copying from here.

### Scroll choreography

`animated-background-config.ts` holds a pose per section — position, rotation,
scale, for desktop and mobile separately. A ScrollTrigger per section moves the
board to the next pose on enter, and back on the way out.

Two things about that are worth knowing, because both were bugs:

The fallback chain has to match the page's real order. Each timeline carries the
section to return to when you scroll back out of it, and the order here is hero,
projects, stack, contact — not the order of the site it was adapted from. Get it
wrong and scrolling up out of the stack hands the board back to the hero pose,
full size and dead centre, on top of whatever is there.

Lenis and ScrollTrigger have to share a clock. Lenis animates scroll on its own
rAF loop; ScrollTrigger left alone reads native scroll events and its own
ticker. Unconnected they drift, and the board lands early or late against the
page it is following. `useLenis(ScrollTrigger.update)` is what ties them.

### Sound

Modal synthesis in
[`keyboard-audio.ts`](src/components/keyboard/keyboard-audio.ts) — no audio
files. A press is a bank of six resonant filters (168–5600 Hz) excited by a
noise burst; a release is three. Output goes through a `tanh` waveshaper for
soft clipping.

The context is created on the first real gesture, not at load, because a browser
will not let it start any earlier. Nothing plays until you click something.

Two things learned the hard way: high-Q bandpass filters throw away most of the
input energy, so mode gains are *not* output amplitudes and a makeup gain is
required — measured with an `OfflineAudioContext`, not guessed. And a
`DynamicsCompressor` made it **quieter**, not louder, because it ducks exactly
the transient that makes a keypress sound like a keypress.

### The earlier board

`src/components/keyboard/` still holds a hand-built three.js version — extruded
keycap geometry, canvas-generated logo textures, a locally generated
`RoomEnvironment`, its own pose table. It is not rendered. Nothing imports
`keyboard-scene.tsx` any more, so it costs nothing at runtime, but it is history
rather than documentation. `keyboard-audio.ts` and `board-placeholder.tsx` are
the two files in there that are still live.

---

## Content model

Everything the site says lives in one file:
[`src/data/portfolio.ts`](src/data/portfolio.ts). Profile, navigation, socials,
hero copy, proof pillars, skills, keycaps, services, delivery process, projects,
case studies, about, stats, FAQ, engineering practices and contact copy.

Components read from it; none of them hard-code copy. Changing what the site
claims is a data edit, not a component edit.

The file also exports `CONTENT_CHECKLIST` — the things still pending (LinkedIn
and Upwork URLs, a custom domain, a verified Resend sending domain), each with
the exact export to edit.

Several fields are deliberately nullable and render **nothing** when unset:
`profile.email` hides the mailto line, `profile.calendly` hides the booking
button, `profile.cv` hides the CV download buttons, `hero.availability` hides
the availability badge, and `Service.priceBand` omits the price line entirely
rather than showing a guess.

---

## Project layout

```
src/
  app/                      routes (App Router)
    api/contact/route.ts    contact form handler
    projects/[slug]/        generated case-study pages
    opengraph-image.tsx     OG image, generated at build time
    privacy/ terms/          legal pages
    thank-you/              where the contact form lands on success
    icon.tsx apple-icon.tsx  favicons, generated at build time
  components/
    animated-background*    the Spline board and its scroll choreography
    keyboard/               keypress audio, plus the retired three.js board
    sections/               one file per home-page section
    projects/               cards, grid, generated cover visuals
    layout/                 header, footer, nav overlay, toggles
    background/             starfield and nebula backdrop
    ui/                     small primitives (button, card, badge, …)
  data/portfolio.ts         all site content
  types/                    shared types
public/assets/devicon/      vendored Devicon SVGs (MIT)
```

---

## Running it locally

Requires Node 18.18+ (Node 20 recommended).

```bash
npm install
```

```bash
npm run dev
```

Then open http://localhost:3000.

Other scripts:

```bash
npm run typecheck
```

```bash
npm run lint
```

```bash
npm run build
```

> **Do not run `npm run build` while `npm run dev` is running.** They share the
> `.next` directory, and the build overwrites the chunks the dev server is
> serving. The symptoms are confusing — 404s on chunk files,
> `__webpack_modules__[moduleId] is not a function`, and 500s that persist until
> the dev server is restarted. Stop dev first.

---

## Environment variables

Copy `.env.example` to `.env.local` and fill in what you need. Every variable is
optional — the site builds and runs without any of them, degrading honestly
rather than crashing.

| Variable | Purpose | Without it |
| --- | --- | --- |
| `RESEND_API_KEY` | Sends contact-form messages | Form returns a clear "not connected yet" message instead of failing silently |
| `CONTACT_TO_EMAIL` | Delivery address | Falls back to the email in `portfolio.ts` |
| `NEXT_PUBLIC_SITE_URL` | Canonical URLs, sitemap, OG images | Falls back to a default origin |

---

## Contact form

`POST /api/contact`, handled in
[`src/app/api/contact/route.ts`](src/app/api/contact/route.ts). Three layers of
spam handling, none of which is a CAPTCHA:

1. **Honeypot** — a `company_website` field that must stay empty. Filled means
   bot, request rejected.
2. **Timing** — submissions faster than 2.5 s are accepted with a `200` and then
   dropped. Returning an error just tells a bot to try again differently.
3. **Rate limit** — 3 messages per IP per 10 minutes, in memory. Serverless
   instances are ephemeral, so this is a speed bump, not a guarantee; the first
   two layers do the real work.

The payload is validated with Zod before anything else happens, and all user
input is HTML-escaped before it reaches the email template.

**Without `RESEND_API_KEY` the form returns 503 and delivers nothing.** It fails
loudly rather than silently: the response carries the address to write to
instead, and the form shows it in a panel that stays put rather than a toast
that takes it away after four seconds.

---

## Deployment

Deployed on [Vercel](https://vercel.com). Pushing to `main` triggers a
production deploy; every other branch gets a preview URL.

To deploy a fork:

```bash
npx vercel --prod
```

Set the environment variables above in the Vercel project settings. Nothing else
is required — there is no database, no external service beyond Resend, and no
build step outside `next build`.

---

## Notes on things that are easy to get wrong

A short list of decisions in here that look arbitrary but are not, so future-me
does not "simplify" them back into bugs.

- **The board's canvas has to re-enable pointer events for itself.** `main`
  carries `canvas-overlay-mode`, which sets `pointer-events: none` so clicks in
  empty space fall through to the scene behind, and restores them for links,
  buttons, fields and headings. A canvas is none of those, so it inherits
  `none` and every hover and tap dies on it. It sets `pointer-events: auto`
  explicitly.

- **Lenis and ScrollTrigger must share a clock.** Lenis animates scroll on its
  own rAF loop; ScrollTrigger otherwise reads native scroll events and its own
  ticker. Unconnected they drift and the board lands early or late against the
  page. `useLenis(ScrollTrigger.update)` ties them together.

- **The section fallback chain follows the page, not the file.** Each timeline
  carries the section to return to when you scroll back out of it. The page runs
  hero, projects, stack, contact. Get that order wrong and scrolling up out of
  the stack hands the board back to the hero pose — full size, dead centre —
  over the projects grid.

- **Scene animation runs on rAF, never `setInterval`.** An interval goes on
  mutating scene objects in a tab nobody is looking at; rAF stops until the tab
  comes back.

- **Smoothing belongs in the rAF loop, not in a CSS transition.** A transition
  plus a per-frame write means restarting the same curve sixty times a second,
  which the browser recomputes every time. Closing a fixed fraction of the gap
  per frame is cheaper and tighter — and the loop stops itself when there is
  nothing left to close.

- **The starfield twinkles in groups, not per star.** One infinite opacity
  animation per star was 182 of them running for as long as the page stayed
  open. Five shared phases per layer is ten. It also fixed something quiet: the
  animation overrode each star's own `opacity`, so every star was swinging
  through the same brightness range.

- **Scroll height is cached, never read in the frame loop.** Touching
  `scrollHeight` forces a synchronous layout; doing it every frame while Lenis
  is writing scroll positions thrashes layout badly enough to take frame time
  from 17 ms to 32 ms.

- **The board fades with one CSS opacity on the canvas element**, not with
  transparent materials. Making the caps transparent pushes them into an
  alpha-blended pass where they sort unreliably against each other, and the
  result reads as blur the moment caps overlap. One composited opacity keeps
  every cap crisply opaque and costs a single GPU operation.

- **Technology logos are mapped by exact name, never by pattern.** A prefix
  match looks harmless and then puts Java's logo on JavaScript, Spring's on
  anything starting "spring", and React's on React Router. The map lives in
  [`src/data/tech-logos.ts`](src/data/tech-logos.ts).

- **Random values use a seeded PRNG (mulberry32).** `Math.random()` in a
  component body produces different values on server and client and fails
  hydration.

- **Don't name a module-level export `process`.** It shadows Node's global
  inside that module and quietly breaks every `process.env` read in the file.

---

## Licence

The code is available for reading and learning from.

The **content is not** — the copy, the project write-ups, the CV and the
photographs describe real work and a real person, and are not for reuse.

Vendored third-party assets keep their own licences: Devicon icons in
`public/assets/devicon/` are MIT, as noted in that directory.
