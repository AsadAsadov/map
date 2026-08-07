#!/usr/bin/env python3
from pathlib import Path
import re, sys
ROOT=Path(__file__).resolve().parents[1]
files=[ROOT/'manuscript'/f for f in ['01-bir-gun-dunyaya-geldik.md','02-sen-dogulanda-hec-ne-bilmirdin.md','03-kainatin-icinde-bir-noqte.md','04-ulduzlarin-kullerinden-yaranan-insan.md','05-heyat-nece-basladi.md']]
sources=set(re.findall(r'^## (SRC-\d+)',(ROOT/'research'/'sources.md').read_text(encoding='utf-8'),re.M))
diagrams=set(re.findall(r'^## (DGM-\d+)',(ROOT/'docs'/'diagram-register.md').read_text(encoding='utf-8'),re.M))
errors=[]
for f in files:
    if not f.exists(): errors.append(f'missing manuscript file: {f.relative_to(ROOT)}'); continue
    text=f.read_text(encoding='utf-8')
    if not text.strip(): errors.append(f'empty chapter: {f.name}')
    if '\ufffd' in text: errors.append(f'unicode replacement character: {f.name}')
    words=re.findall(r"[\wƏəĞğİıÖöŞşÜüÇç'-]+", text, re.UNICODE)
    if len(words)<400: errors.append(f'too short chapter (<400 words): {f.name} ({len(words)})')
    heads=re.findall(r'^(#{1,6})\s+(.+)$', text, re.M)
    seen=set()
    for _,h in heads:
        if h in seen: errors.append(f'duplicate heading in {f.name}: {h}')
        seen.add(h)
    ch=f.name[:2]
    vp=ROOT/'chapters'/next(p.name for p in (ROOT/'chapters').glob(ch+'-*'))/'visual-plan.md'
    allowed_visuals=set(re.findall(r'^## (VISUAL-\d+)', vp.read_text(encoding='utf-8'), re.M))|{'HERO-01','SECONDARY-01'}
    for v in re.findall(r'\[VISUAL:\s*([^\]]+)\]', text):
        if v not in allowed_visuals: errors.append(f'undefined visual marker in {f.name}: {v}')
    for d in re.findall(r'\[DIAGRAM:\s*([^\]]+)\]', text):
        if d not in diagrams: errors.append(f'undefined diagram ID in {f.name}: {d}')
    for s in re.findall(r'\[(SRC-\d+)\]', text):
        if s not in sources: errors.append(f'undefined source ID in {f.name}: {s}')
print('MANUSCRIPT QA:', 'PASS' if not errors else 'FAIL')
print(f'Files checked: {len(files)}')
if errors:
    for e in errors: print('ERROR:',e)
    sys.exit(1)
