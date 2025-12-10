#!/usr/bin/env bash

DIR=$(realpath $0) && DIR=${DIR%/*}
cd $DIR
set -ex

if [ ! -d "node_modules" ]; then
  bun i
fi

NODE_ENV=development exec bun x vite build $@
