#!/bin/sh
set -eu

if [ -z "${DATABASE_URL:-}" ]; then
  echo "[entrypoint] ERROR: DATABASE_URL is not set"
  exit 1
fi

echo "[entrypoint] prisma generate..."
npx prisma generate

echo "[entrypoint] prisma migrate deploy..."
npx prisma migrate deploy --url "$DATABASE_URL"

exec "$@"
