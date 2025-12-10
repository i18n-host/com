#!/usr/bin/env bash

DIR=$(realpath $0) && DIR=${DIR%/*}
cd $DIR
set -ex

WEB=$(dirname $DIR)
ROOT=$(dirname $WEB)

setenv() {
  bun x dotenvx set $1 ${!1} -f .env -p >/dev/null
}

touch .env && setenv WEB && setenv ROOT

./ssl.sh

exec docker compose -p $(basename $(dirname $DIR)) up $@
