# Changelog

All notable changes to the public portfolio. Versions are git tags; `v1.0.0` marks the original design.

## [2.0.0] — Unreleased (branch `redesign`)

A UI/UX audit of the live site, followed by a redesign aimed at recruiters skimming in under a minute.

### Fixed
- **Misaligned "Latest Posts" section.** `<main>` is a flex column, so sections with `margin: 0 auto` and no width shrank to fit their content (Posts started at 311px, Projects at 73px). Sections now set `width: 100%`.
- **Hero headline never scaled.** `clamp(2.5rem, 1vw, 4.25rem)`: the preferred value was always below the minimum. Now `clamp(2.25rem, 4.6vw, 4rem)`.
- **No keyboard focus styles.** Added a global `:focus-visible` ring.
- **Animations ignored "reduce motion".** Added a global `prefers-reduced-motion` override.
- **Blank link previews.** Added Open Graph / Twitter meta tags, a canonical URL and a 1200×630 `og-image.png`.
- **Tech stack shown as one long pill** when saved as a comma-separated string. Added `techList()` in `src/lib/format.js`.

### Changed
- **Design tokens:** rounder corners (2px → 6/12/16px), a brighter interactive green (`#4cb455`, dark text) while the deep green stays for surfaces, softer borders.
- **Typography:** sentence case for nav, buttons, tags and footer; uppercase only for small mono labels.
- **Home:**
  - New hero copy (name and value first, technologies second). Resume is now a primary action.
  - Rounded-rectangle portrait using a new photo.
  - The tech marquee is replaced by a static skills grid.
  - Removed the duplicate section-label bars.
  - Project cards are fully clickable, actions sit below the text, and tags are capped at 4 with "+N".
  - Inset CTA card with a Resume button.
- **About:**
  - Rebuilt around a short intro, quick facts, "How I work" (lessons from the JR Inventory case study) and a newest-first timeline.
  - The experience `link` field is now rendered.
  - Uses the original desk photo.
- **Projects:** a real intro line instead of a lone "My GitHub" link; left-aligned header.
- **Footer:** added email and Resume links.
- **Fonts:** loaded via `<link>` + preconnect instead of CSS `@import`. IBM Plex Sans is no longer downloaded, so the admin falls back to Manrope.
- **Shared content:** skills and availability live in `src/content/profile.js`, so Home and About can't drift apart.

## [1.0.0]

The original dark editorial design (Noto Serif + Manrope, forest-green accent).
