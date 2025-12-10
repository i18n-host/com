#!/usr/bin/env bash

DIR=$(realpath $0) && DIR=${DIR%/*}
cd $DIR
set -ex

cd ../srv

if [ ! -d "node_modules" ]; then
  rm -rf bun.lock
  bun i
fi

esbuild ./mod.js --bundle --outfile=../dist/srv.js \
  --tree-shaking=true --minify=true --format=esm \
  --minify-whitespace=false --minify-identifiers=false \
  --target=esnext --platform=browser --external:"-/*" \
  $@
