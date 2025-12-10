#!/usr/bin/env bash

__PWD=$(pwd)

cd "$(dirname $(dirname $(realpath ${BASH_SOURCE[0]})))"

if ! [ -n "$NODE_ENV" ]; then
  export NODE_ENV=development
fi

env=conf/$NODE_ENV.sh

if [ -f "$env" ]; then
  set -a
  . $env
  set +a
fi

cd $__PWD
