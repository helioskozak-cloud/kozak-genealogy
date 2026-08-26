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

**A → B (Skerry).** Every documented Skerry line in the DAR database is a
**SALEM, ESSEX COUNTY, MASSACHUSETTS** family, going back to the 1740s and
intermarrying with Felt, Ward, Chever and Thompson — Samuel Skerry bp.1747,
Samuel b.1772, Samuel Henry b.1806, Samuel Russell b.1833, Ebenezer Ward
b.1840, Amory Thompson b.1863, Deborah Skerry m. John Felt. **Nothing connects
this to David and Pauline Skerry of Chicago** and S161 makes no such claim. But
with Nova Scotia disproven, an old Essex County family that sent people west is
the best available hypothesis for where Clarence's father came from. Test it;
do not assume it.

**A → C (Cavendish/Hillcrest).** New target at Hillcrest, Proctorsville:
**Adelaide (Spaulding) Cook Brittain**, Marion's sister, DAR #360312 — no birth
date, husband's first name unknown. Also confirmed to have died in
Proctorsville and therefore likely buried nearby: **Amantha Putnam Spaulding**
(d. 30 May 1926) and **Merrill Alonzo Cook** (d. 16 Jun 1945). Walk the plot for
further Cook siblings.

**A → any batch (paywall note).** DAR record copies went to **$15 each on
16 March 2026**. Both applications say "Additional, but unverified lineage is
listed on the application" — meaning the paper copy carries generations the free
database does not show. That is a **deferred lead, not an action item**, and it
is the one paid source in this project worth naming to Grant, because it is a
one-off $15 rather than a subscription.

---

### Batch 0 — 2026-08-25 — brief opened
State at handoff: **157 sources, 58 parts, 130 people.** Site rebuilt and
data-driven. Two sources retracted this session (S34 false Helen, S127 wrong
Clarence). The Appel line runs five generations; the Kozak line three with
candidates beyond. Next action: Batch A, the DAR research system.

---

### Batch A — 2026-08-25 — DAR — **DONE, and it paid out**
Pushed `de0f1f0`. **161 sources · 59 parts · 137 people · zero dangling refs.**

- **Marion C. (Cook) Skerry = DAR National #84679**, ancestor **A107735**. The
  Cavendish-chapter membership in the family story is documented.
- **A107735 = WILLIAM SPALDING**, b. 11 Sep 1737 Westford MA, **Corporal**,
  Massachusetts line (Capt. Asa Lawrance, Col. Jonathan Reed), **d. 28 Jun 1805
  CAVENDISH VT**. Service proved from *MA Soldiers and Sailors* vol.14
  pp.677-678 — a free, independently checkable Tier 1 compilation.
- **This closes Part 48.** Part 48 found a William Spaulding among Cavendish's
  original 1780s settlers in the 1891 county history and could not tell whether
  he was kin. Same man. Two sources found a week apart closing on each other.
- **Four new generations** above Charles Elliot Spaulding: Nathaniel + Anna
  Swift, John + Eunice Jones, William + Esther Dutton. Three new surnames.
- **A new sibling: Adelaide (Spaulding) Cook Brittain**, DAR #360312 on the same
  patriot, daughter of Merrill and Addie — Marion's sister, not previously in
  the tree.
- **Two applications, 35 years apart, verified separately, agreeing date for
  date** across five generations. Adelaide's (c.1946) fills in every place
  Marion's (c.1911) left blank; all the new exact dates come from it.

Method note for later batches: the GRS **Descendants** tab (`Tab_ID=5`) is the
valuable one — it posts to `search_descendants/default.cfm` with
`MyLast_Name`/`First_Name`/`BirthState`/`Action=Search`/`SearchSource=Form`,
and each result row carries a `MyPrimary_Seqn` link that renders the **full
lineage chain**. The Member detail pages (`search_member/`) render empty and are
not worth fetching. Searching the WIFE's surname plus `BirthState` is what found
this; the husband's surname alone returned nothing.

**Then the patriot was verified in the published source, free** (`2a995c0`,
S162, **162 sources**). DAR cites *Massachusetts Soldiers and Sailors* vol.14
pp.677-678; that book is on the Internet Archive in full text
(`massachusettssol14mass`), so the page was read directly instead of trusted
second-hand. It matches DAR exactly — the page break even falls mid-entry,
confirming the citation — and adds what DAR did not carry: *"Corporal, Capt.
Asa Laurance's co. of volunteers, Col. Jonathan Reed's regt.; entered service
Sept. 26, 1777; discharged Nov. 9, 1777; service, 1 mo. 15 days, at the
Northward … company raised in Littleton and Westford and marched to assist army
under Gen. Gates."* **Burgoyne surrendered at Saratoga on 17 Oct 1777, inside
that 45-day turnout.** Recorded as marching to assist Gates, **not** as having
fought — the source does not say so and late-arriving militia often did not
engage. Volume 14 holds several William Spaldings; ours is the Corporal, matched
on Westford.

**General lesson worth reusing: when a compiled record cites a printed source,
check whether that source is on the Internet Archive.** It cost one download and
turned a Tier 2 record into Tier 1 with a campaign attached.

Not done in Batch A, left open: Putnam, Swift, Jones and Dutton parentages are
not carried on either application.

---

### Batch B — 2026-08-25 — IN PROGRESS — checkpoint 1
**MAJOR, and it cuts against the S127 retraction. Handle carefully.**

