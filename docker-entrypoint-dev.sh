#!/bin/sh
set -eu

log() { echo "[entrypoint] $*"; }

DB_HOST="${DATABASE_HOST:-db}"
DB_PORT="${DATABASE_PORT:-5432}"
DB_USER="${DATABASE_USER:-todo_user}"
DB_NAME="${DATABASE_NAME:-todo_dashboard}"

log "Waiting for Postgres at ${DB_HOST}:${DB_PORT}..."
until pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" >/dev/null 2>&1; do
  sleep 1
done
log "Postgres is ready."

log "Prisma generate..."
npx prisma generate

log "Prisma migrate dev..."
npx prisma migrate dev

if [ "${RUN_SEED:-0}" = "1" ]; then
  log "Prisma db seed..."
  npx prisma db seed
fi

log "Starting dev server..."
exec npm run dev
