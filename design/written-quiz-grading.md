# Written-answer quizzes

All fifteen quizzes now use written responses, for 110 questions across the
eighteen-lesson course. The three polar banks and twelve converted course banks
share one short-answer interface and server-side evaluator. All use existing account
drafts, final score saves, owner reports, retakes, revision protection, and the
70-percent passing celebration. No production account, credential, storage, or
schema migration is required.

## Evaluation

`shared/polar-quizzes.mjs` contains each question, model answer, explanation,
required concept groups, accepted phrases, and targeted conflicting phrases.
`shared/written-answer-grading.mjs` evaluates that rubric identically in the UI
and server. A response earns one point when all required idea groups match, or
when a listed equivalent phrase matches, unless a listed conflict is asserted.
The server recomputes the final score; submitted score fields are ignored.

Evaluation ignores case, accents, and ordinary punctuation, accepts listed
synonyms and plural forms, and permits one edit in words of six or more letters.
Short terms remain exact to avoid equating distinct concepts. Multiword phrases
can cross a line break. Local negation and simple contrasts prevent obvious
answers such as “not Antarctica” or “air is not needed” from earning credit.

This is a deterministic short-answer checker, not an AI essay evaluator. It
does not fully understand arbitrary prose, sarcasm, or complex contradictions.
Prompts request a scientific term or a focused explanation, and helper text
explains that checking looks for key ideas and accepted phrases. Students get a
model answer plus a concept explanation after checking. Tests use independent
valid paraphrases, incomplete answers, wrong concepts, negations, and typos.

## UI and saved work

`LessonQuiz.tsx` renders a labeled multiline textarea for written questions, with
no choice buttons. Plain Enter inserts a line break; Ctrl/Command+Enter checks
the response. Checked answers become immutable, while an unfinished selection
continues to debounce-save to the account and use the existing browser recovery
cache. Inputs keep the existing 512-character limit. Final review shows the
student's written response, result, and explanation.

`PolarUnits.tsx` keys each quiz by lesson ID so moving between animals starts or
restores that animal's own attempt. Shared backend tests cover every new bank;
an additional test verifies multiline draft recovery, checked-answer immutability,
server grading of a mixed 5/7 attempt, idempotency, and the owner's score report.

Local browser checks use a temporary, isolated memory-store student fixture and
the actual learning API handler. No real owner's answers or scores are changed.
The temporary fixture configuration and HTML are removed before deployment.

## Course-wide writing update — October 24, 2026

All 15 quizzes (110 questions) now use written responses. `course-written-quizzes.mjs`
adds focused prompts, concept groups and accepted equivalents to the remaining
12 banks. Original question order, counts and correct-answer text are retained,
so checked legacy selections remain valid answers and unfinished attempts retain
the same position. Existing stored scores are not rewritten. The original banks
remain as the source of the legacy answer text; only the written bank reaches the
shared quiz UI and server grader. All current questions use the same textarea.
The introduction and its illustrated guide now describe writing, not choices.

Rubric coverage includes independently worded responses to every converted
question, missing required ideas, negation, common conflicting concepts, and
comma-separated numeric answers. Checking is still deterministic phrase/concept
matching, not AI essay grading. Existing revision, cache, immutability, final-score
idempotency, student isolation and owner-report protections are unchanged.
