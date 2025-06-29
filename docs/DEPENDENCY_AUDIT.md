# Project Dependencies Audit for

## 1. Security Check

The project was scanned for known vulnerabilities using the command:

```
npm audit
```

**Result:** No vulnerabilities were found.

An attempt to automatically fix potential vulnerabilities was performed with:

```
npm audit fix
```

This resulted in the removal of 3 deprecated packages and the update of 1 dependency.

To maintain continuous monitoring of vulnerabilities, GitHub Dependabot has been enabled by adding the file `.github/dependabot.yml`. Dependabot will check all npm ecosystem dependencies weekly for updates and security issues.

---

## 2. Verification of package.json and package-lock.json

- All main libraries are updated to current stable versions.
- The latest Git diff shows only a minor update to the internal dependency `brace-expansion` (from 2.0.1 to 2.0.2), which does not affect application functionality.
- The lock file (`package-lock.json`) is committed to the Git repository to ensure precise version locking and to prevent dependency drift.

---

## 3. Packages Used in the Project

The project uses only well-known and actively maintained open-source libraries, including:

- **Framework:** React 19
- **State Management:** Redux Toolkit, React Query
- **Forms and Validation:** Formik, Yup
- **UI:** Radix UI, TailwindCSS, framer-motion, lucide-react
- **Others:** axios, lodash.debounce, qs, wavesurfer.js, react-router-dom

Most of these libraries are community-supported and regularly updated. None of them had known zero-day vulnerabilities at the time of the audit.

---

## 4. Planned Replacement of the `qs` Package

The `qs` package is currently used for query string building. It remains safe and supported; however, there is a plan to:

- Compare it with alternatives such as the built-in `URLSearchParams` API or the `query-string` library.
- Evaluate whether the alternatives meet requirements for security, performance, and developer convenience.
- If advantages are found, gradually replace `qs` with thorough regression testing.
- The replacement will be done after analyzing compatibility with the current codebase.

---

## Conclusions

- All dependencies have been audited for vulnerabilities.
- Automatic update and vulnerability monitoring is implemented via Dependabot.
- All used libraries are well-maintained and free from known vulnerabilities.
- Migration from `qs` to a modern alternative is planned following a comparative audit.
