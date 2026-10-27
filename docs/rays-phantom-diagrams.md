# Giant phantom jellyfish and Chapter 9 Rays

Three generated scientific plates accompany the lessons. They use the built-in
image-generation tool in **scientific-educational** mode. The complete final
prompts and original PNG locations are preserved in
[rays-image-manifest.json](rays-image-manifest.json). Original files were retained;
selected outputs were converted to WebP without altering the illustration.

| Lesson | Final saved asset | Numbered key |
| --- | --- | --- |
| Giant Phantom Jellyfish | `public/assets/rays/giantPhantom-diagram-v1.webp` | Bell, margin, oral arm, mouth region |
| Rays | `public/assets/rays/rays-diagram-v1.webp` | Oceanic manta, southern stingray, clearnose skate, lesser electric ray |
| Manta Ray | `public/assets/rays/mantaRay-diagram-v1.webp` | Cephalic lobe, mouth, pectoral fin, gill slits, belly markings |

Each image is 1536 × 1024 pixels. Accessible HTML keys supply names, explanations,
and primary science links. Plates are explicitly illustrative and not to a shared
size scale. The phantom plate has four broad ribbons, without a lion’s mane fringe.
The ray comparison preserves disc, head, and tail differences. The manta underside
shows five paired gill slits; the tail has no functional stinging barb.

The bus comparison is a separate code-native graphic: its common-scale lines use
12 m for the chosen bus, 10 m for one extended oral-arm reference, and 1 m for a
bell-diameter reference. Real buses vary and large animals can exceed those animal
reference dimensions. The icons and jelly pose are not measurements of specimens.

The interactive mouth cutaway is also code-native so its structures, labels,
paths, and accessible controls stay consistent. Blue water follows branchial
outlets; gold retained food follows a distinct route toward the throat. Five
filter regions represent one side. A separate enlarged sketch explains ricochet
separation, without presenting a simple size-exclusion sieve as the whole mechanism.
It offers five keyboard-accessible structure selections, route selection,
play/pause, reset, and a static reduced-motion presentation. Paths and timing are
schematic, not a measured rate or a perfect-capture model.

Science checks include MBARI and Naturalis anatomy, Moore et al. (2023) Antarctic
observations, NOAA manta biology and migration research, the IUCN 2022 amended
assessment, the U.S. ESA listing, Divi et al. (2018) filtration experiments, and
species-specific reef-manta social studies. Status checked October 2026. The 2025
recognition of Atlantic manta Mobula yarae is included, avoiding an outdated claim
that there are only two manta species. Global Endangered and U.S. ESA threatened
remain explicitly distinguished.

Reading word counts (article body): phantom 598 / 2,201; rays 611 / 2,286;
manta 604 / 2,287. Each has seven written questions, account completion, independent
saved quiz drafts and scores, and owner-visible reporting through existing APIs.
Catalogue: 49 units in 9 chapters, 48 tracked readings, 45 quizzes. Cnidaria now
has seven units, Rays two, and Midnight four; other chapters retain six.

## Verification

- Automated suite: 112 passed; two optional external checks skipped. New coverage
  verifies three independent quiz drafts, refresh/handler restoration, server
  grading, idempotent score writes, owner reports, and preservation of older
  Cnidaria and shark records. Concise answers and contrary answers have separate
  cases.
- TypeScript and Vercel production build passed. Edited TSX lint has no errors;
  the existing generic `<img>` optimization warning remains.
- Browser: all 49 catalogue cards, Chapter 9 entry, Rays → Manta sequence, both
  reading levels, full-size loaded images, and return-to-main behavior verified.
- Local disposable account: question 2 text and Level 2 restored after refresh;
  seven answers produced 7/7, one saved attempt, completion flourish, and article
  completion. Leaving and reopening the lesson preserved those results.
- Mouth controls: keyboard selection, route selector, enlarged filter explanation,
  reset, and play/pause verified. Paused particle offsets stayed unchanged across
  observations. CSS motion paths anchor at the SVG viewBox origin.
- Mobile: 390 × 844 viewport showed readable controls and no horizontal overflow.
  Bus/arm/bell line widths were 269.61 / 224.67 / 22.46 CSS pixels, preserving
  the 12:10:1 scale. Temporary viewport override reset after testing.
- No authentication, store, credential, or environment configuration changed.
