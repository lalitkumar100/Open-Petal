# Layout & Scrolling Bug Audit

## 1. Component Hierarchy & File Paths

The main rendering tree for the authenticated application follows this hierarchy:

1. **Root Module** (`src/app/app.component.html`) - The base angular outlet.
2. **Main Layout** (`src/app/main-layout/main-layout.html`) - Contains the persistent sidebar, header, and the main layout grid.
3. **Main Area Component** (`src/app/components/main-area-component/main-area-component.html`) - A wrapper inside `<main>` that hosts the inner `<router-outlet>`.
4. **Child Page View** (e.g., `src/app/pages/user/user-home-page/user-home-page.html`) - The specific feature page rendered for a given route.

## 2. Layout & Container Code

### `main-layout.html`
This is the root authenticated wrapper containing the fixed sidebar and top navbar:

```html
<div class="drawer drawer-end h-screen overflow-hidden" data-theme="openpetal-light">
  <input id="chat-drawer" type="checkbox" class="drawer-toggle" />
  
  <div class="drawer-content flex flex-col h-full">
    <div class="drawer lg:drawer-open h-full">
        <input id="my-drawer-4" type="checkbox" class="drawer-toggle inline" />
        
        <div class="drawer-content flex flex-col h-full overflow-hidden">
            <!-- Navbar / Breadcrumb Component -->
            <app-breadcrumb-component></app-breadcrumb-component>
            
            <!-- Page content here -->
            <main class="flex-1 min-h-0 overflow-hidden w-full p-4 bg-surface-container-lowest relative">
                <app-main-area-component class="block h-full w-full"></app-main-area-component>
            </main>
        </div>

        <div class="drawer-side is-drawer-close:overflow-visible z-20">
            <label for="my-drawer-4" aria-label="close sidebar" class="drawer-overlay"></label>
            <app-sidebar-component class="h-full"></app-sidebar-component>
        </div>
    </div>
  </div>
</div>
```

**Key properties applied:**
- Root: `h-screen overflow-hidden` limits layout to viewport size.
- Content Column: `flex flex-col h-full overflow-hidden` allows children to take exact screen dimensions.
- Main `<main>` slot: `flex-1 min-h-0 overflow-hidden w-full` consumes remaining space. The `min-h-0` safeguard prevents flex-item stretching.

### `main-area-component.html`
This wrapper holds the router outlet.

```html
<div class="flex flex-col relative h-full w-full">
  <router-outlet></router-outlet>
</div>
```

## 3. Reference File (Working Setup)

The layout of `admin-conflict-details-page.html` handles its own explicit vertical scrolling:

```html
<div class="p-6 max-w-7xl  min-h-screen">
  <!-- Content here -->
</div>
```
*Note: This page uses `min-h-screen`, which forcefully triggers overflow out of its parent's bounds, causing the layout engine to scroll it when placed in an `overflow-y-auto` container.*

## 4. Sample Page Implementation (Failing to scroll natively without wrapper mods)

### `user-home-page.html` (My Skills)
For a page to correctly behave inside our new explicitly-sized structure, it has been given full dimensional and scroll governance CSS (`h-full w-full overflow-y-auto overflow-x-hidden`):

```html
<div class="p-6 h-full w-full overflow-y-auto overflow-x-hidden">
  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200">
    <div>
      <h1 class="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">My Skills</h1>
    </div>
  </div>

  <div class="mt-8 space-y-8">
    <section class="card bg-base-100 border border-slate-200 shadow-sm !rounded-none">
      <div class="card-body p-0">
        <div class="overflow-x-auto">
          <table class="table w-full">
            <!-- Table content -->
          </table>
        </div>
      </div>
    </section>
  </div>
</div>
```

**Summary of Modifications for Review:**
- Transferred `overflow-y-auto` responsibilities from the `<main>` shell directly into the root `<div>` wrappers of individual components.
- Established a rigid parent wrapper hierarchy via `h-screen` -> `h-full` -> `flex-1 min-h-0`.
