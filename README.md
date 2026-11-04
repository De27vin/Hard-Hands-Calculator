# Hard Hands Calculator

**You've got soooft hands sissy boy**

A completely unscientific, fully client-side meme quiz. Answer 30 questions, get a deterministic hardness score from 0–1000, receive one of eight ridiculous ranks, and send an industrial-styled PNG certificate to the group chat.

All professions deserve respect. This is satire, not a health, safety, or biometric assessment. Appropriate PPE, injury prevention, skincare, rest, and stopping for dangerous weather are explicitly respected in the content and scoring.

## Stack

React 19, TypeScript, Vite, Lucide icons, and custom responsive CSS. Barlow Condensed and DM Sans are bundled locally through Fontsource; no Google Fonts requests. CSS and inline SVG supply the industrial decoration. Three locally bundled Blue Collar SpongeBob meme images appear on the landing page, contextual reactions, results, and share-card backgrounds; see [ASSET_CREDITS.md](ASSET_CREDITS.md) for their sources. Native Canvas generates share cards without screenshot libraries or external APIs.

No backend, database, authentication, API keys, analytics, or paid services. Answers remain in React memory and disappear on refresh or restart. No data is sent anywhere by the app; using the native share sheet sends only the certificate and result text to the destination you select.

## Run locally

Use Node **22.12+** (Node 24 also works) and npm.

```sh
npm ci
npm run dev
```

Open the Local URL Vite prints (normally `http://localhost:5173`).

```sh
npm run test        # unit and UI tests
npm run test:watch  # interactive test runner
npm run build      # strict TypeScript check + optimized static build
npm run preview    # serve dist locally
```

The complete quiz works without network access once loaded. This is not a service-worker PWA: a first visit or page refresh still requires the static files to be available.

## Browser tests

```sh
npx playwright install chromium
npm run build
npm run test:e2e
```

Playwright serves the production build itself on port 4173. Desktop and mobile Chromium tests cover all 30 questions, changing and preserving answers, deterministic results, restart, keyboard controls, reduced motion, 320px overflow checks, offline quiz completion, automated axe accessibility checks, and actual PNG signature/dimensions. Screenshots and downloaded cards go to ignored `test-results/`.

If Chromium is already installed outside Playwright’s default location:

```sh
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/absolute/path/to/chrome npm run test:e2e
```

Native sharing is device/browser dependent and usually needs HTTPS. Unit tests cover successful native sharing, cancellation, unavailable file sharing, and rejected share targets. Download PNG remains available independently. Physical-device share-sheet behavior should be checked on target devices before a broad release.

## Static deployment

Build command: `npm run build`. Output directory: `dist`. No server functions or environment variables are required. `base: './'` in `vite.config.ts` supports both a domain root and a GitHub Pages repository subdirectory. The app uses in-memory views and does not need SPA route rewrites.

- **Cloudflare Pages:** connect the repository, use the build command and output directory above, and set Node to 22.12+ or 24 in the build environment.
- **Vercel:** import the repository, select the Vite framework preset, and use the same build command/output. Select a supported Node version meeting the requirement.
- **GitHub Pages:** run `npm run deploy:pages` from a checkout with Git push access. This builds the app and publishes only `dist` plus `.nojekyll` to the `gh-pages` branch, preserving its history. The relative asset base works at `/Hard-Hands-Calculator/`. GitHub Pages serves the root of `gh-pages`; if Pages is disabled, select **Settings → Pages → Deploy from a branch → gh-pages → /(root)** once.
- **Any static host:** upload the contents of `dist` and serve `index.html`. Use HTTPS for the best native sharing support. Serve bundled assets alongside the HTML.

The repository includes a validation-only CI workflow. To publish a new version, commit and push your source, then run `npm run deploy:pages`. GitHub deploys pushes to the publishing branch. The publish script uses a temporary checkout and leaves the source checkout unchanged.

Published site: https://de27vin.github.io/Hard-Hands-Calculator/

## Editing the quiz

