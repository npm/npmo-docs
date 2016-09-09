# FAQ

Here are answers to some frequently asked questions. If you don't see your question listed here, and it's not covered by one of the many other docs pages, feel free to [open an issue](https://github.com/npm/npme-docs/issues) and ask/propose your question there.

- General
    - [What is npm Enterprise made of?](#what-is-npme-made-of)
    - [How do I upgrade npm Enterprise?](#how-do-i-upgrade-npme)
    - [What is npmo/npm On-Site, and how is it related to npme/npm Enterprise?](#what-is-npmo)
- Scopes and Packages
    - [What's the difference between a scoped package and an unscoped package?](#difference-bw-scoped-and-unscoped)
    - [Does using a scope make packages private automatically?](#are-scoped-packages-automatically-private)
    - [Do I have to use a scope for the packages I publish to npme?](#do-i-have-to-use-a-scope)
    - [Am I assigned a scope? How many scopes can I use?](#am-i-assigned-a-scope-how-many)
    - [If I publish a package to my npm Enterprise registry, will it be published privately on the public registry too?](#are-packages-published-to-public-registry)

## What is npm Enterprise made of? {#what-is-npme-made-of}

npme consists of Docker, Replicated, the npme appliance, and the `npme` installer bin.

[Docker](https://www.docker.com/) is used to run Replicated and the npme appliance.

[Replicated](https://www.replicated.com/) is npme's orchestration software and admin console. It consists of its own Docker images/containers and integration with the underlying operating system. The admin console binds to port `:8800` and uses an SSL/TLS cert separate from the npme appliance. Access the admin console using your favorite browser to configure and manage your npme instance.

The npme appliance is a suite of Docker images/containers that make up the private npm registry and website. The registry binds to port `:8080` and the website binds to port `:8081` on your host. Each instance of the appliance maintains its own databases as Docker containers, storing their data in configurable directories on the host file system. The npme appliance is configured and managed by the admin console. The appliance does not use any SSL/TLS certificate, but the registry and website can be fronted with a load balancer, web server, or reverse proxy that terminates SSL/TLS. See [Terminating SSL with NGINX](../tutorials/nginx.md) for an example.

The [`npme` bin](https://www.npmjs.com/package/npme) is a CLI app distributed as a public npm package. It is used as a one-step installer for Docker and Replicated, and after installation it provides several administrative commands for adding or configuring functionality for your npme instance. In order to use it, you must have Node and npm installed on your host.

The last piece to the puzzle is `npm` itself. The same CLI client you use to install packages from the public registry can be used to publish and install private packages from npm Enterprise. Read more about in [Common Workflows](../workflow/README.md).

## How do I upgrade npm Enterprise? {#how-do-i-upgrade-npme}

The answer depends on [which part](#what-is-npme-made-of) of npme you're talking about.

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

## What is npmo/npm On-Site, and how is it related to npme/npm Enterprise? {#what-is-npmo}

The first version of npm Enterprise that used Replicated and Docker was called npm On-Site, which was released around September 2015. In April 2016, npm On-Site was rebranded back to npm Enterprise. npm On-Site is literally the same product as npm Enterprise, just an older version. Similarly, the `npmo` bin was renamed to `npme` and has been deprecated.

If you're currently running npm On-Site, please use the [How do I upgrade npm Enterprise?](#how-do-i-upgrade-npme) answer to upgrade to npm Enterprise, and make sure to migrate Replicated to version 2. You should also replace the `npmo` bin on your host with `npme` via the following:

```
sudo npm uninstall -g npmo
sudo npm i -g --ignore-scripts npme
```

## What's the difference between a scoped package and an unscoped package? {#difference-bw-scoped-and-unscoped}

A scoped package has a scope (or namespace), which begins with an `@` symbol and is followed by a `/`, in the package name, e.g. `@scope/foo`. An unscoped package has no scope in the package name, e.g. `foo`. The scope is a permanent part of the package's name and identity, used in `package.json` and also in `require()` or `import` statements in code.

Technically, the only difference is the presence of a scope in the package name. Semantically, however, a scoped package is private by default. For this reason, we *highly* recommend that you use a scope for any and all packages that you do not want to publish publicly.

## Does using a scope make packages private automatically? {#are-scoped-packages-automatically-private}

Yes, because a scoped package is only made public if published using `npm publish --access public` (or subsequently modified via `npm access public`). For this reason, we *highly* recommend that you use a scope for any and all private packages.

## Do I have to use a scope for the packages I publish to npme? {#do-i-have-to-use-a-scope}

Technically no. There are a couple ways you can configure your `npm` client (or even an individual package) to point to your private registry without using a scope, but we *highly* recommend using a scope for _all_ private packages to avoid unintentionally publishing your private package to the public registry, based on the following facts:

- The `npm` CLI client treats scoped packages as private by default.
- You cannot accidentally publish a scoped package to the public registry unless you have access to that scope in the public registry.

There are valid workflows which publish prerelease versions of a package to a private npm Enterprise registry as a precursor to publishing a release version publicly on the public registry, but this is not a typical use-case.

For more info on scopes, see the next question.

## Am I assigned a scope for npm Enterprise? How many scopes can I use? {#am-i-assigned-a-scope-how-many}

Unlike [orgs or private packages](https://www.npmjs.com/features) on the public registry, you are *not* assigned a scope to use for private packages you publish to npm Enterprise. You are free to use any scope name that you wish, but to avoid namespace collisions with public scoped packages, you should try to use a scope that identifies your company/organization and is unique on the public registry. This will also make it easier to switch to npm's hosted orgs solution (where your private packages are hosted privately on the public registry), if you ever wish to do so. But it's your choice!

You are allowed to use as many scopes as you like with npm Enterprise. You could use different scopes for different teams or projects within your organization, or use one scope for all packages. It's up to you!

## If I publish a package to my npm Enterprise registry, will it be published privately on the public registry too? {#are-packages-published-to-public-registry}

No. Packages published to npm Enterprise are not published to an upstream registry, particularly not the public registry. One of the main reasons to use npm Enterprise is that you maintain complete control over the packages that you publish - they belong to you and they live _only_ on your server(s). Access to packages published to npm Enterprise is defined by your configured authentication/authorization provider, which is controlled by you or your organization. The access control used by the public registry is different and completely separate.
