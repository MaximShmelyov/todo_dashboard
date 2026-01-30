#!/bin/sh
set -eu

echo "[entrypoint] prisma generate..."
npx prisma generate

echo "[entrypoint] prisma migrate deploy..."
npx prisma migrate deploy

exec "$@"
