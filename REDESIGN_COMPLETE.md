# Redesign Complete — Summary for the Site Owner

**Live site:** https://helioskozak-cloud.github.io/kozak-genealogy/
**This document's commit:** written after the Night 7 verification pass, `main` @ `1fbf1e6`.

## What this covers

`PRESENTATION_REDESIGN_PLAN.md` (written Jul 10) proposed 7 nights to turn the site from a
43-part, ~20,000-word prose scroll into a structured, click-through family graph backed by
`data/family.json`, while losing zero research content. Those 7 nights shipped. Then — outside
that plan, over the following two days — three more rounds of unplanned work happened on `main`
(`SITE_REWORK_PLAN.md`, `GENERATIONAL_TREE_PLAN.md`, `SITE_REBUILD_PLAN.md`), driven by your live
feedback each time the previous result didn't land. This document summarizes all of it, because
by the time this Night-7 verification pass started, the site you're actually looking at is the
result of all four plans, not just the first one.

## What shipped, night by night (and beyond)

**Nights 1–3 — the data layer.** `data/family.json` was created and populated: the old `BRANCHES`
array (30 people, 4 disconnected pedigree trees) and the Sources table (123 rows, S01–S123) were
extracted mechanically; all 43 "Part" session-log narratives were then mined by hand for facts,
new people, and relationship resolutions not already captured. Result: 100 person records, all
123 sources, all 43 Parts (plus one extra pre-numbering session logged as Part 1), each
cross-linked via `partRefs[]` / `sourceRefs[]` / `personRefs[]`.

**Nights 4–6 — the first graph.** The 4 disconnected ahnentafel trees were replaced with one
connected node/edge graph rendered by D3, with Branch and Chronological view modes, a two-tier
hover/click pop-out, and the Overview tab renamed "Research Log." This became the default tab.

**Unplanned round 1 — `SITE_REWORK_PLAN.md` (Jul 11–12).** You asked for relationships to be the
organizing principle across *every* tab, not just the graph. This shipped: Sources got real
`personRefs[]` (not regex-guessed text matching) and clickable URLs where one exists; Missing
Links + Search Queue were retired and folded into a single data-driven Open Questions tab with an
active/resolved split; Business & Property became a real `businesses{}` collection in
`family.json` instead of static HTML; Research Log got search/sort/person-filter controls; and a
`jumpToPerson`/`jumpToSource`/`jumpToBusiness`/`jumpToPart` cross-link system ties all of it back
to the graph in both directions.

