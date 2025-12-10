#!/usr/bin/env bash

DIR=$(realpath $0) && DIR=${DIR%/*}
cd $DIR
set -e
. env.sh

set -x

rm -rf ../dist

../css/svg.sh
./srv.sh

cd ../com
bun x vite build
cd ..

rm -rf dist/import

cep() {
  rm -rf dist/$1
  bun x cep -c $1 -o dist/$1
}

cep dom
cep lib

cd sh

./dom.js

if [ "$NODE_ENV" == "production" ]; then
  ./minifyCss.js
fi

if [ "$NODE_ENV" == "production" ]; then
  ./minifyJs.js
fi

cd $DIR/..
rm -rf htm
bun x pug -c pug -o htm
