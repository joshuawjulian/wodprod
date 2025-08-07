# Wod Planner Layout

This document outlines a scalable and secure architecture for a SvelteKit application. It uses a Service Layer pattern, `HttpOnly` cookie-based authentication, remote functions for UI interactions, and a standard API endpoint for token refreshing.

## ---------------- Architecture Diagram ----------------

````src/
├── app.d.ts // Type definitions for App.Locals (e.g., locals.user)
├── hooks.client.ts // Manages client-side auth tokens and API call retries
├── hooks.server.ts // Validates auth tokens on every server request
│
├── lib/
│ ├── client/
│ │ └── stores/
│ │ └── authStore.ts // In-memory Svelte store for the JWT access token
│ │
│ ├── server/ // SERVER-ONLY CODE (The Engine Room ⚙️)
│ │ ├── db.ts // Manages database client and connection
│ │ │
│ │ ├── models/ // DATA ACCESS LAYER (Raw CRUD 🧱)
│ │ │ ├── user.model.ts
│ │ │ └── post.model.ts
│ │ │
│ │ └── services/ // BUSINESS LOGIC LAYER (Orchestration 🧠)
│ │ ├── auth.service.ts
│ │ └── post.service.ts
│ │
│ └── components/
│ ├── Header.svelte
│ └── UserProfileForm.svelte
│
└── routes/ // UI & API DEFINITIONS (The Control Panel 🚦)
│
├── (app)/ // Route group for pages requiring authentication
│ ├── +layout.server.ts // Loads user data for all protected pages
│ │
│ ├── dashboard/
│ │ ├── +page.svelte
│ │ └── actions.remote.ts
│ │
│ └── profile/
│ ├── +page.svelte
│ └── updateProfile.remote.ts
│
├── (public)/ // Route group for public pages
│ ├── login/
│ │   ├── +page.svelte
│ │   └── login.remote.ts
│ │
│ └── register/
│     └── +page.svelte
│
├── api/
│ └── auth/
│     └── refresh/
│         └── +server.ts // Standard API endpoint for token refreshing
│
├── +layout.svelte // Root layout for the entire application
└── +page.svelte // Public homepage```

## ---------------- Component Explanations ----------------

### src/hooks.client.ts — The Client-Side Security Guard

- **Role:** Intercepts all outgoing `fetch` requests originating from the SvelteKit app in the browser.
- **Responsibilities:**
  1. **Attach Token:** Reads the access token from the in-memory store (`authStore.ts`) and attaches it to the `Authorization` header of every outgoing request.
  2. **Intercept 401s:** Checks the response of every request. If it receives a `401 Unauthorized` status, it knows the access token has expired.
  3. **Refresh & Retry:** When a `401` is detected, it pauses the original request and makes a _new_ request to the `/api/auth/refresh` endpoint. Upon receiving a new access token, it updates the in-memory store and automatically retries the original, failed request.

### src/hooks.server.ts — The Server-Side Security Guard

- **Role:** Intercepts all incoming requests to the SvelteKit server.
- **Responsibilities:**
  1. **Validate Token:** For every request to a protected resource (a page in the `(app)` group or a remote function), this hook reads the `Authorization` header.
  2. **Verify & Decode:** It uses the `auth.service.ts` to verify that the access token is valid and not tampered with.
  3. **Set User Context:** If the token is valid, it decodes the user's information (e.g., user ID, roles) and attaches it to `event.locals.user`. This makes the user data available to all subsequent `load` functions and remote functions for that request without needing to re-validate the token.

### src/lib/server/ — The Engine Room ⚙️

- **Role:** The heart of your backend. All files in this directory are guaranteed to only run on the server, protecting your database credentials, API keys, and core logic.
- **`db.ts`:** Initializes and exports your database client (e.g., Prisma, Drizzle, `node-postgres`). This centralizes your database connection logic.
- **`models/*.ts` (Data Access Layer 🧱):** This layer's only job is to communicate directly with the database. It contains simple, raw **CRUD** (Create, Read, Update, Delete) functions. It knows nothing about business rules. Example: `user.model.ts` contains `findUserById`, `createUser`, etc.
- **`services/*.ts` (Business Logic Layer 🧠):** This layer contains the application's intelligence. Service functions are called by your remote functions and API endpoints. They orchestrate calls to one or more models to perform a specific task, enforce business rules, handle transactions, and perform complex operations. Example: `auth.service.ts` would use the `user.model` to find a user, then use its own logic to verify a password hash and generate JWTs.

### src/routes/ — The UI & API Definitions 🚦

- **Role:** Defines the visible pages and callable API routes of your application.
- **Route Groups `(app)` & `(public)`:** These parentheses denote route groups, which organize your routes without affecting the URL. This is perfect for applying different layouts or logic to sets of pages (e.g., all pages in `(app)` require a user to be logged in).
- **Remote Functions (`*.remote.ts`):** These are the type-safe "direct lines" from your Svelte components to your server. They act as thin controllers that do minimal work other than calling the appropriate service function from your `services` layer. They are the primary way your UI interacts with the backend.
- **Standard Endpoint (`api/auth/refresh/+server.ts`):** This is a traditional API endpoint with a fixed URL. It's used for specific, predictable actions that may be called from outside the SvelteKit UI proxy, like the refresh token call from the client hook. For this auth pattern, it's often the only one you need.
````
