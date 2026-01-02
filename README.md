# DevSphere Web Client (Frontend)

The DevSphere frontend is a React + TypeScript SPA built with Vite and TailwindCSS. It delivers responsive student workflows—authentication, profile management, quiz taking, and AI feedback—while adhering to the RAD/agile criteria from the coursework brief.

## 1. Product Overview

- **Audience**: learners preparing for programming interviews and instructors authoring content.
- **Features**: authentication, OTP-based password recovery, profile editing, protected author screens, quiz catalogue with AI-generated questions, and Lucide-powered UI micro-interactions.
- **Advanced capability**: quiz screens call the backend Hugging Face integration for adaptive question sets (see [src/pages/QuizPage.tsx](src/pages/QuizPage.tsx)).

## 2. Tech Stack

- React 19 with functional components & hooks.
- TypeScript strict mode for safer UI logic.
- Vite dev server for hot-module replacement.
- TailwindCSS + custom CSS in [src/App.css](src/App.css) and [src/index.css](src/index.css).
- React Router v7 for nested routes and lazy loading defined in [src/routes/index.tsx](src/routes/index.tsx).
- Axios-based data layer with interceptors in [src/services/api.ts](src/services/api.ts).
- Lucide icon set for consistent visuals.

## 3. Architecture & State Management

- **Routing shell**: `Layout` component gates protected routes while `RequireAuth` handles role checks.
- **Auth context**: [src/context/authContext.tsx](src/context/authContext.tsx) caches `accessToken`/`refreshToken` flows until Redux Toolkit is introduced. Ticket `FE-STATE-01` will migrate this context into Redux to meet the global state requirement.
- **Services layer**: [src/services/auth.ts](src/services/auth.ts), [src/services/quiz.ts](src/services/quiz.ts), and [src/services/post.ts](src/services/post.ts) encapsulate REST calls and shared types.
- **Pages**: All user flows (Login, Register, Forgot/Reset Password, MyPost, Quiz variations) live under [src/pages](src/pages) and are code-split via `React.lazy`.

## 4. Folder Snapshot

```
src/
  components/     # Layout, Header, reusable buttons/input patterns
  context/        # Auth provider (temporary until Redux Toolkit migration)
  pages/          # Screen-level React components per flow
  routes/         # Router + RequireAuth
  services/       # Axios instance, auth/post/quiz clients
  assets/         # Static imagery & illustrations
   App.tsx         # Hydrates AuthProvider + Router
```

## 5. Environment Variables

Create `.env` or `.env.local`:

```
VITE_API_URL=https://devsphere-api.onrender.com/api/v1
```

This value feeds the Axios base URL in [src/services/api.ts](src/services/api.ts). Local development defaults to `http://localhost:5000/api/v1` when the variable is absent.

## 6. Getting Started

1. Install dependencies
   ```bash
   npm install
   ```
2. Run the dev server (http://localhost:5173)
   ```bash
   npm run dev
   ```
3. Build for production
   ```bash
   npm run build
   ```
4. Preview the production bundle locally
   ```bash
   npm run preview
   ```

## 7. User Flows

- **Authentication**: Login/Register/Forgot/Reset screens consume `/api/v1/auth/*` endpoints with optimistic UI states and loading indicators.
- **Password recovery**: OTP entry + verification sequence aligns with backend OTP hashing logic.
- **Profile editing**: `/profile` reads/writes through `updateMyDetails` to support email/name/password edits.
- **Quiz experiences**: Dedicated routes for Java, Python, TypeScript, JavaScript, HTML, CSS, C#, and Go. Each uses the shared `QuizPage` wrapper that calls `fetchOneQuestion`, paginates 20 questions, and uses `scoreQuiz` for summaries.
- **Protected authoring**: `/my-post` nests inside `RequireAuth` with `roles={['ADMIN','AUTHOR']}` ensuring RBAC parity with the backend middleware.

## 8. UI/UX Guidelines

- Tailwind utility classes keep spacing/typography consistent and mobile-first.
- Loading states and skeletons exist for initial data fetches (`RequireAuth` spinner, quiz loader, etc.).
- Lucide icons (Arrow, Check Circle, Trophy) reinforce quiz feedback.
- Accessibility: semantic headings, focusable buttons, color contrast (#6d28d9 primary accent) pass WCAG AA.

## 9. Deployment (Vercel / Netlify)

1. Fork/clone the GitHub repo and connect it to your hosting provider.
2. Set `VITE_API_URL` in the project environment variables.
3. Configure build command `npm run build` and output directory `dist`.
4. Enable automatic redeployments on pushes to `main` / `release`.
5. Update the root README with the deployed URL so assessors can verify the live client.

## 10. Coursework Requirement Alignment

| Requirement                 | Status     | Notes                                                                       |
| --------------------------- | ---------- | --------------------------------------------------------------------------- |
| React + TypeScript frontend | ✅         | Functional components/hooks across pages                                    |
| TailwindCSS responsive UI   | ✅         | Layout + quiz UI rely on Tailwind utility classes                           |
| Redux for global state      | 🔄 Planned | AuthContext bridges the gap; Redux Toolkit migration tracked as FE-STATE-01 |
| Advanced feature            | ✅         | AI-driven quizzes consume `/api/v1/ai/*`                                    |
| Security (JWT handling)     | ✅         | Axios interceptor refreshes tokens + guards protected routes                |
| Documentation               | ✅         | This README plus backend README satisfy submission requirements             |
| Deployment readiness        | ✅         | Vercel/Netlify steps documented                                             |

## 11. Testing & QA Ideas

- Component-level tests with Vitest + React Testing Library for auth and quiz logic.
- Cypress happy-path regression script (login → quiz → logout) before each submission.
- Visual regression snapshots for key breakpoints (mobile/tablet/desktop).

## 12. Links

- Backend instructions: [../devsphere_be/README.md](../devsphere_be/README.md)
- Design inspiration + mood board: add screenshots/GIFs before final submission.
