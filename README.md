# CampusIQ Frontend

React + TypeScript single-page application for CampusIQ — a peer-tutoring and AI-assistant platform. Students discover tutors, book sessions, and chat with an AI assistant. Tutors manage availability and session requests. Admins moderate users and content.

## Engineering Highlights

- **TanStack Query (React Query v5)** manages the application's primary server-state layer — queries, mutations, caching, cursor-based infinite pagination, and invalidation — with a shared `QueryClient` at the root.
- **Zustand** handles client-state concerns: authentication session, AI message optimistic updates, and document upload state.
- **Supabase** powers both authentication (email/password + Google OAuth) and file storage for document uploads and profile images, with an Axios REST client layered on top for business logic endpoints.
- **Role-based route guards** (`ProtectedRoute`) control frontend access to student, tutor, and admin application areas, with an onboarding redirect gate for newly registered tutors using JWT `app_metadata` claims.
- **Optimistic UI in AI chat**: messages appear immediately via Zustand before the API responds, with the query cache reconciled on success. A `historyIds` Set prevents duplicate rendering.
- **Document pipeline**: PDF upload to Supabase Storage to get object storage URL → the URL is then passed alongside filename to post/Document → the frontend then polls the   backend  via `useGetDocumentStatus` with a dynamic `refetchInterval` (2s when processing, `false` otherwise) — a self-stopping poll to get the processing status "ready"

## Architecture

```
Browser
  ↓
main.tsx — StrictMode + QueryClientProvider + root mount
  ↓
App.tsx — AuthInitializer (Supabase session boot) + BrowserRouter
  ↓
app/routes.tsx — React Router v6 nested route tree
  ↓
ProtectedRoute / PublicRoute — role-based guards + onboarding gate
  ↓
AppShell — Navbar / Sidebar / Outlet / BottomNav layout
  ↓
Pages (src/pages/) → Feature components (src/features/) → Shared components (src/shared/)
  ↓
API Layer: Axios (REST) + Supabase client (auth, storage)
  ↓
Backend (VITE_BASE_URL) + Supabase services
```

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build tool | Vite 5 |
| Routing | React Router v6 |
| Styling | Tailwind CSS v4 + CSS custom properties |
| State (server) | TanStack Query v5 |
| State (client) | Zustand |
| HTTP client | Axios (interceptors for auth tokens) |
| Auth | Supabase Auth (email/password, Google OAuth) |
| Storage | Supabase Storage |
| Forms | Formik + Yup validation schemas |
| AI rendering | react-markdown + remark-gfm + remark-math + rehype-katex |
| Animations | Framer Motion |
| Icons | lucide-react, react-icons |
| Docs | KaTeX |
| Deployment | Vercel |

## Project Structure

```
src/
├── app/                  # Entry point, routes, route guards
│   ├── App.tsx           # AuthInitializer + BrowserRouter
│   ├── routes.tsx        # Full route tree with protected/public sections
│   └── Route/
│       ├── ProtectedRoute.tsx   # Role guard + onboarding redirect
│       └── PublicRoute.tsx      # Unauthenticated-only guard
├── features/             # Feature modules
│   ├── auth/             # Auth store, API, hooks, types
│   ├── ai/               # Chat store, message API, components
│   ├── chat/             # Tutor-student chat with mock data
│   ├── document/         # Document upload + status polling
│   ├── session/          # Session lifecycle hooks + API
│   ├── student/          # Student-specific hooks/components
│   └── tutor/            # Tutor-specific hooks/components
├── pages/                # Route-level page components (by role)
│   ├── auth/             # Login, Signup, AuthCallback
│   ├── student/          # Dashboard, search, booking, chat, AI, sessions
│   ├── tutor/            # Dashboard, profile, onboarding, chat, sessions
│   └── admin/            # Dashboard, users, moderation
├── shared/               # Reusable across features
│   ├── components/       # Layout (Navbar, Sidebar, AppShell, BottomNav) + UI (Avatar, FieldError, etc.)
│   ├── hooks/            # useTheme, useDebounce
│   ├── lib/              # Supabase upload helpers, validation schemas, field utilities
│   └── types/            # Shared Role type
├── lib/                  # Global infrastructure
│   ├── supabase.ts       # Supabase client initialization
│   └── react-query.ts    # QueryClient instance
├── styles/               # globals.css (CSS custom properties)
└── main.tsx              # Entry point
```

