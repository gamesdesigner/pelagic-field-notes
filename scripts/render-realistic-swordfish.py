"""Offline media authoring. Requires Pillow and an explicit FFmpeg path.

Read the checked-in generation plan plus per-frame checkpoints produced by the
built-in image tool. Preserve all generated originals; only convert delivery
copies to WebP. No semantic image edits are performed here.
"""
import argparse
import hashlib
import json
import subprocess
from pathlib import Path
from PIL import Image, ImageDraw, ImageOps

ROOT = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser()
parser.add_argument('--ffmpeg', required=True)
args = parser.parse_args()
if not args.ffmpeg.strip() or not Path(args.ffmpeg).is_file():
    parser.error('--ffmpeg must name an existing encoder binary')
plan = json.loads((ROOT / 'docs/swordfish-realistic-v2-plan.json').read_text())
records = {item['frame']: item for item in plan['anchors']}
previous_path = ROOT / 'docs/swordfish-realistic-v2-manifest.json'
previous = {item['frame']: item for item in json.loads(previous_path.read_text())['frames']} if previous_path.exists() else {}
for job in plan['jobs']:
    checkpoint = Path(f"/private/tmp/ocean-swordfish-frame-v2-{job['frame']:02d}.json")
    records[job['frame']] = json.loads(checkpoint.read_text()) if checkpoint.exists() else previous[job['frame']]
assert set(records) == set(range(32)), 'All 32 generated frames are required.'
output = ROOT / 'public/assets/swordfish/realistic-v2'
output.mkdir(parents=True, exist_ok=True)
sheet = Image.new('RGB', (1280, 8 * 204), '#e9e6dc')
draw = ImageDraw.Draw(sheet)
frames = []
for index, record in sorted(records.items()):
    source = Image.open(record['original']).convert('RGB')
    asset = output / f'frame-{index:02d}.webp'
    source.save(asset, 'WEBP', quality=88, method=6)
    thumb = ImageOps.contain(source, (320, 180))
    left, top = (index % 4) * 320, (index // 4) * 204
    sheet.paste(thumb, (left, top))
    draw.text((left + 8, top + 182), f'Frame {index + 1:02d} / 32', fill='#163d48')
    frames.append({**record, 'asset': '/assets/swordfish/realistic-v2/' + asset.name,
                   'dimensions': list(source.size), 'bytes': asset.stat().st_size,
                   'sha256': hashlib.sha256(asset.read_bytes()).hexdigest()})
sheet.save('/private/tmp/swordfish-realistic-v2-contact-sheet.jpg', quality=92)
video = ROOT / 'public/assets/swordfish/swordfish-hunt-v2.mp4'
subprocess.run([
    args.ffmpeg, '-y', '-framerate', '8', '-i', str(output / 'frame-%02d.webp'),
    '-vf', 'scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2,tpad=stop_mode=clone:stop_duration=1,minterpolate=fps=24:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1',
    '-t', '4', '-an', '-c:v', 'libx264', '-preset', 'slow', '-crf', '19',
    '-pix_fmt', 'yuv420p', '-movflags', '+faststart', str(video)
], check=True)
manifest = {
    'version': 2, 'date': '2026-11-03', 'tool': 'built-in image_gen.imagegen',
    'sourceFrameCount': 32, 'sourceFps': 8, 'outputFps': 24,
    'durationSeconds': 4, 'outputVideoFrames': 96,
    'method': '32 separately generated photorealistic source images. Optical-flow interpolation creates intermediate frames for 24fps playback. Not generative video or wildlife footage.',
    'limits': 'Illustrative hunt and timing. Independently generated images can vary in anatomy, lighting and prey number. Interpolation may create local distortions. No claim of measured animal kinematics or a guaranteed successful hunt.',
    'video': '/assets/swordfish/swordfish-hunt-v2.mp4',
    'poster': frames[0]['asset'], 'videoBytes': video.stat().st_size,
    'encoder': 'FFmpeg / H.264 High / yuv420p / faststart / no audio',
    'renderer': 'scripts/render-realistic-swordfish.py', 'frames': frames,
}
(ROOT / 'docs/swordfish-realistic-v2-manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
print(f'32 generated source images; MP4 {video.stat().st_size} bytes.')
