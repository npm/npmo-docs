# Using Vagrant

## Summary

To get npm Enterprise up and running with Vagrant, you first need:

- An npm Enterprise license. Get a [free trial] here.
- [VirtualBox] installed.
- [Vagrant] installed.

...then we'll need to:

1. Download and run the npm Enterprise [Vagrantfile]

Let's get started!

## Step 1: Install npm Enterprise

The Vagrantfile does several things:

  - Updates `apt-get`.
  - Installs `curl` via `apt-get`.
  - Installs Node.js, via [NodeSource].
  - Updates npm.
  - Displays Node.js and npm versions.
  - Installs `npme` globally as the root user, via npm.

Additionally, it forwards the following ports:

| Service                   | Port  |
|-------------------------- |------ |
| Administrator Panel       | 8800  |
| Registry                  | 8080  |
| Website                   | 8081  |

To start npm Enterprise, simply download the [Vagrantfile] and run `vagrant up`.

To SSH into the vagrant image, run `vagrant ssh`.

## Step 2: Configuring npm Enterprise

Open your favorite web browser, access your server on port `8800`, and follow the prompts to configure and start your appliance.

For more information on configuring npm Enterprise, [read these docs](/up-and-running/customization.html).

[free trial]: https://www.npmjs.com/enterprise#free-trial
[VirtualBox]: https://www.virtualbox.org/
[Vagrant]: https://www.vagrantup.com/downloads.html
[NodeSource]: https://github.com/nodesource/distributions
[Vagrantfile]: https://raw.githubusercontent.com/npm/npme-vagrant/master/Vagrantfile
