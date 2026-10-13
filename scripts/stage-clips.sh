#!/bin/bash
# 일상 영상 11개를 public/clips 로 스테이징 — H.264·무음·30fps·faststart.
# 세로 폰 영상은 회전 메타(displaymatrix)만 있고 픽셀은 가로라서, ffmpeg 가 autorotate 로 픽셀을 돌리고 메타를 지운다.
# 사용: bash scripts/stage-clips.sh <원본 폴더>
# ffmpeg 는 시스템에 없으면 `pip3 install imageio-ffmpeg` 의 바이너리를 쓴다.
set -euo pipefail
SRC="$1"
DST="$(cd "$(dirname "$0")/.." && pwd)/public/clips"
FF="${FFMPEG:-$(python3 -c 'import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())')}"
mkdir -p "$DST"
conv() { "$FF" -hide_banner -loglevel error -y -i "$SRC/$1" -map 0:v:0 -an -r 30 -c:v libx264 -preset medium -crf 18 -pix_fmt yuv420p -movflags +faststart "$DST/$2" && echo "[INFO] $2"; }
conv "2025_01_12 21_43.mp4" c01_cafe.mp4
conv "20250302_013059.mp4" c02_cat_piano.mp4
conv "20251112_131742.mp4" c03_shadow_heart.mp4
conv "20251112_132422_1.mp4" c04_shadow_bridge.mp4
conv "20251115_170127_1.mp4" c05_park_run.mp4
conv "20260201_223959_1.mp4" c06_cat_door.mp4
conv "20260314_183831.mp4" c07_cat_lap.mp4
conv "20260406_224658_1.mp4" c08_cat_pet.mp4
conv "20260411_224835_1.mp4" c09_cat_blanket.mp4
conv "20260522_190714.mp4" c10_brick_wall.mp4
conv "2026_05_22 23_57_1.mp4" c11_studio_bts.mp4
