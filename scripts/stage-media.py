#!/usr/bin/env python3
"""일상 사진·4컷·스티커를 public/daily 로 스테이징한다 (원본은 깃 밖, 구글 드라이브 내려받기 폴더).

사용: python3 -I scripts/stage-media.py <원본 폴더>
- EXIF 회전을 적용하고(삼성 폰 사진은 EXIF 로 세로를 표시한다 — ffmpeg 콘택트 시트는 이를 무시하니 PIL 기준이 맞다)
- 긴 변 2560 으로 축소, JPEG q92
- 고양이 캐릭터 시트(3열×4행)에서 첫 셀을 오려 배경을 투명하게 → sticker_cat_*.png
"""
import pathlib
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageOps

SRC = pathlib.Path(sys.argv[1])
DST = pathlib.Path(__file__).resolve().parent.parent / "public" / "daily"
NAMES = {
    "10km_김나은_23061(1).jpg": "d_marathon.jpg",
    "1789567142819.jpg": "d_sea_selfie.jpg",
    "20260723_004608.jpg": "d_cat_a.jpg",
    "20260723_004815.jpg": "d_cat_b.jpg",
    "niibjgKLwXjK.jpg": "s01_pola_2502.jpg",
    "OoBvDwdkbNFJ.jpg": "s02_planb_2505.jpg",
    "gYRmVKKPfRRa.jpg": "s03_planb_2509.jpg",
    "image-2.jpg": "s04_life4_2510.jpg",
    "MbLpwovngbAu.jpg": "s05_pola_2512.jpg",
    "image-3.jpg": "s06_life4_panda_2602.jpg",
    "Pic.jpg": "s07_photoism.jpg",
    "four-cut-character-1.png": "st_cat_gray.png",
    "four-cut-character.png": "st_cat_brown.png",
}

DST.mkdir(parents=True, exist_ok=True)
for a, b in NAMES.items():
    im = ImageOps.exif_transpose(Image.open(SRC / a))
    w, h = im.size
    if max(w, h) > 2560 and b.endswith(".jpg"):
        s = 2560 / max(w, h)
        im = im.resize((round(w * s), round(h * s)), Image.LANCZOS)
    if b.endswith(".jpg"):
        im.convert("RGB").save(DST / b, quality=92, optimize=True)
    else:
        im.save(DST / b, optimize=True)
    print(b, im.size)

for name in ("st_cat_brown.png", "st_cat_gray.png"):
    sheet = Image.open(DST / name).convert("RGB")
    w, h = sheet.size
    box = (0, 0, int(w / 3), int(h / 4))  # 첫 행·첫 열 셀
    cell = sheet.crop(box)
    mask = cell.copy()
    for xy in ((0, 0), (cell.width - 1, 0), (0, cell.height - 1), (cell.width - 1, cell.height - 1)):
        ImageDraw.floodfill(mask, xy, (255, 0, 255), thresh=48)
    m = np.asarray(mask)
    bg = (m[..., 0] == 255) & (m[..., 1] == 0) & (m[..., 2] == 255)
    rgba = np.dstack([np.asarray(cell), np.where(bg, 0, 255).astype(np.uint8)])
    out = Image.fromarray(rgba.astype(np.uint8), "RGBA")
    out = out.crop(out.getbbox())
    out.save(DST / ("sticker_" + name.replace("st_", "")))
    print("sticker", name, out.size)
