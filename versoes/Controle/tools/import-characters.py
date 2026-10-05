"""Rebuild the atlas and runtime metadata from the sources in assets/sprites.zip."""
from pathlib import Path
from PIL import Image
from zipfile import ZipFile, ZIP_DEFLATED
import io
import json

ROOT = Path(__file__).resolve().parents[1]
ARCHIVE = ROOT / 'assets/sprites.zip'
DIRECTIONS = {'down': 'south', 'left': 'west', 'right': 'east', 'up': 'north'}
WIDTH = 512


def cropped_track(files, names):
    frames = [Image.open(io.BytesIO(files[name])).convert('RGBA') for name in names]
    boxes = [frame.getchannel('A').getbbox() for frame in frames]
    assert frames and all(boxes), f'Empty track: {names}'
    box = (min(b[0] for b in boxes), min(b[1] for b in boxes),
           max(b[2] for b in boxes), max(b[3] for b in boxes))
    return [frame.crop(box) for frame in frames], boxes[0][3] - boxes[0][1]


def build():
    with ZipFile(ARCHIVE) as source:
        files = {name: source.read(name) for name in source.namelist()
                 if not name.startswith('runtime/') and not name.endswith('/')}
    manifest = json.loads(files['manifest.json'])
    data, packed = {}, []
    x = y = row_height = 0
    for kind, spec in manifest.items():
        raw, original_height = [], 0
        for direction in spec.get('directions', list(DIRECTIONS)):
            name = DIRECTIONS[direction]
            rotation = f'{kind}/Idle/rotations/{name}.png'
            prefix = f'{kind}/Idle/animations/{spec.get("animation")}/{name}/'
            walking = sorted(f for f in files if f.startswith(prefix) and f.endswith('.png'))
            if walking:
                frames, _ = cropped_track(files, walking)
                original_height = max(original_height, frames[0].height)
                raw.append(('directions', direction, frames, None, [200] * len(frames)))
            if rotation in files:
                original_height = max(original_height, cropped_track(files, [rotation])[0][0].height)
            override = spec.get('idle_frames', {}).get(direction)
            frames, neutral_height = cropped_track(files, override or [rotation])
            if not override:
                original_height = max(original_height, frames[0].height)
            durations = spec.get('idle_durations', [200] * len(frames)) if override else [200]
            assert len(frames) == len(durations)
            raw.append(('idles', direction, frames, neutral_height if override else None, durations))
        tracks = {'directions': {}, 'idles': {}}
        normalize = spec.get('normalize_height', False)
        for category, direction, frames, override_height, durations in raw:
            scale = spec['height'] / (override_height or original_height) if normalize else 1
            w, h = max(1, round(frames[0].width * scale)), max(1, round(frames[0].height * scale))
            rects = []
            for frame in frames:
                frame = frame.resize((w, h), Image.Resampling.NEAREST) if scale != 1 else frame
                if x + w > WIDTH:
                    x, y, row_height = 0, y + row_height + 1, 0
                packed.append((frame, x, y))
                rects.append([x, y, w, h])
                x += w + 1
                row_height = max(row_height, h)
            tracks[category][direction] = {'frames': rects, 'anchor': [w / 2, h],
                                           'bounds': [0, 0, w, h], 'durations': durations}
        # Front-only assets remain front-facing; never pretend that these are walk cycles.
        if not tracks['directions']:
            idle = tracks['idles']['down']
            tracks['directions']['down'] = {**idle, 'frames': idle['frames'][:1], 'durations': [200]}
        data[kind] = {'image': 'sprites', 'height': spec['height'],
                      'sourceHeight': spec['height'] if normalize else original_height,
                      'idleAnimated': any(len(t['frames']) > 1 for t in tracks['idles'].values()),
                      **tracks}
        if 'stature' in spec:
            data[kind]['stature'] = spec['stature']
        if spec.get('idle_only'):
            data[kind]['idleOnly'] = True
    atlas = Image.new('RGBA', (WIDTH, y + row_height))
    for frame, px, py in packed:
        atlas.paste(frame, (px, py))
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
