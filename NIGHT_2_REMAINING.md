# Night 2 — Remaining Work for Night 3

**Night 2 scope (per `PRESENTATION_REDESIGN_PLAN.md` §6):** mine the 43 numbered "Part" narrative
sections in `index.html`'s Overview tab for facts not yet captured in `data/family.json` — new
people mentioned only in prose, dates, relationship resolutions, and RESOLVED/DISPROVEN status
changes from the colored alert boxes.

## What Night 2 actually mined

**Parts 43 down through 22 — DONE.** All 22 of these Parts are now recorded in
`data/family.json`'s `parts{}` object (keyed by Part number, each with `date`, `title`,
`sourceRefs[]`, `personRefs[]`, and a `summary`). See `data/family.json` → `meta.partsMined`.

Also captured incidentally: the pinned "✓ CONFIRMED — Branch Merge DISPROVEN — Two Separate John
Relihans" alert box, which sits above Part 43 at the top of the live Overview tab and documents
Part 5's conclusion. It's recorded under `parts["5-pinned-alert"]` — **this does NOT mean Part 5
itself, or any of Parts 1-21, have been mined.** It was read only because it happens to render
above the Part 43-22 range in the DOM.

New person records added (named only in prose, no prior `BRANCHES` entry):
`bryan-mcgivney-creenow`, `john-mcgivney-derrylahan`, `bridget-gibney-mcgivney`,
`patrick-mcgivney-b1782`, `nicholas-mcgivney-b1760`, `andrew-mcgivney-b1801-malone`,
`bernard-mcgivney-b1830-malone`, `ellen-mcgivney-drumbee` (an open question, not a resolved
identity).

Relationship resolution propagated: Part 41 (S121) — Peter McGivney Sr. and Patrick McGivney Sr.
are FIRST COUSINS (not the earlier "probable brothers" hypothesis from Part 11/S90); consequently
Peter George McGivney and Bl. Michael J. McGivney are SECOND COUSINS. This was already reflected
in `mcgivney_family-4`'s BRANCHES data at Night-1 extraction time, but `mcgivney_family-2`
(Peter Sr.) still had stale "PROBABLE BROTHER/COUSIN" wording — fixed to match, with a resolution
fact added citing S121.

`partRefs[]` populated on all existing (Night-1-extracted) persons referenced in Parts 22-43.

## NOT yet mined — explicit list for Night 3

**Parts 21 down through 1 — NOT MINED.** These are generally shorter/older sessions per the
redesign plan's own estimate (§6, Night 3 row), but still need the same treatment: new people,
dates, relationship resolutions, RESOLVED/DISPROVEN alert boxes.

Specifically outstanding:
- Part 21 (S100 · Malone NY St. Joseph Cemetery)
- Part 20 (S99 · CavanTownlands.ie Crosserlough Parish)
- Part 19 (S98 · 1901+1911 Irish Census Kilnaleck DED)
- Part 18 (S97 · Complete 1821 NAI McGivney/Cavan sweep)
- Part 17 (S96 · 1821 Census Kilnaleck — Bridget Gibney identified)
- Part 16 (S95 · Second Bryan McGivney in Drumlornin 1828)
- Part 15 (S94 · Bryan McGivney confirmed in Creanew 1828)
- Part 14 down through Part 6 (not yet scanned at all this session)
- **Part 5** itself (only its pinned summary alert box was read — the full Part 5 narrative
  paragraph(s) still need mining)
- Part 4 down through Part 1

Also per the redesign plan (§3, §6 Night 3): fold the Missing Links tab cards and Search Queue
items into `family.json` as person-linked `openQuestions[]` — not started.

## Time/budget note

This was completed within budget — Parts 43-22 (22 of 43 Parts, the most recent/information-dense
half per the plan's own timeboxing guidance) were fully mined in this session, with no shortcuts
taken on the completed range. Night 3 should start at Part 21 and work down to Part 1, then
proceed to the Missing Links/Search Queue folding described in Plan §6 Night 3.
