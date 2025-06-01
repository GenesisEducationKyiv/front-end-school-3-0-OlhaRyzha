# ADR 1: Introducing Layered Architecture to Improve Maintainability in the Track Manager Project

---

## Context

In the current codebase, data fetching, business logic, and state management are often colocated with UI components.  
This creates challenges with code readability, testability, and long-term maintainability:

- Difficult to adapt to API or business logic changes.
- Hard to reuse and test logic independently from UI.
- No clear boundary between data access, logic, and UI — violating the Separation of Concerns principle.

---

## Decision

Introduce a layered architecture to clearly separate concerns and responsibilities.

### Layers Overview

**UI Layer (`components/`, `pages/`):**

- Renders views and handles user interaction.
- No business logic or API calls here.
- Example: `TrackTable.tsx`, `AudioUploadModal.tsx`

**Logic Layer (`store/`, `hooks/`, business helpers):**

- Contains all business rules, state management, and data transformation logic.
- Includes:
  - **Redux slices**: for UI state, cross-component state, caching query params, etc. (e.g., `tableSlice.ts`, `cacheSlice.ts`)
  - **React Query hooks**: for server data fetching, caching, and mutation (e.g., `useTracksQuery.ts`)
  - Data transformation, validation helpers.

**Data Access Layer (`services/api/`):**

- Low-level API interaction (Axios/Fetch) and endpoint wrappers.
- No business logic here — just data transport.
- Example: `BaseService.ts`, `trackService.ts`, `genresService.ts`

---

## Layer Interaction Schema

[UI Layer] → [Logic Layer] → [Data Access Layer]

- UI Components interact only with the Logic Layer (via hooks/selectors).
- Logic Layer handles all business rules and delegates API calls to the Data Access Layer.
- Data Access Layer communicates with the backend.

---

## How to Decide Where Code Goes?

- If it’s API transport or HTTP logic: → Data Access Layer
- If it’s state, business logic, or data transformation: → Logic Layer
- If it’s rendering or UI behavior: → UI Layer

| Example use-case              | Layer       | File Example                    |
| ----------------------------- | ----------- | ------------------------------- |
| Fetching tracks from API      | Data Access | `services/api/trackService.ts`  |
| Caching query params          | Logic       | `store/slices/cacheSlice.ts`    |
| Server data fetching/mutation | Logic       | `store/hooks/useTracksQuery.ts` |
| Rendering table of tracks     | UI          | `components/TrackTable.tsx`     |

---

## Redux vs React Query: When to Use Which?

- **React Query**
  - For _server state_ (entities, lists, data from backend).
  - Use for all API data fetching, caching, and mutations.
  - E.g., track list, genres, updating/deleting tracks.
- **Redux**
  - For _client state_ (UI state, toggles, selection, cached query params).
  - Use for cross-component UI flags, bulk select, persisted UI preferences.
  - E.g., selected mode, cached filter params, open modals, etc.

---

## Migration Strategy

- **Step-by-step migration:**
  - All new components and features must use the new layered structure.
  - Legacy (existing) components remain as-is until refactored.
  - Whenever a legacy component is updated or rewritten, logic and API code must be moved out of UI and into the relevant layer.

---

## Concrete Example from Each Layer

- **UI:**  
  `components/TrackTable.tsx` — renders the table, delegates to logic hooks, does not fetch data itself.
- **Logic:**  
  `store/hooks/useTracksQuery.ts` — uses React Query to fetch and cache tracks.  
  `store/slices/cacheSlice.ts` — Redux slice to cache table params.
- **Data Access:**  
  `services/api/trackService.ts` — wrapper around API endpoints for tracks, no business logic.

---

## Typical Layer Flow

1. **UI Layer** (e.g., `TrackTable.tsx`)

   - User interacts (e.g., clicks “Delete track”).
   - Calls a logic hook (e.g., `useDeleteTrack()`).

2. **Logic Layer** (e.g., `useTracksQuery.ts`)

   - Runs business validation.
   - Calls API method (e.g., `trackService.delete()`).

3. **Data Access Layer** (e.g., `trackService.ts`)
   - Performs HTTP request to backend.

---

## Implementation Guide

- Write API code only in `services/api` (Data Access).
- All business logic, caching, and transformation should be in `store/` or hooks.
- Components must be as “dumb” as possible, receiving all state/data/actions from hooks.

---

## Status

**Planned / In Progress** — All new code uses this structure. Refactoring of legacy code will be gradual.

---

## Consequences

**Positive:**

- Improved maintainability, readability, and testability.
- Easier onboarding for new developers.
- Clear separation of concerns, less risk of side effects in UI.

**Negative:**

- Initial refactoring effort for existing code.
- May temporarily increase code churn until full migration is done.
