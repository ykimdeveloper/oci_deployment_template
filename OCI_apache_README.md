
## Table of Contents Apache

- [Table of Contents Apache](#table-of-contents-apache)
- [OCI To Work With IP Address (nginx)](#oci-to-work-with-ip-address-nginx)
- [create ssl certificate  (nginx)](#create-ssl-certificate--nginx)
- [install nginx to handle firewall traffic  (nginx)](#install-nginx-to-handle-firewall-traffic--nginx)
- [dns from desdec and certbot ssl certificates (apache)](#dns-from-desdec-and-certbot-ssl-certificates-apache)
- [OCI To Work With IP Address (apache)](#oci-to-work-with-ip-address-apache)
- [dns from desdec and certbot ssl certificates (apache)](#dns-from-desdec-and-certbot-ssl-certificates-apache-1)
- [install apache to handle firewall traffic  (apache)](#install-apache-to-handle-firewall-traffic--apache)

## OCI To Work With IP Address (nginx)

```Bash
sudo apt-get update
sudo apt-get install ufw
sudo ufw enable

# for vite
sudo ufw allow 5173/tcp
sudo ufw status

```

## create ssl certificate  (nginx)

```Bash
#create certificate
sudo openssl req -x509 -nodes -days 3650 -newkey rsa:2048 \
-keyout /etc/ssl/private/selfsigned.key \
-out /etc/ssl/certs/selfsigned.crt \
-subj "/C=US/ST=Arizona/L=Phoenix/O=PlotPointers/OU=IT/CN=129.146.203.245"

#certificate
openssl x509 -in /etc/ssl/certs/selfsigned.crt -text -noout

sudo chmod 644 /etc/ssl/private/selfsigned.key
#or

mkdir -p /home/ubuntu/workspace/Mapbox_geojson/certs

sudo cp /etc/ssl/private/selfsigned.key /home/ubuntu/workspace/Mapbox_geojson/certs/selfsigned.key
sudo cp /etc/ssl/certs/selfsigned.crt /home/ubuntu/workspace/Mapbox_geojson/certs/selfsigned.crt

sudo chown ubuntu:ubuntu /home/ubuntu/workspace/Mapbox_geojson/certs/selfsigned.key
sudo chown ubuntu:ubuntu /home/ubuntu/workspace/Mapbox_geojson/certs/selfsigned.crt

chmod 644 /home/ubuntu/workspace/Mapbox_geojson/certs/selfsigned.key
chmod 644 /home/ubuntu/workspace/Mapbox_geojson/certs/selfsigned.crt

```

## install nginx to handle firewall traffic  (nginx)

```Bash

sudo apt install nginx

sudo ufw allow 'Nginx Full'

sudo nano /etc/nginx/sites-available/default
nano /etc/nginx/nginx.conf

# Redirect all HTTP traffic to HTTPS
server {
  listen 80;
  listen [::]:80;
  server_name 129.146.203.245;  # Replace with your public IP (or a domain if you had one)
  return 301 https://$host$request_uri;
}

# HTTPS server block
server {
  listen 443 ssl;
  listen [::]:443 ssl;
  server_name 129.146.203.245;  # Replace with your value

  ssl_certificate /etc/ssl/certs/selfsigned.crt;
  ssl_certificate_key /etc/ssl/private/selfsigned.key;

  # Recommended SSL settings
  ssl_protocols TLSv1.2 TLSv1.3;
  ssl_prefer_server_ciphers on;
  ssl_ciphers HIGH:!aNULL:!MD5;

  root /var/www/html;
  index index.html index.htm index.nginx-debian.html;

  location / {
      # Serve static content or proxy passes if needed
      try_files $uri $uri/ =404;
  }
}
```

```Bash
sudo nano /etc/nginx/sites-available/default

ps aux | grep nginx
sudo killall nginx
sudo systemctl start nginx

```

## dns from desdec and certbot ssl certificates (apache)

```Bash
# Redirect all HTTP traffic to HTTPS
server {
  listen 80;
  listen [::]:80;
  server_name blue-elephant.dedyn.io; 
  return 301 https://$host$request_uri;
}

# HTTPS server block
server {
  listen 443 ssl;
  listen [::]:443 ssl;
  server_name blue-elephant.dedyn.io; 

  ssl_certificate /etc/letsencrypt/live/blue-elephant.dedyn.io/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/blue-elephant.dedyn.io/privkey.pem;

  # Recommended SSL settings
  ssl_protocols TLSv1.2 TLSv1.3;
  ssl_prefer_server_ciphers on;
  ssl_ciphers HIGH:!aNULL:!MD5;

  root /var/www/html;
  index index.html index.htm index.nginx-debian.html;

  location / {
      # Serve static content or proxy passes if needed
      try_files $uri $uri/ =404;
  }
}
```

```Bash
sudo nginx -t
sudo systemctl reload nginx
sudo nano /etc/nginx/sites-available/default

sudo certbot --nginx -d blue-elephant.dedyn.io

sudo nano /etc/ddclient.conf

```

```Bash
protocol=dyndns2
use=web
server=update.dedyn.io
ssl=yes
login=email@email.com
password=passowrd234
blue-elephant.dedyn.io
```

```Bash
nslookup blue-elephant.dedyn.io
sudo ddclient -daemon=0 -debug -verbose -noquiet
```

```Bash
 sudo cp /etc/letsencrypt/live/blue-elephant.dedyn.io/fullchain.pem ~/workspace/Mapbox_geojson/certs

 sudo cp /etc/letsencrypt/live/blue-elephant.dedyn.io/privkey.pem ~/workspace/Mapbox_geojson/certs

sudo chown $(whoami):$(whoami) ~/workspace/Mapbox_geojson/certs/fullchain.pem ~/workspace/Mapbox_geojson/certs/privkey.pem

```

```Javascript

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

export default defineConfig({
  base: '/',
  plugins: [react()],
  server: {
    watch: {
      usePolling: true,
    },
    host: '0.0.0.0', // Makes server accessible from external hosts
    strictPort: true,
    port: 5173,
    https: {
    key: fs.readFileSync(path.resolve('certs/privkey.pem')),
    cert: fs.readFileSync(path.resolve('certs/fullchain.pem'))
    },
    allowedHosts: ['blue-elephant.dedyn.io', '111.1.111.111']
  }
})

```

1. restarts your Vite dev server if necessary.

A. Create a systemd Service for the vite app

```Bash
sudo nano /etc/systemd/system/vite-app.service
```

```Bash
[Unit]
Description=Vite App Service
After=network.target

[Service]
User=ubuntu
WorkingDirectory=/home/ubuntu/workspace/Mapbox_geojson
ExecStart=/home/ubuntu/.nvm/versions/node/v23.9.0/bin/npm run dev
Restart=always
Environment=NODE_ENV=production
Environment=PATH=/home/ubuntu/.nvm/versions/node/v23.9.0/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

[Install]
WantedBy=multi-user.target

```

```Bash
sudo systemctl daemon-reload
sudo systemctl enable vite-app.service
sudo systemctl start vite-app.service
```

```Bash
sudo nano /etc/systemd/system/vite-app.service
```

checking if the app is running verify the service

```Bash
sudo systemctl status vite-app.service
sudo journalctl -u vite-app.service --since "5 minutes ago"
sudo ss -tulpn | grep :5173
```

logs

```Bash
 sudo journalctl -u vite-app.service --since "10 minutes ago"
```

```Bash
sudo netstat -tulpn | grep :5173
```

Stop the Service
Run this command to stop the service immediately:

```Bash
sudo systemctl stop vite-app.service
```

Verify the Service is Stopped
To confirm that the service is no longer running, check its status:

```Bash
sudo systemctl status vite-app.service
```

Disable the Service
If you don’t want the Vite app to start automatically on the next boot, you can disable it:

```Bash
sudo systemctl disable vite-app.service
```

2. Using Certbot's Deploy Hook

Certbot allows you to run a command after a successful renewal by using the --deploy-hook option. You can write a small script that does the following:

Copies the renewed files from /etc/letsencrypt/live/blue-elephant.dedyn.io/ to your project's certs directory.

Adjusts the permissions with chown

```Bash
#!/bin/bash
# renew-certs-and-copy-certs.sh

# Renew certificates (this will only renew if it's within the renewal window)
sudo certbot renew --quiet
renew_status=$?

# Optionally, check if a renewal occurred.
# Note: certbot returns 0 if certificates are valid or renewed.
# If you want to run the copy step only when a renewal actually happened,
# you might parse the log or compare timestamps.
#
# For simplicity, we'll run the copy commands on every execution.

echo "Proceeding to copy certificates..."
# Define paths
LE_BASE="/etc/letsencrypt/live/blue-elephant.dedyn.io"
DEST_DIR="/home/ubuntu/workspace/Mapbox_geojson/certs"

# Copy the certificate files
cp "$LE_BASE/fullchain.pem" "$DEST_DIR/fullchain.pem"
cp "$LE_BASE/privkey.pem" "$DEST_DIR/privkey.pem"

# Set proper ownership (adjust "ubuntu" if needed)
chown $(whoami):$(whoami) "$DEST_DIR/fullchain.pem" "$DEST_DIR/privkey.pem"

# Optionally restart your Vite app if necessary. E.g., if you're running it via systemd:
# Restart your Vite app service so it picks up the new certificates
sudo systemctl restart vite-app.service

echo "Certificate deployment complete and Vite app restarted."

```

Make the script executable:

```Bash
chmod +x renew-certs-and-copy-certs.sh


```

Then modify your certbot renewal command (or configuration) to include this deploy hook:

2. Schedule with Cron: Add a cron entry that calls this script regularly. For example, to run it daily at midnight

A. Edit Your Crontab File

```Bash
crontab -e
```

B. Add the Cron Job

In the editor, add the following line (make sure to use the absolute path to your script):

```Bash
0 0 * * * /home/ubuntu/renew-certs-and-copy-certs.sh
```

To verify the cron job has been added

```Bash
crontab -l
```

## OCI To Work With IP Address (apache)

## dns from desdec and certbot ssl certificates (apache)

## install apache to handle firewall traffic  (apache)

Santa Monica boundaries goes into the ocean
https://www.openstreetmap.org/relation/3353288

![Santa Monica booundary at openstreetmap](./assets/screenshot3.png)
