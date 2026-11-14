# Bobbit Worm and Bigfin Squid units

Added to the canonical Vercel curriculum without changing earlier lesson IDs,
renderer indices, account credentials, storage connections, or saved records.

- Bobbit Worm: Chapter 2, Unit 9; stable lesson ID `bobbitWorm`, renderer index 36.
- Bigfin Squid: Chapter 6, Unit 8; stable lesson ID `bigfinSquid`, renderer index 37.
- Both use the existing Level 1/Level 2 readings, abstracts, article completion,
  checkpoint saving on Enter/Check, server grading, and owner report mechanics.
- Level 1: 508 / 535 body words. Level 2: 2,005 / 2,037 body words.
- Each quiz has seven written questions with reviewed short-answer equivalents.

## Assets and delivery

The media were generated in earlier tasks. Original images, prompts, and render
scripts remain in the workspace's `animations/bobbit-worm-4s/` and
`animations/bigfin-squid-4s/` folders. The website identifies them as educational
reconstructions, not wildlife footage or measured behavioral records.

- Bobbit Worm: original four-second MP4, H.264, 1280×720, 60 fps, silent.
  Native controls, looping, descriptive WebVTT track, static WebP poster,
  `preload="none"`, and no autoplay. A written action summary accompanies it.
- Bigfin Squid: only a single-frame WebP converted from the previously generated
  PNG. No bigfin video or animated WebP is shipped in this unit.
- All new media live in `public/assets/ambush-and-bigfin/` with versioned names
  and immutable browser/CDN cache headers. They do not use account Blob storage.

## Science and teaching

Primary references are linked in the readings and defined in
`shared/ambush-and-bigfin/sources.mjs`. Bobbit worms are taught as shallow benthic
annelids, not exclusively deep-sea animals. The ancient trace-fossil interpretation
does not identify an exact modern species. Bigfin squid are taught as Magnapinna
at genus level, with eight arms and two tentacles, variable posture, and uncertain
feeding details. The illustration is not evidence for a proven diet or attack.
Hypothetical calculations in Level 2 are explicitly labeled as invented examples.

Validation includes content/chapter/media checks, concise-answer grading,
checkpoint restoration, idempotent completion, owner reports, and preservation of
earlier lesson progress using an isolated memory store. Live account availability
depends on the existing storage service and is not changed by these units.
