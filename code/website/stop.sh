#!/bin/sh
systemctl stop nginx
pm2 stop all
pm2 delete all
