# Building Setup and Optimization

## Key optimizations

1. **Bundle Analysis**

   - The build uses `rollup-plugin-visualizer` to analyze chunk sizes and dependencies.
   - To visualize the bundle, run:  
     `npm run build`  
     The visualizer opens a detailed treemap of the final JS bundles, helping spot heavy dependencies and opportunities for code splitting.

2. **Code Splitting & Lazy Loading**

   - Large or rarely used components (modals, audio waveform visualizer) are loaded with `React.lazy` and dynamic imports.
   - This ensures that initial bundle size stays small and the app loads faster for users.

3. **Tree Shaking**

   - Tree shaking is enabled by default via Vite and ESModules. Only the code actually used gets included in the final bundle.

4. **Source Maps**

   - Source maps are generated for local debugging (`build.sourcemap: 'hidden'` in `vite.config`).
   - Before deployment, all `.map` files are automatically deleted (see the `clean:maps` npm script), so no source maps are exposed in production.

5. **Environment Variables**

   - All critical API URLs are kept in the `.env` file for clarity and safe separation between environments.
   - Example:
     ```
     VITE_API_BASE_URL=http://localhost:8000/api/
     VITE_WS_URL=ws://localhost:8000/ws
     ```
   - The `.env` file is listed in `.gitignore` and is **never committed** to the repository.

6. **Clean Imports and Structure**

   - The codebase uses absolute imports (via `@/`) and well-structured folders.
   - Unused dependencies and files are regularly checked using tools like `depcheck` and `unimported`.

## Result

- Core app logic is small (~28kb after tree-shaking).
- Most bundle weight comes from major libraries (React, Radix UI, TanStack Query, Formik).
- Lazy loading and code splitting keep initial load fast, even with large feature components.
- The build is production-grade, debuggable in dev, and secure for deploy.
