#!/usr/bin/env -S -- bash
# -*- coding: ascii -*-

set -e -o pipefail
cd "$(readlink -e -- "${0%/*}/.." || true)"

export TAG=$(jq -r '.version' package.json)

docker compose -f docker-compose.prod.yml build
docker tag tincho70/bot-pozo:$TAG tincho70/bot-pozo:latest
docker push tincho70/bot-pozo -a