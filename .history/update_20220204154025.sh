#! /bin/sh
git fetch --all
git reset --hard
git pull
npm i
npm i i2c-bus