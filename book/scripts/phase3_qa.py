from pathlib import Path
import re, sys
root=Path(__file__).resolve().parents[1]
chapters=sorted((root/'chapters').glob('*'))
statuses={'VERIFIED','PARTIALLY VERIFIED','NEEDS VERIFICATION','DISPUTED','INCORRECT','PHILOSOPHICAL','RELIGIOUS CLAIM','OPINION'}
errors=[]
if len(chapters)!=30: errors.append(f'Expected 30 chapters, found {len(chapters)}')
claim_ids=[]
for d in chapters:
    for name in ['brief.md','research.md','visual-plan.md','claims.md']:
        if not (d/name).exists(): errors.append(f'Missing {d/name}')
    if (d/'brief.md').exists():
        txt=(d/'brief.md').read_text()
        for sec in ['Opening Scene','Narrative Arc','Scientific Explanation','Philosophical Problem','Counterpoint','Response','Unknowns','Closing Thought','Next Chapter Hook','Reader Experience','Manuscript Readiness Score']:
            if f'## {sec}' not in txt: errors.append(f'Missing brief section {sec} in {d.name}')
    if (d/'visual-plan.md').exists() and '## VISUAL-01' not in (d/'visual-plan.md').read_text(): errors.append(f'Missing VISUAL-01 in {d.name}')
    if (d/'research.md').exists():
        txt=(d/'research.md').read_text(); ids=re.findall(r'### (CLAIM-\d+)',txt); claim_ids += ids
        for st in re.findall(r'Status:\n([^\n]+)',txt):
            if st.strip() not in statuses: errors.append(f'Invalid status {st} in {d.name}')
        for cid in ids:
            block=txt.split(f'### {cid}',1)[1].split('### CLAIM-',1)[0]
            for field in ['Original Claim:','Category:','Priority:','Status:','Source IDs:','Evidence:','Confidence:','Editorial Action:']:
                if field not in block: errors.append(f'Missing {field} in {cid}')
if len(claim_ids)<90: errors.append(f'Expected at least 90 claims, found {len(claim_ids)}')
if len(claim_ids)!=len(set(claim_ids)): errors.append('Duplicate claim IDs found')
sources=(root/'research'/'sources.md').read_text() if (root/'research'/'sources.md').exists() else ''
sids=re.findall(r'## (SRC-\d+)',sources)
if not sids: errors.append('No source IDs')
if len(sids)!=len(set(sids)): errors.append('Duplicate source IDs')
for doc in ['consistency-audit.md','diagram-register.md','phase-3-report.md']:
    if not (root/'docs'/doc).exists() and doc!='phase-3-report.md': errors.append(f'Missing docs/{doc}')
print('PHASE 3 QA')
print(f'chapters={len(chapters)} claims={len(claim_ids)} sources={len(sids)}')
print('errors=',len(errors))
for e in errors: print('ERROR:',e)
sys.exit(1 if errors else 0)
