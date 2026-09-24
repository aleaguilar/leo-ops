#!/usr/bin/env python3
"""Upload dist/ to the Leo Ops Railway Function (S3-backed).

Requires:
  LEO_OPS_URL          default https://leo-ops-rates-production.up.railway.app
  LEO_OPS_UPLOAD_TOKEN the Function's UPLOAD_TOKEN
"""

from __future__ import annotations

import os
import pathlib
import sys
import urllib.error
import urllib.request

DEFAULT_URL = "https://leo-ops-rates-production.up.railway.app"


def put(base: str, token: str, key: str, path: pathlib.Path) -> None:
    data = path.read_bytes()
    req = urllib.request.Request(
        f"{base}/__upload/{key}",
        data=data,
        method="PUT",
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/octet-stream",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            body = resp.read().decode()
            print(f"{resp.status} {key} {len(data)} {body}")
    except urllib.error.HTTPError as err:
        print(f"{err.code} {key} {err.read().decode()}", file=sys.stderr)
        raise


def main() -> int:
    dist = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else "dist")
    base = os.environ.get("LEO_OPS_URL", DEFAULT_URL).rstrip("/")
    token = os.environ.get("LEO_OPS_UPLOAD_TOKEN", "")
    if not token:
        print("set LEO_OPS_UPLOAD_TOKEN", file=sys.stderr)
        return 1
    html = dist / "index.html"
    svg = dist / "favicon.svg"
    assets = dist / "assets"
    if not html.is_file():
        print(f"missing {html}; run npm run build first", file=sys.stderr)
        return 1
    put(base, token, "index.html", html)
    if svg.is_file():
        put(base, token, "favicon.svg", svg)
    for file in sorted(assets.glob("*")):
        if file.is_file():
            put(base, token, f"assets/{file.name}", file)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
