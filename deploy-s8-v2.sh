#!/bin/bash
sudo find /var/www/html/ita-angular-s8-v2 -mindepth 1 -delete
sudo cp -r /srv/shared/ita-angular-s8-v2/. /var/www/html/ita-angular-s8-v2
