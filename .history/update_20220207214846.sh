#! /bin/sh
git fetch --all
git reset --hard origin/master
git pull
npm i
npm i i2c-bus
npm i rpi-oled
pm2 restart 0
pm2 log