```text
src/
  components/     Header/footer, hand artwork, share dialog
  data/
    questions.ts Categories, 30 questions, answer labels and points
    ranks.ts     Rank boundaries, descriptions, color, and personality
    reactions.ts Sparse live reactions and personalized commentary rules
  lib/
    quiz.ts      Pure navigation/state reducer
    scoring.ts   Pure scoring and completeness checks
    sharing.ts   Canvas PNG, native share, download fallback
  pages/         Landing, Quiz, Calculating, Results
  styles/        Responsive design and reduced-motion support
  types.ts       Shared TypeScript contracts
tests/           Data, scoring, state, reactions, sharing, and UI tests
e2e/             Production-browser tests
```

Edit question wording, asides, and options in `src/data/questions.ts`. The `q()` helper assigns stable `q1`–`q30` question IDs and `a0`–`a4` answer IDs. Reordering options requires updating reaction/commentary rules that refer to those IDs. Keep exactly five questions per category and three to five options per question. Each question must include a minimum of 0 and maximum of 4 points.

### Scoring

Every question contributes 0–4 raw points. Each five-question category has a 20-point maximum. The whole quiz has a 120-point maximum:

```text
total = round(sum(answer points) / 120 × 1000)
category percent = round(category points / 20 × 100)
```

The implementation derives maxima from the data, rejects unknown answer IDs by treating them as zero, and clamps the result to 0–1000. The UI/reducer only permits completing the quiz after all 30 answers are valid. Category percentages are rounded independently, while the final score is rounded once from raw points. No question carries extra weight; each category supplies one sixth of the possible total.

Change point values in `questions.ts` and the pure calculation in `src/lib/scoring.ts` if requirements change. Update the balanced-range tests and the on-screen math explanation too. Keep real safety decisions neutral: for example, both outdoor weather-safety answers receive full points, and daily versus as-needed cream use for working hands receives the same points.

### Ranks and reactions

Edit or add ranks in `src/data/ranks.ts`. Ranges must cover every integer from 0 through 1000 with no overlaps. Each rank has its own emoji, description, tagline, accent color, and visual level. Update the eight-rank test and landing copy if deliberately changing the required number of ranks.

Reactions are intentionally available on only eight questions and appear at most once per eligible question in a quiz run. They use a reserved inline area, never block navigation, and are announced politely to screen readers. Personalized result notes use deterministic answer rules in `reactions.ts`.

### Accessibility and motion

Semantic headings, labelled radio groups, native radio keyboard behavior, focus rings, a skip link, question focus management, live progress/reactions, a native modal dialog with focus restoration, and reduced-motion CSS are included. The fictional calculation interlude is shortened under reduced motion. All functionality remains usable without animations.

### Sharing

The share dialog builds a 1200×1200 PNG using local bundled fonts and Canvas. It previews the actual image. Share Card uses `navigator.canShare`/`navigator.share` for files when supported, falls back to downloading on unsupported/rejected targets, and respects user cancellation. Download PNG always works independently on browsers with Canvas export. A failed image export displays a readable error. No personal information is included. Meme backgrounds use the same locally bundled images as the UI, so Canvas export needs no third-party image requests or CORS permission. Image-decode failures fall back to the readable text certificate. Shared score URLs are intentionally omitted.

## Limitations

- The joke measures answers, not strength, identity, occupational worth, or actual hand condition.
- Refreshing clears progress; there is no persistent tracking or account.
- Native share targets depend on the browser and device. Desktop browsers commonly use the PNG fallback.
- Browser automation targets Chromium at desktop/mobile viewport sizes; it does not replace physical iOS/Android checks or a manual screen-reader review.
- Social previews include title/description metadata; a deployed absolute Open Graph image URL can be added after a hosting domain is selected.

Font licenses are supplied in the installed Fontsource packages and bundled under `public/licenses`. Meme image sources are documented in [ASSET_CREDITS.md](ASSET_CREDITS.md). Images and fonts are served with the app; there are no third-party asset requests at runtime.
