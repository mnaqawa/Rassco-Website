#!/usr/bin/env python3
"""
Process client logo PNGs: knock out near-white backgrounds, trim, normalize
height, add transparent padding, save optimized PNG + WebP.

Run from repo root: python scripts/process_client_logos.py
Requires: pip install pillow numpy
"""
from __future__ import annotations

import glob
import os
import sys

import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LOGO_DIR = os.path.join(ROOT, "ClientLogos")
GLOB = os.path.join(LOGO_DIR, "Seperate Clients-*.png")

# Pixels >= this RGB are treated as background (white matte removal)
WHITE_THRESHOLD = 248
# Target logo height after trim (before outer padding)
TARGET_H = 72
MAX_W = 200
# Transparent margin around normalized logo
PAD = 12


def process_one(path: str) -> tuple[bool, str]:
    try:
        im = Image.open(path).convert("RGBA")
    except OSError as e:
        return False, f"open: {e}"

    arr = np.array(im)
    rgb = arr[:, :, :3].astype(np.int16)
    white = (
        (rgb[:, :, 0] >= WHITE_THRESHOLD)
        & (rgb[:, :, 1] >= WHITE_THRESHOLD)
        & (rgb[:, :, 2] >= WHITE_THRESHOLD)
    )
    arr = arr.copy()
    arr[white, 3] = 0
    out = Image.fromarray(arr, "RGBA")

    bbox = out.getbbox()
    if not bbox:
        return False, "empty after white removal"
    out = out.crop(bbox)

    w, h = out.size
    if h < 1:
        return False, "zero height"

    scale = TARGET_H / h
    nw = max(1, int(w * scale))
    nh = TARGET_H
    if nw > MAX_W:
        scale = MAX_W / w
        nw = MAX_W
        nh = max(1, int(h * scale))

    out = out.resize((nw, nh), Image.Resampling.LANCZOS)

    canvas_w = nw + 2 * PAD
    canvas_h = nh + 2 * PAD
    canvas = Image.new("RGBA", (canvas_w, canvas_h), (0, 0, 0, 0))
    canvas.paste(out, (PAD, PAD), out)

    base, _ = os.path.splitext(path)
    webp_path = base + ".webp"

    canvas.save(path, "PNG", optimize=True)
    canvas.save(webp_path, "WEBP", quality=88, method=6)
    return True, f"{canvas_w}x{canvas_h}"


def main() -> int:
    if not os.path.isdir(LOGO_DIR):
        print("Missing ClientLogos folder", file=sys.stderr)
        return 1

    paths = sorted(glob.glob(GLOB), key=lambda p: p.lower())
    if not paths:
        print("No PNGs matched", GLOB, file=sys.stderr)
        return 1

    ok = 0
    for p in paths:
        success, msg = process_one(p)
        rel = os.path.relpath(p, ROOT)
        if success:
            ok += 1
            print("OK", rel, msg)
        else:
            print("SKIP", rel, msg, file=sys.stderr)

    print("Done:", ok, "/", len(paths))
    return 0 if ok else 1


if __name__ == "__main__":
    raise SystemExit(main())
