#!/usr/bin/env python3
"""Gzip + base64 the Vite dist/ assets into Railway-sized env chunks."""

from __future__ import annotations

import argparse
import base64
import gzip
import pathlib
import sys

CHUNK = 2800


def gz_b64(path: pathlib.Path) -> str:
    return base64.b64encode(gzip.compress(path.read_bytes(), 9)).decode()


def split_chunks(blob: str, size: int) -> list[str]:
    return [blob[i : i + size] for i in range(0, len(blob), size)] or [""]


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--dist",
        type=pathlib.Path,
        default=pathlib.Path("dist"),
        help="Vite output directory",
    )
    parser.add_argument(
        "--out",
        type=pathlib.Path,
        default=pathlib.Path("/tmp/leo-env"),
        help="Directory to write ASSET_* chunk files",
    )
    parser.add_argument("--chunk", type=int, default=CHUNK)
    args = parser.parse_args()

    dist: pathlib.Path = args.dist
    html = dist / "index.html"
    svg = dist / "favicon.svg"
    assets = dist / "assets"
    if not html.is_file():
        print(f"missing {html}; run npm run build first", file=sys.stderr)
        return 1

    css_files = sorted(assets.glob("*.css"))
    js_files = sorted(assets.glob("*.js"))
    if len(css_files) != 1 or len(js_files) != 1:
        print(f"expected one css and one js in {assets}", file=sys.stderr)
        return 1

    payload = {
        "HTML": gz_b64(html),
        "CSS": gz_b64(css_files[0]),
        "SVG": gz_b64(svg) if svg.is_file() else "",
        "JS": gz_b64(js_files[0]),
    }

    out: pathlib.Path = args.out
    out.mkdir(parents=True, exist_ok=True)
    for old in out.iterdir():
        if old.is_file():
            old.unlink()

    print("NAME\tB64\tCHUNKS\tMAX\tLAST")
    for name, blob in payload.items():
        parts = split_chunks(blob, args.chunk)
        for i, part in enumerate(parts):
            (out / f"{name}_{i:02d}").write_text(part)
        joined = "".join(parts)
        if joined != blob:
            print("join mismatch", name, file=sys.stderr)
            return 1
        print(
            f"{name}\t{len(blob)}\t{len(parts)}\t{max(len(p) for p in parts)}\t{len(parts[-1])}"
        )
        print(f"  set ASSET_{name}_00 .. ASSET_{name}_{len(parts) - 1:02d}")

    print(f"wrote {out}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
