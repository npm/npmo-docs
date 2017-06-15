# Requirements

To install the latest version of npm Enterprise, you need a server fulfilling these basic specs:

- 64-bit architecture
- Kernel version 3.10 or higher
- One of the following Linux flavors (see [note on supported platforms](#note-on-supported-platforms) below):
    - Ubuntu 14.04 / 15.10
    - CentOS 7.x
    - Red Hat Enterprise Linux (RHEL) 7.x
    - Debian 7.7
- 4 or more CPUs/cores
- At least 16 GB of memory/RAM
- At least 25 GB of disk space (see [note on disk space](#note-on-disk-space) below)
- Ports opened for inbound TCP traffic:
    - 8800 (admin console)
    - 8080 (registry)
    - 8081 (website)
- Access to the public internet, either directly or via proxy (see [network requirements](#network-requirements) below)

If using Amazon Web Services, see [note on AWS](#note-on-aws) below.

## Network Requirements

Access to the following domains are required for installing and running an instance of npm Enterprise. Assume HTTP and HTTPS traffic for all of the domains listed.

In addition to this list, you should make sure your host has access to the `yum` or `apt` repositories it needs for standard OS and kernel upgrades.

### Docker

- cdn-registry-1.docker.io
- index.docker.io
- registry-1.docker.io
- quay.io
- get.docker.com
- apt.dockerproject.org
- yum.dockerproject.org
- ha.pool.sks-keyservers.net
- pgp.mit.edu
- keyserver.ubuntu.com
- quay-registry.s3.amazonaws.com
- auth.docker.io
- cloudfront.net

### Replicated

- api.replicated.com
- get.replicated.com
- registry.replicated.com

### npm

- license.npmjs.com
- registry.npmjs.com
- registry.npmjs.org
- replicate.npmjs.com
- skimdb.npmjs.com

### Node

- deb.nodesource.com
- rpm.nodesource.com
- dl.fedoraproject.org

### Node Security Platform

- api.nodesecurity.io

## Note on Supported Platforms

We have tested extensively on the operating systems listed above. It may be possible to run npm Enterprise on other systems, but, at this time, no other systems are officially supported.

We do our best to support as many systems as possible. If you have special requirements or feedback for other platforms, please reach out to us at support@npmjs.com. We'd love to work with you.

You can also check for system issues on the <a href="https://github.com/npm/npme-installer/issues" target="_blank">npme-installer GitHub repo</a>.

## Note on Disk Space

The amount of disk space needed is directly proportional to the number and size of packages your registry will need to host.

For example, the full public registry hosts at least 300,000 packages with an average of 6 versions each, and this requires at least a terabyte of storage. Smaller registries, however, can get away with just a few gigabytes.

Therefore, a server with 75 - 150 GB is a good choice for most registries.

Please reserve at least 10 GB for OS resources and npm Enterprise appliance containers.

Once installed, you can configure where registry data is stored on your server via the "Storage" paths on the "Settings" page of the admin web console (port 8800). For details on configuring your Enterprise instance, please see [this page](customization.md).

<a name="note-aws"></a>
## Note on AWS

We have an AMI for npm Enterprise, and you should use it! [Read more about that here.](platforms/aws.md)

We recommend using an <a href="https://aws.amazon.com/ec2/instance-types/#M3" target="_blank">m3.large</a> instance type.

If extra storage is needed, you may want to <a href="http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ebs-using-volumes.html" target="_blank">attach an EBS volume</a> to your EC2 instance and configure the "Storage" paths on your Enterprise appliance to use directories under the mount point.

To open ports on your AWS EC2 instance, you can define a Security Group with the following Inbound settings:

| Port | Reason            |
| ---- | ----------------- |
| 8080 | Registry          |
| 8081 | Website           |
| 8800 | Admin web console |
