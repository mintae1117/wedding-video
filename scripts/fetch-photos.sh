#!/bin/bash
# 청첩장 R2 버킷에서 사진 21장을 다시 받는다 (public/photos 가 비어 있을 때).
# 깃에도 사진이 들어 있으므로 평소엔 필요 없다 — 사진을 교체했거나 새로 추가됐을 때 사용.
set -euo pipefail
cd "$(dirname "$0")/../public/photos"
B="https://pub-aff195e758a643619b9135886dc7b279.r2.dev/my_wedding"
curl -sS -f -o hero.jpg "$B/hero_final/hero.jpg"
for i in $(seq 1 20); do
  curl -sS -f -o "$(printf '%02d' "$i").jpg" "$B/gal_grid_final/$i.jpg" || echo "[WARN] $i.jpg 실패"
done
ls -la