## Core Flows

### Authentication

CampusIQ uses **Supabase Auth** for authentication, supporting both email/password and **Google OAuth** sign-in. Both flows end at the same `/auth/callback` route.

#### Email / Password Flow

```
User enters email + password on LoginPage or SignupPage
  → useAuthStore.signIn() / signUp()
  → Supabase Auth
  → Zustand updates session, accessToken, status
  → Supabase onAuthStateChange subscription keeps session in sync
  → ProtectedRoute reads Zustand session + JWT metadata → redirect if unauthenticated or wrong role
  → signOut clears Zustand, invalidates QueryClient cache
```

#### Google OAuth Flow

```
User clicks "Continue with Google" on LoginPage or SignupPage
  → SignupPage: user first selects role (student/tutor), stored in localStorage under
    PENDING_ROLE_KEY = "campusiq_pending_role"
  → signInWithGoogle() calls supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: "/auth/callback" } })
  → Browser redirects to Google's consent screen
  → Google authenticates user and redirects back to /auth/callback
  → AuthCallback page takes over:
      1. supabase.auth.getSession() retrieves the session from the URL hash
      2. accessToken + session set in Zustand store (status stays "loading" until sync completes)
      3. Role determined:
         a. If PENDING_ROLE_KEY exists (new Google signup from SignupPage):
              → syncUserAsync({ role: pendingRole }) registers user via backend API
              → role stored in JWT app_metadata for future sessions
              → PENDING_ROLE_KEY removed from localStorage
         b. If no pending role (returning user):
              → role read from session.user.app_metadata (JWT claim)
              → if no role → redirect to /login
      4. Navigation:
         → Tutor with onboarding incomplete → /tutor/onboarding
         → Otherwise → /{role}/dashboard
  → ProtectedRoute takes over from here (reads Zustand session + app_metadata)
```

**Key distinction between login and signup with Google:**
- **Signup**: User selects their role on the SignupPage before clicking "Continue with Google". The role is saved to `localStorage` and consumed by `AuthCallback`, which calls `syncUser` to register the user in the backend and persist the role in `app_metadata`.
- **Login**: No role selection is needed — the role is already in `app_metadata` from the initial signup. `AuthCallback` reads it directly from the JWT.

#### Auth Initialization
```
App mounts → AuthInitializer calls supabase.auth.getSession()
  → Hydrates Zustand store (user, session, accessToken, status, initialized)
  → Subscribes to supabase.auth.onAuthStateChange() for reactive updates
  → Returns cleanup (subscription.unsubscribe()) on unmount
  → ProtectedRoute returns null while !initialized (prevents flash of unauthenticated content)
  → Once initialized: redirects to correct role dashboard or login
```

### Tutor Onboarding Gate
```
ProtectedRoute detects metadata.onboarding_complete === false
  → Redirect to /tutor/onboarding
  → On completion, JWT metadata updated (metadata.onboarding_complete === true)
  → Redirect to /tutor/dashboard
```

