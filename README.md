# raysandesigns.com — static site

Plain HTML, CSS and a little JavaScript, built on Material Design 3 (color roles, type scale, shape, elevation, state layers and components, all hand-coded). No WordPress, no plugins, no build step. Icons are Material Symbols Rounded headings use Sofia Sans and body copy uses Google Sans Text, all from Google Fonts.

```
index.html          Home: hero, selected work, experience, about, contact
asthma-log.html     Asthma Log case study
kids-week.html      Kids Week case study
favicon.svg
assets/css/site.css All styles: M3 tokens at the top, original-site look at the bottom
assets/js/site.js   Copy-email button, footer year, image lightbox
assets/img/         Case study screens (WebP)
```

## Edit
- Text: open the .html file in any editor (VS Code works well) and change the words between the tags.
- Colors: the `--md-*` tokens at the top of `site.css` are M3 color roles mapped to your original palette (navy #1B3867, sky #3CB4E5, green #61CE70). The hero gradient is `--hero-grad`.
- Icons: any Material Symbols name works, e.g. `<span class="ms">palette</span>`.
- New case study: duplicate `asthma-log.html`, rename it, swap the text and images, and add a card that links to it in the Selected work section of `index.html`.

## Preview locally
Double-click `index.html`, or run `python3 -m http.server` in this folder and open http://localhost:8000.

## Go live (free) with Cloudflare Pages or Netlify
1. Create a free account at pages.cloudflare.com (or netlify.com).
2. Create a new project → "Upload assets" / drag and drop, and drop in this whole folder.
3. In the project's Custom domains settings, add `raysandesigns.com` and `www.raysandesigns.com`.
4. At your domain registrar, update the DNS records the host gives you (or move nameservers to Cloudflare).
5. Once the new site loads on your domain, cancel the WordPress hosting. Export anything you want to keep first (Tools → Export, and wp-content/uploads).

Updates later: edit the files, then drag the folder in again (or connect a GitHub repo so every push deploys).

## Contact form
The old site had a popup form. This version uses email/phone links instead, so nothing needs a server.
To add a form later, Netlify Forms (add `data-netlify="true"` to a `<form>`) or Formspree both work with static HTML.
