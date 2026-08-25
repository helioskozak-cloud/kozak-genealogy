# Overnight brief — night of 2026-08-25 → 26

**Every batch reads this file first.** Each starts cold with no memory of the
last. This is the shared state: what is reachable, what is not, the rules, the
batches, and a running log at the bottom.

Owner: **Grant Kozak**. Site: `C:\kozak-genealogy\site` (git, public, GitHub
Pages). Working notes: `C:\kozak-genealogy\` (not a repo).

---

## 0. THE ONE RULE THAT MATTERS MOST

**`site/data/family.json` IS THE SOURCE OF TRUTH.** The site renders entirely
from it — ancestry, people, sources, research log, open questions. Nothing on
the page is hand-authored.

Research written anywhere else **does not exist**. This has already gone wrong
once: seven nights of work went into hand-written HTML, the data never heard of
it, and none of it appeared. If you find something, it goes in `family.json` or
it is lost.

After editing, always re-check: JSON parses, and **zero dangling refs** —
every `personRefs`, `sourceRefs` and `parents` id must exist.

---

## 1. TOOLING — hard-won, do not re-litigate

### Works
| Source | How |
|---|---|
| **Find a Grave** | **Playwright/Chromium ONLY.** Every plain fetch returns 403. This was written off across six sessions and is the single biggest unlock — it produced Clarence's Chicago birth and the whole Spaulding line. Scripts in `C:\Users\Helios\AppData\Local\Temp\claude\...\scratchpad\fg2.py`, `fgm.py`, `fgbatch.py` (rewrite if gone). Cemetery search: `/cemetery/<id>/memorial-search?lastname=X`. Person: `/memorial/<id>/<slug>`. |
| **CT death index** | `data.ct.gov/resource/psf6-3vsu.json` — *CT Vital Records Index of Deaths 1897-2001*. Free Socrata API. Fields: firstname, lastname, date, city. **Nothing else** — no ages, no parents. Confirms known deaths, generates candidates, proves no relationship. |
| **Nova Scotia Archives** | `archives.novascotia.ca/vital-statistics/results/` — plain GET, no login. **Use `LastS=<>` for EXACT match**; anything else silently means "contains" and inflates counts. Also `/census/results/?Search=` for 1767–1838 returns. |
| **Internet Archive** | Norwich Bulletin, collection `norwichbulletinmicrofilmotislibrary`: 311 volumes **1773–1930**. OCR via `archive.org/download/<id>/<id>_djvu.txt` (9–16MB). **Fetch with curl, not urllib** — urllib fails silently. ~half the volumes have no OCR. OCR quality is poor. |
| Obituaries | `WebSearch`, then `WebFetch`. `reformer.com` fetches fine. |
| `genealogytrails.com` | Free county histories, full text. |
| `ancestors.familysearch.org` | Person pages are public — but only reachable via `WebSearch` with `allowed_domains`. Direct fetch returns a browser-compat stub. |

### Blocked — do NOT spend time re-testing
`1950census.archives.gov` (network-level, connection reset — Playwright does not
help) · `bac-lac.gc.ca` (403) · `familysearch.org/search` (403) ·
`automatedgenealogy.com` (bot wall) · `census.nationalarchives.ie` (unreachable)
· `loc.gov` item pages (**Cloudflare challenge defeats headless Chromium too**)
· `geneanet.org` (403) · `keenesentinel.com` (429, persistently) ·
`everloved.com` (403) · Ancestry / MyHeritage / GenealogyBank / Newspapers.com
(paywalled — **the owner has no subscriptions**; cite as deferred leads, never
as action items).

---

## 2. STANDING DECISIONS — do not re-ask

- **Living people are named, "leads only"**, consistent with the site.
- **Free sources only.** The owner has no genealogy subscriptions.
- **Evidence tiers and confidence are mandatory** on every finding: Confirmed /
  Probable / Possible / Disproven. A search that returned nothing is a finding.
- **Every person gets birth year + location.** Repeated given names everywhere.
- Sources continue from **S158**; parts from **Part 56**.
- Never `git add -A`. Stage by name.

---

## 3. WHAT IS ACTUALLY OPEN

### Appel line (Elizabeth Anna Appel — the owner's aunt by marriage)
Established to five generations. Loose ends, best first:

1. **David and Pauline Skerry** — Clarence Edmond Skerry's parents, named on his
   memorial, no dates. **Clarence was born in Chicago 21 Sep 1877**, so where the
   Skerrys were before that is the whole remaining question on this line.
2. **Marion's DAR membership** — she belonged to the Cavendish chapter, which
   implies a *documented* Revolutionary ancestor. **DAR's Genealogical Research
   System (`services.dar.org/Public/DAR_Research/`) is FREE and public.** If her
   application is on file it names her ancestry back several generations at once.
   Highest value-per-effort item in the whole queue.
3. **Charles Elliot Spaulding (1833–1890) + Amantha Putnam Spaulding (1837–1926)**
   — Cavendish. Find a Grave family links; *Families of Cavendish* is print-only.
4. **Pemlia Shufelt Cook (1815–1899)** — Merrill's mother. Shufelt is a new
   surname; Iron Hill, Québec / Eastern Townships.
5. **William Herr Appel (d.1999)** — no reachable obituary; thinnest link in the
   chain. The **Herr** line points at Lancaster County PA Mennonites.

### Kozak line (the owner's own)
6. **Helen Ustaseski Kozak's death date is UNKNOWN** — S34 was retracted as a
   false match (wrong Helen, Pennsylvania). All that is established: she
   predeceased John, who died 6 Sep 2020.
7. **Frank Ustaseski (d.1956 Norwich) and M. G. Ustaszewska (b.1883, d.6 Sep 1937,
   buried Divine Providence)** — candidates for Helen's parents, unproven.
8. **Nicholas Kozak, b. 22 Sep 1893 Wilno** — immigration never worked. Try free
   passenger routes (Ellis Island / Castle Garden / stevemorse.org one-step).
9. **Anna Byczkowska** — probable death 14 Nov 1981 Norwich; origins unknown.
10. **Michael Shomsky / George + Helen Demchak** — candidate deaths, unconfirmed.

### Site
11. `index-legacy.html` and `tree.html` are both orphaned by the rebuild. Decide
    or flag; do not delete on your own judgement.

---

## 4. RULES FOR AN UNATTENDED BATCH

1. **Checkpoint into §6 every ~10 minutes.** A batch that dies at minute 50 with
   nothing written has produced nothing.
2. **Commit and push at least every 30 minutes**, and always before finishing.
   The owner reviews on another machine; local-only work is unreachable.
3. Stage files by name. **Never `git add -A`.**
4. On a rate or session limit: commit, write state into §6, stop cleanly.
5. Stay in your batch's scope. Anything for another batch goes under Handoffs.
6. **Do not overstate.** This project has already had to retract two sources
   (S34, S127). "Probable" and "not found" are good outcomes; a forced match is
   not.

---

## 5. THE BATCHES

**Batch A — DAR.** Marion C. (Cook) Skerry's DAR membership. Search the free DAR
GRS for her and for Spaulding/Cook/Putnam ancestors of Cavendish VT. Best
value-per-effort in the queue.

**Batch B — David and Pauline Skerry, Chicago 1877.** Find a Grave (browser),
Illinois/Cook County free indexes, obituary search. Where were the Skerrys
before Chicago?

**Batch C — the Cavendish cluster.** Charles Elliot + Amantha Putnam Spaulding,
Merrill Alonzo Cook, Pemlia Shufelt Cook. Find a Grave family links at Hillcrest
Cemetery Proctorsville (id 104054) — walk the whole plot, not just names already
known.

**Batch D — Helen Ustaseski.** Her death date, and whether Frank Ustaseski and
M. G. Ustaszewska were her parents. Find a Grave across CT; CT death index;
obituary search. Accept "still unproven".

**Batch E — Nicholas Kozak's immigration.** b. 22 Sep 1893 Wilno → Norwich CT.
Free passenger-list routes only. Also Anna Byczkowska's origins.

**Batch F — Shomsky / Demchak.** Confirm or reject the candidate deaths for
Michael Shomsky and George + Helen Demchak as the Bridgeport great-grandparents.

**Batch G — integrate and report.** Everything into `family.json`; verify the
site renders with zero console errors; push; then write
`C:\kozak-genealogy\MORNING_2026-08-26.md`: what was established, what was ruled
out, what needs the owner, and the three best next actions. Say plainly if a
batch found nothing.

---

## 6. RUNNING LOG — append, never overwrite

### Handoffs
_(things found by one batch that belong to another)_

---

### Batch 0 — 2026-08-25 — brief opened
State at handoff: **157 sources, 58 parts, 130 people.** Site rebuilt and
data-driven. Two sources retracted this session (S34 false Helen, S127 wrong
Clarence). The Appel line runs five generations; the Kozak line three with
candidates beyond. Next action: Batch A, the DAR research system.
