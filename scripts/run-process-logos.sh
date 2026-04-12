#!/usr/bin/env bash
# From site root: bash scripts/run-process-logos.sh
# Uses .venv-logo/ (PEP 668 safe on Ubuntu 24+ — avoids externally-managed-environment).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
if [[ ! -d ClientLogos ]]; then
  echo "Error: ClientLogos/ not found. Run from site root (e.g. /var/www/rassco)." >&2
  exit 1
fi
if ! command -v python3 >/dev/null 2>&1; then
  echo "Install Python 3: sudo apt install -y python3 python3-venv" >&2
  exit 1
fi
VENV="$ROOT/.venv-logo"
if [[ ! -d "$VENV" ]]; then
  echo "Creating virtual env at .venv-logo ..."
  python3 -m venv "$VENV"
fi
"$VENV/bin/pip" install -q -r "$ROOT/scripts/requirements-tools.txt"
"$VENV/bin/python" "$ROOT/scripts/process_client_logos.py"
