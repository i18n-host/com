#!/usr/bin/env bash

DIR=$(realpath $0) && DIR=${DIR%/*}
cd $DIR
set -ex

NODE_ENV=production ./sh/build.sh

bun x mdt .

git add .
git commit -m. || true

npm version patch

cp README.md package.json dist/
cd dist/

node -e "fs.writeFileSync('package.json', JSON.stringify((d => {delete d.devDependencies; delete d.dependencies; delete d.browserslist; return d;})(JSON.parse(fs.readFileSync('package.json')))))"

#npm publish --access public
