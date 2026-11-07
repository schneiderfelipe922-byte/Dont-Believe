"""Normalize generated Mel art into the game's 4-direction sheets, one shared scale.

This only extracts, scales and anchors the generated frames; it does not redraw art.
"""
from collections import deque
from pathlib import Path
import hashlib
import json
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'assets/sprites-e-idles/fontes-mel/prancha-gerada.png'
FINAL = ROOT / 'assets/sprites-e-idles/sprites-novos'
OUT = FINAL / 'mel'
PREVIEW = ROOT / 'previas/mel'
CELL, BASELINE, HEIGHT = 48, 46, 26


def components(image):
    width, height = image.size
    mask = bytearray(image.getchannel('A').point(lambda a: 255 if a > 160 else 0).tobytes())
    result = []
    for start in range(len(mask)):
        if not mask[start]:
            continue
        queue = deque([start]); mask[start] = 0
        count = 0; x0 = width; y0 = height; x1 = y1 = 0
        while queue:
            i = queue.popleft(); x, y = i % width, i // width
            count += 1; x0 = min(x0, x); y0 = min(y0, y); x1 = max(x1, x); y1 = max(y1, y)
            for j in (i-width if y else -1, i+width if y < height-1 else -1,
                      i-1 if x else -1, i+1 if x < width-1 else -1):
                if j >= 0 and mask[j]:
                    mask[j] = 0; queue.append(j)
        if count > 2500:
            result.append((x0, y0, x1+1, y1+1))
    assert len(result) == 40, f'Expected 40 isolated cat frames; found {len(result)}'
    return result


def build():
    OUT.mkdir(parents=True, exist_ok=True); PREVIEW.mkdir(parents=True, exist_ok=True)
    image = Image.open(SOURCE).convert('RGBA')
    boxes = components(image)
    # Artwork's rows have slight baseline offsets: sort by the four authored baselines.
    rows = [[] for _ in range(4)]
    for box in boxes:
        row = min(range(4), key=lambda r: abs(box[3] - [219, 389, 571, 773][r]))
        rows[row].append(box)
    for row in rows:
        row.sort(key=lambda b: b[0]); assert len(row) == 10
    scale = HEIGHT / max(b[3]-b[1] for row in rows for b in row)
    sheets = {'walk': Image.new('RGBA', (CELL*6, CELL*4)),
              'idle': Image.new('RGBA', (CELL*4, CELL*4))}
    for r, row in enumerate(rows):
        animations = {'walk': [], 'idle': []}
        for i, box in enumerate(row):
            crop = image.crop(box)
            size = (max(1, round(crop.width*scale)), max(1, round(crop.height*scale)))
            crop = crop.resize(size, Image.Resampling.NEAREST)
            frame = Image.new('RGBA', (CELL, CELL))
            frame.alpha_composite(crop, ((CELL-size[0])//2, BASELINE-size[1]))
            category, col = ('walk', i) if i < 6 else ('idle', i-6)
            sheets[category].alpha_composite(frame, (col*CELL, r*CELL))
            animations[category].append(frame)
        for category, frames in animations.items():
            # Dark stage background is preview-only; runtime sheets retain genuine alpha.
            previews = []
            for frame in frames:
                bg = Image.new('RGBA', frame.size, '#211b20'); bg.alpha_composite(frame)
                previews.append(bg.convert('RGB').resize((192,192), Image.Resampling.NEAREST))
            previews[0].save(PREVIEW / f'{category}-{["frente","esquerda","direita","costas"][r]}.gif',
                             save_all=True, append_images=previews[1:], duration=160 if category=='walk' else [450,250,450,250], loop=0)
    for name, sheet in sheets.items():
        sheet.save(OUT / f'{name}.png', optimize=True)
    preview = Image.new('RGB', (CELL*10, CELL*4), '#211b20')
    preview.paste(sheets['walk'], (0,0), sheets['walk'])
    preview.paste(sheets['idle'], (CELL*6,0), sheets['idle'])
    preview.resize((1440,576), Image.Resampling.NEAREST).save(PREVIEW / 'sprites.png')
    manifest = json.loads((FINAL / 'manifest.json').read_text())
    manifest['personagens']['mel'] = {'altura': HEIGHT,
        'idle': {'arquivo': 'mel/idle.png', 'quadros_por_direcao': 4, 'celula': [CELL,CELL], 'duracoes_ms': [450,250,450,250]},
        'walk': {'arquivo': 'mel/walk.png', 'quadros_por_direcao': 6, 'celula': [CELL,CELL], 'duracoes_ms': [160]*6}}
    (FINAL / 'manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2)+'\n')
    hashes = json.loads((FINAL / 'sha256.json').read_text())
    for name in ['idle','walk']:
        relative = f'mel/{name}.png'; hashes[relative] = hashlib.sha256((FINAL/relative).read_bytes()).hexdigest()
    (FINAL / 'sha256.json').write_text(json.dumps(hashes, ensure_ascii=False, indent=2)+'\n')
    print('Mel: 40 frames; shared scale', scale, '; 26px maximum silhouette, baseline 46, 48px cells')

if __name__ == '__main__':
    build()
