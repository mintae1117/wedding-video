#!/usr/bin/env python3
"""여러 PNG/JPG 를 라벨 붙여 한 장의 시트로 합친다 — 렌더 결과를 눈으로 검토할 때 쓴다.

사용:
  python3 scripts/sheet.py out/review.jpg "라벨1=out/stills/f150.png" "라벨2=out/stills/f330.png" ...
  python3 scripts/sheet.py out/review.jpg out/stills/*.png      # 라벨 생략 시 파일명

의존성: pillow (python3 -m venv .venv && .venv/bin/pip install pillow)
"""
import os
import sys

from PIL import Image, ImageDraw, ImageFont

out = sys.argv[1]
items = []
for arg in sys.argv[2:]:
    label, _, path = arg.rpartition("=") if "=" in arg else ("", "", arg)
    items.append((label or os.path.basename(path), path))

COLS = 3 if len(items) > 4 else max(1, len(items))
CW, CH, LABEL_H = 960, 540, 40
rows = (len(items) + COLS - 1) // COLS
sheet = Image.new("RGB", (COLS * CW, rows * (CH + LABEL_H)), "white")
draw = ImageDraw.Draw(sheet)
try:
    font = ImageFont.truetype("/System/Library/Fonts/Supplemental/AppleGothic.ttf", 26)
except OSError:
    font = ImageFont.load_default()

for i, (label, path) in enumerate(items):
    im = Image.open(path).convert("RGB").resize((CW, CH), Image.LANCZOS)
    x, y = (i % COLS) * CW, (i // COLS) * (CH + LABEL_H)
    sheet.paste(im, (x, y))
    draw.text((x + 10, y + CH + 6), label, fill="black", font=font)

sheet.save(out, quality=88)
print(out, sheet.size)
