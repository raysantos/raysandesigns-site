# raysandesigns.com — notes for Claude

Plain static site: HTML, one stylesheet (`assets/css/site.css`), one script (`assets/js/site.js`). No build step. Pushing to `main` deploys.

This file is the single source of truth for the site. Keep **Current state** and **Open items** up to date whenever a change lands, so the next session starts from the facts.

## Hosting and branches

- **Cloudflare Pages** project `raysandesigns-site`, deploying automatically on push.
  - `main` → live: raysandesigns.com, www.raysandesigns.com, raysandesigns-site.pages.dev
  - `dev` → private preview: dev.raysandesigns-site.pages.dev
  - The free plan builds one deploy at a time, so a push can take a few minutes when others are queued.
- Ray says whether a change goes on **dev** (preview) or **live** (`main`). If he doesn't say, ask.
- When a change goes live, apply the same change to `dev` as a normal commit on top of `dev` (cherry-pick or re-apply). Never force-push, and don't merge `main` into `dev` from a shallow clone; it conflicts.
- Other branches: `archive-cheqrboard` (old long CheQRboard case study), `case-study-templates-draft` (eight placeholder pages for the old small work cards). Leave them alone unless asked.
- **Caching** (`_headers`): HTML is no-cache, `/assets/*` caches for 5 minutes. That's why the `?v=` bump below matters.
- **DNS** is on Cloudflare; the registrar is Bluehost. The mail, imap, pop, smtp and ftp records point to Bluehost and must stay "DNS only". Don't touch them, and don't suggest cancelling Bluehost without checking whether @raysandesigns.com email is in use.

## Current state (2026-10-11)

**Live home page.** Focused on Ray's own apps, with Iconic as the centerpiece (it supports his Google Senior Icon Designer application).
- Flagship: Iconic (`iconic.html`), full-width `.feature.flagship` card, overline "FEATURED · ICON DESIGN SOFTWARE".
- Then a two-column `.app-grid` (one column on phones), image on top in a 16:9 frame: The Iconic logo, Asthma Log, Kids Week, Resin Matrix, AppFill.
- `iconic-logo.html` (live 2026-10-12): the Iconic logo case study. Its lead figure is an inline SVG that morphs through six real versions (JS at the bottom of the page; respects reduced motion). Icons live in `assets/img/iconic-logo/` as SVG, pulled from the Iconic repo history. Linked from its home card and a "The logo story" button on `iconic.html`.
- Card chips are varied on purpose; The Iconic logo: Logo design, Icon design, Brand. never repeat "AI-assisted build" or "Mobile web app". Iconic: Icon design, Icon systems, Tool design. Asthma Log: Health UX, Mobile UX, Real-time sync. Kids Week: Information design, Schedule design, Mobile UX. Resin Matrix: Data design, Comparison UX, Decision support. AppFill: Interaction design, Chrome extension, Automation.
- Unlinked but still live: `document-system.html`, plus the old small work-card grid (Fintech Icon System, Three Brand Launches, Painting Pro Platform, Interactive Statements with Orion AI, Agency Website Refresh, Websites & Intranets, Ventilation & IAQ Launches). To bring any back, restore it from `index.html` at commit `5246477`.

