#!/usr/bin/env bash

DIR=$(realpath $0) && DIR=${DIR%/*/*}
cd $DIR
set -ex

fmt() {
  bun x biome format **/*.js --write
}
fmt
cd dist
fmt
