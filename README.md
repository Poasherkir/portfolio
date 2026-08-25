# Portfolio — Malik Boudine

The source for my personal site: a full-stack and mobile developer portfolio built
around an interactive 3D keyboard where every keycap is a technology I actually
ship with.

Live: **<https://malikboudine.vercel.app>**

This is the only public repository on my account. Every project the site talks
about — Briefing Point Go, TechSub, BAC Archive — is a live product holding real
user data, so those stay private. This repo is the code you can read instead.

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
| 3D | React Three Fiber 9 + drei 10 + three.js 0.171 |
| Animation | `motion` (Framer Motion 12) |
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

The centrepiece, and the part worth reading if you only read one thing. It lives
in [`src/components/keyboard/`](src/components/keyboard/).

Thirty keycaps, each carrying a real technology logo, arranged on a modelled
board. You can hover a cap to see what it is and what I used it in, click one to
pin that read-out, or press the matching key on your actual keyboard. Each press
makes a sound. The board is choreographed against the page: it drifts, tips,
comes apart into floating caps as you scroll, and reassembles into a keyboard
over the tech-stack section.

### How the caps are made

Each cap is an `ExtrudeGeometry` with a bevel and a dished top, generated once
and shared across all thirty instances (`keycap-geometry.ts`). The logo is not a
decal or a separate plane — a **planar UV projection** is applied to the cap
mesh, and the logo is painted into a canvas texture that maps onto it
(`keycap-texture.ts`). An earlier version floated a separate legend plane just
above each cap; it was abandoned because it z-fights and breaks the moment the
cap rotates.

Cap and ink colours are chosen as a **pair** (`capAndInk()`), not independently.
A logo on a keycap of a similar hue vanishes — a blue Flutter mark on a blue cap
is invisible — so the ink is picked for contrast against the chosen cap colour,
and monochrome variants are recoloured on the fly.

Devicon ships `-original` (full colour) and `-plain` (single path) variants.
This uses `-plain` wherever it exists (23 of 30), because recolouring an
`-original` SVG fills in its cut-outs: the HTML5 "5" and the Next.js "N" become
solid blobs.

### Lighting

`RoomEnvironment` is generated locally and run through `PMREMGenerator` to give
the physical materials something to reflect. Without an environment map a
`MeshPhysicalMaterial` reads as flat gouache. drei's `<Environment>` presets do
the same job but fetch an `.hdr` from a CDN; this one costs one render at
startup and no network.

Tone mapping is Khronos **neutral**, not ACES. ACES rolls bright saturated
colour toward white, which turned every brand colour pastel.

### Sound

Modal synthesis in `keyboard-audio.ts` — no audio files. A press is a bank of
six resonant filters (168–5600 Hz) excited by a noise burst; a release is three.
Output goes through a `tanh` waveshaper for soft clipping.

Two things learned the hard way: high-Q bandpass filters throw away most of the
input energy, so mode gains are *not* output amplitudes and a makeup gain is
required (measured with an `OfflineAudioContext`, not guessed). And a
`DynamicsCompressor` made it **quieter**, not louder, because it ducks exactly
the transient that makes a keypress sound like a keypress.

### Choreography

`poses.ts` holds a keyframe per section — position, rotation, scale — plus a
presence (opacity) value and a drift ceiling. The scene interpolates
continuously between whichever two keyframes the current scroll position falls
between, so the board is always moving rather than snapping at boundaries.

Anchors are **measured from the real DOM** and sorted by measured position, not
by the order they are declared in. A section can nominate a different trigger
element with `data-kbd-anchor` — the stack section does this, because its pose
should peak when the empty stage is on screen, not when its sticky heading is,
and those are most of a viewport apart.

Opacity and drift are keyed to sections rather than to a fraction of total
scroll for a specific reason: a hard-coded "fade out at 55% of the page" stop
silently lands somewhere else the moment a section is added. Anything tied to
page length will drift out of tune as the page grows.

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
  components/
    keyboard/               the 3D scene — geometry, textures, audio, poses
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

- **The canvas sits at `z-0`, never a negative z-index.** Content behind an
  opaque ancestor background is excluded from hit-testing, so a canvas at
  `-z-10` receives no pointer events at all and hover silently never fires.

- **Scroll height is cached, never read in the frame loop.** Touching
  `scrollHeight` forces a synchronous layout; doing it every frame while Lenis
  is writing scroll positions thrashes layout badly enough to take frame time
  from 17 ms to 32 ms.

- **The board fades with one CSS opacity on the canvas element, not with
  `transparent` materials.** Making thirty caps transparent pushes them into
  three's alpha-blended pass where they sort unreliably against each other — the
  result reads as *blur* the moment caps overlap. One composited opacity keeps
  every cap crisply opaque and costs a single GPU operation.

- **A cap's static offset lives on an outer group, its animation on an inner
  one.** Animating a mesh's `position` directly fights React re-applying the
  `position` prop on every render.

- **Blob URLs for SVG textures are revoked *after* the draw, not in a `finally`.**
  Chrome rasterises SVGs lazily: the image reports as decoded but is unpaintable
  if its blob URL is already gone. This was the actual cause of "the keycaps have
  no logos".

- **Devicon SVGs carry only a `viewBox`, no width/height**, which gives them zero
  intrinsic size, which makes `drawImage` paint nothing at all — silently.
  Dimensions are injected from the viewBox before drawing.

- **Every `rotation.x` in `poses.ts` is positive.** The board is modelled lying
  flat with caps toward +Y and the camera on +Z; a negative rotation turns it
  over and renders the underside.

- **Random values use a seeded PRNG (mulberry32).** `Math.random()` in a
  component body produces different values on server and client and fails
  hydration.

- **Don't name a module-level export `process`.** It shadows Node's global inside
  that module and quietly breaks every `process.env` read in the same file.

---

## Licence

The code is available for reading and learning from.

The **content is not** — the copy, the project write-ups, the CV and the
photographs describe real work and a real person, and are not for reuse.

Vendored third-party assets keep their own licences: Devicon icons in
`public/assets/devicon/` are MIT, as noted in that directory.
