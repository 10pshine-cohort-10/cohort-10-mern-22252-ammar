# Project Guide

## What this project is

This repository contains a full-stack notes application built as one unified codebase with two separately running applications: a React client and an Express API server. The server uses MongoDB through Mongoose. This is a modular monolithic full-stack application: the API and browser app are separate deployable parts, but they are developed together and serve one product.

## Architecture and Request Flow

1. The browser loads the React application from `client/`.
2. Client pages and components call service modules, which use Axios configured in `client/src/services/api/axiosClient.ts`.
3. Axios sends requests to the Express API under `/api/v1`.
4. Express applies security headers (Helmet), CORS, body parsing (with 16kb size limits), cookie parsing, request logging (Pino HTTP), and rate limiting.
5. Authentication routes create accounts and issue JWTs. Protected note routes verify the token, load the current user, then perform user-scoped MongoDB operations.
6. Mongoose models define users and notes. The API returns JSON to the client, which updates its Zustand auth state and renders the results.

---

## Complete Project Folder & File Breakdown

Below is the exact list of all folders in the repository, how many files each folder contains, and the full list of file names with descriptions.

### 1. Root Directory (`/`) — Total Files: 5
- `.coderabbit.yaml` — CodeRabbit code review and quality bot configuration.
- `.gitignore` — Root Git ignore rules (prevents tracking `node_modules`, `.env`, `dist`, logs).
- `package.json` — Root package scripts (`client:dev`, `server:dev`, `client:build`, `client:test`, `server:test`).
- `project.md` — Project documentation and folder-by-folder file directory.
- `README.md` — Project overview, tech stack documentation, and quickstart commands.

---

### 2. Client Root (`client/`) — Total Files: 12
- `.env.example` — Environment template for client (`VITE_API_URL=http://localhost:5000/api/v1`).
- `.gitignore` — Client-specific ignore file.
- `.npmrc` — Client npm package manager settings.
- `.oxlintrc.json` — Fast linter configuration.
- `.prettierrc` — Prettier formatting rules.
- `components.json` — UI component configuration (shadcn/ui compatible).
- `eslint.config.js` — Flat ESLint configuration supporting TypeScript and React.
- `index.html` — HTML shell and mounting point for the Vite application.
- `package.json` — Client dependencies, scripts, and build toolchain definition.
- `package-lock.json` — Deterministic lockfile for client dependencies.
- `README.md` — Vite + React TypeScript client overview.
- `vite.config.ts` — Vite bundler configuration including Tailwind CSS v4 and path aliases.

#### TypeScript Config Files in `client/`
- `tsconfig.json` — Base TypeScript project references.
- `tsconfig.app.json` — App source code compilation options.
- `tsconfig.node.json` — Vite configuration compilation options.

---

### 3. Client Public (`client/public/`) — Total Files: 2
- `favicon.svg` — Application browser tab icon.
- `icons.svg` — Static SVG icon sprite/asset.

---

### 4. Client Source Root (`client/src/`) — Total Files: 4
- `App.css` — Top-level styling resets.
- `App.tsx` — Root component defining client routes (`/login`, `/dashboard`, `/notes`, `/editor`, `/profile`) and protected route guards.
- `index.css` — Global styling with Tailwind CSS v4 directives, font definitions, and TipTap list styles.
- `main.tsx` — React DOM entry point that renders `<App />`.

---

### 5. Client Assets (`client/src/assets/`) — Total Files: 3
- `hero.png` — Hero image banner.
- `react.svg` — React logo SVG asset.
- `vite.svg` — Vite logo SVG asset.

---

### 6. Client Components (`client/src/components/`)
Subdivided into modular categories:

#### a. Authentication Components (`client/src/components/auth/`) — Total Files: 3
- `AuthScreen.tsx` — Main split-screen login and registration component with live password strength checklist and toggleable view.
- `LoginForm.tsx` — Standalone reusable login form component.
- `SignupForm.tsx` — Standalone reusable registration form component.

#### b. Layout Components (`client/src/components/layout/`) — Total Files: 1
- `AppSidebar.tsx` — Navigation sidebar highlighting active routes (Dashboard, My Notes, Pinned, Archived, Profile), displaying user initials avatar, and handling SweetAlert2 logout.

#### c. UI Primitives (`client/src/components/ui/`) — Total Files: 3
- `button.tsx` — Reusable button with style variants (`default`, `destructive`, `outline`, `secondary`, `ghost`, `link`).
- `card.tsx` — Card container components (`Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`).
- `input.tsx` — Accessible text input field with styling states.

---

