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

### Batch C — 2026-08-26 — IN PROGRESS — checkpoint 1
Starting S169 / Part 58. Hillcrest 104054 swept: Cook 6, Spaulding 27, Putnam 2,
Skerry 2, Brittain 2, **Shufelt 0**.

Found so far (all Find a Grave, Tier 2):
- **Batch A handoff closed:** Adelaide Spaulding "Addie" Cook Brittain
  **b. 31 May 1893, d. 1 Jul 1996 — aged 103**; husband **Clifford Samuel
  Brittain (1884-1969)**. Both at Hillcrest.
- **NEW GENERATION, Shufelt:** Pemlia's parents are **John Shufelt (1788-1858)**
  and **Jane Salls Shufelt (1791-1876)**, m. 1815. **SALLS** is a new surname.
  Pemlia's siblings: Candace Boright (1817-1914), David (1819-1911), John Daniel
  (1829-1875), Lana Ann Bull (1834-1913), Harriet O Willis McCoy (1836-1922).
- **Addie's five siblings** (Charles Elliot + Amantha's other children): Ida J
  (1860-1863, died at 3), Alice Jenny Magwire (1866-1951), Frank Charles
  (1869-1925), Lillian M (1875-1947), Gertrude Ina Jewell (1878-1967).
- **Merrill's siblings** (Pemlia's children): Harris Cook (1838-1928), Silas
  Jackson Cook (1840-1919), Polly Jane Newton (1849-1947), Fannie Maria Newton
  (1849-1922), Candace Lucy Cook Cook (1855-1950), David S Cook (d.1930).

**Still missing: MERRILL'S FATHER.** Confirmed structurally, not just by
omission — Pemlia's memorial has Parents, Siblings and Children groups and **no
Spouse group at all**. Trying his siblings' memorials next.

Also note: **Charles Elliot Spaulding and Amantha Putnam have NO parents on Find
a Grave.** Batch A got his from DAR (Nathaniel + Anna Swift); Find a Grave does
not contradict it, it is simply silent. **Amantha's Putnam parentage is open on
both sources.**

#### Tooling — Find a Grave family links
`fgq.py`'s `#family-members` selector returns nothing; the section is found by
matching a heading against /family|parent|sibling|spouse|child/ and taking
`h.closest('section,div')`. **Names and dates are on SEPARATE lines** of the
section's innerText, and the group labels (Parents/Spouse/Siblings/Children) are
inline — so you must pair each name line with the following date line and track
the last label seen, or you will merge parents, siblings and children into one
undifferentiated list. Working script: `scratchpad/fgfam3.py`. Scroll the page
(4 x mouse.wheel) before reading — the section lazy-loads.

### Batch C — 2026-08-26 — **DONE** — pushed `4e60ce7`
**177 sources · 61 parts · 163 people · zero dangling refs.** S169–S177, Part 58.

**Established.** Pemlia Shufelt Cook's parents are **John Shufelt (1788-1858)**
and **Jane Salls (1791-1876)**, m.1815, Union Cemetery, **Brome, Québec** — the
same township Merrill was born in. New surnames **SALLS**, and **CHURCH** via
John's bio line ("Son of William Shufelt & Catherine Church", Possible only).
**Pemlia died in Greene County, IOWA**, 1899. Batch A's handoff closed:
**Adelaide Cook Brittain b. 31 May 1893, d. 1 Jul 1996, aged 103**, m. Clifford
Samuel Brittain. Sixteen new collateral relatives: 5 siblings for Addie, 6 for
Merrill (Candace Lucy b.1855 likely his twin), 5 for Pemlia.

**Merrill's father: NOT FOUND, and now a documented negative (S174).** Four
memorials each name a mother and no father; Pemlia's has no Spouse group at all;
she is the only Cook at Greenbrier. Find a Grave cannot answer it.

**Amantha Putnam's parents: NOT FOUND**, and now silent on *two* independent
sources — both DAR applications and Find a Grave. The only Hillcrest Putnams
were born 1844, far too late to be hers.

#### Handoffs
**C → whoever takes Québec.** Both remaining Cook questions now point at the
same place: **Brome County, Québec — parish registers and the 1851/1861
censuses.** That would settle Merrill's father, test the Silas Cook lead (S175),
and probably reach the Shufelt generation above John. No free route to Québec
records has been tried yet in this project; `bac-lac.gc.ca` is 403 but the
**Drouin/BAnQ** collections and `bibliotheque.banq.qc.ca` have not been tested.
**Do NOT attach Silas Cook to the tree without a record** — S175 is a naming
coincidence in a small township, deliberately left unlinked.

