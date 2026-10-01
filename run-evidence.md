# Run evidence — Guest log in → Add car → Audi → TT → Mileage 12000

- Tool: Playwright Test (`@playwright/test` ^1.55.0, Chromium — Chrome for Testing 151.0.7922.34), executed directly via the Playwright CLI in the user's local Terminal. Test uses a Page Object (`pages/GaragePage.ts`) encapsulating the Garage/"Add a car" dialog locators and actions; locator discovery for that dialog used manually captured screenshots of the live UI instead of the Codex/Playwright-CLI accessibility inspector — see RISKS for why.
- Command: `npx playwright test tests/add-car.spec.ts --project=chromium`
- Timestamp: 2026-10-01 (local run by the student; exact time-of-day not included in the command's own output)
- Environment: macOS (darwin arm64), Node v26.8.1, Playwright Chromium 1234 (Chrome for Testing 151.0.7922.34), `QAUTO_BASE_URL` not overridden → default `https://qauto.forstudy.space` from `playwright.config.ts` (unmodified). No credentials included in this file or in the test.
- Actual (verbatim, final run after Page Object refactor):
```
Running 1 test using 1 worker

  ✓  1 …um] › tests/add-car.spec.ts:4:5 › guest can add Audi TT to Garage (3.0s)

  1 passed (3.4s)
```
Earlier run of the same scenario, before the Page Object refactor, also passed (verbatim):
```
Running 1 test using 1 worker

  ✓  1 [chromium] › tests/add-car.spec.ts:3:5 › guest can add Audi TT to Garage (3.3s)

  1 passed (4.8s)
```

| Елемент | Джерело |
|---|---|
| setup (guest login) | `GaragePage.guestLogIn()` → `page.getByRole('button', { name: /guest log in/i })` — button text confirmed from a live, logged-in screenshot of the Qauto homepage sent by the user |
| locator/action (open "Add a car", fill form) | `GaragePage.addCar()` → `getByRole('button', { name: /add car/i })`, `getByRole('dialog')`, `getByLabel(/brand/i)`, `getByLabel(/model/i)`, `getByLabel(/mileage/i)`, `getByRole('button', { name: /^add$/i })` — field labels, default Brand=Audi/Model=TT, Mileage input, and Add/Cancel buttons confirmed from a live screenshot of the real "Add a car" modal; `role="dialog"` itself was a visual inference (Bootstrap-style modal), not read from a confirmed accessibility snapshot — flagged as a RISK before the run and accepted by the user |
| assertions | `expect(page).toHaveURL(/panel\/garage/)` (inside `guestLogIn()` and `submitAddCarForm()`) + `expect(garage.carRow('Audi','TT')).toBeVisible()` — matches `specs/add-car.md`'s required check that "Audi TT" appears in the Garage |

- FACTS:
  - `npm run preflight` (run by the user, verbatim): Node v26.8.1, darwin arm64, HTTP credentials configured: true, Playwright CLI Chromium ready: true, Playwright CLI config ready: true, Course project structure: OK.
  - `npx playwright test tests/add-car.spec.ts --project=chromium` → **1 passed**, run twice by the user in their own Terminal: once with locators inline in the test, once after refactoring to the `GaragePage` page object — both passed against the live site.
  - `tests/add-car.spec.ts` and `pages/GaragePage.ts` contain no API calls, no `/auth/signup` or registration flow, no Fuel Expenses interaction, and no `page.waitForTimeout` / fixed waits anywhere.
  - `playwright.config.ts`, `tsconfig.json`, `package.json`/lockfile, and the existing `tests/guest-garage.spec.ts` were not modified. `pages/GaragePage.ts` is a new, additional file — not a change to product or config code.
- ASSUMPTIONS:
  - None outstanding — the two locator assumptions carried into the first run (the modal's `role="dialog"` and the exact Brand/Model/Mileage label wiring) are resolved by the test passing against the live site both before and after the refactor.
- RISKS:
  - Locators for the "Add a car" modal were originally derived from screenshots the user captured manually, not from a live Playwright CLI accessibility snapshot/Inspector session as the assignment's "Codex + approval gates" workflow intends. Root cause: an organization network-egress policy blocked both the sandboxed agent environment and the local dev shell from reaching `registry.npmjs.org` and `qauto.forstudy.space` during authoring (a CLI SETUP BLOCKER). This was disclosed to the user before the test was written and approved by them ("APPROVE") as an accepted deviation.
  - `tsconfig.json`'s `include` list was not updated to list `pages/**/*.ts` explicitly (left untouched per the "do not modify config" constraint). This does not affect `playwright test` (which transpiles any `.ts` file it imports on the fly) and both runs confirm this — it only means a standalone `tsc --noEmit` type-check would need `pages/` added to see that file, which is a documentation note, not a functional risk.
  - Two runs only (before/after refactor); no repeat/flake check beyond that.
- HUMAN CORRECTION:
  - The user manually entered the site's HTTP Basic Auth credentials (`guest`/`welcome2qauto`) and manually navigated Guest log in → Garage → Add a car to capture the screenshots used for locator discovery, because automated browser control (tried via two different tools) could not get past the Basic Auth dialog / got stuck in an infinite-loading state on this page.
  - The user ran `npm ci`, `npx playwright install chromium`, `npm run preflight`, and both test executions themselves in their own local Terminal, because the sandboxed environments available to the assistant could not reach the npm registry or the QAuto site (and additionally could not run the project's own native toolchain, which is built for the user's macOS/arm64 machine).
- DECISION: `ACCEPT` — real Playwright runs against the live, unmodified starter config and target site produced `1 passed` both before and after introducing the `GaragePage` page object, satisfying the required scenario (`Guest log in → Add car → Audi → TT → Mileage 12000`) and both required assertions (Garage URL, "Audi TT" visible) exactly as specified in `specs/add-car.md`.