**Unplanned round 2 — `GENERATIONAL_TREE_PLAN.md` (Jul 12).** You asked for the graph to make
generation (who's a child vs. a spouse) legible. A third "Generational" view mode was built and
shipped (5 sessions, ending in a full regression pass) — but your reaction on seeing it live was
**"The generational view is even worse."**

**Unplanned round 3 — `SITE_REBUILD_PLAN.md` (Jul 12, partial).** Root-caused: every prior
verification pass checked structural correctness, not what a real visitor sees first — small,
illegible node clusters in an oversized empty canvas, on all three D3 view modes and the old
Pedigree tab alike. The fix decided on: retire the D3 force-graph entirely in favor of a
CSS-grid/flex expand-collapse tree, plus a "Full Family" poster mode giving the big-picture view
you'd been asking for since round 2. **Only sessions 1–2 (plus part of 3) of that plan's 5-session
schedule actually landed** (commits `d751d93`, `ca7a9d5`) before this Night-7 task started — see
Known Gaps below.

**Night 7 (this pass) — verification.** Because the live site had drifted well past the original
7-night plan by the time this ran, this pass first re-confirmed Nights 1–6 actually landed intact
(they did), then ran the three verification checks from `PRESENTATION_REDESIGN_PLAN.md` §7 against
the site as it exists *today* — the poster/focus tree, not the retired D3 graph — since that's
what you and any visitor actually see. One data gap was found and fixed (below).

## Verification checks — all three passed clean

1. **Automated coverage check.** Every `S\d+` and `Part \d+` token in the pre-redesign `index.html`
   (commit `ec23473`, the last Part-43/S123 state) was extracted and cross-checked against
   `data/family.json`. **Result: all 123 sources and all 43 Parts (plus the implicit pre-numbering
   Part 1) are present, none orphaned.**
2. **Fact-density spot check.** 15 of the most fact-dense McGivney/Relihan-core-line people were
   diffed fact-by-fact between the old prose/`BRANCHES` data and the new pop-out panels:
   Peter McGivney Sr., Patrick McGivney Sr., John Relihan Sr. (Dooley branch), Thomas P. Relihan,
   Ann née Clark McGivney, John J. Relihan Sr. (McNamara branch), Ann Louise Martini, Peter George
   McGivney, Maurice Relihan, Ann Duley Relihan, Joan B. Relihan, John J. Relihan Jr. (AZ),
   Bl. Michael J. McGivney, James T. Relihan, and Mary Lynch McGivney. **Result: zero facts lost.**
   The old `BRANCHES` array and the full ~20,000-word Research Log prose both still exist verbatim
   inside `index.html` (the migration was additive, not destructive) and `data/family.json` layers
   structured, cross-linked data on top of that, not instead of it. The 3 duplicate-record merges
   flagged during the redesign (Thomas P. Relihan, Ann Duley Relihan, and the John Relihan
   Sr./John J. Relihan Sr. non-merge — see below) were checked directly and are correct.
3. **Confidence-badge check.** Every RESOLVED/CONFIRMED/DISPROVEN callout that used to live in a
   colored alert box was checked against the current site:
   - **Part 5 — "Branch Merge DISPROVEN, Two Separate John Relihans."** The Dooley-branch John
     Relihan Sr. (`tpr-2`) and McNamara-branch John J. Relihan Sr. (`mcn-2`) remain two distinct
     person records, each explicitly noting they're a different man from the other — the disproof
     was not silently re-merged.
   - **Part 41 — Peter McGivney Sr. / Patrick McGivney Sr. = first cousins, not brothers.** Both
     records carry the corrected relationship, citing S121, and the Open Questions entry for this
     question shows `status: resolved` on both.
   - **The Jun 30 2026 "Major Correction" (County Cavan, not Cork)** for Patrick McGivney Sr., and
     the related Mary Lynch McGivney origin correction (Cavan, not Sligo), are both preserved.
   - **Sub-chains A, B, C, D** (the McGivney↔Relihan connection chain, Parts 39–41) all still
     appear in `data/family.json`.
   - Visually: confirmed people render with a solid card border, probable people with a dashed
     amber border, matching the original site's convention.

One data gap turned up during check 2 and was fixed before shipping: James T. Relihan's son and
grandson records (`james-m-relihan`, `joseph-r-relihan` — one generation past the required 15,
so this didn't fail check 2, but it's the same "no research content lost" principle) had empty
`partRefs[]` despite Parts 2, 4, 36, and 37 discussing them by name, and were missing their
obituaries' grandchildren/great-grandchildren counts. Both are now linked and complete. Check 1
was re-run after the fix and still passes clean.

## Known gaps / deferred items

- **`SITE_REBUILD_PLAN.md` is incomplete.** Sessions 1–2 (replace the D3 graph with the
  expand-collapse Family Tree) and part of session 3 landed. Sessions 3 (fully retiring the old
  Pedigree tab and re-pointing all cross-links at Family Tree), 4 (copy/documentation pass on
  Research Log / Sources / Open Questions / Business & Property intros), and 5 (mobile-viewport
  regression pass with plain full-page screenshots) did not run. Concretely: **the Pedigree tab is
  still live** as a separate tab alongside the new Family Tree tab, rather than being merged into
  it as that plan intended — it's redundant but not broken, and its underlying data (the original
  `BRANCHES` array) is confirmed intact. If you want that plan finished, it needs its own session
  budget; it's a presentation-layer cleanup, not a data-integrity issue, so it was left alone here
  rather than taken on unilaterally as part of a verification pass.
- **This verification pass could not exercise the Pedigree tab's D3 rendering directly** — the
  sandboxed environment used to test the live site blocks the `cdn.jsdelivr.net` CDN that serves
  D3, which is a restriction specific to that test environment, not the live GitHub Pages site
  (real visitors load D3 normally). The default Family Tree tab, which no longer depends on D3,
  was fully click-tested and confirmed working end-to-end.
- **The retired Missing Links tab's free-text "your findings" save box has no equivalent** in the
  new Open Questions tab. This is a feature regression, not a data-loss issue — nothing typed into
  it previously was stored in a way this migration could have carried forward.
- **The 4 open research threads flagged in the original redesign plan (§8) are still open** and
  were explicitly out of scope for all 7 nights: LNV archive access, Ann née Clark's father
  identity conflict, the Bryan/John McGivney brothers evidence gap, and James T. Relihan's
  September 1946 obituary. None of this week's work touched them.

## Bottom line

Every fact, source citation, S-number, and Part-conclusion that was on the live site before this
week's work is confirmed present on the site today. The one gap the verification process found was
fixed before this was written up. The front end looks different than the original 7-night plan
specified, because your feedback across two more rounds changed the layout approach twice more —
but the data underneath, and the "no research content lost" guarantee, held through all of it.
