# Marine Biology Class

Interactive ocean-science lessons, animations, quizzes, and two reading levels.

## Current host: Vercel

The user requested live Vercel updates on October 18, 2026, overriding earlier
Netlify-only instructions. Use existing project `prj_p8H4QykqouyJu8leR4eIJbaITawL`
in team `team_H46xn7eMAifKIkbtBxahAwMU` at
https://marinebiology-learn.vercel.app. Never manage the old ChatGPT-hosted site.

Canonical source: https://github.com/gamesdesigner/pelagic-field-notes (`main`).
Read `AGENTS.md` before deployment. Keep private credentials outside source.
The GitHub integration is not installed: pushing Git alone does not publish to
Vercel. Create a deployment from the exact pushed commit and verify READY status.

## Development and verification

Use Node 24 and the pnpm lockfile:

```sh
pnpm install --frozen-lockfile
pnpm run dev:vercel
pnpm test
pnpm run typecheck:vercel
pnpm run build:vercel
```

`vite.vercel.config.ts` builds the React entry into `dist-vercel/`. Lessons live
in `app/`. Local preview accounts use disposable process memory and reset when
Vite restarts. Deploy source and `api/` together: auth, students and progress
functions use the existing private Vercel Blob store. A static-only upload would
break sign-in and progress saves. Preserve existing production accounts and never
copy another host's database or provision an owner during deployment.

## Great White Shark anatomy

The shark lesson has a stationary interactive anatomy plate in place of the old
swimming animation. Body parts covers seven labeled structures. Special
adaptations covers electrical sensors, dermal denticles, heat-retaining vessels,
an oil-rich liver and a cartilage skeleton. Numbered markers and the named list
share selection, with explanations and simplified internal overlays. All controls
work by keyboard. The original article levels and seven-question quiz remain.
Sources are linked to Florida Museum, AMNH and NOAA.

## Marine Life in Twilight

Unit 1 is **General Marine Life in Twilight**. Its introductory article has 640
words; Level 2 has a 1,595-word body plus an abstract. The day/night depth explorer
has six selectable animal types, example depths, pausable swimming, and linked
numbered anatomy diagrams. Positions and migrations are illustrative, not fixed
species limits. Sunlit water above 200 m is included to show the nightly journeys.

Unit 2 is **Vampire Squid**, with a 646-word introductory article and a 2,443-word
high-school deep dive plus an abstract. The step-by-step defense animation shows
arm-tip light, release of luminous mucus, and retreat, with playback, speed, reset,
and still-stage controls. Vampire squid do not have an ordinary ink-sac defense.
Two new generated images are in `public/assets/twilight/`; their built-in generation
prompts and source references are in `design/twilight-image-prompts.md`.

Both units have seven-question, five-choice quizzes using the shared server-graded
question bank and existing resume/save/celebration behavior. Article checks and
reading levels save independently. The existing `twilight` progress key remains
bound to Vampire Squid; `twilightGeneral` is the new unit, preserving earlier work.
The catalog now contains 13 lessons and 10 quizzes. Reduced-motion preferences
stop the visual motion, while selection, stage controls and reading remain usable.

## Resuming quizzes and completing articles

All ten quizzes automatically save their question, selected/typed answer and
checked answers to the signed-in account. Reopen the same lesson after leaving or
refreshing to continue. An immediate browser recovery copy protects the last edit
while it syncs. Save failures are visible and retryable. In-progress quizzes also
appear in learner and owner progress reports.

Checking the final answer automatically finishes and saves one graded attempt.
The results include an answer review, latest/best scores and attempt counts.
At least 70% correct earns a small checkmark and confetti flourish, with reduced
motion respected. A completed result restores without replaying the animation or
counting another attempt. An explicit retake starts a new attempt and preserves
the best score. The **✓ Check** button on each article saves article completion
separately from quiz completion.

Server grading, account isolation, revision ordering, immutable checked answers,
conditional writes and retry IDs prevent stale tabs and retries from overwriting
newer progress or inflating scores. Existing records require no migration.

## Vercel account implementation

Vercel Functions `api/auth.js` and `api/students.js` use shared handlers in
`server/accounts/`. Private Vercel Blob holds JSON account records; no Neon or
external database is required. The connected store is `store_5P506RkyxPFpB47z`.
The production `BLOB_READ_WRITE_TOKEN` is injected by Vercel, never client code.
Do not commit it or prefix it with VITE_. Keep preview records separate from
production; the adapter uses environment-specific path namespaces.

