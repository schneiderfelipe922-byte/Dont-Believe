"""Import the final character sheets, preserve Mel, and rebuild the runtime atlas."""
from pathlib import Path
from PIL import Image
from zipfile import ZipFile, ZIP_DEFLATED
import io
import json

ROOT = Path(__file__).resolve().parents[1]
ARCHIVE = ROOT / 'assets/sprites-e-idles/sprites.zip'
DIRECTIONS = {'down': 'south', 'left': 'west', 'right': 'east', 'up': 'north'}
WIDTH = 512
FINAL = ROOT / 'assets/sprites-e-idles/sprites-novos'
ALIASES = {'vigia': 'guard', 'lider': 'leader'}


def cropped_track(files, names, shared_box=None):
    frames = [Image.open(io.BytesIO(files[name])).convert('RGBA') for name in names]
    boxes = [frame.getchannel('A').getbbox() for frame in frames]
    assert frames and all(boxes), f'Empty track: {names}'
    box = shared_box or (min(b[0] for b in boxes), min(b[1] for b in boxes),
           max(b[2] for b in boxes), max(b[3] for b in boxes))
    return [frame.crop(box) for frame in frames], boxes[0][3] - boxes[0][1]


def import_final_sheets(files, manifest):
    """Keep the sheet origin and foot baseline, including transparent margins."""
    source = json.loads((FINAL / 'manifest.json').read_text())
    expected = json.loads((FINAL / 'sha256.json').read_text())
    import hashlib
    for name, spec in source['personagens'].items():
        kind = ALIASES.get(name, name)
        for old in list(files):
            if old.startswith(kind + '/'):
                del files[old]
        width, height = spec['idle']['celula']
        entry = {'height': spec['altura'], 'animation': 'Walking',
                 'stature': {40: 'short', 46: 'medium', 54: 'tall'}[spec['altura']],
                 'normalize_height': False, 'directions': list(DIRECTIONS),
                 'idle_frames': {}, 'idle_durations': spec['idle']['duracoes_ms'],
                 'walk_durations': {}, 'foot_anchor': [width / 2, height - 2],
                 'source_package': 'sprites-novos/' + name}
        if 'walk' not in spec:
            entry['idle_only'] = True
        for category in ['idle', 'walk']:
            if category not in spec:
                continue
            track = spec[category]
            assert track['celula'] == [width, height], name + ': inconsistent cells'
            content = (FINAL / track['arquivo']).read_bytes()
            assert hashlib.sha256(content).hexdigest() == expected[track['arquivo']], name + ': changed source'
            image = Image.open(io.BytesIO(content)).convert('RGBA')
            count = track['quadros_por_direcao']
            assert count == (4 if category == 'idle' else 6)
            assert image.size == (width * count, height * len(DIRECTIONS))
            assert len(track['duracoes_ms']) == count
            for row, (direction, rotation) in enumerate(DIRECTIONS.items()):
                names = []
                for col in range(count):
                    frame = image.crop((col * width, row * height, (col + 1) * width, (row + 1) * height))
                    assert frame.getchannel('A').getbbox(), name + ': empty frame'
                    prefix = 'idle-cycle' if category == 'idle' else 'animations/Walking'
                    path = f'{kind}/Idle/{prefix}/{rotation}/frame-{col:02}.png'
                    output = io.BytesIO()
                    frame.save(output, format='PNG')
                    files[path] = output.getvalue()
                    names.append(path)
                if category == 'idle':
                    entry['idle_frames'][direction] = names
                    files[f'{kind}/Idle/rotations/{rotation}.png'] = files[names[0]]
                else:
                    entry['walk_durations'][direction] = track['duracoes_ms']
        manifest[kind] = entry
    files['manifest.json'] = json.dumps(manifest, ensure_ascii=False, indent=2).encode()
    return source


