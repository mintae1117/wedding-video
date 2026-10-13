#!/usr/bin/env python3
"""우드 테이블 텍스처 생성 — public/textures/walnut.jpg(어두운 월넛)·oak.jpg(밝은 오크).

사용: python3 -I scripts/textures.py
의존성: numpy, Pillow (시스템 python3 에 있음)
결(線)은 y 방향 누적 위상에 저주파 노이즈로 굴곡을 주고, 선 굵기·가시성·널빤지 밝기를 노이즈로 흔든다.
warp 가 크면 물결·모래결처럼 보이니(1차 시안) 월넛 42·오크 16 정도로 둔다.
"""
import pathlib

import numpy as np
from PIL import Image

OUT = pathlib.Path(__file__).resolve().parent.parent / "public" / "textures"
H, W = 1080, 1920
y, x = np.mgrid[0:H, 0:W].astype(np.float32)


def smooth_noise(seed, cx, cy):
    rng = np.random.default_rng(seed)
    small = (rng.random((cy, cx)) * 255).astype(np.uint8)
    return np.asarray(Image.fromarray(small).resize((W, H), Image.BICUBIC)).astype(np.float32) / 255


def box_x(a, k):
    c = np.cumsum(np.pad(a, ((0, 0), (k, k)), mode="edge"), axis=1)
    return (c[:, 2 * k:] - c[:, :-2 * k]) / (2 * k)


def grain(seed, period, warp_px, flat):
    rng = np.random.default_rng(seed)
    n1 = smooth_noise(seed, 4, 3)
    n2 = smooth_noise(seed + 1, 16, 9)
    n3 = smooth_noise(seed + 2, 120, 70)
    per = period * (0.8 + 0.5 * smooth_noise(seed + 3, 4, 3))
    phase = np.cumsum(2 * np.pi / per, axis=0)
    phase += ((n1 - 0.5) * warp_px + (n2 - 0.5) * warp_px * 0.3 + (n3 - 0.5) * 3) * (2 * np.pi / period)
    lines = (0.5 + 0.5 * np.sin(phase)) ** 3.5
    vis = 0.3 + 0.7 * smooth_noise(seed + 4, 40, 6)
    fine = rng.normal(0, 1, (H, W)).astype(np.float32)
    fine = box_x(fine, 6)
    fine = (fine - fine.min()) / (fine.max() - fine.min())
    v = 0.55 * lines * vis + 0.15 * n2 + 0.12 * fine
    v = (v - v.min()) / (v.max() - v.min())
    v = 0.5 + (v - 0.5) * flat
    return v, 0.95 + 0.10 * n1


def paint(seed, period, warp, flat, base, streak, name):
    v, bright = grain(seed, period, warp, flat)
    base = np.array(base, np.float32)
    streak = np.array(streak, np.float32)
    img = (base[None, None, :] + (streak - base)[None, None, :] * v[..., None]) * bright[..., None]
    Image.fromarray(np.clip(img, 0, 255).astype(np.uint8)).save(OUT / name, quality=90)
    print(name, img.mean(axis=(0, 1)).round(1))


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    paint(7, 22, 42, 0.8, (52, 35, 24), (90, 65, 45), "walnut.jpg")
    paint(11, 24, 16, 0.55, (212, 191, 162), (229, 214, 191), "oak.jpg")
