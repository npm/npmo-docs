# Load balancing with NGiNX & Varnish

If you are using npm Enterprise and want to apply Varnish as a solution for load balancing then follow the steps below.

* **Preferred Topology.**

The recommended topology is to provide a dedicated host for NGiNX and Varnish to run on. In environments where a secondary instance is warranted to support the load, running NGiNX and Varnish on the primary will only introduce competition for resources and could destabilize your environment.

**IMPORTANT** The configuration files provided assume that NGiNX and Varnish are each running on the same dedicated host, separate from the hosts for the primary and secondary npmE instances.

* [**Install and configure NGiNX.**](https://www.nginx.com/resources/wiki/start/topics/tutorials/install/)

* **Nginx Configuration File.**

> **Edit the `nginx.conf` according to the steps mentioned below.**

> **Run `sudo nano /etc/nginx/nginx.conf`**

```
# -----------------------------------------------------------------------------
# 1. replace `your-domain.com` with your public-facing domain
# 2. replace `1.1.1.1` with your primary server's IP
# 3. replace worker_processes with 1 if host only has 1 core
# 4. add `fs.file-max = 4096` to `/etc/sysctl.conf`
# 5. copy your SSL pem file to `/etc/nginx/wildcard.pem`
# -----------------------------------------------------------------------------

user root;
worker_processes 2;
pid /var/run/nginx.pid;
worker_rlimit_nofile 30000;

events {
    worker_connections  4096;
}

http {
    upstream website {
      # primary server website.
      server 1.1.1.1:8081;
    }

    upstream registry {
        server 127.0.0.1:6081;
    }

    client_max_body_size  200M;
    keepalive_timeout     65;

    sendfile      on;
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;
    access_log    /var/log/nginx/access.log  main;

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    # HTTPS - npmE website
    server {
        listen       443;
        server_name  your-domain.com;

        ssl                   on;
        ssl_certificate       /etc/nginx/wildcard.pem;
        ssl_certificate_key   /etc/nginx/wildcard.pem;
        ssl_session_timeout   5m;
        ssl_protocols         TLSv1 TLSv1.1 TLSv1.2;
        ssl_ciphers           "EECDH+ECDSA+AESGCM EECDH+aRSA+AESGCM EECDH+ECDSA+SHA384 EECDH+ECDSA+SHA256 EECDH+aRSA+SHA384 EECDH+aRSA+SHA256 EECDH+aRSA+RC4 EECDH EDH+aRSA RC4 !aNULL !eNULL !LOW !3DES !MD5 !EXP !PSK !SRP !DSS";
        ssl_prefer_server_ciphers on;

        location / {
            proxy_pass       http://website;
              proxy_pass_request_headers on;
        }
    }

    # HTTPS - npmE Registry
    server {
        listen       443;
        server_name  registry.your-domain.com;

        ssl                   on;
        ssl_certificate       /etc/nginx/wildcard.pem;
        ssl_certificate_key   /etc/nginx/wildcard.pem;
        ssl_session_timeout   5m;
        ssl_protocols         TLSv1 TLSv1.1 TLSv1.2;
        ssl_ciphers           "EECDH+ECDSA+AESGCM EECDH+aRSA+AESGCM EECDH+ECDSA+SHA384 EECDH+ECDSA+SHA256 EECDH+aRSA+SHA384 EECDH+aRSA+SHA256 EECDH+aRSA+RC4 EECDH EDH+aRSA RC4 !aNULL !eNULL !LOW !3DES !MD5 !EXP !PSK !SRP !DSS";
        ssl_prefer_server_ciphers on;

        location / {
            proxy_pass       http://registry;
            proxy_pass_request_headers on;
        }
    }

    # npm Enterprise on HTTPS.
    server {
        listen       4443;
        server_name  npm.your-domain.com;

        ssl                   on;
        ssl_certificate       /etc/nginx/wildcard.pem;
        ssl_certificate_key   /etc/nginx/wildcard.pem;
        ssl_session_timeout   5m;
        ssl_protocols         TLSv1 TLSv1.1 TLSv1.2;
        ssl_ciphers           "EECDH+ECDSA+AESGCM EECDH+aRSA+AESGCM EECDH+ECDSA+SHA384 EECDH+ECDSA+SHA256 EECDH+aRSA+SHA384 EECDH+aRSA+SHA256 EECDH+aRSA+RC4 EECDH EDH+aRSA RC4 !aNULL !eNULL !LOW !3DES !MD5 !EXP !PSK !SRP !DSS";
        ssl_prefer_server_ciphers on;

        location / {
            proxy_pass       http://registry;
            proxy_pass_request_headers on;
        }
    }

    # HTTP -
    server {
        listen        80;
        server_name   npm.your-domain.com;
        rewrite       ^ https://$server_name$request_uri? permanent;
    }
}
```

> **Edit `/etc/sysctl.conf` and change or add the line `fs.file-max = 4096`**

> **Copy your `SSL pem file` to `/etc/nginx/wildcard.pem`**

> **Reload the NGiNX configuration with `sudo nginx -s reload`**

* [**Install and configure varnish.**](https://varnish-cache.org/docs/trunk/installation/install.html?highlight=installation)

> **Edit the `default.vcl` according to the steps mentioned below.**

> **Run `sudo nano /etc/varnish/default.vcl`** ( or you can use your .vcl file instead of default.vcl file)

```
# -----------------------------------------------------------------------------
# 1. replace `1.1.1.1` with your primary server's IP
# 2. replace `2.2.2.2` with your secondary server's IP
# 3. duplicate `replica1` block for each secondary server
# 4. add additional replicas in `vcl_init` via `pkgread.add_backend()`
# -----------------------------------------------------------------------------

vcl 4.0;
import directors;
backend primary {
  .host = "1.1.1.1";
  .port = "8080";
  .probe = {
    .url = "/";
    .timeout = 2s;
    .interval = 30s;
    .window = 5;
    .threshold = 3;
  }
}

backend replica1 {
  .host = "2.2.2.2";
  .port = "8080";
  .probe = {
    .url = "/";
    .timeout = 2s;
    .interval = 30s;
    .window = 5;
    .threshold = 3;
  }
}

sub vcl_init {
  new pkgread = directors.round_robin();
  pkgread.add_backend(primary);
  pkgread.add_backend(replica1);
}

sub vcl_backend_response {
  unset beresp.http.Etag;
  if (bereq.url ~ "@" || bereq.url ~ "/-/whoami" || beresp.status >= 300 || bereq.method != "GET") {
    # DON'T CACHE SCOPED MODULES.
    set beresp.ttl = 0s;
  } else if (bereq.url ~ "\.tgz$") {
    # CACHE TARBALLS FOR A LONG TIME.
    set beresp.ttl = 21600s;
  } else if (bereq.url ~ "^/[^/]+$") {
    # DON'T CACHE JSON FOR LONG.
    set beresp.ttl = 300s;
  } else {
    # DON'T CACHE SPECIAL ROUTES
    set beresp.ttl = 0s;
  }
}

sub vcl_hash {
  hash_data(req.url);
  return (lookup);
}

sub vcl_recv {
  set req.http.X-Authorization = req.http.Authorization;
  unset req.http.Authorization;
  unset req.http.If-Modified-Since;
  # we can correct for specific package collisions here.
  if (req.method == "GET") {
    set req.backend_hint = pkgread.backend();
  } else {
    set req.backend_hint = primary;
  }
}

sub vcl_backend_response {
    if (beresp.status >= 300 && bereq.retries == 0 && bereq.method == "GET") {
        return(retry);
    }
}

sub vcl_backend_fetch {
  set bereq.http.Authorization = bereq.http.X-Authorization;
  if (bereq.retries > 0) {
      set bereq.backend = primary;
  }
}
```

**Now restart varnish:**

> On `Debian systems` - `sudo service varnish restart`

> On `CentOS/RHEL systems` - `sudo # Load balancing with NGiNX & Varnish

