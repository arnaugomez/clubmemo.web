# Effect v4 migration research and implementation plan

Prepared before application changes, 2026-09-18. This document records the intended rewrite; completion and verification must be recorded separately, not inferred from this plan.

## Research and baseline

Clubmemo contains 604 TypeScript/TSX files under src, 39 domain use-case files, 14 MongoDB repositories, and 44 schema files. It is a Next.js 16 App Router application with React 19, React Hook Form, Zod 3, Lucia authentication, MongoDB Atlas Search, S3 uploads, Resend email, OpenAI generation, and ts-fsrs scheduling. There is no existing Effect dependency. Constructor-injected classes are assembled through individual locator functions; workflows use async/await, thrown errors, and Promise.all. The browser practice queue implements retries through React state and timers.

Sources reviewed:

- [Effect v4 RC announcement](https://effect.website/blog/releases/effect/40-rc)
- [Official repository and requirements](https://github.com/Effect-TS/effect)
- [Official agent guidance and capability index](https://github.com/Effect-TS/effect/blob/main/LLMS.md)
- [v4 migration guide](https://github.com/Effect-TS/effect/blob/main/MIGRATION.md)
- [v4 services and dependency injection](https://github.com/Effect-TS/effect/blob/main/migration/services.md)
- [Schema reference](https://github.com/Effect-TS/effect/blob/main/packages/effect/SCHEMA.md)
- [ManagedRuntime integration example](https://github.com/Effect-TS/effect/blob/main/ai-docs/src/04_integration/10_managed-runtime.ts)
- [Effect testing example](https://github.com/Effect-TS/effect/blob/main/ai-docs/src/09_testing/10_effect-tests.ts)

npm reports effect@rc as 4.0.0-rc.115. Pin the actual version, rather than a moving dist-tag. Use matching versions for any Effect integration packages. v4 uses Context.Service, explicit Layers, Effect.fn, and the new Schema API; v3 tutorials are not an implementation reference. TypeScript must be at least 5.9.

## Application-wide opportunities

| Area | Current behavior and compatibility constraints | Effect rewrite |
| --- | --- | --- |
| Composition | Per-class locators and global singleton clients | Context.Service contracts, explicit Layer composition, ManagedRuntime at framework boundaries, scoped resource finalizers. Never cache request cookies or identity in singleton services. |
| Authentication | Signup, login/logout, session validation, email verification, password changes/reset, account deletion; Lucia cookies and Argon2 pepper | Effect.fn workflows with injected authentication, cookie, IP, email, profile, token and rate-limit services. Yield tagged domain failures. Keep cookie names, session invalidation, limits, sequencing, and redirects. |
| Permissions | Owner/editor/viewer permissions and private profile guards | Typed authorization failures and composable service dependencies. Preserve every existing permission check before reads/writes. |
| Courses | Create/edit/delete/copy, enroll/unenroll, favorites, study configuration, recommendations | Effect workflows compose repositories and authorization. Effect.all for existing independent parallel work; sequential effects for dependent writes. No blanket retries of mutations. |
| Notes | Create/update/delete, HTML sanitization, JSON/CSV/Anki import and export | Schema decoding at import boundaries; typed parse errors, effectful file reads, repository effects, existing sanitization and serialization. Preserve file formats and content. |
| Practice | FSRS scheduling, new/due cards, daily limits, review logs, provisional card IDs | Schema-backed card/review/configuration data; Clock/DateTime for testable time; service workflows for persistence and permission checks. Preserve FSRS parameters and Europe/Madrid calendar semantics. |
| Browser queue | FIFO writes, error callbacks, one-second retry, pending status | Scoped worker, Queue, Schedule and cancellation; preserve ordering, retry notifications, and provisional-ID reconciliation. Never leave workers alive after unmount. |
| Profiles | Read/edit public and private profiles, handles, interests and pictures | Schema-backed models, typed duplicate-handle failures, injected repositories and upload dependencies. |
| Discovery | Atlas autocomplete, fuzzy search, searchSequenceToken pagination | Effect repository programs around driver operations, retaining the Atlas aggregation stages and opaque pagination tokens. Local MongoDB alone cannot verify this feature. |
| Administration | Dynamic resource schemas, uniqueness hooks, password hashing, joins and tags | Effect Schema fields, effectful hooks, authorization service, explicit database errors. Preserve dynamic form structure, labels and validation. |
| Rate limits | Daily counters and Madrid day boundaries | Effect service with testable time and tagged limit failure; retain current key naming and accounting points. |
| Uploads | Presigned S3 POST, browser upload, reference tracking, stale-file cron deletion | Scoped SDK client and typed storage errors; Effect HTTP client for browser requests where suitable; cancellation and controlled concurrency. Preserve multipart fields, ACL, limits, expiry and public URL format. |
| AI | gpt-4o-mini, structured flashcards, fake provider, refusal/rate-limit handling | Effect service with Schema-decoded structured output and tagged provider failures; live/test Layers. Keep prompts, model, output format, and rate accounting. |
| Email | Verification and reset templates; live or console provider | Effect service Layers with typed delivery failures. Keep templates, subjects and URLs exactly. |
| Forms | Shared Zod schemas and Spanish error map on client and server | Effect Schema as source of truth, React Hook Form resolver and action error translation. Preserve constraints, trimming, empty/null handling, field paths, Spanish messages, and form response shape. |
| Domain data | Interface-plus-class data models, getters and defaults | Schema-backed models/codecs, retaining getters and plain serializable data at Next.js boundaries. Use Option/Result where they clarify internal absence/failure without altering serialized contracts. |
| Configuration | Untyped process.env assertions and construction-time reads | Config with validation, Redacted secrets, lazy acquisition for optional services and test configuration Layers. Avoid requiring unrelated external credentials to render public pages. |
| Errors/telemetry | instanceof chains, Sentry capture, error responses | Tagged errors and catchTag/catchTags, preserved error-to-UI mapping, named Effect.fn spans and existing Sentry integration. Defects remain distinguishable from expected business failures. |
| Testing | Model/unit tests plus a few database tests; browser tests cover landing/signup and Playwright's own website | Deterministic service-layer tests, error and sequencing tests, schema parity tests, integration tests and comprehensive Playwright journeys against isolated infrastructure. |

## Scope decisions

Keep React/Next.js, Radix, Tiptap, HTML, CSS, visible strings, layout, navigation, and FSRS. Pure render functions and static configuration should remain straightforward; wrapping JSX in Effect has no benefit. The goal is complete migration of application behavior, dependencies, validation and data boundaries, with Promises restricted to framework/SDK interoperability. SDK calls may legitimately use Effect.tryPromise; entire existing async workflows must not simply be enclosed in it.

Effect offers Stream, RequestResolver, caching, PubSub, HTTP APIs/RPC, SQL, durable workflows, cluster, CLI and AI modules. Use these only when they fit existing behavior. Replacing MongoDB with SQL, Next server actions with RPC, or adding a durable workflow engine would change deployment and persistence semantics without solving an existing requirement. Compose current request workflows with Effect; introduce durable execution only with an explicit storage/recovery design. Avoid caching user-sensitive reads or retrying non-idempotent operations.

## Verification plan

1. Capture baseline type-check/unit results and UI markup before migration.
2. Preserve JSX, styles, visible copy and assets; mechanically compare render trees where practical and run browser assertions/screenshots.
3. Test Schema acceptance/rejection, coercion, defaults, nested paths, and Spanish error text.
4. Test services with replacement Layers: missing session, access denied, duplicates, expired tokens, rate limits, upstream failures, write ordering, cancellation and resource disposal.
5. Run existing model/collection tests and isolated MongoDB integration tests.
6. Playwright journeys: public pages and navigation; signup/verify/login/logout; forgot/reset/change password; profile/privacy; course create/edit/copy/delete; enroll/favorite/configure/unenroll; notes CRUD and each import/export format; practice completion and retry; AI preview/confirm; upload; discovery pagination; admin authorization/CRUD; account deletion.
7. Run type checking, lint/format, production build, unit/integration tests and browser tests. Report any unverified external path explicitly.
8. Create a PR targeting dev with implementation summary, verification evidence, and outstanding limitations.

## Initial environment findings (before test credentials were supplied)

Only .env.development.local is present. Do not disclose or copy its secrets into reports. Existing integration tests delete collections in named test databases; browser signup tests mutate users. A dedicated .env.test.local has been requested. Complete discovery verification requires MongoDB Atlas Search with the courses index in docs/mongodb-atlas-search-indexes/courses.json. Upload verification requires an isolated S3 bucket/credentials. Email and AI fakes can cover deterministic workflows, with live transport tests separately identified. Dependency installation initially encountered sandbox network restrictions and succeeded in downloading packages after escalation; build-script policy needs explicit configuration before tooling is ready.

## Implemented architecture

The migration uses pinned `effect@4.0.0-rc.115` and TypeScript 5.9.3. The research above preceded the implementation; the following describes the resulting code.

- All 39 use-case files now compose lazy, named Effect programs. Context services and 62 explicit Layer modules replace service locators and singleton helpers. Repository calls, authorization, rate accounting, dependent mutations and parallel independent reads are yielded individually.
- `src/common/effect/server-runtime.ts` composes application dependencies once per runtime. Request identity and cookies are read per operation. Next adapters run programs at the boundary and preserve Next's redirect, not-found and dynamic-render control exceptions, including exceptions carried as SDK error causes. Hot replacement disposes the previous runtime.
- Repository/service contracts expose specific error unions. Use-case errors are inferred from their dependencies and tagged failures; there is no application-wide catch-all error union. External failures carry an operation and cause. Expected domain failures retain their existing Spanish form/toast responses.
- Effect Schema replaces all source Zod usage, including dynamic admin forms, action inputs, import/AI decoding and persistent domain models. Schema classes preserve the existing getters and plain `.data` serialization. Legacy missing/null optional Mongo fields remain accepted. A shared React Hook Form resolver retains Spanish messages and nested field paths.
- MongoDB and S3 resources are scoped Layers. SDK calls remain narrow interoperability boundaries. Stale upload traversal uses a scoped cursor and Stream; PDF extraction acquires and releases the loading task in a scope, including failure/interruption. Optional OpenAI acquisition is lazy.
- Browser upload workflows compose presigning and an injected upload service. Practice persistence uses a FIFO Queue, one-second Schedule retries, interruption on unmount, and the original provisional-card ID reconciliation. Clock/DateTime now drive authentication expiry, timestamps, daily limits, FSRS review time and Madrid calendar boundaries.
- Effect Config validates environment values and redacts MongoDB, pepper, email and OpenAI secrets. AWS retains its SDK credential-provider chain. Pure presentation, arithmetic, pagination containers and FSRS conversion remain ordinary TypeScript where effects add no behavior. React event handlers and Next entry points retain their required Promise interfaces.

Compatibility fixes discovered by real execution include awaiting Next 16 admin route parameters, rethrowing framework control flow through Effect boundaries, accepting omitted inactive AI file fields, and supplying OpenAI's strict JSON schema without excess properties. The existing PDF script imported a nonexistent default export; it now loads the namespace into the existing browser API. No visible UI was added or changed.

The existing Anki format, including its trailing tab, is preserved. The stale-upload query also retains its original `date` field rather than silently changing deletion semantics during this migration.

## Reproducing verification

Use Node with the repository's package manager, then:

```sh
pnpm install --frozen-lockfile
pnpm check-types
pnpm check-format
pnpm test:unit:run
pnpm exec playwright install chromium firefox webkit
pnpm test:e2e
pnpm test:integrations
```

`test:e2e` requires OpenSSL and builds and starts a production server through `scripts/e2e-server.mjs`. Locally, `.env.test.local` must explicitly contain the isolated `MONGODB_URL`; the runner refuses to fall back to the development database. `.env.development.local` supplies optional integration settings, then test settings override them. CI supplies its own isolated environment. The runner disables email delivery and selects deterministic AI generation. The runner creates a temporary self-signed HTTPS proxy on port 3443 so all engines honor production Secure cookies; its certificate is deleted on shutdown. An externally managed server can be used with `PLAYWRIGHT_EXTERNAL_SERVER=1` and `PLAYWRIGHT_BASE_URL` if needed.

For all browser engines, run `pnpm exec playwright test --grep-invert 'visual parity' --workers=1`. For a fresh side-by-side visual comparison, serve an unmodified `dev` checkout on another port with the same environment and run:

```sh
BASELINE_URL=http://127.0.0.1:3001 PLAYWRIGHT_EXTERNAL_SERVER=1 \
  pnpm exec playwright test e2e/visual-parity.test.ts --project=chromium
```

The visual test compares main-content text and screenshots at 390px and 1280px with zero differing pixels. It excludes only Next's development overlay. It requires the baseline server and is skipped in ordinary functional runs.

### Infrastructure and cleanup

The user provided `.env.test.local` and authorized using `.env.development.local` for S3/OpenAI. The isolated Atlas database initially lacked its search index; the `courses` index was provisioned from `docs/mongodb-atlas-search-indexes/courses.json` and verified queryable. Future environments need the same index.

Unit database suites use unique database names and drop only the collections owned by each suite, then close the client. Browser tests use unique users/course IDs and clean up only their fixtures in `finally`. Upload tests use unique S3 objects and remove them afterward. Live integration tests are opt-in and exercise real S3 upload/read/delete and a small OpenAI structured-generation request. Browser AI uses the deterministic provider; email delivery is disabled, while verification and password-reset tokens are exercised through the real UI and database. Live email delivery is not claimed as tested.

## Verification evidence

- Original baseline: type checking passed; 145 tests passed. Two singleton-specific tests were retired with the removed singleton utility.
- Migrated suite: 163 tests passed across 52 files; the two opt-in live tests pass separately.
- TypeScript, Biome formatting/import/lint checks and the production webpack build pass. Webpack is selected explicitly for the existing Sentry integration.
- Static comparison of all 222 original component files found no changes to rendered HTML tags, styles or visible copy. The only JSX metadata differences are a React context value and removal of an unreachable fallback from a Suspense key. CSS and image assets are unchanged.
- Eight public-page comparisons (landing, login, signup and recovery, mobile and desktop) pass with zero screenshot differences against `dev`.
- All 15 functional Playwright tests pass across Chromium, Firefox and WebKit against the production build over local HTTPS. Functional browser journeys cover signup/verification, login/logout, recovery/reset/password changes, profile editing and S3 image upload, course creation/editing/privacy/copy/deletion, enrollment/favorites/configuration/unenrollment, note CRUD and all import/export formats, practice persistence, AI pasted text/topic/text-file/PDF input, preview removal/cancellation/confirmation, Atlas search/pagination, admin authorization/CRUD, private-course access and account deletion.

WebKit logged background prefetch/telemetry access-control messages during navigation in the self-signed test environment; all assertions and subsequent navigations passed.

The Effect release is an RC and intentionally pinned. This rewrite preserves persistence formats, deployment services and application behavior rather than adding durable workflow infrastructure, changing the database, or moving Next routes to a new HTTP stack.
