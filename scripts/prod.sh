#!/usr/bin/env -S -- bash
# -*- coding: ascii -*-

set -e -o pipefail
cd "$(readlink -e -- "${0%/*}/.." || true)"

export TAG=$(jq -r '.version' package.json)

docker compose -f docker-compose.prod.yml build
