# ADR 1: Introducing Layered Architecture to Improve Maintainability in the Track Manager Project

---

## Context

While evaluating how well the current architecture of the Track Manager project supports long-term maintainability, readability, testability, and scalability, I identified that business logic, API calls, and state management are often placed directly within UI components or pages.

This creates several challenges:

- Adapting to API or business logic changes becomes more difficult;
- Logic is hard to reuse across different parts of the application;
- Unit testing logic in isolation from UI is problematic;

Additionally, the lack of clear boundaries between data access, logic, and UI layers violates the principle of Separation of Concerns.

---

## Decision

I decided to introduce a layered architectural approach to separate the logic of the application into three distinct layers, while preserving the horizontal folder structure of the project.

### 1. Data Access Layer (`services/api/`)

- Responsible for low-level API calls (via Axios).
- This layer is already implemented in the project and remains unchanged.

### 2. Logic Layer (`store/`, `store/hooks/`)

- Contains React Query hooks, Redux slices, and data transformation logic.
- Examples: `useTracksQuery.ts`, `cacheSlice.ts`

### 3. UI Layer (`components/`, `pages/`)

- Responsible only for rendering and UI behavior.
- Examples: `TrackTable.tsx`, `AudioUploadModal.tsx`

---

## Rationale

This decision is based on the principles of:

- Separation of Concerns
- Single Responsibility Principle
- Composability of React hooks

### Key Benefits:

- UI components will become simpler and more focused;
- Logic will be centralized and reusable;
- Easier unit testing of business logic;
- Better long-term maintainability.

### Rejected Alternatives:

- Keeping all logic inside UI components or pages (anti-pattern).

---

## Status

**Accepted** – Changes are being progressively implemented in key parts of the project including modals, tables, and forms.

---

## Consequences

### Positive:

- Easier to understand and maintain the codebase;
- Improved testability of logic;
- Better scalability;
- Alignment with modern frontend architectural best practices.

### Negative:

- Initial time investment required to refactor and separate concerns.
