Here is the updated Open Petal project context. The guidelines have been modified to replace Angular Material with daisyUI, emphasizing its CSS-only nature and how to enforce your strict sharp-edge rules on daisyUI components.

# Open Petal Project Context & Development Guidelines

## 1. Core Angular Architecture Rules

* **Application Type:** Non-standalone Angular application (`standalone: false`).
* **Module Registration & Automatic AppModule Updates:** Whenever a new component, page, or feature is created, Antigravity must **automatically update `app.module.ts**` to declare the component and import any required standard Angular modules (e.g., `CommonModule`, `ReactiveFormsModule`).
* **daisyUI Integration:** Prioritize native daisyUI component classes (e.g., `btn`, `drawer`, `menu`, `input`, `select`, `card`) for UI elements. Because daisyUI is a Tailwind CSS plugin, there are no specific UI modules to import into `app.module.ts`. Interactive behaviors (like modals or drawers) should be controlled via standard Angular component logic or HTML state management (like hidden checkboxes) as per daisyUI's patterns.
* **Routing:** Parent layout containers must use `<router-outlet>` to render child pages.

## 2. Official Design System & Tailwind Theme Tokens

* **Color Tokens:** Always use our official project color palette from `tailwind.config.js`:
* Primary & Accents: `primary` (`#006578`), `primary-container`, `tertiary` (`#006672`).
* Surfaces & Backgrounds: `background` (`#f8fafb`), `surface`, `surface-container-low`, `surface-container`, `surface-container-high`.
* Text & Outlines: `on-background`, `on-surface`, `on-surface-variant`, `outline`, `outline-variant`.


* **Borders & Edges (CRITICAL):** **Sharp edges only.** daisyUI components have rounded corners by default. You must aggressively override these by appending `rounded-none` to all daisyUI elements (buttons, cards, containers, inputs, and avatars) or configuring `--rounded-box: 0` and `--rounded-btn: 0` in the theme configuration. Strict square structural boxes are required.
* **Typography:** Use Hanken Grotesk (`font-display-lg`, `font-headline-lg`, `font-headline-md`, `font-body-lg`) and JetBrains Mono (`font-label-md`, `font-label-sm`).
* **UI Framework:** Combine official **daisyUI** component classes with our custom **Tailwind CSS** utility classes to handle precise spacing, sizing, and colors.
* **Icons & Assets:** Use inline SVGs or local assets (`loader.gif`, `logo.png`) stored locally. Do not use external broken image links.

## 3. Component Standards & Specific Rules

* **Dual-Mode Loader (`app-loader`):**
* Supports three modes: `mode="inline"`, `mode="page"`, and `mode="global"`.
* **CRITICAL CONTAINER RULE:** Whenever `mode="inline"` is used for a card or widget, the parent container element **must have explicit `relative` positioning** so the loader stays bounded within that card.
* **GIF & Spinner Fallback Logic:** Prioritizes displaying `loader.gif`, but uses a sharp-edged CSS spinner (or daisyUI `loading` class with squared modifications) as an instant fallback while the GIF is loading or if it fails.


* **Navigation & Links:** Active states require a clear highlight (`bg-primary-container/20` with a left border accent using `border-tertiary-fixed-dim`). Menu item text must be legible and styled cleanly against our dark/surface theme matching the active design tokens.