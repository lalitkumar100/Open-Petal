# Open Petal Project Context & Development Guidelines

## 1. Core Angular Architecture Rules
- **Application Type:** Non-standalone Angular application (`standalone: false`).
- **Module Registration & Automatic AppModule Updates:** Whenever a new component, page, or feature is created, Antigravity must **automatically update `app.module.ts`** to declare the component and import any required Angular modules.
- **Angular Material Integration:** Prioritize native Angular Material components (e.g., `MatButtonModule`, `MatIconModule`, `MatSidenavModule`, `MatListModule`, `MatFormFieldModule`, `MatSelectModule`, etc.) and ensure their respective modules are explicitly imported in `app.module.ts`.
- **Routing:** Parent layout containers must use `<router-outlet>` to render child pages.

## 2. Official Design System & Tailwind Theme Tokens
- **Color Tokens:** Always use our official project color palette from `tailwind.config.js`:
  - Primary & Accents: `primary` (`#006578`), `primary-container`, `tertiary` (`#006672`).
  - Surfaces & Backgrounds: `background` (`#f8fafb`), `surface`, `surface-container-low`, `surface-container`, `surface-container-high`.
  - Text & Outlines: `on-background`, `on-surface`, `on-surface-variant`, `outline`, `outline-variant`.
- **Borders & Edges:** **Sharp edges only.** Never use `rounded-xl`, `rounded-full`, etc. Override border radiuses using `rounded-none` or strict square structural boxes across all buttons, cards, containers, inputs, and avatars.
- **Typography:** Use Hanken Grotesk (`font-display-lg`, `font-headline-lg`, `font-headline-md`, `font-body-lg`) and JetBrains Mono (`font-label-md`, `font-label-sm`).
- **UI Framework:** Combine official **Angular Material** components with our custom **Tailwind CSS** utility classes.
- **Icons & Assets:** Use inline SVGs or local assets (`loader.gif`, `logo.png`) stored locally. Do not use external broken image links.

## 3. Component Standards & Specific Rules
- **Dual-Mode Loader (`app-loader`):**
  - Supports three modes: `mode="inline"`, `mode="page"`, and `mode="global"`.
  - **CRITICAL CONTAINER RULE:** Whenever `mode="inline"` is used for a card or widget, the parent container element **must have explicit `relative` positioning** so the loader stays bounded within that card.
  - **GIF & Spinner Fallback Logic:** Prioritizes displaying `loader.gif`, but uses a sharp-edged CSS spinner as an instant fallback while the GIF is loading or if it fails.
- **Navigation & Links:** Active states require a clear highlight (`bg-primary-container/20` with a left border accent using `border-tertiary-fixed-dim`). Menu item text must be legible and styled cleanly against our dark/surface theme matching the active design tokens.