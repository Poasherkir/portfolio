# Portfolio — Malik Boudine

Source for my personal site: full-stack and mobile work, case studies, and an
interactive 3D keyboard whose keycaps are the technologies I use.

Live: **<https://malikboudine.vercel.app>**

Most of the projects on the site are private because they hold real user data.
[BAC Archive](https://github.com/Poasherkir/bac-archive),
[Delivery OS](https://github.com/Poasherkir/delivery-os) and this repository are
public, and [GateFlow](https://gateflow-demo.vercel.app) has a public demo.

## Stack

| Concern | Choice |
| --- | --- |
| Framework | Next.js 15 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS 3.4, CSS custom properties for theming |
| 3D | Spline runtime (`@splinetool/react-spline`) |
| Animation | `motion` for page transitions, GSAP + ScrollTrigger for the keyboard |
| Smooth scroll | Lenis |
| Theming | `next-themes`, light by default with a dark theme |
| Icons | `lucide-react`, plus vendored [Devicon](https://devicon.dev) logos (MIT) |
| Mail | Resend, validated with Zod |
| Analytics | `@vercel/analytics` |

## Project layout

```
src/
  app/                      routes (App Router)
    api/contact/route.ts    contact form handler
    projects/[slug]/        case-study pages, generated from the project data
    archive/                every project in one table
    opengraph-image.tsx     OG image, generated at build time
    icon.tsx apple-icon.tsx favicons, generated at build time
  components/
    animated-background*    Spline keyboard and its scroll choreography
    keyboard/               synthesised key sounds, loading silhouette
    sections/               home-page sections
    projects/               cards, grids, screenshot frames, cover figures
    layout/                 header, footer, navigation, toggles
    background/             starfield backdrop
    ui/                     small primitives (button, card, badge, ...)
  data/portfolio.ts         all site copy and project data
  data/roadmap.ts           data for the /stack page
  data/tech-logos.ts        skill name to Devicon file
  types/                    shared types
public/assets/projects/     project screenshots (WebP)
public/assets/devicon/      vendored Devicon logos
```

## Content

All copy lives in [`src/data/portfolio.ts`](src/data/portfolio.ts): profile,
navigation, hero, skills, keycaps, services, projects, about, FAQ and contact
text. Components read from it and contain no copy of their own.

Optional fields hide their UI when unset: `profile.email`, `profile.calendly`,
`profile.cv`, `hero.availability` and `Service.priceBand`.

### Adding a project

Add an entry to `projects` in `portfolio.ts`:

- `images` are 16:10 desktop screenshots (1600×1000 WebP). The first one is the
  cover; the rest appear in the case study.
- `screens` are phone screenshots (582 px wide WebP), shown in device frames.
- `architecture` fills the layer diagram on the case study and on `/projects`.
- `featured: true` puts it in the home-page grid. `FEATURED_SLUGS` in
  `src/app/projects/page.tsx` controls the large rows on `/projects`.

## Running locally

Requires Node 18.18+ (Node 20 recommended).

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

```bash
npm run typecheck
npm run lint
npm run build
```

Stop the dev server before running `npm run build`: both write to `.next`, and
the build overwrites the chunks the dev server is serving.

## Environment variables

Copy `.env.example` to `.env.local`. Everything is optional.

| Variable | Purpose | Without it |
| --- | --- | --- |
| `RESEND_API_KEY` | Sends contact-form messages | The form returns 503 and shows the email address instead |
| `CONTACT_TO_EMAIL` | Delivery address | Falls back to the email in `portfolio.ts` |
| `CONTACT_FROM_EMAIL` | Sender, on a domain verified in Resend | `onboarding@resend.dev`, which only delivers to the Resend account owner |
| `NEXT_PUBLIC_SITE_URL` | Canonical URLs, sitemap, OG images | Falls back to the Vercel URL |

## Contact form

`POST /api/contact` ([route](src/app/api/contact/route.ts)) validates the
payload with Zod and HTML-escapes everything before it reaches the email.
Spam handling, without a CAPTCHA:

1. **Honeypot.** A hidden `company_website` field must stay empty.
2. **Timing.** Submissions faster than 2.5 s get a `200` and are dropped.
3. **Rate limit.** 8 messages per IP per 10 minutes, in memory. Serverless
   instances are short-lived, so this only slows bursts down.

## Implementation notes

- **Lenis and ScrollTrigger share one clock.** `useLenis(ScrollTrigger.update)`
  drives ScrollTrigger from Lenis's frame loop; without it the keyboard drifts
  against the page.
- **The section chain follows the page order** (hero, projects, skills,
  contact). Each section falls back to the previous one when scrolling up.
- **Pointer events reach the keyboard through the page.** `main` has
  `canvas-overlay-mode`, which disables pointer events except on links,
  controls and text. The canvas re-enables them for itself.
- **Logos are matched by exact name** in
  [`src/data/tech-logos.ts`](src/data/tech-logos.ts) and in the project modal
  dock. A prefix match would give Java the JavaScript logo.
- **Seeded randomness.** The starfield and cover figures use a seeded PRNG so
  server and client markup match.
- **Keyboard sound** is synthesised in
  [`keyboard-audio.ts`](src/components/keyboard/keyboard-audio.ts) (a noise
  burst through resonant bandpass filters, then a `tanh` soft clip). The
  AudioContext is created on the first user gesture.

## Deployment

Deployed on [Vercel](https://vercel.com). Pushing to `main` deploys to
production; other branches get preview URLs. Set the environment variables
above in the Vercel project settings.

## Inspiration

Some ideas, not code, came from other developers' open-source portfolios: the
project archive table, the header that hides while scrolling, the CV button and
the live and source links on projects from
[Brittany Chiang's v4](https://github.com/bchiang7/v4), and reading time on
case studies from [Sat Naing's site](https://github.com/satnaing/satnaing.dev).

## Licence

The code is available to read and learn from. The content (copy, project
write-ups, screenshots, CV) describes real work and a real person and is not
for reuse.

Third-party code and assets keep their own licences; see
[`NOTICE.md`](NOTICE.md).
