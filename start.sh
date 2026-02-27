#!/bin/bash

APP_NAME="ipe-exam"
APP_DIR="$(cd "$(dirname "$0")" && pwd)"

cd "$APP_DIR"

pnpm build

pm2 delete "$APP_NAME" 2>/dev/null
pm2 start pnpm --name "$APP_NAME" -- preview
pm2 save
