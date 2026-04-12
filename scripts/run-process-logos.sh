#!/usr/bin/env bash
# From site root: bash scripts/run-process-logos.sh
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
if [[ ! -d ClientLogos ]]; then
  echo "Error: ClientLogos/ not found. Run from site root (e.g. /var/www/rassco)." >&2
  exit 1
fi
if ! command -v python3 >/dev/null 2>&1; then
  echo "Install Python 3: sudo apt install -y python3 python3-pip" >&2
  exit 1
fi
python3 -m pip install --user -r "$ROOT/scripts/requirements-tools.txt"
python3 "$ROOT/scripts/process_client_logos.py"