**C → Amantha Putnam.** Needs a different *kind* of source, not another cemetery
sweep: Springfield VT town vital records, or the published *Putnam Leaflets* /
Putnam family genealogies, which are old enough to be free on the Internet
Archive. Worth one look given how well vol.14 of MA Soldiers and Sailors paid
off in Batch A.

**C → site.** `John Spaulding II (1784-1858)` and `Dolly Spear Spaulding` are at
Hillcrest and are NOT in the tree. Our John Spaulding is b.1760; the 1784 man is
probably his son, i.e. Nathaniel's brother — **untested, not recorded as kin.**

#### Tooling — Find a Grave family links (this cost 20 minutes, do not repeat it)
- `#family-members` does not exist. Find the section by matching a heading
  against `/family|parent|sibling|spouse|child/` and taking `h.closest('section,div')`.
- **Names and dates are on SEPARATE lines** of that section's `innerText`, and
  the group labels are inline. Pair each name line with the FOLLOWING date line
  and track the last label seen — otherwise Parents, Siblings and Children merge
  into one undifferentiated list and you will attach the wrong relationship.
  That failure mode already happened once in this project.
- Scroll before reading (4 × `mouse.wheel`); the section lazy-loads.
- Working script: **`scratchpad/fgfam3.py`** (groups) alongside `fgq.py`
  (details/lists) and `cemid.py` (cemetery ids from a memorial).

### Batch D — 2026-08-26 — IN PROGRESS — checkpoint 1
Starting S178 / Part 59. **Owner's own line.**

**Method note that mattered:** searched the CT death index under her MARRIED
name, KOZAK, not Ustaseski. Prior work had only swept USTAS*.

- **123 Kozak deaths in CT 1897-2001.** Confirms two known: NICHOLAS KOZAK
  Norwich 1950-03-08 and ANNA KOZAK Norwich 1981-11-14.
- **Exactly three HELEN KOZAKs**: Waterbury 1984-05-20, Southington 1996-11-28,
  **NEW LONDON 1999-01-04** — New London County, same county as Norwich.
- The Southington one is **eliminated**: Find a Grave has Helen W Kozak
  **1920**-1996 at South End Burying Ground, Plantsville (in Southington). Ours
  was born 1924.
- The index carries **only firstname/lastname/date/city** — verified against the
  raw JSON. No ages, no parents. It can generate a candidate, never confirm one.
- Find a Grave: **no** Helen Kozak in Norwich or New London County; only ONE
  Ustaseski worldwide (Stanley, 1885-1943, New Haven). Divine Providence is
  untranscribed for Kozaks (S154), so absence proves nothing there.

**Jennie A. Kozak's Feb 2009 obituary (The Day) — a real constraint.** Her
family list names every spouse: "Mark and wife, Nancy", "David and his wife,
Elizabeth", "Cindy and her husband, Tom Buckley" — but **"brother, John J. Kozak
of Norwich" is listed ALONE, with no wife.** So Helen was almost certainly
already dead by February 2009. Consistent with the 1999 candidate; NOT proof of
it.
Also from that obituary: **the Kozak house was 103 GOLDEN ST., Norwich**, where
Jennie was born at home in 1925 to Anna (Byczkowska) and Nicholas — which
corroborates John marrying "his Golden Street neighbour".

**NOT adopting the New London 1999 entry.** Same shape as the S34 error:
plausible name, plausible place, no confirming detail.

#### Tooling
**legacy.com 403s WebFetch but renders fine under Playwright.** Generic fetcher
written at `scratchpad/pget.py`. This opens the whole Legacy/The Day/Norwich
Bulletin obituary archive, which earlier batches had written off. dignitymemorial
fetches normally; **echovita returns 410**.

### Batch D — 2026-08-26 — **DONE** — pushed `167d743`
**183 sources · 62 parts · 163 people · zero dangling refs.** S178–S183, Part 59.

**Q1 Helen's death date: STILL UNKNOWN.** Narrowed, not solved.
- Ruled out: Southington 1996 (Helen W Kozak b.**1920**, Plantsville).
- Open, unsupported: Waterbury 1984.
- **One live candidate: HELEN KOZAK, NEW LONDON, 4 JAN 1999.** NOT adopted —
  index has no age/spouse/parents. Same shape as the S34 error. **Do not
  promote this without a second document.**
