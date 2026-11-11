"""Fingerprint local art/scripts/styles so browsers cannot mix old and new sprites."""
from pathlib import Path
import hashlib,json,re,struct
ROOT=Path(__file__).resolve().parents[1]

def digest(path):return hashlib.sha256(path.read_bytes()).hexdigest()[:12]
def art_urls(text):
    urls=dict(re.findall(r"(\w+):'([^']+\.(?:png|webp))'",text))
    for person in ['kali','noah','mira','eron','tomas','vigia','lider','daty','inauri','mel']:
        urls['dialogue_'+person]='assets/dialogos/retratos/'+person+'.png'
    return urls

def build():
    source=ROOT/'javascript/assets.js';text=source.read_text()
    urls=art_urls(text)
    revisions={name:digest(ROOT/url) for name,url in urls.items()}
    size=struct.unpack('>II',(ROOT/urls['sprites']).read_bytes()[16:24])
    block='// BEGIN GENERATED ART REVISIONS — tools/prepare-web-assets.py\nconst revisions='+json.dumps(revisions,separators=(',',':'))+';\nconst spriteSize='+json.dumps(size,separators=(',',':'))+';\n// END GENERATED ART REVISIONS'
    text=re.sub(r'// BEGIN GENERATED ART REVISIONS.*?// END GENERATED ART REVISIONS',lambda m:block,text,flags=re.S)
    source.write_text(text)
    index=ROOT/'index.html';html=index.read_text()
    def version(m):
        attr,url=m.group(1),m.group(2).split('?')[0]
        return attr+'="'+url+'?v='+digest(ROOT/url)+'"'
    html=re.sub(r'(src|href)="((?:javascript|css)/[^"?]+(?:\?[^\"]*)?)"',version,html)
    index.write_text(html)
    print('Versioned',len(revisions),'images and local JavaScript/CSS; atlas',size,revisions['sprites'])
if __name__=='__main__':build()
