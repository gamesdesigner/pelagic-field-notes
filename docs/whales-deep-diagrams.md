# Whales and expanded Midnight Zone

Nine lesson additions use the established two reading levels, teaching guides,
numbered plates, seven written questions, article checks, saved quiz drafts,
server-graded scores, and owner reports. Chapter 10- Whales contains Whales,
Blue Whale, and Sperm Whale in that order. Chapter 5 appends Oarfish, Giant
Tubeworms, Yeti Crab, Hydrothermal Vents, Anglerfish, and Coelacanth after its
original four units. Existing renderer indices and account keys remain stable;
the nine new destinations append extensions20..28.

All selected scientific plates were generated with the **built-in image-generation
tool**, using scientific-educational prompts. Full initial prompts, targeted edit
prompts, selected source PNG locations, and saved WebP destinations are in
[whales-deep-image-manifest.json](whales-deep-image-manifest.json). Original PNGs
were retained, and selected outputs converted to 1536 × 1024 WebP assets. Every
selected image was visually inspected. Two received targeted corrections: reduced
unpigmented Kiwa tyleri eyes, and an anglerfish microbial inset connected to the
lure rather than the back.

| Lesson | Final saved asset | Level 1 / Level 2 body words |
| --- | --- | --- |
| Whales | `public/assets/whales-deep/whales-diagram-v1.webp` | 611 / 2,181 |
| Blue Whale | `public/assets/whales-deep/blueWhale-diagram-v1.webp` | 615 / 2,190 |
| Sperm Whale | `public/assets/whales-deep/spermWhale-diagram-v1.webp` | 591 / 2,159 |
| Oarfish | `public/assets/whales-deep/oarfish-diagram-v1.webp` | 608 / 2,061 |
| Giant Tubeworms | `public/assets/whales-deep/giantTubeworm-diagram-v1.webp` | 620 / 2,167 |
| Yeti Crab | `public/assets/whales-deep/yetiCrab-diagram-v1.webp` | 616 / 2,145 |
| Hydrothermal Vents | `public/assets/whales-deep/hydrothermalVents-diagram-v1.webp` | 611 / 2,142 |
| Anglerfish | `public/assets/whales-deep/anglerfish-diagram-v1.webp` | 604 / 2,070 |
| Coelacanth | `public/assets/whales-deep/coelacanth-diagram-v1.webp` | 610 / 2,104 |

## Scientific scope and diagram review

- The whale comparison shows blue, sperm, humpback, and gray whales without a
  shared size scale. Blue-whale baleen attaches to the upper jaw, throat folds
  expand during engulfment, and the paired blowholes remain distinct from the
  feeding pathway. Sperm-whale head anatomy is a simplified sound-associated
  spermaceti-complex inset, not a giant brain.
- Migration and reproductive habitat are population-specific. Mating, calving,
  and nursing are distinct activities. Gulf of California mother–calf use does
  not become a claim that all blue-whale mating grounds are fully known.
- Dive values distinguish typical behavior, dataset maxima, and demonstrated
  depths. The blue 315 m example belongs to one comparative study. The sperm
  account contrasts studied 600–1,000 m feeding with NOAA-reviewed records near
  2,000 m. Cuvier’s 2,992 m is cited as a study observation, not an indefinitely
  current world record.
- Oarfish and coelacanth remain in the requested chapter as explicitly labeled
  depth comparisons. Their actual records are mainly shallower. The coelacanth
  is a modern evolving fish, not an unchanged human ancestor; updated scale-based
  life-history estimates are distinguished from older published estimates.
- Riftia is an Eastern Pacific tubeworm. The adult has no ordinary mouth/gut;
  its trophosome hosts nutritional bacteria. Plume exchange, blood transport,
  chemical energy, and inorganic carbon have different roles. Vessel colors are
  schematic. Kiwa tyleri is a Southern Ocean squat lobster with important ventral
  setae and external associated microbes. Behavior from other Kiwa species is
  not automatically assigned to it.
- The vent cutaway separates descending seawater, geological heat, rising altered
  fluid, precipitation, cooler mixing habitat, and microbes. Dark plume particles
  are minerals. Animals are beside mixed flow, not inside the hottest jet.
  Eastern Pacific representative fauna are not presented as the Antarctic community.
- The female Melanocetus johnsonii plate shows one forehead illicium and esca,
  distinct from a dragonfish chin barbel. Its luminous bacterial partnership is
  not conflated with vent carbon fixation. Reproductive fusion in some anglerfish
  species is not described as universal.

## Additional teaching controls

`WhaleFieldGuide.tsx` offers four keyboard-accessible species selections with prey,
population-specific movement, reproductive habitat, and depth context. Each panel
links to the relevant science sources. `VentChemistry.tsx` filters nine chemical
entries by roles, with formulas, origin, explanation, and references. It separates
energy-related substrates, carbon sources, electron acceptors, and metals/minerals;
oxygen principally comes from seawater mixing. Composition is not a universal recipe.

## Verification

- 116 tests pass; two optional external checks skipped. New tests cover all nine
  registry entries, sources, substantial reading levels, diagrams, chapter order,
  stable destinations, short-answer paraphrases and contrary ideas, independent
  draft restoration, idempotent score writes, owner reports, and earlier records.
- TypeScript, Vercel production build, edited-component lint, and diff checks pass.
  The existing large client-bundle build warning remains.
- Local browser verified all nine article pages, both levels, loaded 1536-pixel
  images, chapter/unit labels, 58 catalogue cards, and written-quiz regions.
- A disposable local-memory account restored Level 2 and an unfinished Whales
  question after refresh, then completed 7/7 with the completion flourish and
  article check. Reopening reported the saved result and one attempt.
- Keyboard selection changed the whale comparison. Chemical-role filtering showed
  methane and inorganic carbon under Carbon sources, and oxygen/sulfate under
  electron acceptors. The 390 × 844 mobile DOM had no horizontal overflow and
  chemical cards stacked in one column. Browser screenshot capture was unavailable
  during this run; mobile verification used rendered DOM geometry. Temporary
  viewport overrides were reset.
- Production credentials, Blob namespaces, account data, environment configuration,
  owner provisioning, old Sites hosting, and Netlify were not changed.

Course totals after this update: 58 catalogue units, 57 tracked readings, and 54
written quizzes. Chapter unit counts: 6, 6, 6, 6, 10, 6, 7, 6, 2, 3.
