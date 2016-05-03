# Using Vagrant

## Summary

To get npm Enterprise up and running with Vagrant, you first need:

- An [npm user account]
- An npm Enterprise license. Get a [free trial] here!
- [VirtualBox] installed.
- [Vagrant] installed.

...then we'll need to:

1. Download and run the npm Enterprise `Vagrantfile`

Let's get started!

## Step 1: Install npm Enterprise

This `Vagrantfile` does several things:

  - updates `apt-get`
  - installs `curl` via `apt-get`
  - installs Node.js, via [NodeSource]
  - updates npm
  - displays Node.js and npm versions
  - installs `npmo` globally as the root user, via npm

Additionally, it forwards the following ports:

| Service                   | Port  |
|-------------------------- |------ |
| Administrator Panel       | 8800  |
| Registry                  | 8080  |
| Website                   | 8081  |
| Authentication Endpoints  | 8082  |


[npm user account]: https://www.npmjs.com/signup
[free trial]: https://www.npmjs.com/enterprise#free-trial
[VirtualBox]: https://www.virtualbox.org/
[Vagrant]: https://www.vagrantup.com/downloads.html
