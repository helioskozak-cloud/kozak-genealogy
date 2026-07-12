# Site Rebuild Plan — full redo, all tabs, all new copy

## 1. Why this exists

After three prior plans (`PRESENTATION_REDESIGN_PLAN.md`, `SITE_REWORK_PLAN.md`, `GENERATIONAL_TREE_PLAN.md`) and five sessions specifically building and "verifying" a Generational graph view, the owner's reaction on seeing it live was: **"The generational view is even worse."** Followed by: **"Please just re-do this whole site with all new tabs, complete cleanup and redocumentation of everything."**

Root cause, confirmed with fresh full-page screenshots taken *after* claiming the work was verified: every verification pass across all three prior plans checked structural correctness (does it render, zero console errors, do computed positions avoid collisions, does a zoomed-in crop of one specific detail look right) — but **never once looked at the plain, unzoomed, default view a real visitor sees first.** That view, for Branch/Chronological/Generational graph modes alike, is a small cluster of illegible tiny cards sitting in a mostly-empty oversized canvas. The same defect exists, less severely, in the existing Pedigree tab's per-branch tree charts (also small trees floating in large empty containers).

This is a structural failure of the underlying visualization approach (D3 force-directed / computed-layout nodes on an auto-fit `<svg>` canvas), not a tunable bug. It is being replaced, not patched again.

**New verification rule for this plan, non-negotiable:** every UI session must include a plain `page.screenshot(full_page=True)` of the default, un-zoomed view before any claim of "done" — reviewed for legibility and layout balance, not just presence of DOM elements. Cropped/zoomed screenshots may supplement but never substitute for this.

## 2. Decisions (owner-confirmed)

- **Pedigree tab is in scope.** Not exempted this time — fold it into the rebuild.
- **Relationship visualization replaces the D3 graph entirely** with a traditional expand/collapse ancestor/descendant tree chart (the FamilySearch/Ancestry pattern) — proven UX, no force-simulation, no auto-fit guesswork.

## 3. New information architecture

**5 tabs, down from 6** (Graph + Pedigree merge into one coherent tree view — this also resolves an old, never-addressed complaint from the original rework ask that the site had redundant/overlapping tabs):

| Tab | Replaces | Content |
|---|---|---|
| **Family Tree** | Graph (all 3 modes) + Pedigree | One expand/collapse tree component. Default focus: Grant Kozak. Parents/grandparents expand upward per-branch (collapsed by default beyond 2 generations, click to go further); spouse + children expand downward. Any person becomes a new focus on click ("re-center"), so every one of the 100 people is reachable, not just Grant's direct line. Confidence styling (solid/dashed border, branch color) carried over from the existing `CLR`/`nodeClr` scheme. The 37 people with no traced parent/child link get a separate, clearly-labeled "Not yet connected" list below the tree (searchable), not force-crammed into the chart. |
| **Research Log** | Research Log (kept, redocumented) | Existing search/sort/filter from Site Rework Session 5 kept; tab intro copy rewritten for clarity. |
| **Sources** | Sources (kept, redocumented) | Existing data-driven tab (personRefs/url) from Site Rework Sessions 1-2 kept; copy pass. |
| **Open Questions** | Open Questions (kept, redocumented) | Existing data-driven tab kept; copy pass. |
| **Business & Property** | Business & Property (kept, redocumented) | Existing tab kept; copy pass, confirm cross-links into the new Family Tree tab still work. |

`data/family.json` schema is unchanged — this is a presentation-layer rebuild, not a data migration. `jumpToPerson`-equivalent cross-tab linking is preserved but re-pointed at the new Family Tree tab.

## 4. The tree component, specifically

- Layout: CSS grid/flex, not absolutely-positioned SVG nodes — sized to genuinely fill its container at default zoom, no auto-fit-to-tiny-cluster failure mode.
- Ancestors: standard pedigree-chart shape (each generation doubles: 1 focus → 2 parents → 4 grandparents...), collapsed past grandparents by default with a "show more" per branch, since several lines run 4+ generations deep and showing all of them by default is what produced the original "tiny/cramped" complaint.
- Descendants: simple indented list/rows below the focus person's card (children, their spouses, grandchildren), expand/collapse per child.
- Every card: name, birth/death year, click → same detail panel content already used elsewhere (facts, sources, parts, open questions) — reuse `sourcesHtmlFor`/`partsHtmlFor`/`openQuestionsHtmlFor`/`businessHtmlFor`, do not reinvent.
- Legend + confidence styling: reused from existing `CLR`/branch-color scheme, not reinvented.
- Disproven-link and same-person-duplicate cases (rare, 2 and 0 respectively today) shown as a small inline note on the affected card, not a special edge-routing system — they're edge cases, not core to daily use.

## 5. Execution approach (changed from prior plans)

Prior plans delegated each session to a fresh cloud agent via a long natural-language prompt, then trusted its self-reported verification. That pattern is what produced this failure. This plan is executed directly, in this environment, with real Playwright + full internet access, committing incrementally and screenshotting the plain default view at every step before moving on. No session is marked done on a self-report alone.

## 6. Session breakdown

1. Family Tree component — ancestor side (expand/collapse upward from focus person), reusing detail panel/legend.
2. Family Tree component — descendant side (children/grandchildren downward) + focus-switching (click any card to re-center) + "not yet connected" list.
3. Retire Graph tab and Pedigree tab, wire Family Tree as their replacement; re-point all existing cross-tab jump links.
4. Copy/documentation pass across Research Log, Sources, Open Questions, Business & Property tab intros — accuracy + clarity, no functional changes.
5. Full regression + sign-off: every tab, every cross-link, mobile viewport, plain full-page screenshots of every view as the shipped record.
