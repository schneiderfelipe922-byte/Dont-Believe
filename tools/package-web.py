"""Build a complete, versioned web folder, excluding authoring sources and Unity."""
from pathlib import Path
from zipfile import ZipFile,ZIP_DEFLATED
import hashlib,json,re
from zoneinfo import ZoneInfo
from datetime import datetime
import runpy

ROOT=Path(__file__).resolve().parents[1]

def build():
    art=runpy.run_path(str(ROOT/'tools/prepare-web-assets.py'),run_name='__main__')
    today=datetime.now(ZoneInfo('America/Sao_Paulo')).date().isoformat()
    name='dont-believe-web-'+today
    out=ROOT/'output'/(name+'.zip');out.parent.mkdir(exist_ok=True)
    runtime=[ROOT/'index.html',*ROOT.glob('javascript/*.js'),*ROOT.glob('css/*.css')]
    files=runtime+[ROOT/'LEIA-ME.txt',*ROOT.glob('*.md'),*ROOT.glob('documentacao/*.md')]
    # Paths assembled at runtime (the dialogue portraits) come from the same manifest as the preloader.
    resources=set(art['art_urls']((ROOT/'javascript/assets.js').read_text()).values())
    literal_asset=re.compile(r"(assets/[^\s\"'()?]+\.(?:png|webp|jpe?g|svg|ttf|woff2?|mp3|ogg|wav))\b",re.I)
    for source in runtime:resources.update(literal_asset.findall(source.read_text()))
    files.extend(ROOT/resource for resource in resources)
    files.extend(ROOT.glob('assets/fontes/*-OFL.txt'))
    files.extend((ROOT/'assets').rglob('*.md'))
    hashes={p.relative_to(ROOT).as_posix():hashlib.sha256(p.read_bytes()).hexdigest() for p in sorted(files)}
    with ZipFile(out,'w',compression=ZIP_DEFLATED,compresslevel=9) as package:
        for p in sorted(files):package.write(p,name+'/'+p.relative_to(ROOT).as_posix())
        package.writestr(name+'/versao.json',json.dumps({'version':today,'sha256':hashes},ensure_ascii=False,indent=2))
    print(out,'—',len(files),'files')
    return out

if __name__=='__main__':build()
