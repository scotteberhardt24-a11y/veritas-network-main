#!/usr/bin/env bash

set -euo pipefail

echo "======================================="
echo " Veritas Trust Ledger Monorepo Setup "
echo "======================================="

echo "[1/10] Checking pnpm..."

if ! command -v pnpm &> /dev/null
then
  echo "pnpm not found. Installing..."
  npm install -g pnpm
fi

echo "[2/10] Removing corrupted installs..."

rm -rf node_modules
rm -rf apps/web/node_modules
rm -rf apps/api/node_modules
rm -rf .next
rm -rf dist
rm -rf build

find . -name "package-lock.json" -delete

echo "[3/10] Removing old pnpm lock..."
rm -f pnpm-lock.yaml

echo "[4/10] Cleaning pnpm cache..."
pnpm store prune || true

echo "[5/10] Installing workspace dependencies..."
pnpm install

echo "[6/10] Verifying Next.js installation..."
pnpm --filter veritas-web exec next --version

echo "[7/10] Running security audit..."
pnpm audit || true

echo "[8/10] Building workspace..."
pnpm build

echo "[9/10] Creating logs/security folders..."
mkdir -p logs
mkdir -p security

echo "[10/10] Setup complete."

echo ""
echo "Run development server:"
echo "--------------------------------"
echo "pnpm dev"
echo "--------------------------------"
