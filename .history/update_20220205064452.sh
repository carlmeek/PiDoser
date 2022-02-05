#! /bin/sh
git fetch --all
git reset --hard origin/master
git pull
npm i
npm i i2c-bus
pm2 restart 0