Reads use `useCache: false` so session revocation and account pauses are immediate.
New records disallow overwrites; updates require the previous ETag (`ifMatch`).
These conditional writes protect simultaneous signup, singleton ownership, and
attempt limits. No process-memory fallback exists on production endpoints.
The private store is initialized on use; no SQL migration is required.

Run optional integration verification with an ignored `.env.vercel.local` containing
the private store token:

```sh
MARINE_BLOB_INTEGRATION=1 node --env-file=.env.vercel.local --test tests/vercel-accounts.test.mjs
```

The test uses a random isolated namespace and removes its records afterward.
Previous hosts have separate account records, which are not automatically moved.

Registration requires a username and any nonempty password up to 128 characters;
email is optional. Passwords use salted scrypt hashes. Thirty-day sessions use
HttpOnly, SameSite cookies and Secure on HTTPS. APIs check origins, input sizes,
and attempt limits. Email verification and password recovery are not implemented.
Lesson assets are public; the welcome gate does not make lesson content confidential.

## Account settings and owner access

Public owner signup has been removed from the interface and API. The owner account
is configured administratively in private Vercel storage; it signs in using the
regular Sign in form. The user requested the owner name **Max Yang**. Never put an
owner password, hash, or invitation code in client code, documentation, or Git.
`server/accounts/provision-owner.mjs` is an administrative helper, never an API.
Run provisioning only after an explicit owner setup/reset instruction; deployment
must never reset an existing owner's changed credentials. The earlier setup-code
variable is unused. Private handoff instructions are outside the repository.

**Account settings** lets every signed-in user change a username or password after
entering the current password. New passwords are confirmed in the UI; any nonempty
password up to 128 characters is accepted. Usernames support 3–24 ASCII letters,
numbers, underscores, and single spaces between words; sign-in ignores case.
Display capitalization is preserved. Changes revoke all earlier sessions and issue
a new cookie for the current browser. Stable account keys preserve ownership and
student records across renames. Historical names remain reserved to prevent takeovers.
Legacy accounts and sessions are read compatibly; no data reset is required.

Owners can search students by the start of their current username, view optional
emails/join dates, and pause/reactivate accounts, with 50 accounts per page. APIs
check ownership on every request. Pausing permanently revokes previous sessions,
including after reactivation. The client rechecks sign-in each visible minute and
when returning to a tab. Passwords never appear in student management.

The illustrated signup/sign-in page keeps the existing logo and ocean palette,
adds turtle, cuttlefish, and ocean-current lesson previews, and explains the site.
The Vercel Blob account store persists across deployments. Cookies retain sign-in
for 30 days; signing out ends that session without deleting the account. No password
is stored in browser localStorage. Local development remains disposable memory.

## Quiz scores and lesson progress

`api/progress.js` uses the private Vercel account store and the authenticated
account's stable key. Learning records live under a hash of that key, so changing
a username preserves results. No progress is keyed only by browser localStorage.
Students can read or change only their own learning record; the owner can view
students through authenticated `/api/students?student=<username>` reports.

All 13 lessons record started/completed status, visit dates, and the last reading
level. Learners explicitly use **Mark lesson complete** after the reading. The
preferred reading level is restored next time they open that lesson. **My progress**
in the lesson header shows the complete account report.

All ten quizzes save after every question in an attempt has been
answered. The server grades submitted answers using `shared/learning-content.mjs`,
the same question bank used by the UI; client-supplied scores are ignored. Saved
records contain latest/best score, question total, attempt count and last-attempt
date. Retaking a quiz preserves the best score. Retry identifiers deduplicate
recent requests (last 100 per quiz), and conditional writes merge simultaneous
saves from different tabs. Save failures are shown with a Retry button.
Unfinished attempts are not resumed after a reload. Tracking begins with new
activity; quiz results from before persistence existed cannot be reconstructed.

Student accounts shows each student's completed-lesson and quiz counts. **View
learning progress** expands all lesson statuses and quiz results. Paused/revoked
sessions cannot save progress or read private reports. Scores and progress survive
renames and new deployments. Tests cover isolation, server-side grading, retries,
concurrent writes, owner authorization, renamed accounts and real private storage.

The existing owner display name remains **Max Yang**. Normal Sign in also accepts
**MaxYang**, ignoring capitalization, with the same password. Compact owner spelling
is reserved against new signups/renames; existing distinct accounts take precedence.
No owner password was reset for this fix.

## Retained historical configuration

Vercel adapters remain in source for historical compatibility. They are not the
deployment target. Do not use Sites source helpers, publish a Sites update, or
manage the old `*.chatgpt.site` website. The previously rejected broad-scope
Netlify secret action remains unapproved.
