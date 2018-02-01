# FAQ

Here are answers to some frequently asked questions. If you don't see your question listed here, and it's not covered by one of the many other docs pages, feel free to [open an issue](https://github.com/npm/npme-docs/issues) and ask/propose your question there.

- General
    - [What is npm Enterprise made of?](#what-is-npm-enterprise-made-of)
    - [How do I upgrade npm Enterprise?](#how-do-i-upgrade-npm-enterprise)
    - [What is npmo/npm On-Site, and how is it related to npme/npm Enterprise?](#what-is-npmonpm-on-site-and-how-is-it-related-to-npmenpm-enterprise)
    - [How do I replicate between two npm Enterprise instances?](#how-do-i-replicate-between-two-npm-enterprise-instances)
    - [What should I do if npm Enterprise binds to the wrong address?](#what-should-i-do-if-npm-enterprise-binds-to-the-wrong-ip-address)
    - [What should I do if I see a devicemapper warning?](#what-should-i-do-if-i-see-a-devicemapper-warning)
    - [Why use npm Enterprise](#why-use-npm-enterprise)
    - [What should I do with git dependencies on closed networks?](#what-should-i-do-with-git-dependencies-on-closed-networks)
    - [How do I update my npm Enterprise license?](#how-do-i-update-my-npm-enterprise-license)
    - [What should I do if ssl problem occurs with npme over https?](#what-should-i-do-if-ssl-problem-occurs-with-npme-over-https)
    - [How to configure proxy in Docker service?](#how-to-configure-proxy-in-docker-service) 


- Scopes and Packages
    - [What's the difference between a scoped package and an unscoped package?](#whats-the-difference-between-a-scoped-package-and-an-unscoped-package)
    - [Does using a scope make packages private automatically?](#does-using-a-scope-make-packages-private-automatically)
    - [Do I have to use a scope for the packages I publish to npme?](#do-i-have-to-use-a-scope-for-the-packages-i-publish-to-npme)
    - [Am I assigned a scope? How many scopes can I use?](#am-i-assigned-a-scope-for-npm-enterprise-how-many-scopes-can-i-use)
    - [How should I choose my scope?](#how-should-i-choose-my-scope)
    - [If I publish a package to my npm Enterprise registry, will it be published privately on the public registry too?](#if-i-publish-a-package-to-my-npm-enterprise-registry-will-it-be-published-privately-on-the-public-registry-too)

## What is npm Enterprise made of?

npmE consists of Docker, Replicated, the npme appliance, and the `npme` installer bin.

[Docker](https://www.docker.com/) is used to run Replicated and the npmE appliance.

[Replicated](https://www.replicated.com/) is npmE's orchestration software and admin console. It consists of its own Docker images/containers and integration with the underlying operating system. The admin console binds to port `:8800` and uses an SSL/TLS cert separate from the npmE appliance. Access the admin console using your favorite browser to configure and manage your npmE instance.

The npmE appliance is a suite of Docker images/containers that make up the private npm registry and website. The registry binds to port `:8080` and the website binds to port `:8081` on your host. Each instance of the appliance maintains its own databases as Docker containers, storing their data in configurable directories on the host file system. The npmE appliance is configured and managed by the admin console. The appliance does not use any SSL/TLS certificate, but the registry and website can be fronted with a load balancer, web server, or reverse proxy that terminates SSL/TLS. See [Terminating SSL with NGINX](../tutorials/nginx.md) for an example.

The [`npme` bin](https://www.npmjs.com/package/npme) is a CLI app distributed as a public npm package. It is used as a one-step installer for Docker and Replicated, and after installation it provides several administrative commands for adding or configuring functionality for your npme instance. In order to use it, you must have Node.js and npm installed on your host.

The last piece to the puzzle is `npm` itself. The same CLI client you use to install packages from the public registry can be used to publish and install private packages from npm Enterprise. Read more about in [Common Workflows](../workflow/README.md).

## How do I upgrade npm Enterprise?

The answer depends on [which part](#what-is-npm-enterprise-made-of) of npmE you're talking about.

1. Upgrading the appliance (registry and website)

    This is the most common type of upgrade, and it can be done from the admin console web UI (port `:8800`). Either click the "Check Now" button in the top-center panel of the Dashboard page (`/dashboard`) or go to the Releases page (`/releases`). If a new version is available, it will be displayed with an option to install it - just click the button!

    Upgrading to a new appliance version will first download the necessary Docker images and then restart the appliance. Downtime will be incurred while the appliance is restarted and generally takes less than a minute.

    It's a good idea to check for updates every few weeks.

2. Upgrading the `npme` bin

    You can upgrade the `npme` installer bin by SSH'ing into your server and simply running:

    ```
    sudo npm i -g --ignore-scripts npme
    ```

    This _will not_ affect the running appliance and does not incur any downtime.

3. Upgrading Replicated with or without Docker

    The method you use to upgrade Replicated (npme's orchestration software and admin console) depends on the current version your instance is running.

    To determine the Replicated version, SSH into your host and run `replicated --version`.

    If you're running a version less than 2.0.0, you need to migrate to version 2 first. Run this and answer any prompts:

    ```
    curl -sSL https://get.replicated.com/migrate-v2 | sudo bash
    ```

    If you're running a version greater than 2.0.0, you can either upgrade Replicated and Docker together using the `npme` installer (run the following and answer any prompts):

    ```
    sudo npm i npme -g --unsafe
    ```

    Or you can upgrade just Replicated by running this and answering any prompts:

    ```
    curl -sSL https://get.replicated.com/docker | sudo bash no-docker
    ```

    It's generally a good idea to upgrade Replicated with Docker to make sure your system is running the best compatible version of Docker for npmE.

    Note that all of these options incur downtime for your npmE instance.

## What is npmo/npm On-Site, and how is it related to npmE/npm Enterprise?

The first version of npm Enterprise did not use Docker or Replicated, but it only supported a small range of platforms. Around August 2015, the product was refactored to leverage Replicated and Docker, significantly expanding the range of supported platforms, and was soon renamed to npm On-Site. Over time we discovered the On-Site name was confusing, and so in April 2016 we rebranded npm On-Site back to npm Enterprise.

npm On-Site is literally the same product as npm Enterprise, just an older version. Similarly, the `npmo` bin was renamed to `npmE` and has been deprecated.

If you're currently running npm On-Site, please use the [How do I upgrade npm Enterprise?](#how-do-i-upgrade-npm-enterprise) answer to upgrade to npm Enterprise, and make sure to migrate Replicated to version 2. You should also replace the `npmo` bin on your host with `npme` via the following:

```
sudo npm uninstall -g npmo
sudo npm i -g --ignore-scripts npme
```

## How do I replicate between two npm Enterprise instances?

It's good practice to setup a second npm Enterprise as a replica of your primary npm Enterprise
server. This gives you a hot spare to fallback to in the case of failure.

Setting up a replica is easy:

1. On your primary server, copy the values of `Full URL of npm Enterprise registry`, and
   `Secret used between services` (replication connects to the registry component
    of npm Enterprise, which defaults to running on `:8080`).
2. Provision the secondary server and ensure that publication and installation is working
  appropriately.
3. Optionally, set `Publication Settings` to `Read Only` on the secondary server (this
   will prevent users form accidentally publishing packages to it).
4. On the secondary server:
  * set `Upstream URL` to the value of `Full URL of npm Enterprise registry` on the primary.
  * set `Upstream secret` to the value of `Secret used between services` on the primary.
  * set `Policy to apply during replication` to `mirror` on the secondary server.
5. `ssh` into the secondary server, and run `npme reset-follower`.

That's all there is to it! Wait a few minutes and the secondary should be synced with the
primary server.

For more details, see replication for [Backups and HA](../tutorials/backups-and-ha.md).

## What should I do if npm Enterprise binds to the wrong IP address?

In rare situations, npm Enterprise may bind to the wrong `Daemon Address`
for the cluster of services that it provisions. To fix this, manually configure
the IP address:

### On Centos/RHEL

1. Edit `/etc/sysconfig/replicated`, set `PRIVATE_ADDRESS` to the appropriate value.
2. Edit `/etc/sysconfig/replicated-operator`, set `PRIVATE_ADDRESS` to the appropriate value.
3. `sudo systemctl restart replicated replicated-operator`, to reload the environment.

### On Ubuntu/Debian

1. Edit `/etc/default/replicated`, set `PRIVATE_ADDRESS` to the appropriate value.
2. Edit `/etc/default/replicated-operator`, set `PRIVATE_ADDRESS` to the appropriate value.
3. `sudo service replicated stop && sudo service replicated-operator stop && sudo service replicated start && sudo service replicated-operator start`, to reload the environment.

## What should I do if I see a devicemapper warning?

Running `devicemapper` in loopback mode is discouraged for production.
It has known performance problems and a different storage driver should be used. 
See [devicemapper performance considerations](https://docs.docker.com/engine/userguide/storagedriver/device-mapper-driver/#other-device-mapper-performance-considerations) 
and [selecting a storage driver](https://docs.docker.com/engine/userguide/storagedriver/selectadriver/) to understand the available storage drivers and limitations. 


To find out which storage driver is set on the daemon, use the Docker info command:

`$ docker info`

You can set the storage driver by passing the `—-storage-driver=<name>` option to the dockerd command line.

`$ dockerd --storage-driver=overlay &`

Alternatively, you can force the Docker daemon to automatically start with the overlay/overlay2 driver by editing the Docker config file and adding the `—-storage-driver=overlay` flag to the `DOCKER_OPTS` line.

Your choice of storage driver can affect the performance of your npm Enterprise server, 
so it’s important to understand the different storage driver options available and select the right one for your application.

We recommend that you use the `overlay` driver, rather than `devicemapper`; for help configuring this [please see the following tutorial](https://docs.docker.com/engine/userguide/storagedriver/overlayfs-driver/#configure-docker-with-the-overlayoverlay2-storage-driver)

## Why use npm Enterprise?

1. npm Enterprise is single tenant vs. multi tenant -- which is important for companies with advanced compliance needs. npm Enterprise also allows you to have any number of scopes and provides its own website, which can be useful for large organizations.

2. npm Enterprise allows you to run npm’s infrastructure behind your company’s firewall.

3. Integration with the *Node Security Platform* provides package-level analysis to assist Enterprise customers with security risk mitigation.

   Read more about it on our [blog](http://blog.npmjs.org/post/146943134240/npm-add-ons) and this [Node Security Platform article.](https://medium.com/node-security/announcing-npm-enterprise-security-add-on-6dde303efb9f).

4. Significantly improve the efficiency of your development process, making it easier to share documentation and code, streamline your build process, and breakup your monolithic code-bases into individual packages that are easier to maintain.

5. Control access to packages and the website via the following supported authentication types:

   *  [GitHub Enterprise](https://npme.npmjs.com/docs/up-and-running/auth/github.html)
   *  Bitbucket Cloud
   *  [LDAP](https://npme.npmjs.com/docs/up-and-running/auth/ldap.html)
   *  SAML
   *  OAuth 2, e.g. [Google](https://npme.npmjs.com/docs/up-and-running/auth/oauth-google.html)

   Optionally, develop your own [custom auth-plugin](https://npme.npmjs.com/docs/up-and-running/auth/custom.html) for advanced cases where a supported option is unavailable.
   
## What should I do with git dependencies on closed networks?

If you are installing a package that has a git URL as a dependency, npm will fetch that package from the remote git repository itself. npm supports both [git and HTTP URL formats](https://docs.npmjs.com/files/package.json#dependencies), so we will need to work around this in our private registry.

```
"dependencies" : {
  "name1" : "git://github.com/user/project.git#commit-ish",
  "name2" : "git://github.com/user/project.git#commit-ish"
}
```
When you are installing the package in the closed network where a dependency references a git url rather than a package name, you will be unable to install the dependency since it references an external network address.

#### Publishing the git dependency to your private repo

In this situation, one approach you can take is to download a tarball version of the package and republish it to your private registry.

You can download a tarball version of the package from GitHub using:
```
 wget -L https://github.com/user-or-org/repo/archive/master.tar.gz
```
Replace `user-or-org` and `repo` accordingly.

To publish the tarball to your private registry, simply follow the steps listed below:

*  tar -xvzf package.tar.gz
*  cd package
*  npm publish --registry=http://your-private-registry:8080 --scope=@your-scope

#### Updating packages to reference the new dependency

After publishing the git dependency to your private repo, you need to update the packages to reference the new dependency:

```
"dependencies" : {
  "@your-scope/package-name" : "latest version"
}
```
Please note that, since it will often be a dependency of a dependency that has the git dependency, it will likely be necessary to both publish the git dependency and the dependency requiring it. We recommend that you publish these new versions with a scope (@your-scope/request);

We have a tool for simplifying this process: https://www.npmjs.com/package/scope-it

## How do I update my npm Enterprise license?

You can update npm Enterprise license by following the steps below:

1. Run `npme update-license` on your npm Enterprise server.

2. When prompted, enter your registered billing email.

3. When prompted, enter your license key.

You can get a license key by purchasing an npm Enterprise license on our [license page](https://www.npmjs.com/enterprise/license)

## What should I do if SSL problem occurs with npmE over https?

When using a custom certificate for your npmE registry, you might get an error related to the SSL certificate when logging in or publishing a package even though the browser does not display errors when viewing the npme registry site. This is because Node's certificate validation is strict and doesn't allow for things like self-signed certificates by default.
To fix your issue temporarily you can provide `--strict-ssl=false` during login or you can add it to your ~/.npmrc file
`npm config set strict-ssl=false`.

For a permanent fix, you can point npm to a `cafile`:
```
npm config set cafile /path/to/cert.pem
```

You can also configure ca string(s) directly.

```
npm config set ca "cert string"`
```
`ca` can be an array of cert strings too. In your .npmrc:

```
ca[ ]="cert 1 base64 string"
ca[ ]="cert 2 base64 string"
```

The npm config commands above will persist the relevant config items to your ~/.npmrc file:

```
cafile=/path/to/cert.pem
```


The above `cafile` setting will override the default "real world" certificate authority lookups that npm uses. If you try and use any public npm registries via https that aren't signed by your CA certificate, you will get errors.

If you need to support both public https npm registries as well as your own, you could use [curl's Mozilla based CA bundle](https://curl.haxx.se/docs/caextract.html) and append your CA cert to the cacert.pem file.

## How to configure proxy in Docker service?

In order for the system to work properly with your proxy, Docker has to be configured to use the proxy correctly. `HTTP_PROXY` and `HTTPS_PROXY` are standard Linux variables and they have to be set in order for the system to work correctly.

To set these, you have two options:

#### Option 1 - Change the /etc/sysconfig/docker

```
export HTTP_PROXY="http://proxy.company.com:proxyport"
export HTTPS_PROXY="http://proxy.company.com:proxyport"
sudo service docker restart
```
#### Option 2 - Set Environment Variables Via system.d

```
sudo mkdir /etc/systemd/system/docker.service.d
```
Create a file called `/etc/systemd/system/docker.service.d/http-proxy.conf` that adds the `HTTP_PROXY` environment variable:

```
[Service]
Environment="HTTP_PROXY=http://proxy.company.com:proxyport"
```
If you are behind the `HTTPS` proxy server, create a file called `/etc/systemd/system/docker.service.d/https-proxy.conf` that adds the `HTTPS_PROXY` environment variable:

```
[Service]
Environment="HTTPS_PROXY=http://proxy.company.com:proxyport"
```
If you have internal Docker registries that you need to contact without proxying, you can specify them via the `NO_PROXY` environment variable:

```
[Service]
Environment="HTTP_PROXY=http://proxy.company.com:proxyport" "NO_PROXY=localhost,127.0.0.1,docker-registry.somecorporation.com"
```
Or, if you are behind the HTTPS proxy server:

```
[Service]
Environment="HTTPS_PROXY=http://proxy.company.com:proxyport" "NO_PROXY=localhost,127.0.0.1,docker-registry.somecorporation.com"
```
Flush changes:

```
sudo systemctl daemon-reload
```
Restart Docker:

```
sudo systemctl restart docker
```

Which option you choose may depend on your host OS and Docker version. The important thing is to ensure that the containers reflect those environment variables getting set correctly.

Verify that the configuration has been loaded:

```
$ systemctl show --property=Environment docker
Environment=HTTP_PROXY=http://proxy.company.com:proxyport
```
Or, if you are behind the HTTPS proxy server:

```
$ systemctl show --property=Environment docker
Environment=HTTPS_PROXY=https://proxy.company.com:proxyport
```

## What's the difference between a scoped package and an unscoped package?

A scoped package has a scope (or namespace), which begins with an `@` symbol and is followed by a `/`, in the package name, e.g. `@scope/foo`. An unscoped package has no scope in the package name, e.g. `foo`. The scope is a permanent part of the package's name and identity, used in `package.json` and also in `require()` or `import` statements in code.

Technically, the only difference is the presence of a scope in the package name. Semantically, however, a scoped package is private by default. For this reason, we *highly* recommend that you use a scope for any and all packages that you do not want to publish publicly.

## Does using a scope make packages private automatically?

Yes, because a scoped package is only made public if published using `npm publish --access public` (or subsequently modified via `npm access public`). For this reason, we *highly* recommend that you use a scope for any and all private packages.

## Do I have to use a scope for the packages I publish to npmE?

Technically no. There are a couple ways you can configure your `npm` client (or even an individual package) to point to your private registry without using a scope, but we *highly* recommend using a scope for _all_ private packages to avoid unintentionally publishing your private package to the public registry, based on the following facts:

- The `npm` CLI client treats scoped packages as private by default.
- You cannot accidentally publish a scoped package to the public registry unless you have access to that scope in the public registry.

There are valid workflows which publish prerelease versions of a package to a private npm Enterprise registry as a precursor to publishing a release version publicly on the public registry, but this is not a typical use-case.

For more info on scopes, see the next question.

## Am I assigned a scope for npm Enterprise? How many scopes can I use?

Unlike [orgs or private packages](https://www.npmjs.com/features) on the public registry, you are *not* assigned a scope to use for private packages you publish to npm Enterprise. You are free to use any scope name that you wish, but to avoid namespace collisions with public scoped packages, you should try to use a scope that identifies your company/organization and is unique on the public registry. This will also make it easier to switch to npm's hosted Orgs solution (where your private packages are hosted privately on the public registry), if you ever wish to do so. But it's your choice!

You are allowed to use as many scopes as you like with npm Enterprise. You could use different scopes for different teams or projects within your organization, or use one scope for all packages. It's up to you!

## How should I choose my scope?

It's recommended that you use your company name, e.g., `@npm`,
or for large organizations a business unit within your company, e.g., `@npm-cli`. There's
no limit on the number of scopes that you can use in npm Enterprise.

## If I publish a package to my npm Enterprise registry, will it be published privately on the public registry too?

No. Packages published to npm Enterprise are not published to an upstream registry, particularly not the public registry. One of the main reasons to use npm Enterprise is that you maintain complete control over the packages that you publish - they belong to you and they live _only_ on your server(s). Access to packages published to npm Enterprise is defined by your configured authentication/authorization provider, which is controlled by you or your organization. The access control used by the public registry is different and completely separate.
