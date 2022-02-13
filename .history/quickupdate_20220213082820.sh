#! /bin/sh
git fetch --all
git reset --hard origin/master
git pull
pm2 restart 0
pm2 log