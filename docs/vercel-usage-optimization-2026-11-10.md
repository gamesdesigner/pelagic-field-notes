# Reducing Vercel usage — November 10, 2026

Account storage remains in the existing private Vercel Blob store. This change
does not migrate, reset, cache, or overwrite production account records.

## Account operations

Read-only session/account/report lookups request fresh record bodies without
fetching strong ETags they will never use. Conditional updates still request and
verify authoritative strong ETags. Private reads continue to use `useCache:false`.
Progress endpoints skip owner-role lookups, since they only access the signed-in
account's own progress. Owner management endpoints still verify ownership.
Session expiration, disabled status, and session-version checks remain in both
the initial authorization and the check immediately before a progress write.

An isolated benchmark ran the previous commit and new implementation against the
same fake Blob adapter, using the weak delivery validators previously observed in
production. No live account data or storage credentials were used.

| Request | Previous Blob GET / HEAD calls | New GET / HEAD calls | Simple reads |
| --- | --- | --- | --- |
| Load progress | 4 / 4 | 3 / 0 | 8 → 3 |
| Save checked quiz answer / score | 7 / 7 | 5 / 1 | 14 → 6 |

A real write still performs one Blob PUT, billed as an advanced operation. With
strong delivery validators, progress saves use five body reads instead of seven;
metadata savings depend on the delivery validator. These are per-request fixture
measurements, not a guarantee about total Vercel usage or charges.

## Avoiding redundant saves

After a successful lesson visit is loaded or saved, revisiting the same lesson
and reading level within 24 hours does not send another save request. This is
checked inside the client save queue so duplicate effects also collapse. The
server independently avoids duplicate visit writes from other tabs or old clients.
Changing reading level, first completion, and later daily visits still save.
Quiz checkpoints are never suppressed by this visit policy. Daily background
account checks and Enter/Check-only quiz saves from the previous updates remain.

Browser validation used an isolated memory account: one initial lesson visit;
reloading added no visit POST; switching level and completing the article each
saved once; seven checked answers added exactly seven POSTs and a saved 7/7 score.
The trace contained ten progress POSTs total (1 visit + 1 level + 1 completion + 7
answers). No production quiz attempts or student records were changed.

## Static delivery

The logo is encoded losslessly as WebP. Two large landing-page photos use quality
92 WebP at their original dimensions. Original source images remain available.

| Asset | PNG bytes | Optimized WebP bytes |
| --- | ---: | ---: |
| Logo | 830,951 | 365,122 |
| Green turtle | 2,713,567 | 449,118 |
| Common cuttlefish | 3,000,140 | 435,838 |
| Combined | 6,544,658 | 1,250,078 |

These three assets transfer about 81% fewer bytes. Public images use a one-hour
browser cache, while content-hashed JS/CSS and the versioned v6 swordfish video
use immutable caching. API responses retain `Cache-Control:no-store`; private
account data is never covered by the public asset rules.

The heavy lesson engine is also loaded lazily after sign-in. The initial public
JavaScript bundle decreased from about 775 KB gzip to 408 KB gzip (about 47%).
The deferred lesson bundle is about 368 KB gzip; it is downloaded when needed.
An isolated browser sign-up confirmed the deferred unit, article, model, and quiz
load correctly. Course content and visual layout are unchanged.

Sources: [Blob pricing](https://vercel.com/docs/vercel-blob/usage-and-pricing),
[consistent private reads](https://vercel.com/changelog/vercel-blob-now-supports-consistent-reads-on-private-storage),
[cache-control](https://vercel.com/docs/caching/cache-control-headers).

The store was still reported as `limits-exceeded-suspended` during the read-only
status check. Optimizing requests cannot reset Vercel's previously consumed quota.
