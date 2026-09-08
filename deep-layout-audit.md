# Deep Layout & Scrolling Audit (DaisyUI)

## 1. DaisyUI Drawer Structure Analysis

**Current Nested Structure (`main-layout.html`):**
```html
<div class="drawer drawer-end h-screen overflow-hidden" data-theme="openpetal-light">
  ...
  <div class="drawer-content flex flex-col h-full">
    <div class="drawer lg:drawer-open h-full">
        ...
        <div class="drawer-content flex flex-col h-full overflow-hidden">
            <app-breadcrumb-component></app-breadcrumb-component>
            <main class="flex-1 min-h-0 overflow-hidden w-full p-4 bg-surface-container-lowest relative">
                <app-main-area-component class="block w-full"></app-main-area-component>
            </main>
        </div>
```

**Diagnostic Findings:**
In DaisyUI, the `.drawer-content` class typically handles overflow for the content portion of the drawer. By default, it sets up its own scrolling context. When we forcefully apply `overflow-hidden` to the inner `.drawer-content` (and then again to `<main>`), we are fundamentally breaking DaisyUI's native scroll handling. 

Because we have nested drawers:
1. Outer Drawer: Wraps the chat panel (right side).
2. Inner Drawer: Wraps the main sidebar (left side).

When the inner `.drawer-content` has `overflow-hidden`, and `<main>` has `overflow-hidden`, and we removed `h-full` from `<app-main-area-component>`, the content inside `<main>` expands vertically indefinitely, but it's clamped visually because all parents explicitly forbid scrolling.

## 2. Global CSS Inspection

**`src/styles.css` Findings:**
- The file imports `tailwindcss` and configures the `daisyui` plugin with custom theme tokens.
- **There are NO global overrides** for `html`, `body`, or `:root` height/overflow. The issue is strictly localized to the classes applied directly in `main-layout.html`.

## 3. DOM Tree Between `<main>` and the Page

### `src/app/main-layout/main-layout.html`
```html
<main class="flex-1 min-h-0 overflow-hidden w-full p-4 bg-surface-container-lowest relative">
  <app-main-area-component class="block w-full"></app-main-area-component>
</main>
```

### `src/app/components/main-area-component/main-area-component.ts`
*(Host styles missing / default)*
Since no `@Component({ host: { class: '...' } })` is declared, the component relies on the `class="block w-full"` passed from `main-layout.html`.
```html
<div class="w-full relative">
  <router-outlet></router-outlet>
</div>
```

### `src/app/pages/user/user-home-page/user-home-page.component.ts` (Example Child)
```html
<div class="p-6 w-full">
  <!-- Content... -->
</div>
```

## 4. Working Comparison (Admin Layout)

There is no separate `admin.config` or admin layout file—the admin pages (like `admin-conflict-details-page.html`) use the exact same `main-layout.html` wrapper!

**Why `admin-conflict-details-page` works differently:**
That page uses `min-h-screen` on its root div:
```html
<div class="p-6 max-w-7xl min-h-screen">
```
Because it forcefully requests at least `100vh`, it always broke out of certain containment rules, creating scenarios where it managed to force a scrollbar in older configurations, or it simply masked the issue by being excessively tall. However, in the current `overflow-hidden` lock, even this page might fail to scroll properly.

## Conclusion & Next Steps

The audit confirms that DaisyUI's `.drawer-content` is being suffocated by our explicit `overflow-hidden` utility classes. We need to restore scroll authority to the layout element that DaisyUI naturally expects to handle it.