### 7. Client Pages (`client/src/pages/`) — Total Files: 5
- `DashboardPage.tsx` — Dashboard view featuring the Recharts note activity graph, summary statistic counters, and recent notes.
- `LoginPage.tsx` — Wrapper page rendering the `AuthScreen` component.
- `NoteEditorPage.tsx` — TipTap rich text note editor with formatting toolbar (headings, bold, italic, strike, lists, links), tags input, and safe error boundary.
- `NotesPage.tsx` — Dedicated note management page with grid display, filter tabs (All, Pinned, Archived), search bar, and SweetAlert2 actions.
- `ProfilePage.tsx` — User profile view showing member information, account status, monogram avatar, and live name editing.

---

### 8. Client Services (`client/src/services/`)
- `api/axiosClient.ts` — Centralized Axios HTTP instance with automatic `Authorization: Bearer <token>` injection and 401 response handling.
- `auth/authService.ts` — Authentication API calls (`signup`, `login`, `getCurrentUser`, `updateProfile`, `logout`).
- `notes/notesService.ts` — Notes CRUD API calls (`getNotes`, `getNoteById`, `createNote`, `updateNote`, `deleteNote`).

---

### 9. Client Stores (`client/src/stores/`) — Total Files: 1
- `authStore.ts` — Zustand store maintaining user, token, authentication status, and session hydration from `localStorage`.

---

### 10. Client Hooks (`client/src/hooks/`) — Total Files: 1
- `useAuth.ts` — Custom helper hook providing authentication status and state selectors.

---

### 11. Client Validations (`client/src/validations/`) — Total Files: 1
- `auth.validation.ts` — Zod schemas for login and signup form validation.

---

### 12. Client Types (`client/src/types/`) — Total Files: 1
- `index.ts` — TypeScript interfaces for `User`, `Note`, `NoteStats`, `AuthState`, and `ApiResponse`.

---

### 13. Client Utilities & Libraries (`client/src/utils/` & `client/src/lib/`) — Total Files: 2
- `client/src/lib/utils.ts` — Class name merging utility function (`cn`).
- `client/src/utils/index.ts` — General utility helper re-exports.

---

### 14. Server Root (`server/`) — Total Files: 5
- `.env.example` — Template for backend environment variables (`PORT`, `NODE_ENV`, `MONGODB_URI`, `JWT_SECRET`, etc.).
- `.gitignore` — Server-specific Git ignore rules.
- `package.json` — Node.js Express server dependencies, scripts (`dev`, `start`, `typecheck`).
- `package-lock.json` — Lockfile for server dependencies.
- `tsconfig.json` — TypeScript checking configuration for server ES modules (`NodeNext`, `checkJs: true`).

---

### 15. Server Source Files (`server/src/`)
Total files inside `server/src/`: 13

#### a. Server Entry & App Setup (`server/src/`) — Total Files: 2
- `server.js` — HTTP server bootstrap, connects to database, starts port listener, and handles graceful shutdown signals (`SIGINT`, `SIGTERM`).
- `app.js` — Express application setup, security middlewares (Helmet, CORS, rate limits), Pino request logger, and route mounting.

#### b. Server Configuration (`server/src/config/`) — Total Files: 3
- `database.js` — MongoDB Mongoose connection manager with optional custom DNS resolver configuration and error handling.
- `env.js` — Central environment configuration with strict presence checking for `JWT_SECRET` and path resolution.
- `logger.js` — High-performance Pino logger instance with ISO timestamps and environment log level mapping.

#### c. Server Middlewares (`server/src/middleware/`) — Total Files: 3
- `authenticate.js` — JWT verification middleware extracting tokens from headers/cookies and resolving the authenticated user from MongoDB.
- `rateLimiter.js` — Express rate limiting configs: `generalLimiter` (100 req/15 min) and `authLimiter` (10 req/15 min for login/signup).
- `requestLogger.js` — Pino HTTP logging middleware serializing request and response details.

#### d. Server Models (`server/src/models/`) — Total Files: 2
- `User.js` — Mongoose schema for user accounts (name, unique email, hashed password, role, status, avatarUrl).
- `Note.js` — Mongoose schema for notes (userId reference, title, content, category, tags, isPinned, isArchived).

#### e. Server Modules & Routes (`server/src/modules/`) — Total Files: 2
- `auth/auth.routes.js` — API endpoints for user signup, login, current session (`/me`), and profile updates.
- `notes/notes.routes.js` — Full CRUD API endpoints for notes including search, category filtering, pin/archive status, and stats aggregation.

#### f. Server Types (`server/src/types/`) — Total Files: 1
- `express.d.ts` — Express Request declaration file extending `req.user`.

---

## Running Locally

1. Install dependencies in `client/` and `server/`:
   ```bash
   npm --prefix client install
   npm --prefix server install
   ```
2. Copy `server/.env.example` to `server/.env` and specify a private `JWT_SECRET` and MongoDB URI.
3. Start the applications:
   ```bash
   npm run server:dev  # Runs Express server on port 5000
   npm run client:dev  # Runs Vite React app on port 5173
   ```
4. Access the app at `http://localhost:5173`.
