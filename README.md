## Table of Contents

- [OCI To Work With IP Address (nginx)](#oci-to-work-with-ip-address-nginx)
- [create ssl certificate  (nginx)](#create-ssl-certificate--nginx)
- [install nginx to handle firewall traffic  (nginx)](#install-nginx-to-handle-firewall-traffic--nginx)
- [dns from desdec and certbot ssl certificates (apache)](#dns-from-desdec-and-certbot-ssl-certificates-apache)
- [OCI To Work With IP Address (apache)](#oci-to-work-with-ip-address-apache)
- [dns from desdec and certbot ssl certificates (apache)](#dns-from-desdec-and-certbot-ssl-certificates-apache-1)
- [install apache to handle firewall traffic  (nginx)](#install-apache-to-handle-firewall-traffic--nginx)

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

## OCI To Work With IP Address (apache)

## dns from desdec and certbot ssl certificates (apache)

## install apache to handle firewall traffic  (nginx)

Santa Monica boundaries goes into the ocean
https://www.openstreetmap.org/relation/3353288

![Santa Monica booundary at openstreetmap](./assets/screenshot3.png)
