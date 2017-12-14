#!/bin/sh
cp nginx/sites-enabled/default /etc/nginx/sites-enabled/default
systemctl start nginx
pm2 start mdbook/bookServer.js
pm2 start rpgbot/rpgbot.js
