"""Rebuild the lossless character atlas from assets/sprites.zip (Python + Pillow)."""
from pathlib import Path
from PIL import Image
from zipfile import ZipFile, ZIP_DEFLATED
import io
import json

ROOT = Path(__file__).resolve().parents[1]
ARCHIVE = ROOT / 'assets/sprites.zip'
DIRECTIONS = {'down': 'south', 'left': 'west', 'right': 'east', 'up': 'north'}
WIDTH = 512


def build():
    with ZipFile(ARCHIVE) as source:
        files = {name: source.read(name) for name in source.namelist()
                 if not name.startswith('runtime/') and not name.endswith('/')}
    manifest = json.loads(files['manifest.json'])
    data, packed = {}, []
    x = y = row_height = 0
    for kind, spec in manifest.items():
        tracks, idles, body_height = {}, {}, 0
        for direction, name in DIRECTIONS.items():
            prefix = f'{kind}/Idle/animations/{spec["animation"]}/{name}/'
            walking = sorted(f for f in files if f.startswith(prefix) and f.endswith('.png'))
            for names, target in [(walking, tracks), ([f'{kind}/Idle/rotations/{name}.png'], idles)]:
                frames = [Image.open(io.BytesIO(files[f])).convert('RGBA') for f in names]
                boxes = [im.getchannel('A').getbbox() for im in frames]
                assert frames and all(boxes), f'Empty track: {kind}/{direction}'
                box = (min(b[0] for b in boxes), min(b[1] for b in boxes),
                       max(b[2] for b in boxes), max(b[3] for b in boxes))
                w, h = box[2] - box[0], box[3] - box[1]
                body_height = max(body_height, h)
                rects = []
                for frame in frames:
                    if x + w > WIDTH:
                        x, y, row_height = 0, y + row_height + 1, 0
                    packed.append((frame.crop(box), x, y))
                    rects.append([x, y, w, h])
                    x += w + 1
                    row_height = max(row_height, h)
                target[direction] = {'frames': rects, 'anchor': [w / 2, h],
                                     'bounds': [0, 0, w, h], 'durations': [200] * len(frames)}
        data[kind] = {'image': 'sprites', 'height': spec['height'], 'sourceHeight': body_height,
                      'idleAnimated': False, 'directions': tracks, 'idles': idles}
    atlas = Image.new('RGBA', (WIDTH, y + row_height))
    for im, px, py in packed:
        atlas.paste(im, (px, py))
    # Preserve alpha and every original pixel; use PNG's maximum lossless compression.
    atlas.save(ROOT / 'assets/sprites.png', optimize=True, compress_level=9)
    js = ('(function(root){\nconst data=' + json.dumps(data, separators=(',', ':')) +
          ';\nroot.CharacterData=data;if(typeof module!=="undefined")module.exports=data;\n'
          '})(typeof window!=="undefined"?window:globalThis);\n')
    (ROOT / 'character-data.js').write_text(js)
    with ZipFile(ARCHIVE, 'w', compression=ZIP_DEFLATED, compresslevel=9) as out:
        for name, content in files.items():
            out.writestr(name, content)
        out.writestr('runtime/sprites.png', (ROOT / 'assets/sprites.png').read_bytes())
        out.writestr('runtime/character-data.js', js)
    print(f'{len(data)} characters, {len(packed)} frames, {atlas.width}x{atlas.height}; {ARCHIVE}')


if __name__ == '__main__':
    build()
