# Frontend Architecture Context: Global Error Handling (401 & 403)

This document serves as a reference for developers and AI agents regarding the global error handling architecture implemented in the Open Petal Frontend, specifically for dealing with `401 Unauthorized` and `403 Access Denied` errors.

## 1. Global State Management (`ErrorDialog` Service)
**Location:** `src/app/core/services/error-dialog.ts`

To manage the visibility of global error dialogs without prop drilling, we use a dedicated service with RxJS `BehaviorSubject`.
- Contains `showAccessDenied$` and `showUnauthorized$` Observables.
- Provides `showAccessDenied()` / `hideAccessDenied()` and `showUnauthorized()` / `hideUnauthorized()` methods.
- **Usage:** Any component or service can inject `ErrorDialog` to manually trigger the 401/403 popup.

## 2. Automatic HTTP Interception (`auth.interceptor.ts`)
**Location:** `src/app/core/interceptors/auth.interceptor.ts`

The application globally catches backend permission errors using an Angular HTTP Interceptor. 
- It intercepts all outgoing/incoming HTTP requests.
- If the backend returns an HTTP status of `403 (Forbidden)`, the interceptor automatically calls `ErrorDialog.showAccessDenied()`.
- If the backend returns an HTTP status of `401 (Unauthorized)`, the interceptor automatically calls `ErrorDialog.showUnauthorized()`.
- **Note to Developers:** You do not need to manually handle 401/403 errors in individual component API subscriptions. The interceptor guarantees the user is blocked and notified.

## 3. UI Component (`AccessDeniedDialog`)
**Location:** `src/app/components/access-denied-dialog/`

A global UI component that subscribes to `ErrorDialog.showAccessDenied$`.
- **Rendering:** It is placed directly in `src/app/app.html` (alongside `<router-outlet>`) so that it can overlay the entire application regardless of the current route.
- **Design:** Uses a fixed full-screen container with Tailwind backdrop blur (`backdrop-blur-md bg-base-300/60`) and a high z-index (`z-[9999]`) to lock the screen.
- **Actions:** 
  - **Dismiss:** Hides the dialog (user remains on the current page).
  - **Sign Out:** Hides the dialog and completely logs the user out via `AuthService.logout()`.

## Summary Flow
1. API Request fails with `401` or `403`.
2. `auth.interceptor.ts` catches the error.
3. Interceptor calls `errorDialog.showUnauthorized()` or `errorDialog.showAccessDenied()`.
4. `BehaviorSubject` emits `true`.
5. `app-unauthorized-dialog` or `app-access-denied-dialog` (living in `app.html`) appears with a full-screen blur.

## 4. UI Library & Styling (`src/styles.css`)
- **Framework:** Tailwind CSS is used globally for all utility classes.
- **Component Library:** **DaisyUI** is strictly used as the core UI component library (e.g., `.btn`, `.select`, `.modal-box`).
- **Theming:** A custom DaisyUI theme named `openpetal` is configured in `src/styles.css`.
  - Primary color is Ocean Blue (`#0284c7`).
  - Secondary color is Teal (`#0d9488`).
  - Base colors and semantic statuses (`info`, `success`, `error`) are globally defined here.
- **Icons:** **Angular Material Icons** (`<mat-icon>`) are used exclusively throughout the application for visual icons.

## 5. Global Loader (`LoaderComponent`)
**Location:** `src/app/components/loader/loader.ts`

- A highly reusable loading spinner component capable of displaying in multiple `mode`s (`inline`, `page`, `global`).
- Contains fallback mechanisms (e.g., showing a CSS spinner if the custom animation image fails to load via the `onGifError` handler).
- Developers should utilize this component (`<app-loader>`) whenever initiating long-running asynchronous API calls.

## 6. Storage Management (`StorageService`)
**Location:** `src/app/core/services/storage.service.ts`

- A unified service API for interacting with the browser's storage layer.
- **Automatic Serialization:** Automatically handles JSON parsing on `getItem()` and `JSON.stringify` on `setItem()`.
- **Remember Me Handling:** The `setItem()` function accepts a `rememberMe` boolean flag. 
  - If `true`, the data is saved in persistent `localStorage`. 
  - If `false`, it uses ephemeral `sessionStorage`. 
  - It handles mutual exclusion by clearing out the key from the unused storage medium, preventing collision errors.
