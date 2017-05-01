# Load balancing with Varnish

If you are using npm Enterprise and want to apply Varnish as a solution for load balancing then follow the steps below.

* Install and configure nginx.

    * [Configure nginx](https://gist.github.com/bcoe/0f2ca5e644d464f40f9937c9787a244c)
    * [Increase limits](https://www.masv.io/boost-nginx-connection-limits/)

* [Install and configure varnish.](https://varnish-cache.org/docs/trunk/installation/install.html?highlight=installation)

Open `*.vcl` file (by default it is `default.vcl`).

Varnish has a concept of "backend" servers. A backend server is the server providing the content that Varnish will accelerate.

Somewhere in the top there will be a section that looks a bit like this:

```
backend default {
    .host = "127.0.0.1”;
    .port = "8080”;
 }
 ```

This defines a backend in Varnish called `default`. When Varnish serves content from this backend, it will connect to port 8080 on `127.0.0.1`.

Varnish can have several backends defined. You can even join several backends together into clusters of backends for load balancing purposes.

Let say we have default backend defined as registry

```
backend registry {
  .host = "127.0.0.1";
  .port = "8080";
}
```

This will point to your npm Enterprise registry.

Now we want to configure another server as replica of our primary server and use it for load balancing.

```
backend replica {
  .host = “Enter your host";
  .port = "8080";
}
```

Add another backend called public

```
backend public {
  .host = "127.0.0.1";
  .port = "8085";
}
```

Now group the above defined backends into a Director (group) called `pkgread`.

```
sub vcl_init {
  new pkgread = directors.round_robin();
  pkgread.add_backend(registry);
  pkgread.add_backend(replica);
}
```

Now send all the traffic to the `pkgread` Director.

We can avoid specific package collisions here, by redirecting traffic based on our requirements. Such as, here we are redirecting all scoped package installs to all the 3 backends that are available. But publish is redirected to `registry i.e (localhost:8080)`.
Other than the scoped packages all the other packages are installed from `public server i.e (localhost:8085)` and publishes are redirected to `registry i.e (localhost:8080)`.


```
sub vcl_recv {
  set req.http.X-Authorization = req.http.Authorization;
  unset req.http.Authorization;
  unset req.http.If-Modified-Since;

    if (req.method == "GET") {
     set req.backend_hint = pkgread.backend();
    } else {
     set req.backend_hint = registry;
    }
  } else if (req.method == "GET") {
    set req.backend_hint = public;
  } else {
    set req.backend_hint = registry;
  }
}
```