### AI Chat — Message Loading & Cursor Pagination
```
AIAssistant component mounts
  → useGetAiMessages() uses useInfiniteQuery
    queryKey: ["ai-messages", user?.id]
    getNextPageParam: (lastPage) => lastPage?.next_cursor ?? undefined
    initialPageParam: undefined
  → Messages flattened from pages:
    data?.pages?.flatMap((page) => [...page.messages].reverse()).reverse()
  → useAIStore provides optimistic messages (not yet in history)
  → AIAssistant merges via historyIds Set to avoid duplicates
  → AIMessageList renders merged messages

Scroll-triggered pagination:
  → IntersectionObserver on topSentinelRef inside scroll container
  → On scroll: userHasScrolledUp ref tracks direction
  → When sentinel intersects AND userHasScrolledUp AND hasNextPage:
    prevScrollHeight recorded, fetchNextPage() called
  → on pageCount change: scrollTop adjusted by diff to maintain position
  → Loading spinner shown during isFetchingNextPage

Message rendering:
  → normalizeLatex converts \[...\] and $$...$$ to single $ for KaTeX
  → ReactMarkdown with remark-gfm, remark-math, rehype-katex, rehype-highlight, rehype-raw
  → DocumentCard embedded for user messages with document_id
```

### AI Chat — Send Flow
```
User types message + optional document
  → useAIStore.sendMessage(): creates optimistic user message with tempId (crypto.randomUUID())
  → POST /ai/chat via aiApi (Axios, token-intercepted)
  → Assistant response appended to Zustand store
  → On success: conversationId stored for subsequent messages
  → On error: fallback error message appended to store for ux and not sent to the backend for persistence 
  → QueryClient.invalidateQueries(["student_dashboard_stats"]) on send
```

### Document Upload — PDF Pipeline & Status Polling
```
PDF file selected in AIInput
  → uploadDocument(): supabase.storage.from("documents").upload(filePath, file)
  → supabase.storage.getPublicUrl(filePath) → publicUrl
  → useUploadDocument mutation: POST /documents {file_name, file_url} to backend
  → On success: pendingFile.status = "uploaded", documentId stored

Status polling:
  → useGetDocumentStatus(documentId, enabled=!!documentId)
    refetchInterval: (query) =>
      query.state.data?.status === DocumentStatus.processing ? 2000 : false
  → Self-stopping poll: 2s intervals while processing, stops when ready/failed
  → AIInput renders per-state UI:
    uploading → "Uploading..." / spinner
    processing → "Processing..." / spinner
    ready → "Ready to send" (send enabled)
    failed → "Processing failed" (send disabled)

Query invalidation on upload success:
  → qc.invalidateQueries({ queryKey: ["conversation-documents", conversationId] })
```

### Session Lifecycle
```
Student books tutor → SessionBookingPage → SessionConfirmed
  → useSession hooks (useGetSession, useStartSession, useEndSession, useCancelSession, useDeclineSession)
  → SessionDetails page shows status-aware actions
```

## API / Data Layer

The frontend communicates with two backends:

1. **Supabase** — authentication, object file storage
2. **REST API** (`VITE_BASE_URL`) — business logic endpoints via Axios

**Axios clients**: Multiple Axios clients isolate API concerns while sharing a consistent request-interceptor pattern that attaches the current Supabase access token.

**TanStack Query** manages:
- Server-state caching (`useQuery`, `useMutation`, `useInfiniteQuery`)
- Cursor-based pagination (`useInfiniteQuery` with `getNextPageParam` extracting `next_cursor`)
- Dynamic `refetchInterval` in `useGetDocumentStatus`: `2000ms` when processing, `false` otherwise
- Stale times (1h for user data, 5m for AI messages)
- Garbage collection times (24h)
- Retry logic (never retry 401s, retry 2× for network failures)
- Query invalidation on mutations (documents, dashboard stats)

**Form validation** uses Formik + Yup schemas in `src/shared/lib/validation/`.

## Authentication