def build():
    with ZipFile(ARCHIVE) as source:
        files = {name: source.read(name) for name in source.namelist()
                 if not name.startswith('runtime/') and not name.endswith('/')}
    manifest = json.loads(files['manifest.json'])
    final_manifest = import_final_sheets(files, manifest)
    data, packed = {}, []
    x = y = row_height = 0
    for kind, spec in manifest.items():
        raw, original_height = [], 0
        for direction in spec.get('directions', list(DIRECTIONS)):
            name = DIRECTIONS[direction]
            rotation = f'{kind}/Idle/rotations/{name}.png'
            prefix = f'{kind}/Idle/animations/{spec.get("animation")}/{name}/'
            walking = sorted(f for f in files if f.startswith(prefix) and f.endswith('.png'))
            override = spec.get('idle_frames', {}).get(direction)
            shared_box = None
            anchor = None
            if 'foot_anchor' in spec:
                images = [Image.open(io.BytesIO(files[n])).convert('RGBA')
                          for n in walking + (override or [rotation])]
                boxes = [frame.getchannel('A').getbbox() for frame in images]
                shared_box = (min(b[0] for b in boxes), min(b[1] for b in boxes),
                              max(b[2] for b in boxes), max(b[3] for b in boxes))
                assert shared_box[3] - shared_box[1] == spec['height'], kind + ': changed stature'
                anchor = [spec['foot_anchor'][0] - shared_box[0],
                          spec['foot_anchor'][1] - shared_box[1]]
            if walking:
                frames, _ = cropped_track(files, walking, shared_box)
                original_height = max(original_height, frames[0].height)
                durations = spec.get('walk_durations', {}).get(direction, [200] * len(frames))
                raw.append(('directions', direction, frames, None, durations, anchor))
            if rotation in files:
                original_height = max(original_height, cropped_track(files, [rotation])[0][0].height)
            frames, neutral_height = cropped_track(files, override or [rotation], shared_box)
            if not override:
                original_height = max(original_height, frames[0].height)
            durations = spec.get('idle_durations', [200] * len(frames)) if override else [200]
            assert len(frames) == len(durations)
            raw.append(('idles', direction, frames, neutral_height if override else None, durations, anchor))
        tracks = {'directions': {}, 'idles': {}}
        normalize = spec.get('normalize_height', False)
        for category, direction, frames, override_height, durations, anchor in raw:
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
            tracks[category][direction] = {'frames': rects, 'anchor': anchor or [w / 2, h],
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
        if 'source_package' in spec:
            data[kind]['sourcePackage'] = spec['source_package']
    atlas = Image.new('RGBA', (WIDTH, y + row_height))
    for frame, px, py in packed:
        atlas.paste(frame, (px, py))
    atlas.save(ROOT / 'assets/sprites-e-idles/sprites.png', optimize=True, compress_level=9)
    js = ('(function(root){\nconst data=' + json.dumps(data, separators=(',', ':')) +
          ';\nroot.CharacterData=data;if(typeof module!=="undefined")module.exports=data;\n'
          '})(typeof window!=="undefined"?window:globalThis);\n')
    (ROOT / 'javascript/character-data.js').write_text(js)
    with ZipFile(ARCHIVE, 'w', compression=ZIP_DEFLATED, compresslevel=9) as out:
        for name, content in files.items():
            out.writestr(name, content)
        out.writestr('runtime/sprites.png', (ROOT / 'assets/sprites-e-idles/sprites.png').read_bytes())
        out.writestr('runtime/character-data.js', js)
    final_manifest['integrado_ao_jogo'] = True
    final_manifest['atlas_do_jogo'] = 'assets/sprites-e-idles/sprites.png'
    final_manifest['dados_do_jogo'] = 'javascript/character-data.js'
    (FINAL / 'manifest.json').write_text(json.dumps(final_manifest, ensure_ascii=False, indent=2) + '\n')
    readme = (FINAL / 'LEIA-ME.txt').read_text()
    readme = readme.replace('Não integrados automaticamente ao jogo.',
                            'Integrados ao jogo no atlas assets/sprites-e-idles/sprites.png.')
    (FINAL / 'LEIA-ME.txt').write_text(readme)
    package = FINAL / 'todos-os-sprites.zip'
    with ZipFile(package) as old_package:
        package_files = {n: old_package.read(n) for n in old_package.namelist() if not n.endswith('/')}
    for path in [FINAL / 'manifest.json', FINAL / 'LEIA-ME.txt']:
        name = path.name
        matches = [n for n in package_files if n == name or n.endswith('/' + name)]
        assert len(matches) == 1, 'Ambiguous package file: ' + name
        package_files[matches[0]] = path.read_bytes()
    with ZipFile(package, 'w', compression=ZIP_DEFLATED, compresslevel=9) as out:
        for name, content in package_files.items():
            out.writestr(name, content)
    print(f'{len(data)} characters, {len(packed)} frames, {atlas.width}x{atlas.height}; {ARCHIVE}')


if __name__ == '__main__':
    build()