- **Window closed from 2020 to Feb 2009** via Jennie's obituary, which names
  every other spouse and lists John alone.
- Not on Find a Grave: all 49 worldwide Helen Kozaks b.1924±5 checked; the one
  CT hit is the Southington woman. Divine Providence still has ZERO Kozaks.
- **New fact:** the Kozak house is **103 Golden St., Norwich**.

**Q2 parentage: UNCHANGED, still Probable.** Frank Ustaseski has no memorial
anywhere on Find a Grave; Mary Ustaszewska's has no family section at all; no
other Ustaszewski/a anywhere in CT. Nothing was added to the S146 argument.

#### Handoffs
**D → E/F/G, and it is the single best remaining Kozak-line target.**
**FRANK USTASESKI'S OBITUARY, Norwich, ~13-14 February 1956.** He died three
months after Helen married John, so a notice would list a surviving daughter as
**"Mrs. John Kozak"** and prove the parentage in one line. Free Norwich Bulletin
digitisation stops in 1930 (S156) — but **legacy.com now works under Playwright**,
so The Day's archive is worth testing for 1956, and **Google News Archive carries
The Day (New London) as free page images** and has never been tried by this
project. Same trick would reach Mary Ustaszewska's 1937 notice.

**D → whoever writes the morning report.** Say plainly that Helen's date is a
**phone call, not a research problem**: Mark Kozak is living and knows it, and a
photograph of the Divine Providence headstone settles Helen AND likely Nicholas
and Anna, whose plot is equally untranscribed.

#### Tooling — two findings that change earlier conclusions
1. **legacy.com renders under Playwright** (403s WebFetch). Opens The Day /
   Norwich Bulletin obituary archives that earlier batches wrote off. Generic
   fetcher: `scratchpad/pget.py`. **dignitymemorial** fetches normally;
   **echovita returns 410**.
2. **Find a Grave's location filter gives SILENT FALSE NEGATIVES.** Proved by
   control test: surname USTASZEWSKA + `location=Connecticut&locationId=state_9`
   → "No matches found"; the same surname unfiltered → **M. G. Ustaszewska,
   Divine Providence Cemetery, Norwich, CONNECTICUT** as the first result.
   **Never trust a location-filtered Find a Grave negative** — search unfiltered
   and read the locations, or scope by cemetery id, which does work. Same class
   of bug as the NS Archives checkbox fault in Batch B.
3. CT death index fields are **only** firstname/lastname/date/city — confirmed
   against raw JSON. It generates candidates; it can never confirm one.

### Batch E — 2026-08-26 — IN PROGRESS — checkpoint 1
Starting S184 / Part 60.

**THE ELLIS ISLAND SEARCH WORKS AND IS FREE.** Not `libertyellisfoundation.org`
— the live form is a WordPress plugin at
**`https://www.statueofliberty.org/arrival-search/`**, AJAX, fields
`first_name / last_name / exact_match_first / exact_match_last / sex /
birth_year_from / birth_year_to / residence_place / arrival_year_from /
arrival_year_to / arrival_location_us / ship_name / passenger_id / nonce`.
Drive it with Playwright (`scratchpad/ellis.py`). reCAPTCHA is on the page but
does not block the search. It covers MORE than Ellis Island — NY passenger
lists, Philadelphia, Detroit, and **St Albans VT Canadian border crossings**.
`castlegarden.org` is DOWN (000) but only covers 1820-1892 anyway.

**CAUTION — two search behaviours that will mislead you:**
- The name match is **FUZZY/soundex**. "Anna Byczkowska" returned Goczkowski,
  Beczkowski, Baczkowska, Buczkowska, Buschkowska. Exact-match checkboxes help
  but the result set is still loose. Read every returned name.
- **`residence_place` does not filter as advertised.** `last=Kozak` +
  `residence=Wilno` cut 23,312 down to 9 — but not one of the 9 has Wilno as its
  last residence (Rozany, Berehy Dolna, Lipniez Wielkie, Kamionka...). Do not
  report "no Kozaks from Wilno" on the strength of that field.

Results so far, nothing adopted:
- **BYCZKOWSKA exact: 11 records.** No Anna. Notable cluster: four Byczkowskas
  arriving together 21 Aug 1900 from **Sereje** (Seirijai, Lithuania — the right
  region) — Kazimir, Jozef, Helena, Rozalia. No connection established.
