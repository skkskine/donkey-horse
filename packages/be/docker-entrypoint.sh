#!/bin/sh
set -e

echo "Running migrations..."
npm run migrate:up --workspace=migrations

echo "Starting backend..."
exec "$@"