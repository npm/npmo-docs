# Using VMWare

## Summary

To get npm Enterprise up and running in VMWare, you first need:

- An [npm user account]
- An npm Enterprise license. Get a [free trial] here!
- [VMWare]

...then we'll need to:

1. Create a custom Ubuntu 14.04 LTS, Debian, or CentOS VM
2. Run the npmo deploy script
3. Forward ports for the admin panel, registry, and website

Let's get started!

## Step 1: Create a custom VM

## Step 2: Install npm Enterprise

This script:

  - updates `apt-get`
  - installs `curl` via `apt-get`
  - installs Node.js, via [NodeSource]
  - updates npm
  - displays Node.js and npm versions
  - installs `npmo` globally as the root user, via npm

## Step 3: Forward VM Ports

| Service                   | Port  |
|-------------------------- |------ |
| Administrator Panel       | 8800  |
| Registry                  | 8080  |
| Website                   | 8081  |
| Authentication Endpoints  | 8082  |

[npm user account]: https://www.npmjs.com/signup
[free trial]: https://www.npmjs.com/enterprise#free-trial
[VMWare]: http://www.vmware.com/