- **BYCZKOWSKI exact: 37.** No Anna.
- **MIKOLAJ KOZAK: 11. NIKOLAJ KOZAK: 4.** Every one with a stated residence is
  **Galicia/Austria** (Torki, Zabnice, Korostowick, Starzawa, Pcim, Kuleszy) —
  none from Wilno. Worth noting as background: Kozak is overwhelmingly a
  Galician/Ukrainian surname, and Wilno is far to the north, so a Kozak family
  from Vilnius is genuinely unusual.

### Batch E — 2026-08-26 — **DONE** — pushed `20adf3d`
**189 sources · 63 parts · 163 people · zero dangling refs.** S184–S189, Part 60.

**Both immigration questions: NOT FOUND.** Normal outcome, recorded as negatives.
- **Nicholas:** 11 Mikolaj + 4 Nikolaj Kozak arrivals; every one with a stated
  origin is **Galicia/Austria**, none from Wilno. None adopted.
- **Anna:** 11 Byczkowskas, 37 Byczkowskis, no Anna.

**The one result that genuinely narrows things: ZERO Byczkowski/Byczkowska
deaths in Connecticut, 1897-2001.** Near-spellings (2 Byckowski, 9 Buczkowski)
are all in other cities — **not one in Norwich or New London County**. Find a
Grave agrees (224 worldwide, none in CT). **Anna's birth family were not Norwich
people. Stop looking for her origins in Norwich.**

#### Handoffs
**E → a future batch: TEST THE WILNO, ONTARIO HYPOTHESIS (S186).** Kozak is a
southern-Polish/Ukrainian surname and Vilnius is far north; **Wilno, Ontario**
(Renfrew County — oldest Polish settlement in Canada, founded 1858 by Kashubians,
named for the city) is an alternative reading of Nicholas's birthplace. It would
explain why no ship arrival exists, since such a man crosses a land border — and
**St Albans VT border crossings keep appearing in these results.** Checkable
prediction: **a Kozak household in Renfrew County, Ontario in the 1891 or 1901
Canadian census.** Recorded at Possible and **deliberately NOT attached to the
tree.** If it fails, the Vilnius birth stands unchanged.

**E → still open from D:** Frank Ustaseski's Feb 1956 Norwich obituary remains
the single best Kozak-line document. And the **Divine Providence headstone
photograph would settle Nicholas, Anna AND Helen at once** — that plot is
untranscribed and is now blocking three separate questions.

#### Tooling — a real unlock plus three traps
**The Ellis Island search is FREE and WORKS.** Earlier sessions wrote it off
because they used `libertyellisfoundation.org`. The live form is
**`https://www.statueofliberty.org/arrival-search/`** — WordPress plugin, AJAX,
fields `first_name/last_name/exact_match_first/exact_match_last/sex/
birth_year_from/birth_year_to/residence_place/arrival_year_from/arrival_year_to/
arrival_location_us/ship_name/passenger_id/nonce`. Drive with Playwright:
`scratchpad/ellis.py`, `scratchpad/ellis2.py` (the latter sets the range
sliders via a native value-setter + input/change events). reCAPTCHA is present
but does not block searching. Covers **more than Ellis Island** — NY 1820-1920,
Philadelphia, Baltimore, Detroit/Port Huron, **St Albans VT Canadian border
crossings 1895-1954**.

**Three ways it will lie to you:**
1. **Matching is FUZZY/soundex.** "Anna Byczkowska" returns Goczkowski,
   Beczkowski, Baczkowska, Buczkowska, Buschkowska. Read every returned name;
   never trust the count alone.
2. **`residence_place` does not filter.** `Kozak` + `Wilno` cut 23,312 → 9, and
   none of the 9 had Wilno as last residence. Never draw a place-based negative
   from it.
3. **The birth-year range DELETES records that have no birth year** — which is
   most of them. Adding birth 1891-1895 to a Mikolaj Kozak search made the real
   Mikolaj Kozaks vanish and left only soundex noise. Filters here remove real
   records silently — the same failure family as the NS Archives checkboxes
   (Batch B) and the Find a Grave location filter (Batch D). **This project has
   now hit that bug three times in three different tools: assume a filter is
   broken until a control test says otherwise.**

`castlegarden.org` is DOWN (000) — but it only covers 1820-1892, so no loss.
