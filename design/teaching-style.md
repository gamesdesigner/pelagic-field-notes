# Course teaching style

All lessons use the same sequence at both reading levels: guiding question,
abstract, three learning goals, numbered explanations, key terms, key takeaway,
understanding check with a revealed explanation, application, and sources.
`app/LessonReading.tsx` is the shared renderer. Models, illustrations, and saved
quizzes remain beside it in their existing lesson components.

## Editorial conventions

Use direct, explanatory US English and SI units. Define unfamiliar terms before
using them to explain mechanisms. Keep a paragraph focused on one idea, connect
causes with effects, and identify limits or alternative explanations. Use
sentence-case headings. Avoid promotional language, exaggerated conclusions,
and universal claims based on one species or experiment.

Level 1 introduces concrete examples and essential mechanisms in plain language.
Level 2 develops the same subject through mechanisms, evidence, quantitative
reasoning, uncertainty, and investigation. Preserve the substantial length of
the extended articles; a new abstract or a vocabulary list does not substitute
for a developed explanation. Label hypothetical numerical examples and teaching
models clearly. Prefer original research for specific experimental findings.

## Content sources

- `shared/introductory-articles.json`: foundation readings extracted and edited
  from the original lessons, including expanded midnight and general readings.
- `shared/plankton-articles.mjs` and `shared/twilight-articles.mjs`: existing
  foundation and advanced biological content.
- `shared/schooling-articles.mjs`: Schools of Fish, adapted from the user's
  Level 1 text, with an original extended Level 2 and seven quiz questions.
- `shared/teaching-guides.json`: the guiding question, both abstracts, learning
  goals, introductory vocabulary, recap, and formative/application questions for
  every lesson.
- `shared/lesson-articles.mjs`: assembles the introductory catalog and normalizes
  spelling. This is the foundation content actually displayed.
- `app/deepDives.ts` and `app/deepDiveExtensions.ts`: the full advanced articles
  and source index. Shared guides supply their revised abstracts.

The schooling lesson distinguishes shoaling from aligned schooling, separates
dilution from predator confusion, and treats temporary leadership, escape order,
and energetic benefits as context-dependent. It links primary studies rather
than presenting one permanent leader or identical responses as universal rules.
All old lesson IDs remain stable so existing account progress is retained. The
new `schooling` ID uses the existing server grading and account-save pathways.