NS Archives birth register, book 1816 p.170 no.449, read from the free scan:
> **Clarence Edmund Skerry, M, b. 27 Sept 1872 Lakeville. Father: David T.
> Skerry, CARPENTER, Lakeville. Mother: Paulina Rockwell. Married 22 Sept 1866,
> BOSTON, MASS. Informant: D. T. Skerry, Lakeville.**

So the Kings County couple IS David T. Skerry + Pauline L. Rockwell (Find a
Grave, one stone, Lakeview Cemetery Billtown: David b. 19 Dec 1837 CHESTER,
Lunenburg Co, d. 30 Sep 1909; Pauline b. 1837 Kings Co, d. 1909).

**They married in BOSTON in 1866** — this family was already moving between Nova
Scotia and the US, and David was a carpenter, a trade that followed work.

Our Clarence: b. **21 Sep 1877 CHICAGO**, son of **David and Pauline** Skerry.
Theirs: b. **27 Sep 1872 Lakeville**, son of **David T.** and **Paulina**. Same
rare surname, same parents' names, same given names, birthdays six days apart in
late September. Two unrelated David+Pauline Skerry couples both naming a
Clarence Edmund born in late September is not a credible coincidence.

**But which reading is right is NOT yet settled**, and this project has already
been burned once here:
 (a) the 1872 boy died and the name was reused on a Chicago-born son in 1877; or
 (b) they are one man and the 1877/Chicago data on his memorial — which comes
     from late, self-reported Vermont records — is wrong, meaning S127 was right
     and the retraction over-corrected.
Against (a): there is **no Kings County death record for him**, and NS death
coverage does include 1864-1877. Against (b): "Chicago" is a specific claim.

**NS Archives tooling correction — the brief was incomplete.** Checkboxes need
`B=birth&M=marriage&D=death`, NOT `B=on`. With `on` the site returns "No records
found" for *everything*, including Smith — a silent false negative. `LastS=<>`
for exact was right. Record pages give only book/page/number; the **scanned
register image is free** at
`/images/vital-statistics/births/<book>/<book>-<page5>.jpg` and is readable.
**Always control-test this search with a common surname before reporting a
negative.**

### Batch B — 2026-08-25 — **DONE** — pushed `27343ae`
**168 sources · 60 parts · 139 people · zero dangling refs.** S163–S168, Part 57.

**Answered:** where the Skerrys were before Chicago — **Nova Scotia**, south
shore into Kings County. **Pauline's maiden name is ROCKWELL** (the standing
open question on her). David T. Skerry + Pauline L. Rockwell share one stone at
Lakeview Cemetery, Billtown, Sec 1 Stone 40. Two new siblings: **Aubrey Eaton
Skerry** (1867–1936, stayed) and **Frederick Leander** (1869–1870, infant).
David was **Baptist**, a carpenter then farmer, **married Paulina at BOSTON on
22 Sep 1866**.

**Reopened, deliberately and on the record:** the child was registered twice,
and the mother's own registration gives **21 September** — our Clarence's exact
birthday. **S127 moved Disproven → Probable; S148 Confirmed → Probable on the
birth details only.** Neither promoted to Confirmed; the five-year and
country-of-birth conflicts are real and unexplained. **Do not let a later batch
quietly resolve this in either direction without a new primary document.**

**THE decisive test, for whoever picks it up — 1881 Canadian census, Lakeville,
Kings County.** A Clarence aged 8 in David Skerry's household kills the Chicago
birth outright; his absence supports it. `bac-lac.gc.ca` (403) and
`automatedgenealogy.com` (bot wall) are both on the blocked list, so this needs
a *new* free route — try `familysearch.org` **ancestors** pages via WebSearch
with `allowed_domains` (per §1 that route works), or a Kings County GenWeb
transcription. Second choice: 1880 US census, Chicago. Third: the Vermont 1936
death record read rather than summarised.

**Not attempted:** Chicago city directories 1875–1880 on the Internet Archive.
Cheap and free, and would show a David Skerry in Chicago or not. Good next move.

#### Tooling learned in Batch B — IMPORTANT, §1 is incomplete
- **NS Archives checkboxes need `B=birth&M=marriage&D=death`, NOT `B=on`.** With
  `on` the site returns **"No records found" for everything, including Smith** —
  a completely silent false negative. `LastS=<>` (exact) was right. Full working
  query: `/vital-statistics/results/?First=&FirstS=<>&Last=X&LastS=<>&Place=&County=&sYear=&eYear=&B=birth&M=marriage&D=death`
  (URL-encode `<>` as `%3C%3E`). Results cap at ~26 rows with no pagination —
  narrow by `County=` to see more.
- **ALWAYS control-test a search with a common surname before reporting a
  negative.** That is the only reason this batch caught the bug.
- **The register scans are free and readable.** Record pages give only
  book/page/number; the image is at
  `/images/vital-statistics/{births,deaths}/<book>/<book>-<page-5-digit>.jpg`
  and can be downloaded with curl and read directly. **This is a much bigger
  unlock than the index** — the index has no parents on it; the scan has
  parents, occupation, marriage date and place, and the informant's name.
- `ilsos.gov` (Illinois SOS — statewide death and marriage indexes) **times out
  at the network level**, like `1950census.archives.gov`. Add to blocked.