- **Provider**: Supabase Auth (`@supabase/supabase-js`) — issues JWTs with `app_metadata` claims
- **Methods**: Email/password sign-in and sign-up, Google OAuth
- **Session persistence**: Zustand store initialized from `supabase.auth.getSession()` on app load, kept in sync via `supabase.auth.onAuthStateChange()` subscription
- **Token attachment**: Axios interceptors read `accessToken` from Zustand and inject `Authorization: Bearer <token>`
- **Route protection**: `ProtectedRoute` reads `session.user.app_metadata` (JWT claims) for `role` and `onboarding_complete`; redirects to `/login` if unauthenticated, to `/${role}/dashboard` if wrong role, to `/tutor/onboarding` if incomplete
- **Hydration gate**: `ProtectedRoute` returns `null` while `initialized === false` to prevent flash-of-unauthenticated-content
- **Logout**: Calls `supabase.auth.signOut()`, clears Zustand state, empties QueryClient cache

## State Management

```
Server State (TanStack Query)
├── User profile & session data (useGetMe, useGetProfile)
├── AI message history (useGetAiMessages — cursor-based infinite pagination)
├── Document status polling (useGetDocumentStatus — dynamic refetchInterval)
├── Session operations (useSession hooks)
└── User sync (useSyncUser)

Client / UI State (Zustand)
├── Auth session (useAuthStore — user, session, accessToken, status, initialized)
├── AI messages (useAIStore — optimistic message list, conversationId, loading)
└── File upload pending state (AIInput local state)
```

## UI Engineering

- **Design tokens**: CSS custom properties (`--bg`, `--bg2`, `--bg3`, `--text`, `--text2`, `--text3`, `--accent`, `--accent2`, `--border`, etc.) defined in `globals.css`
- **Layout system**: `AppShell` composes `Navbar`, `Sidebar`, `Outlet`, and `BottomNav` based on role; AI page uses a full-screen flex layout without sidebar
- **Component hierarchy**: `src/shared/components/ui/` (Avatar, FieldError, Stars, AuthLoader, DropDown) and `src/shared/components/layout/` (Navbar, Sidebar, AppShell, BottomNav, AvatarMenu)
- **Responsive**: Mobile drawer in Navbar, responsive sidebar/padding, `md:`/`lg:` breakpoints
- **Form handling**: Formik for form state + Yup for validation schemas (login, signup, booking)
- **Markdown/LaTeX rendering**: `react-markdown` with `remark-gfm`, `remark-math`, `rehype-katex`, `rehype-highlight`, `rehype-raw` for AI message rendering
- **Loading/error states**: Skeleton spinners, disabled states, inline error messages, processing status indicators

## Performance

- **Cursor-based pagination**: `useInfiniteQuery` with `getNextPageParam` avoids loading entire message history; `IntersectionObserver` triggers fetch only when user scrolls up
- **Dynamic polling**: `useGetDocumentStatus` self-stops polling when document is no longer processing (2s interval → `false`), avoiding unnecessary requests
- **Query caching**: TanStack Query `staleTime` and `gcTime` tuned per data type; `refetchOnWindowFocus` disabled for auth queries
- **Optimistic updates**: AI messages appear before API confirmation via Zustand, avoiding loading spinners for user actions
- **Render efficiency**: Zustand selectors subscribe components to only the state slices they need

## Setup

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Type checking
npm run typecheck

# Production build
npm run build

# Preview production build
npm run preview
```

**Environment variables** (`.env`):

```
VITE_BASE_URL=<backend-url>
VITE_SUPABASE_URL=<supabase-project-url>
VITE_SUPABASE_ANON_KEY=<supabase-anon-key>
```

## Testing

No tests are present in the repository. No test framework configuration exists (`vitest.config`, `jest.config`, or `__tests__` directory are all absent).

## Limitations

- **No test coverage** — the absence of tests means no regression safety net.
- **No CI pipeline** — no GitHub Actions or other automated checks configured.
- **No TypeScript checking in dev** — `tsc --noEmit` is available but not integrated into the dev loop.
<!-- - **Chat feature** (`src/features/chat`) uses local mock data (`THREAD_MESSAGES`, `AUTO_REPLIES`) with `setTimeout`-based auto-replies rather than a live API — it is not a real-time chat implementation. -->

## License

MIT
