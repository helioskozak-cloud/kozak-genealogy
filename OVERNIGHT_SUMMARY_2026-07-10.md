# Overnight Summary — 2026-07-10

Recap of everything committed to `main` overnight (2026-07-09 evening through the morning of 2026-07-10), across all scheduled runs, for the site owner to read first.

## TL;DR

- **No new genealogy content (Parts/Sources) was added overnight.** The site's research content is unchanged: latest Part is still **Part 43**, latest Source is still **S123** (both from the Jul 6 2026 session).
- The main overnight deliverable is a **planning document**, `PRESENTATION_REDESIGN_PLAN.md` — a fully scoped redesign of the site's front page (see headline below).
- Tonight's Bryan/John McGivney brothers research pass found **no new citable evidence**: every external genealogy source it tried to reach (irishgenealogy.ie, cavanlibrary.ie, rootsweb.com, townlands.ie) returned HTTP 403 this session. Nothing was added to `index.html` as a result — per the standing rule, unvalidated/empty findings are not committed.

## What each run did

| When (UTC) | Commit | What happened |
|---|---|---|
| 2026-07-09 15:40 | `e0b99a7` | `test: verify push access` — a throwaway file to confirm the session could push to `origin/main`. |
| 2026-07-09 11:45 (local)/15:45 UTC | `b47884e` | `chore: remove push-access test file` — cleanup of the above. |
| 2026-07-10 03:04 | `bcd82a4` | `Add presentation redesign plan` — added `PRESENTATION_REDESIGN_PLAN.md` (108 lines), no `index.html` changes. |
| 2026-07-10 (this run) | — | Ran the Bryan/John McGivney brothers research pass (Part A) — found no new citable evidence, added nothing to `index.html`. Fixed a repo-state issue where the three commits above existed only on a detached `HEAD` and had never actually reached `origin/main` — they're now properly on `main` and pushed. Wrote this summary (Part B). |

One housekeeping note: the previous overnight runs left their commits on a detached `HEAD` rather than the `main` branch, so `origin/main` was still sitting at Part 43 (`ec23473`) when this run started, even though the planning doc had already been written to disk. This run fast-forwarded `main` to include those commits and pushed — so the redesign plan is now actually live on the repo (it wasn't before). Worth checking your `main`-branch checkout habits in future scheduled runs so this doesn't silently recur.

## New Parts/Sources added

None. Current state remains:
- **Latest Part: 43** (S123 · CT Death Index confirms James T. Relihan d.Sep 10 1946 Derby CT + Maurice Relihan d.1921)
- **Latest Source: S123**

## Bryan/John McGivney brothers research (tonight's Part A attempt)

Tonight's task was to look for new circumstantial evidence (land record adjacency, godparent/sponsor patterns, naming patterns) that Bryan McGivney (Creenow) and John McGivney (Derrylahan) — the great-great-grandfathers of Peter George McGivney and Fr. Michael J. McGivney respectively — were brothers, not just same-parish, same-era neighbors. This question is already extensively worked over in the existing site (Parts 11, 21–28, 33–35, 40–41; S90, S100–S104, S108–S109, S113–S121) and is currently carried as a "strong circumstantial case" / working hypothesis, not a documented fact.

This session was not able to add to it:
- Direct fetches of `irishgenealogy.ie` church records (baptism/sponsor search), `cavanlibrary.ie`'s digitized Freeholders Register, `sites.rootsweb.com`'s Crosserlough page, and `townlands.ie`'s Derrylahan page all returned **403 Forbidden**, including via a direct `curl` attempt (blocked at the outbound proxy).
- General web searches surfaced only information already cited in the existing Parts (Griffith's Valuation adjacency, the "Drumloman origin theory," the Rose/Peter naming-pattern note) — nothing new.
- No new Part/Source was added, per the rule against committing unvalidated or non-substantive work.

**For a future run:** the most promising unexplored angle is the actual sponsor/godparent data in the NLI Crosserlough Catholic parish register (baptisms from Oct 13 1843), which the site has never been able to search in transcribed form — only image scans have been referenced (`registers.nli.ie/parishes/0826`). A session with working access to `irishgenealogy.ie`'s search form, or to RootsIreland's Cavan index, would be the highest-value next attempt. The redesign plan (§8 below) already earmarks 1–2 nights for exactly this.

## Presentation redesign plan — headline

`PRESENTATION_REDESIGN_PLAN.md` (written by an earlier overnight run) proposes replacing the front page's current format — 43 chronological "Part" prose blocks, ~20,000 words, one continuous scroll — with a **single interactive graph/tree view**: each person shown as a compact name + birth-year card, arranged chronologically, with hover/click pop-outs revealing full sourced detail. It's a 7-night build (schema → data extraction → unified graph → compact cards/pop-outs → chronological toggle → verification pass), with a hard requirement that no existing research content (any `S###` or `Part N` citation) gets lost in the migration — verified by an automated coverage check before anything ships. The plan explicitly separates this UI work from the 4 open research threads (including tonight's Bryan/John question), which resume on their own footing afterward — realistic total across both tracks is **11–12 nights**, not 7.

No code from the plan has been implemented yet — it's planning-only, as designed.
