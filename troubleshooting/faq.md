# FAQ

Here are answers to some frequently asked questions. If you don't see your question listed here, and it's not covered by one of the many other docs pages, feel free to [open an issue](https://github.com/npm/npme-docs/issues) and ask/propose your question there.

- General
    - [What is npm Enterprise made of?](#what-is-npm-enterprise-made-of)
    - [How do I upgrade npm Enterprise?](#how-do-i-upgrade-npm-enterprise)
    - [What is npmo/npm On-Site, and how is it related to npme/npm Enterprise?](#what-is-npmonpm-on-site-and-how-is-it-related-to-npmenpm-enterprise)
    - [How do I replicate between two npm Enterprise instances?](#how-do-i-replicate-between-two-npm-enterprise-instances)
    - [What should I do if npm Enterprise binds to the wrong address?](#what-should-i-do-if-npm-enterprise-binds-to-the-wrong-ip-address)
    - [What should I do if I see a devicemapper warning?](#what-should-i-do-if-i-see-a-devicemapper-warning)

- Scopes and Packages
    - [What's the difference between a scoped package and an unscoped package?](#whats-the-difference-between-a-scoped-package-and-an-unscoped-package)
    - [Does using a scope make packages private automatically?](#does-using-a-scope-make-packages-private-automatically)
    - [Do I have to use a scope for the packages I publish to npme?](#do-i-have-to-use-a-scope-for-the-packages-i-publish-to-npme)
    - [Am I assigned a scope? How many scopes can I use?](#am-i-assigned-a-scope-for-npm-enterprise-how-many-scopes-can-i-use)
    - [How should I choose my scope?](#how-should-i-choose-my-scope)
    - [If I publish a package to my npm Enterprise registry, will it be published privately on the public registry too?](#if-i-publish-a-package-to-my-npm-enterprise-registry-will-it-be-published-privately-on-the-public-registry-too)

## What is npm Enterprise made of?

npme consists of Docker, Replicated, the npme appliance, and the `npme` installer bin.

[Docker](https://www.docker.com/) is used to run Replicated and the npme appliance.

[Replicated](https://www.replicated.com/) is npme's orchestration software and admin console. It consists of its own Docker images/containers and integration with the underlying operating system. The admin console binds to port `:8800` and uses an SSL/TLS cert separate from the npme appliance. Access the admin console using your favorite browser to configure and manage your npme instance.

The npme appliance is a suite of Docker images/containers that make up the private npm registry and website. The registry binds to port `:8080` and the website binds to port `:8081` on your host. Each instance of the appliance maintains its own databases as Docker containers, storing their data in configurable directories on the host file system. The npme appliance is configured and managed by the admin console. The appliance does not use any SSL/TLS certificate, but the registry and website can be fronted with a load balancer, web server, or reverse proxy that terminates SSL/TLS. See [Terminating SSL with NGINX](../tutorials/nginx.md) for an example.

The [`npme` bin](https://www.npmjs.com/package/npme) is a CLI app distributed as a public npm package. It is used as a one-step installer for Docker and Replicated, and after installation it provides several administrative commands for adding or configuring functionality for your npme instance. In order to use it, you must have Node and npm installed on your host.

The last piece to the puzzle is `npm` itself. The same CLI client you use to install packages from the public registry can be used to publish and install private packages from npm Enterprise. Read more about in [Common Workflows](../workflow/README.md).

## How do I upgrade npm Enterprise?

The answer depends on [which part](#what-is-npm-enterprise-made-of) of npme you're talking about.

1. Upgrading the appliance (registry and website)

    This is the most common type of upgrade, and it can be done from the admin console web UI (port `:8800`). Either click the "Check Now" button in the top-center panel of the Dashboard page (`/dashboard`) or go to the Releases page (`/releases`). If a new version is available, it will be displayed with an option to install it - just click the button!

    Upgrading to a new appliance version will first download the necessary Docker images and then restart the appliance. Downtime will be incurred while the appliance is restarted and generally takes less than a minute.

    It's probably a good idea to check for updates every few weeks.

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

    It's generally a good idea to upgrade Replicated with Docker to make sure your system is running the best compatible version of Docker for npme.

    Note that all of these options incur downtime for your npme instance.

## What is npmo/npm On-Site, and how is it related to npme/npm Enterprise?

The first version of npm Enterprise did not use Docker or Replicated, but it only supported a small range of platforms. Around August 2015, the product was refactored to leverage Replicated and Docker, significantly expanding the range of supported platforms, and was soon renamed to npm On-Site. Over time we discovered the On-Site name was confusing, and so in April 2016 we rebranded npm On-Site back to npm Enterprise.

npm On-Site is literally the same product as npm Enterprise, just an older version. Similarly, the `npmo` bin was renamed to `npme` and has been deprecated.

If you're currently running npm On-Site, please use the [How do I upgrade npm Enterprise?](#how-do-i-upgrade-npm-enterprise) answer to upgrade to npm Enterprise, and make sure to migrate Replicated to version 2. You should also replace the `npmo` bin on your host with `npme` via the following:

```
sudo npm uninstall -g npmo
sudo npm i -g --ignore-scripts npme
```

## How do I replicate between two npm Enterprise instances?

It's good practice to setup a second npm Enterprise as a replica of your primary npm Enterprise
server. This gives you a hot spare to fallback to in the case of failure.

Setting up a replica is easy:

1. on your primary server copy the values of `Full URL of npm Enterprise registry`, and
   `Secret used between services` (replication connects to the registry component
    of npm Enterprise, which defaults to running on `:8080`).
2. provision the secondary server and ensure that publication and installation is working
  appropriately.
3. Optionally, set `Publication Settings` to `Read Only` on the secondary server (this
   will prevent users form accidentally publishing packages to it).
4. on the secondary server:
  * set `Upstream URL` to the value of `Full URL of npm Enterprise registry` on the primary.
  * set `Upstream secret` to the value of `Secret used between services` on the primary.
  * set `Policy to apply during replication` to `mirror` on the secondary server.
5. `ssh` into the secondary server, and run `npme reset-follower`.

That's all there is to it, wait a few minutes and the secondary should be synced with the
primary server.

For more details, see replication for [Backups and HA](../tutorials/backups-and-ha.md).

## What should I do if npm Enterprise binds to the wrong IP address?

In rare situations, npm Enterprise may bind to the wrong `Daemon Address`
for the cluster of services that it provisions. To fix this, manually configure
the IP address:

### On Centos/RHEL

1. edit `/etc/sysconfig/replicated`, set `PRIVATE_ADDRESS` to the appropriate value.
2. edit `/etc/sysconfig/replicated-operator`, set `PRIVATE_ADDRESS` to the appropriate value.
3. `sudo systemctl restart replicated replicated-operator`, to reload the environment.

### On Ubuntu/Debian

1. edit `/etc/default/replicated`, set `PRIVATE_ADDRESS` to the appropriate value.
2. edit `/etc/default/replicated-operator`, set `PRIVATE_ADDRESS` to the appropriate value.
3. `sudo service replicated stop && sudo service replicated-operator stop && sudo service replicated start && sudo service replicated-operator start`, to reload the environment.

## What should I do if I see a devicemapper warning?

Running `devicemapper` in loopback mode is discouraged for production.
It has known performance problems and a different storage driver should be used. 
See [devicemapper performance considerations](https://docs.docker.com/engine/userguide/storagedriver/device-mapper-driver/#other-device-mapper-performance-considerations) 
and [selecting a storage driver](https://docs.docker.com/engine/userguide/storagedriver/selectadriver/) to understand the available storage drivers and limitations. 


To find out which storage driver is set on the daemon, use the docker info command:

`$ docker info`

You can set the storage driver by passing the `—-storage-driver=<name>` option to the dockerd command line.

`$ dockerd --storage-driver=overlay &`

Alternatively, you can force the Docker daemon to automatically start with the overlay/overlay2 driver by editing the Docker config file and adding the `—-storage-driver=overlay` flag to the `DOCKER_OPTS` line.

Your choice of storage driver can affect the performance of your npm Enterprise server. 
So it’s important to understand the different storage driver options available and select the right one for your application.

We recommend that you use the `overlay` driver, rather than `devicemapper`; for help configuring this [please see the following tutorial](https://docs.docker.com/engine/userguide/storagedriver/overlayfs-driver/#configure-docker-with-the-overlayoverlay2-storage-driver)

## What's the difference between a scoped package and an unscoped package?

A scoped package has a scope (or namespace), which begins with an `@` symbol and is followed by a `/`, in the package name, e.g. `@scope/foo`. An unscoped package has no scope in the package name, e.g. `foo`. The scope is a permanent part of the package's name and identity, used in `package.json` and also in `require()` or `import` statements in code.

Technically, the only difference is the presence of a scope in the package name. Semantically, however, a scoped package is private by default. For this reason, we *highly* recommend that you use a scope for any and all packages that you do not want to publish publicly.

## Does using a scope make packages private automatically?

Yes, because a scoped package is only made public if published using `npm publish --access public` (or subsequently modified via `npm access public`). For this reason, we *highly* recommend that you use a scope for any and all private packages.

## Do I have to use a scope for the packages I publish to npme?

Technically no. There are a couple ways you can configure your `npm` client (or even an individual package) to point to your private registry without using a scope, but we *highly* recommend using a scope for _all_ private packages to avoid unintentionally publishing your private package to the public registry, based on the following facts:

- The `npm` CLI client treats scoped packages as private by default.
- You cannot accidentally publish a scoped package to the public registry unless you have access to that scope in the public registry.

There are valid workflows which publish prerelease versions of a package to a private npm Enterprise registry as a precursor to publishing a release version publicly on the public registry, but this is not a typical use-case.

For more info on scopes, see the next question.

## Am I assigned a scope for npm Enterprise? How many scopes can I use?

Unlike [orgs or private packages](https://www.npmjs.com/features) on the public registry, you are *not* assigned a scope to use for private packages you publish to npm Enterprise. You are free to use any scope name that you wish, but to avoid namespace collisions with public scoped packages, you should try to use a scope that identifies your company/organization and is unique on the public registry. This will also make it easier to switch to npm's hosted orgs solution (where your private packages are hosted privately on the public registry), if you ever wish to do so. But it's your choice!

You are allowed to use as many scopes as you like with npm Enterprise. You could use different scopes for different teams or projects within your organization, or use one scope for all packages. It's up to you!

## How should I choose my scope?

It's recommended that you use your company name, e.g., `@npm`,
or for large organizations a business unit within your company, e.g., `@npm-cli`. There's
no limit on the number of scopes that you can use in npm Enterprise.

## If I publish a package to my npm Enterprise registry, will it be published privately on the public registry too?

No. Packages published to npm Enterprise are not published to an upstream registry, particularly not the public registry. One of the main reasons to use npm Enterprise is that you maintain complete control over the packages that you publish - they belong to you and they live _only_ on your server(s). Access to packages published to npm Enterprise is defined by your configured authentication/authorization provider, which is controlled by you or your organization. The access control used by the public registry is different and completely separate.