**Work section layout (live since 2026-10-12, Ray's BBC news reference).** No card fills. Iconic is the lead story: text left, big media right (stacked, media first, under 840px). The rest sit three across (two under 1100px; exactly four items go four across), each with a small-radius image, green kicker, title, description and a gray meta line of tags split by thin dividers, closed by a hairline rule; a rule separates the lead from the row. No "Read the case study" link; the title underlines on hover. Under 600px the row goes two across with image and title only. CSS block after `.app-grid` in `site.css`, `?v=20261012d`. Earlier tries: navy cards with full-bleed media (dev `3b4bb45`), no-fill single column (dev `74766ac`).

**On dev only, waiting for Ray's approval.**
- `cheqrboard.html`, rebuilt short: client work (Zero Copy Labs, 2025), 8 story sections plus Things to improve, no Revisions section (client work, like `industrial-iot.html`). Seven looping clips (`cheq-build`, `cheq-poll`, `cheq-warning`, `cheq-schedule`, `cheq-presets`, `cheq-sidebar`, `cheq-card`), each with a `-poster.webp`. The clips are soft because the Figma exports are low resolution.
- Home page: CheQRboard and Industrial IoT App are the first two `.app-grid` cards (six cards total). Chips: CheQRboard: Design systems, Product UI, Icon set. Industrial IoT: IoT, Dashboards, Icon design. Industrial IoT is real client work (ProAxion via Zero Copy Labs).
- `asthma-assistant.html`: model UX case study for the Google DeepMind Senior Model UX Designer application. Unlisted and `noindex`. Don't add a home card or merge to `main` until its "To do" sections are filled in.

## Design decisions

- **Foundation:** Material Design 3 tokens and components in the original site's look. Animated hero gradient. Sofia Sans headings (300–700), Google Sans Text body. Navy and white cards, 30px radius. Type uses the `--fs-*` tokens on an 8px line-height rhythm.
- **Header:** "Raysan Designs" wordmark on a cream fade (#ffecce), running to the left edge on phones. Icon nav pills that expand to labels on hover; LinkedIn is an icon-only pill at the far right. A progress bar starts after the hero.
- **Phone nav:** under 600px the top nav hides and a bottom `.nav-bar` (Work, Experience, About, Contact) shows, on every page. Case studies link to `index.html#…` with Work active.
- **Touch:** no tap highlight and no sticky hover states (`@media (hover: none)` block at the end of `site.css`).
- **Hero:** left-aligned, vertically centered. Eyebrow "— HI, I'M A", then a rotating Sofia Sans Light word (Product / Visual / Icon, every 4.6s) above "Designer". Status line: "Currently designing at Panasonic North America." No buttons, no down arrow.
- **Never call Ray "Senior"** in his own voice (hero, About). Past job titles in Experience keep their real names.
- **Work cards:** title-case titles, then the description. No logos.
- **Case studies:** multi-step flows are looping MP4 clips, not wide strips of frames.
- **Experience:** company logo bubbles. Raysan Designs is a cream-fade bubble with a black R, which is also the favicon. Education: Pratt and SVA NYC, stacked.
- **About:** a one-sentence `p.big` lede ("I'm Ray Santos, a visual designer with 15+ years in iconography, brand identity and UX/UI, trained in communication design at Pratt."), then three paragraphs: skills, versatility, hobbies.
- **Contact card:** email and LinkedIn only, icon and value, no labels or copy button. No phone number anywhere.
- **Tried and reverted, don't bring back:** a "Kitchen Confidential" voice for About, a Marvel-card power-ratings chart, logos on work cards.

## Open items

- Ray to review CheQRboard and Industrial IoT on dev, then merge both to `main`.
- Trim `industrial-iot.html` to the case study length rules below. (`document-system.html` was never trimmed either.)
- Fill in the "To do" sections of `asthma-assistant.html`: instructions v1→v3, eval results, control screens, live playground.
- Add a résumé link once the Google Senior Icon Designer resume is built.
- Suggested, not started: an icon showcase strip, an og:image social preview.

## Case studies

Every case study page follows the same shape. Use an existing one (`asthma-log.html`, `kids-week.html`) as the template.

**Keep it short.** A reader should get the whole story by skimming headings, first sentences and captions.
- Lede: two sentences at most (about 40 words).
- Six to eight story sections, not counting Revisions and Things to improve. Merge thin sections rather than adding new ones.
- Each section body: one short paragraph (about 60 words) **or** one lead sentence plus up to four one-line bullets. Lead with the decision or outcome, not the backstory.
- The `h2` carries the point on its own; the body backs it up rather than restating it.
- Captions: one line, about 15 words, starting with a bold phrase.
- Revisions and Things to improve items: one sentence each after the bold title.

1. Hero: back link, overline, title, lede, meta cards, lead image.
2. Story sections (`<section class="cs-sec wrap">` with a `.step` label, an `h2` and `.copytext`).
3. **Things to improve** (always the last content section, right before the contact block). Use this markup:

```html
<section class="cs-sec wrap improve">
  <div class="cs-text">
    <p class="step"><span class="ms" aria-hidden="true">flag</span>What's next</p>
    <div>
      <h2>Things to improve</h2>
      <div class="copytext">
        <ul>
          <li><span class="ms" aria-hidden="true">radio_button_unchecked</span><span><b>Short title.</b> One or two sentences: what falls short today and what would fix it.</span></li>
        </ul>
      </div>
    </div>
  </div>
</section>
```

   Aim for three to five honest items: gaps in the current version, lessons learned, and what you'd do next. Write them as plain statements, not apologies.

   **Keep it current.** When a project gets revised, check off the items the revision addresses: give the `<li>` `class="done"`, swap the icon to `check_circle`, and start the text with "Done:" plus what shipped. Never delete a checked item. If only part is done, check off the done part and add a new unchecked item for what's left. Add new items as new gaps show up.

   **Revisions section.** Right before Things to improve, a `<section class="cs-sec wrap">` with step label `history` / "Revisions" and the h2 "What changed since launch" lists changes in groups, each a `<p><b>Group</b></p>` followed by a `<ul>`: New features (icon `new_releases`), Improvements (`auto_fix_high`), Fixes (`build`), and Tried and taken back out (`undo`). Add to it on every revision, and update any story section, caption, screenshot or clip the change made out of date. To keep the page short, the `.copytext` opens with one sentence naming the biggest changes, and the grouped lists sit inside a collapsed `<details class="changes"><summary><span class="ms" aria-hidden="true">expand_more</span>All N changes (or "1 change")</summary> … </details>`. Update N when adding items.
4. Contact block and footer, copied from the home page.

## Working rules

- Several conversations edit this site at once. Pull before every change, touch only the files the task is about, and rebase before pushing.
- When `site.css` or `site.js` changes, bump its `?v=` value (date plus a letter, e.g. `20261011b`) on every page that links it, so browsers load the new version.
- Images live in `assets/img/` (WebP), clips in `assets/video/` (H.264 MP4, muted, looping, with a WebP poster).

## Light / dark mode

- Light is the default. The footer has a sun/moon `.theme-toggle` button, and `site.js` sets `data-theme="dark"` on `<html>` and saves the choice in `localStorage`.
- Every page needs the one-line theme script right after the `theme-color` meta (it prevents a light flash), plus the toggle button in `.site-foot`. Copy both from `index.html`.
- Use the `--md-*` color tokens, not hard-coded colors, so new sections work in both modes. Dark values live under `:root[data-theme="dark"]` at the end of `site.css`.
