# Introduction, fish artwork, and polar lessons

The Introduction is the first subject card, before Ocean Currents. Its overview
contains 502 words, followed by exactly two illustrated guides: quiz operation
and the existing plankton population lab. The SVG guides are deterministic UI
illustrations with numbered coral outlines, not screenshots or live controls.
Their steps match the existing Check answer/Next question flow and the tank's
nutrient packets, Water temperature slider, fish controls, and playback controls.
Links open the real fish-school lesson, plankton unit, or Ocean Currents index.

Life in the Arctic contains the requested three animals in order. Emperor
penguins are explicitly labeled an Antarctic comparison on the index, card,
lesson, image caption, and both reading levels. They are not presented as native
Arctic wildlife. Orcas are treated as population-specific, with Arctic examples;
lion's mane jellyfish are placed in cool northern waters. Avoid assigning one
population's diet, experimental result, maximum size, or seasonal calendar to
all members of a species.

All six new readings use the shared course teaching renderer and support saved
reading levels and article completion through the existing account API. New
stable IDs are `penguin`, `orca`, and `lionsmane`. Level 1 body lengths are
609/600/586 words; Level 2 lengths are 1,608/1,640/1,700. There are now 18 lessons
and 12 quizzes. No new quizzes were requested for these three readings; they
include the shared understanding checks and application questions.

## Evidence and teaching assumptions

- Australian Antarctic Program species, breeding, and diving pages establish
  the emperor penguin's geography and basic biology. The level 2 reading explains
  rather than copies those descriptions. Zitterbart et al. (2011), PMID 21673816,
  supports the discussion of intermittent coordinated huddle movements.
- Ponganis et al. (2024), PMID 38390686, supports flexible blood/muscle oxygen
  management. Dive-response profiles are not converted into a universal dive
  duration, and a depth trace alone is not treated as evidence of prey capture.
- NOAA Fisheries documents orca population differences and biology. Fisheries
  and Oceans Canada provides the Arctic access and community-observation
  context. Matthews et al. (2020), PMID 32152110, supplies the tracked example of
  bowhead habitat changes associated with killer whale presence. The lesson
  distinguishes direct predation from nonconsumptive risk effects.
- Monterey Bay Aquarium and Smithsonian Ocean provide jelly biology and anatomy.
  The Gullmar Fjord study, DOI 10.1016/0022-0981(87)90149-3, provides a regional
  example of Cyanea capillata ephyra release and growth. Its seasonal observations
  are not generalized into an Arctic-wide calendar.
- Heat transfer, drag/power, echo delay, survey rates, jelly motion vectors,
  population budgets, and counting examples are explicitly simplified or
  hypothetical teaching models. They are not reported species measurements.

The complete link index is in `shared/polar-content.mjs`. The content lives in
`shared/polar-articles.json`, with learning scaffolds in `teaching-guides.json`.

## Generated assets

Four distinct images were generated with the built-in `image_gen` tool, reviewed,
copied into the project, and converted to WebP delivery assets. Original PNGs
are retained beside them. Exact prompts and saved paths are recorded in
`design/polar-image-prompts.json`. No external image API or CLI fallback was used.

- `public/assets/schooling/fish-school-v2.{png,webp}` replaces the repeated SVG
  fish in the Schools of Fish card and hero and illustrates the introduction.
- `public/assets/polar/emperor-penguin-v1.{png,webp}`
- `public/assets/polar/orca-v1.{png,webp}`
- `public/assets/polar/lions-mane-jellyfish-v1.{png,webp}`

October 24 replacement: `public/assets/polar/lions-mane-jellyfish-v2.{png,webp}`
now supplies the lion’s mane card and hero. It emphasizes a broader, shallower,
deeply scalloped red-brown bell, dense folded oral arms, and a much fuller curtain
of fine tentacles. The first version is retained. The built-in generation prompt,
scientific references, and asset paths are in `design/lions-mane-image-v2.json`.

Illustrations have descriptive alt text and captions identifying their
illustrative status. The existing palette, logo, accounts, credentials,
production store, old lesson IDs, and existing quizzes are preserved.
