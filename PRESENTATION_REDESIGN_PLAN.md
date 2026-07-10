# Presentation Redesign Plan

**Status at time of writing:** `main` @ `b47884e`, latest research entry = **Part 43 / S123** (Jul 6 2026 session). This plan does not modify `index.html` — it is the design + schedule for a future set of sessions.

## 1. The problem

The site owner's complaint: the front page (`tab-overview`) is a wall of prose. Concretely — the Overview tab is **43 "Part" session-log blocks, ~20,000 words, one continuous scroll, ordered most-recent-first** (Part 43 at the top, Part 1 at the bottom). To find "when was X born" you have to either know which Part discussed it or scan the whole thing.

The ask: a single interactive "web" (graph/tree) where each person shows only **name + birthdate** at a glance, arranged **chronologically**, with click/hover pop-outs revealing the full detail (sources, notes, Part citations) that today is buried in prose.

## 2. Reference examples researched

| Example | What's good about it | How it applies here |
|---|---|---|
| [WikiTree Compact Family Tree](https://www.wikitree.com/wiki/Help:Compact_Family_Tree) / [Person Profile](https://www.wikitree.com/wiki/Help:Person_Profile) | Profile header is strictly name + dates + place; everything else (bio prose, sources, DNA) lives in collapsed sections below, expanded on demand. Proves the "name+date only, click for the rest" pattern scales to thousands of profiles. | Matches the requested card format exactly: name/birthdate on the node, everything else (facts, sources, Part citations) inside the pop-out. |
| [donatso/family-chart](https://github.com/donatso/family-chart) ([docs](https://donatso.github.io/family-chart-doc/)) | Actively maintained, MIT-licensed, D3-based family tree renderer. Cards are small (name + date), zoom/pan, framework-agnostic, and it exposes a click handler per card for custom detail panels. | Don't need to adopt the library wholesale — the site already has a hand-rolled D3 v7 pedigree renderer (`index.html:1040-1360`, ahnentafel-indexed boxes+lines) with a working `showPanel()` click-to-detail pop-out. `family-chart`'s card/click-handler split is the validation that generalizing the *existing* renderer (rather than importing a new dependency) is the right call — same interaction model, zero new library risk. |
| [D3 collapsible tree demo](https://kyhau.github.io/d3-collapsible-tree-demo/) / [d3-pedigree-examples](https://github.com/justincy/d3-pedigree-examples) | Vanilla D3 v-whatever patterns for expand/collapse subtrees and pedigree layout with animated transitions, no framework. | Directly portable to this codebase since it already loads `d3@7` from CDN and already has a layout math module (`genOf/rowOf/xOf/yOf` at `index.html:1058-1065`). The new "unified web" is this same toolkit generalized from a strict binary ahnentafel tree to a general node/edge graph (needed once cousins, disproven links, and multiple marriages are represented). |
| [FamilySearch Timeline Grids](https://www.familysearch.org/en/wiki/Timeline_Grids) | Person + event-type + date + place + notes as a sortable grid, explicitly built for "what happened when" across a family group rather than a single lineage. | Model for the **chronological view mode**: a second lens over the same node data, sorted by birth year instead of generation/branch, satisfying the "chronological order" part of the ask without needing a second data store. |
| [Ancestry.com tree navigation (hover preview card)](https://support.ancestry.com/s/article/Navigating-an-Ancestry-Family-Tree) | Hover surfaces a lightweight preview card before committing to a full click-through to the detail page — two tiers of disclosure. | Suggests a two-tier pop-out here too: **hover** = 2-3 line summary (dates, one-line status), **click** = full panel (all facts, sources, Part citations, confirm/deny). Avoids overwhelming the graph view while still making full detail one click away, and reuses the existing `.cbar` confirm/deny UI inside the click tier. |

## 3. Feasibility assessment of the current codebase

This is better positioned for the redesign than "prose blog → structured app" usually is, because **structure already exists in three places**:

1. **`BRANCHES` array** (`index.html:755-1040`, ~285 lines, 30 person entries across 4 sub-trees: `grant`, `mcgivney_family`, `tpr`, `mcn`). Each person already has `id` (ahnentafel index), `name`, `branch` (color/family group), `relation`, `note` (dates as free text), `facts[]` (label/value pairs), optional `prob` flag and `confirm` object. There is **already a working click-to-detail pop-out** (`showPanel()`, `index.html:1099-1121`) — the pop-out mechanism the redesign needs is not being built from zero, it's being generalized.
2. **Sources tab** (`index.html:1722-1862`, 123 rows, `S01`-`S123`): already a regular HTML table — person, related person, relationship/clue, source type, citation, date, confidence badge, notes. This is close to a direct 1:1 extraction into JSON; no prose-mining needed for sources themselves.
3. **Missing Links tab** (`index.html:1362-1722`): already broken into structured sub-fields per open question (hypothesis / geographic status / remaining steps / exact searches / user notes), just as styled HTML cards rather than data.

**What's *not* structured, and is the real work:**
- The 43 Part-section narrative blocks (Overview tab) are unstructured prose. Facts about specific people are stated inline in paragraphs, not attached to a person record — e.g. Part 41's resolution of the Patrick/Peter first-cousin relationship exists only as a paragraph, not as a fact on either person's node.
- Only 30 people currently have tree nodes; a rough scan of the Sources table shows on the order of 80-100+ distinct named individuals across all branches once collaterals (Finns, Demchaks, Kozaks, etc.) are counted — most have no node today.
- The 4 sub-trees in `BRANCHES` are separate ahnentafel binary trees (strict parent math via `genOf/rowOf`), not one connected graph. Cousin relationships, disproven hypotheses, and probable-vs-confirmed links don't fit that math and will need a general node/edge structure instead.

**Verdict: feasible.** The extraction target is bounded (~20k words, 123 sources, an estimated 80-120 people) and about a third of the destination schema already exists in working form. The heaviest lift is prose-mining the Part sections without dropping facts, plus building one connected graph in place of four disconnected trees — the risk is completeness of extraction, not technical novelty.

## 4. Target data model

A single `data/family.json` (or equivalent — SQLite adds a build step for no real benefit at this scale; a JSON file loaded by the existing inline `<script>` is simplest and keeps the site static/GitHub-Pages-friendly):

```jsonc
{
  "persons": {
    "peter-george-mcgivney": {
      "name": "Peter George McGivney",
      "birth": {"year": 1891, "month": 2, "day": 7, "place": "Derby CT", "confidence": "confirmed"},
      "death": {"year": 1973, "month": 3, "day": 25, "place": "Derby CT", "confidence": "confirmed"},
      "branch": "mcg",
      "relations": {"spouse": ["helen-relihan"], "parents": ["peter-mcgivney-sr", "ann-clark-mcgivney"]},
      "facts": [{"label": "Married", "value": "Helen Relihan, Jun 14 1921", "sources": ["S51"]}],
      "sources": ["S51", "S89"],
      "partRefs": [39, 41],
      "confirm": {"id": "...", "q": "..."}
    }
  },
  "sources": { "S01": {"person": "...", "relatedPerson": "...", "clue": "...", "type": "...", "citation": "...", "date": "...", "confidence": "confirmed", "notes": "..."} },
  "parts": { "43": {"date": "2026-07-06", "title": "...", "sourceRefs": ["S123"], "personRefs": ["james-t-relihan"] } }
}
```

Key design choices:
- `persons` keyed by a stable slug id, not the ahnentafel `k` index — required to merge the 4 disconnected trees into one graph and to add the ~50-90 people who exist only in the Sources table today.
- Every fact/source/relation carries its own `confidence` (`confirmed` / `probable` / `tenuous` / `disproven`) so the graph can render badge coloring exactly as today's `.bc/.bp/.bt/.bx` badges do, without re-deriving it.
- `partRefs` on both persons and sources is what lets a pop-out say "see Part 41 for the reasoning" without re-embedding the prose — the Part-log narrative doesn't disappear, it becomes a linked citation instead of the primary surface.

## 5. Target front-end

- **Default view: the graph/web.** Nodes = persons, positioned as one connected D3 force or hierarchical-DAG layout (generalizing the existing `genOf/rowOf/xOf/yOf` math or replacing it with a proper DAG layout once cousins/multiple-marriage edges are in play — see Night 4). Node = compact card, name + birth year only, colored/bordered by branch and confidence exactly as today.
- **Chronological mode toggle:** same node data, alternate layout sorted by birth year along a single axis (timeline), per the FamilySearch Timeline Grids pattern — this is what satisfies "in chronological order" without a second data store.
- **Two-tier pop-out**, per the Ancestry hover-vs-click pattern:
  - Hover → 2-3 line tooltip (dates, one confidence-status line).
  - Click → full panel: generalized `showPanel()`, listing all `facts[]`, linked `sources[]` (rendered inline, not just cited), `partRefs[]` as jump links back to a **retained** Research Log tab, and the existing `.cbar` confirm/deny control.
- **Existing tabs (Missing Links, Sources, Search Queue, Business & Property) stay** — the graph becomes the new default landing tab, but nothing is deleted; the Overview prose tab is renamed **"Research Log"** and kept as the chronological session-by-session audit trail (still valuable — it's the *how we know* record, distinct from the *what we know* graph).

## 6. Night-by-night schedule

Honest scope check first: **7 nights covers the redesign itself (data + graph + chronological + verification). It does not leave room for the 4 open research threads in the same 7.** Forcing research into the same budget would mean shortchanging either the extraction-completeness check or the threads — given "no research content lost" is an explicit requirement, that's not a trade worth making silently. Proposed: **7 nights for the redesign, then research threads resume on their own footing starting night 8**, sized per-thread below in §7.

| Night | Work | Deliverable |
|---|---|---|
| **1** | Define `family.json` schema (§4, finalized against real data quirks found while extracting). Write a one-off extraction script that mechanically converts the 30 `BRANCHES` entries + 123 Sources-table rows into the new schema (both are already regular/structured — low risk). | `data/family.json` seeded with 30 people (all `partRefs`/`confirm` preserved) + 123 sources, `node --check`-validated extraction script discarded after use (data file is static output, not runtime code). |
| **2** | Mine the 43 Part-section paragraphs for facts not yet captured in step 1 — new people, dates, relationship resolutions (e.g. Part 41's cousin determination), status changes (RESOLVED/DISPROVEN markers). This is the largest single-night risk (20k words) — timebox to Parts 43→22 (most information-dense / most recent) if it overruns. | `family.json` updated; running list of any Part content *not yet* mapped, carried to Night 3. |
| **3** | Finish prose-mining (Parts 21→1, generally shorter/older). Fold Missing Links cards and Search Queue items into `family.json` as person-linked open questions (`openQuestions[]`) rather than leaving them as separate unstructured HTML. | Full `family.json`, ~80-120 people, all 123 sources and all 43 Parts linked to at least one person. |
| **4** | Build the unified graph structure: replace the 4 disconnected ahnentafel trees with one node/edge graph (parent/child/spouse/disproven-link edge types); generalize the D3 layout math for a general DAG instead of a strict binary tree. | Working (unstyled) force/DAG render of all persons on one canvas, driven by `family.json`. |
| **5** | Build the compact card component (name + birth year, branch/confidence styling reused from existing CSS vars) + two-tier pop-out (hover tooltip, click → generalized `showPanel()` with facts/sources/partRefs/confirm-deny). | Graph view fully interactive, matching §5. |
| **6** | Build chronological toggle (birth-year-sorted layout, same node/pop-out components); rename Overview → Research Log, wire `partRefs` jump links; confirm Missing Links/Sources/Search Queue/Business tabs still render correctly against the new data-backed structure. | Full new front end feature-complete; extract `BRANCHES` `<script>` to temp `.js`, `node --check` before any commit. |
| **7** | **Verification/reverify pass** (see §7 detail below) + fix any drift found + final commit/push. | Signed-off migration: every fact, source citation, S-number, and Part-conclusion on the current live site is confirmed present in the new site. |

## 7. Verification / reverify step (Night 7, detail)

Because "don't lose research content" is a hard requirement, this is a diff, not a spot-check:

1. **Automated coverage check:** script walks the *current live* `index.html` and extracts every `S\d+` token and every `Part \d+` token that appears in prose; cross-checks each appears in `family.json` (`sources` keys / `parts` keys respectively, or in a person's `partRefs`/`sources`). Flags any orphaned S-number or Part with zero downstream reference.
2. **Fact-density spot check:** for a sample of ~15 people (weighted toward the most fact-dense — McGivney/Relihan core lines, not distant collaterals), manually diff the old pop-out/prose against the new pop-out fact-by-fact.
3. **Confidence-badge check:** every `RESOLVED`/`CONFIRMED`/`DISPROVEN` status callout currently in the colored alert boxes (e.g. Part 41's cousin resolution, Part 5's branch-merge disproof) must show the matching `confirmed`/`disproven` state on the relevant node — these are the highest-value conclusions on the site and the easiest to silently flatten during extraction.
4. Only after (1)-(3) pass clean: commit and push. If anything fails, fix and re-run (1) before proceeding — do not ship on a partial pass.

## 8. Folding remaining nights into the open research threads

Once the redesign ships (end of Night 7), the site is a better research tool, not a finished research project — the 4 open threads continue on their own merits:

| Thread | Current blocker | Realistic next step |
|---|---|---|
| **LNV archive access** (`lnv.historyarchives.online`) | JS-rendering blocks programmatic fetch; free archive tier only covers through Jan 1931 anyway (per current site notes), which may not even cover the record needed. | Needs a manual browser session (not a fetch-based search pass) to confirm what the archive actually holds before spending more automated search budget on it — 1 night to manually page through relevant date ranges and record findings, or conclusively rule it out as a dead end. |
| **Ann née Clark's father identity conflict** | Source data itself is inconsistent (S50 lists Ann McGivney née Clark's parents in a way that doesn't parse cleanly). | 1 night: re-derive from primary records (not the secondary Find A Grave/Ancestry transcription already on file) — Crosserlough/Cavan parish or civil records for Ann Clark's actual baptism, cross-check against the existing S50 citation for a transcription error vs. a genuine name conflict. |
| **Bryan/John McGivney brothers evidence** | Currently asserted from geographic proximity (same parish, adjacent townlands) — Missing Links card itself says "almost certainly brothers or first cousins," not confirmed. Needs the actual Crosserlough Parish baptism register entries for Bryan's and John's children naming their father, per the card's own "remaining steps." | 1-2 nights: targeted IrishGenealogy.ie / FamilySearch Crosserlough baptism register search for the specific entries already identified in the Missing Links card (Patrick b.~1832 father-name check, Peter b.~1844 father-name check). |
| **James T. Relihan's Sep 1946 obituary** | CT Death Index entry confirmed (S123, Part 43) but the obituary text itself — the "documentary proof" for Sub-chain C — hasn't been retrieved. Site notes it's in the Valley Gazette/Ansonia-Derby-Seymour archive (subscription) or outside the LNV free archive's 1931 cutoff. | 1 night, and it's now unblocked *by* the LNV thread above: once that manual session confirms what's accessible, target the Sep 1946 date directly (subscription archive or a library/historical-society lookup) rather than repeated blind searches. |

Total: roughly **4-5 additional nights** for the four threads (LNV thread first, since it unblocks the James T. Relihan obituary search) — bringing the realistic total for "redesign + resume research" to **11-12 nights**, not 7. If the user wants to compress this, the honest lever is cutting Night 7's verification sample size (§7.2) or accepting a slower chronological-mode build (fold into Night 5 instead of a dedicated Night 6) — not cutting the research threads, which were already open before this plan and aren't created by it.
