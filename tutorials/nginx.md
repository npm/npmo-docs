# Terminating SSL with NGINX

Using NGINX is a great way to add DNS and SSL termination to your
npm Enterprise server.

Here's an example `nginx.conf` configuration that you can use for
associating one DNS name with your npm Enterprise Website and an
alternative DNS name with your npm Enterprise Registry:

```nginx
user root;
worker_processes 1;
pid /var/run/nginx.pid;

events {
    # After increasing this value You probably should increase limit
    # of file descriptors (for example in start_precmd in startup script)
    worker_connections  1024;
}

http {
    upstream registry {
        server 127.0.0.1:8080;
    }

    upstream www {
        server 127.0.0.1:8081;
    }

    client_max_body_size 200M;

    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile        on;

    keepalive_timeout  65;

    # npm Enterprise registry.
    server {
        listen       443;
        server_name  demo-registry.npmjs.com;

        ssl                  on;

        ssl_certificate      /home/ubuntu/sslcerts/wildcard.pem;
        ssl_certificate_key  /home/ubuntu/sslcerts/wildcard.pem;

        ssl_session_timeout  5m;

        ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
        ssl_prefer_server_ciphers on;
        ssl_ciphers "EECDH+ECDSA+AESGCM EECDH+aRSA+AESGCM EECDH+ECDSA+SHA384 EECDH+ECDSA+SHA256 EECDH+aRSA+SHA384 EECDH+aRSA+SHA256 EECDH+aRSA+RC4 EECDH EDH+aRSA RC4 !aNULL !eNULL !LOW !3DES !MD5 !EXP !PSK !SRP !DSS";

        location / {
            proxy_pass       http://registry;
            proxy_set_header Host $host;
        }
    }

    # npm Enterprise Website
    server {
        listen       443;
        server_name  demo-www.npmjs.com;

        ssl                  on;

        ssl_certificate      /home/ubuntu/sslcerts/wildcard.pem;
        ssl_certificate_key  /home/ubuntu/sslcerts/wildcard.pem;

        ssl_session_timeout  5m;

        ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
        ssl_prefer_server_ciphers on;
        ssl_ciphers "EECDH+ECDSA+AESGCM EECDH+aRSA+AESGCM EECDH+ECDSA+SHA384 EECDH+ECDSA+SHA256 EECDH+aRSA+SHA384 EECDH+aRSA+SHA256 EECDH+aRSA+RC4 EECDH EDH+aRSA RC4 !aNULL !eNULL !LOW !3DES !MD5 !EXP !PSK !SRP !DSS";

        location / {
            proxy_pass       http://www;
            proxy_set_header Host $host;
        }
    }
}
```
