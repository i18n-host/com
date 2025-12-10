#!/usr/bin/env bash

DIR=$(realpath $0) && DIR=${DIR%/*/*}
cd $DIR
set -ex

git add . && git commit -m "dist lib"
cd lib
npm patch -v
cd ..
./dist.sh
cd dist/lib
pnpm publish --access=public --publish-branch $(git symbolic-ref --short -q HEAD)
