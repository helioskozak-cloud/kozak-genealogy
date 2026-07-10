// Night-1 extraction script: index.html BRANCHES array + Sources table -> data/family.json
// Not part of the runtime site — this is a one-off migration tool kept as
// documentation of the BRANCHES/Sources -> family.json mapping (crossRef
// dedup logic, the S90 malformed-row quirk, etc). Re-run with `node
// scripts/extract_family_json.js` from the repo root to regenerate.
'use strict';
const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..');
const INDEX_HTML = path.join(REPO_ROOT, 'index.html');
const OUT_PATH = path.join(REPO_ROOT, 'data', 'family.json');

const html = fs.readFileSync(INDEX_HTML, 'utf8');

// ---------------------------------------------------------------------------
// 1. Extract BRANCHES array via a real JS eval (source is a trusted JS object
//    literal with unquoted keys / single quotes — not valid JSON, so we let
//    the JS engine parse it instead of hand-rolling a parser).
// ---------------------------------------------------------------------------
const startMarker = 'var BRANCHES=[';
const endMarker = '];// end BRANCHES';
const startIdx = html.indexOf(startMarker);
const endIdx = html.indexOf(endMarker);
if (startIdx === -1 || endIdx === -1) {
  throw new Error('Could not locate BRANCHES array markers in index.html');
}
const arrayLiteral = html.slice(startIdx + 'var BRANCHES='.length, endIdx + ']'.length);
const BRANCHES = new Function('return (' + arrayLiteral + ');')();

// ---------------------------------------------------------------------------
// 2. Extract the Sources table (123 rows) via regex + entity decoding.
// ---------------------------------------------------------------------------
function decodeEntities(s) {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .replace(/&#8211;/g, '–')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#x2717;/g, '✗')
    .replace(/&#x2715;/g, '✕')
    .replace(/&#x2713;/g, '✓')
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}
function stripTags(s) {
  return decodeEntities(s.replace(/<\/?(strong|em|br|span)[^>]*>/gi, '')).trim();
}

const rowRe = /<tr><td>(S\d+)<\/td>(.*?)<\/tr>/gs;
const sources = {};
let rowMatch;
let rowCount = 0;
while ((rowMatch = rowRe.exec(html)) !== null) {
  const sid = rowMatch[1];
  const rowBody = rowMatch[2];
  const cellRe = /<td(?:\s+class="([a-z]+)")?>(.*?)<\/td>/gs;
  const cells = [];
  let cellMatch;
  while ((cellMatch = cellRe.exec(rowBody)) !== null) {
    cells.push({ cls: cellMatch[1] || null, text: stripTags(cellMatch[2]) });
  }
  let dataQuirk = null;
  if (cells.length === 7) {
    // S90 in the live table is malformed: one <td> (Source type) is missing
    // entirely from the HTML, so the row has 8 columns instead of the usual
    // 9. Verified by hand against the header row; every other row has 9.
    // Reconstruct with an empty "type" so downstream shape stays uniform.
    cells.splice(3, 0, { cls: null, text: '' });
    dataQuirk = 'source row missing the "Source type" <td> in index.html — reconstructed with type:"" ';
  } else if (cells.length !== 8) {
    throw new Error(`Unexpected cell count (${cells.length}) for ${sid}`);
  }
  const [person, relatedPerson, clue, type, citation, date, conf, notes] = cells;
  sources[sid] = {
    num: Number(sid.slice(1)),
    person: person.text,
    relatedPerson: relatedPerson.text,
    clue: clue.text,
    type: type.text,
    citation: citation.text,
    date: date.text,
    confidenceClass: conf.cls,
    confidence: conf.text,
    notes: notes.text,
    dataQuirk
  };
  rowCount++;
}
if (rowCount !== 123) {
  throw new Error(`Expected 123 source rows, found ${rowCount}`);
}

// ---------------------------------------------------------------------------
// 3. Flatten BRANCHES into branches[] + persons{}.
//    - persons{} entries (ahnentafel-keyed) -> id `${treeId}-${key}`
//    - childGroups[].children[] -> id `${treeId}-cg${groupIdx}-${childIdx}`,
//      unless the child carries crossRef, in which case it is NOT a new
//      person — it's a duplicate pointer back to persons[crossRef] in the
//      same tree, and is recorded as a crossRef, not a new person record.
// ---------------------------------------------------------------------------
const branches = [];
const persons = {};
let personRecordCount = 0;
let crossRefCount = 0;

for (const tree of BRANCHES) {
  const treeId = tree.id;
  const personKeys = tree.persons ? Object.keys(tree.persons).map(Number) : [];

  branches.push({
    id: treeId,
    color: tree.color,
    name: tree.name,
    note: tree.note || null,
    descHtml: tree.descHtml || null,
    personKeys
  });

  if (tree.persons) {
    for (const key of Object.keys(tree.persons)) {
      const p = tree.persons[key];
      const id = `${treeId}-${key}`;
      persons[id] = {
        id,
        sourceTree: treeId,
        sourceKey: Number(key),
        kind: 'persons',
        name: p.name,
        branch: p.branch || null,
        relation: p.relation || null,
        note: p.note || null,
        prob: !!p.prob,
        facts: p.facts || [],
        confirm: p.confirm || null,
        crossRef: null,
        childGroupInfo: null,
        partRefs: [] // not present in source data yet — populated Nights 2-3
      };
      personRecordCount++;
    }
  }

  if (tree.childGroups) {
    tree.childGroups.forEach((group, groupIdx) => {
      group.children.forEach((child, childIdx) => {
        if (child.crossRef !== undefined && child.crossRef !== null) {
          // Not a new person — a pointer back to persons[crossRef] in this tree.
          const targetId = `${treeId}-${child.crossRef}`;
          if (!persons[targetId]) {
            throw new Error(`crossRef ${child.crossRef} in tree ${treeId} has no matching persons entry`);
          }
          crossRefCount++;
          return;
        }
        const id = `${treeId}-cg${groupIdx}-${childIdx}`;
        persons[id] = {
          id,
          sourceTree: treeId,
          sourceKey: null,
          kind: 'childGroup',
          name: child.name,
          branch: child.branch || null,
          relation: null,
          note: child.note || null,
          prob: !!child.prob,
          facts: child.facts || [],
          confirm: child.confirm || null,
          crossRef: null,
          childGroupInfo: {
            parentKey: group.parentKey,
            label: group.label,
            groupIndex: groupIdx,
            childIndex: childIdx
          },
          partRefs: []
        };
        personRecordCount++;
      });
    });
  }
}

// ---------------------------------------------------------------------------
// 4. Assemble + write.
// ---------------------------------------------------------------------------
const output = {
  meta: {
    schemaVersion: 1,
    description: 'Night 1 mechanical extraction of index.html BRANCHES array + Sources table. See PRESENTATION_REDESIGN_PLAN.md section 4 for the target schema this seeds. Prose (43 Part narrative sections) is NOT yet mined into this file — that is Nights 2-3. partRefs[] on persons is present but empty for every record because the source BRANCHES data has no partRefs field today.',
    personRecordCount,
    crossRefCount,
    sourceRecordCount: rowCount
  },
  branches,
  persons,
  sources
};

fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
fs.writeFileSync(OUT_PATH, JSON.stringify(output, null, 2) + '\n');

console.log(`Wrote ${OUT_PATH}`);
console.log(`  branches: ${branches.length}`);
console.log(`  persons: ${Object.keys(persons).length} (${personRecordCount} extracted, ${crossRefCount} crossRefs deduped)`);
console.log(`  sources: ${Object.keys(sources).length}`);
