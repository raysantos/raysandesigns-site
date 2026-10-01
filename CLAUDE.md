# raysandesigns.com — notes for Claude

Plain static site: HTML, one stylesheet (`assets/css/site.css`), one script (`assets/js/site.js`). No build step. Pushing to `main` deploys.

## Case studies

Every case study page follows the same shape. Use an existing one (`asthma-log.html`, `kids-week.html`) as the template.

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
4. Contact block and footer, copied from the home page.

## Working rules

- Several conversations edit this site at once. Pull before every change, touch only the files the task is about, and rebase before pushing.
- When `site.css` changes, bump its `?v=` value on every page that links it, so browsers load the new version.
- Images live in `assets/img/` (WebP), clips in `assets/video/` (H.264 MP4, muted, looping, with a WebP poster).
