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

   **Keep it current.** When a project gets revised, check off the items the revision addresses: give the `<li>` `class="done"`, swap the icon to `check_circle`, and start the text with "Done:" plus what shipped. Never delete a checked item. If only part is done, check off the done part and add a new unchecked item for what's left. Add new items as new gaps show up.

   **Revisions section.** Right before Things to improve, a `<section class="cs-sec wrap">` with step label `history` / "Revisions" and the h2 "What changed since launch" lists changes in groups, each a `<p><b>Group</b></p>` followed by a `<ul>`: New features (icon `new_releases`), Improvements (`auto_fix_high`), Fixes (`build`), and Tried and taken back out (`undo`). Add to it on every revision, and update any story section, caption, screenshot or clip the change made out of date.
4. Contact block and footer, copied from the home page.

## Working rules

- Several conversations edit this site at once. Pull before every change, touch only the files the task is about, and rebase before pushing.
- When `site.css` changes, bump its `?v=` value on every page that links it, so browsers load the new version.
- Images live in `assets/img/` (WebP), clips in `assets/video/` (H.264 MP4, muted, looping, with a WebP poster).

## Light / dark mode

- Light is the default. The footer has a sun/moon `.theme-toggle` button, and `site.js` sets `data-theme="dark"` on `<html>` and saves the choice in `localStorage`.
- Every page needs the one-line theme script right after the `theme-color` meta (it prevents a light flash), plus the toggle button in `.site-foot`. Copy both from `index.html`.
- Use the `--md-*` color tokens, not hard-coded colors, so new sections work in both modes. Dark values live under `:root[data-theme="dark"]` at the end of `site.css`.
