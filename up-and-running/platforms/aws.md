# Running npm Enterprise in AWS

<a href="https://www.npmjs.com/npm/enterprise" target="_blank">npm Enterprise</a> allows you to run your own private npm registry and website behind the firewall, and it’s designed to run on several different infrastructures. One of the easiest ways to run it, which we test extensively, is using Amazon Web Services.

In this article, we’ll show you exactly how to set this up.

Here’s the general idea:

1. [Define a Security Group](#define-a-security-group)
2. [Launch an EC2 instance](#launch-an-ec2-instance)
3. [Format and mount an attached EBS volume](#format-and-mount-an-attached-ebs-volume)
4. [Install and configure npm Enterprise](#install-and-configure-npm-enterprise)
5. [Use your private registry](#use-your-private-registry)

That’s all it takes to get up and running!

Let’s start by logging into the <a href="https://console.aws.amazon.com/console/home" target="_blank">AWS Console</a>. From there, click on “EC2” in the top left to access the EC2 Dashboard.

<a name="define-a-security-group"></a>
## 1. Define a Security Group

In AWS, a private virtual server is called an “EC2 instance.” We’ll need to create, or “launch,” an instance that can run npm Enterprise. _Before_ we can launch an instance, though, we’ll need a “security group” to allow inbound TCP communication on the ports on which npm Enterprise services listen. An AWS security group is a set of rules defining what type of network traffic is allowed for an EC2 instance.

To create a security group, click “Security Groups” under “Network & Security” in the vertical navigation bar on the left, then click the blue “Create Security Group” button near the top.

![Security Group List](/images/npmo-aws1.png)

The ports needed for inbound traffic include:

```
Port | Reason           
---- | -----------------
8080 | Registry         
8081 | Website          
8082 | Auth endpoints   
8800 | Admin web console
```

You’ll also need SSH access into your instance, so include port 22 in your security group. Then give your security group a name that you will recognize later, like “npmo”:

![Security Group Inbound](/images/npmo-aws2.png)

In a production environment, you’ll probably want to front the registry and website with a load balancer or routing layer, using a DNS name and standard ports (80 for HTTP and 443 for HTTPS). For purposes of this walkthrough, though, we’ll do without that initially and just access the services directly on the ports to which they bind.

<a name="launch-an-ec2-instance"></a>
## 2. Launch an EC2 instance

Now that we have a security group defined, we’re ready to launch an EC2 instance.

Click on “Instances” under “Instances” in the left navigation panel, then click the blue “Launch Instance” button.

![Instance List](/images/npmo-aws3.png)

This starts the multi-step instance wizard.

Our first step is to select a base Amazon Machine Image (or AMI) as a starting point. npm Enterprise supports Ubuntu 14+, CentOS 7, and RHEL 7. For this walkthrough, let’s assume CentOS 7. You can use the top `centos 7` search result in the “AWS Marketplace.” Just make sure it’s 64-bit. Click the blue “Select” button.

![Launch Step 1](/images/npmo-aws4.png)

The next step is choosing an instance type. This determines how many resources your server will be allocated. We recommend using an `m3.large`. Select the radio button in the first column of the table, then click “Next: Configure Instance Details” on the bottom right.

![Launch Step 2](/images/npmo-aws5.png)

Go with default instance details, then click “Next: Add Storage” on the bottom right.

![Launch Step 3](/images/npmo-aws6.png)

The next step is to configure storage volumes for your instance. We recommend adding an EBS volume that has at least 50 GB. We’ll use this volume to store the data for our npm Enterprise registry, and using EBS will make it easy to create snapshots of your package data for backup or transfer purposes.

Click “Add New Volume” button, select “EBS” as the “Volume Type,” and enter your desired amount of storage in “Size.” Then click the “Next: Tag Instance” button on the bottom right.

![Launch Step 4](/images/npmo-aws7.png)

Give your instance a name and click “Next: Configure Security Group.”

![Launch Step 5](/images/npmo-aws8.png)

Choose “Select an existing security group” at the top, then select the Security Group you created in step 1 from the list. Next, click the blue “Review and Launch.”

![Launch Step 6](/images/npmo-aws9.png)

Review your settings and click the blue “Launch” instance when you’re satisfied. This will open a dialog to select or create a key pair that you’ll need to access your instance over SSH.

![Launch Step 7](/images/npmo-aws10.png)

In the dialog, select “Create a new key pair” if you don’t already have one. Give it a name and click “Download Key Pair.” Remember where you save this file, as you’ll need it to SSH into your server. Once you’ve downloaded the `.pem` key pair file, click “Launch Instances” in blue.

![Key Pair](/images/npmo-aws11.png)

Wait for your instance to launch, and view its status in the “Instances” list.

![Instance Created](/images/npmo-aws12.png)

Note that if you’re running your EC2 instance in an AWS VPC virtual private cloud, then you may need to explicitly set your network interface MTU setting to 1500. You can read about why and how to do this in <a href="http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/network_mtu.html" target="_blank">the AWS docs</a>.

<a name="format-and-mount-an-attached-ebs-volume"></a>
## 3. Format and mount an attached EBS volume

Now that we have a server instance up and running, we need to prepare our attached EBS volume for use. Note that it will be attached, but not formatted or mounted initially.

Access your server using the `.pem` key pair file via SSH. For Mac or Linux users, use the canonical `ssh` CLI program. For Windows users, try <a href="http://www.putty.org/" target="_blank">PuTTY</a>.

To SSH into your server, you’ll need its public IP address. You can find the public IP for your server in the Instances list. Note that for CentOS 7, the username is `centos`, but if you chose a different Amazon Machine Image, the username may be different (e.g., `ubuntu` for Ubuntu, `ec2-user` for RHEL, or `admin` for Debian).

```sh
$ ssh -i ~/.ssh/my-key-pair.pem centos@<public-ip>
```

First find the volume’s device name, e.g. `/dev/xvdb`, using the `lsblk` command:

```sh
$ lsblk
NAME    MAJ:MIN RM SIZE RO TYPE MOUNTPOINT
xvda    202:0    0   8G  0 disk
└─xvda1 202:1    0   8G  0 part /
xvdb    202:16   0  50G  0 disk
```

Let’s quickly verify that our volume does not yet have a file system:

```sh
# sudo file -s <device>
$ sudo file -s /dev/xvdb
/dev/xvdb: data
```

The output should say `data`, meaning there is no file system formatted on the volume yet. Let’s add one:

```sh
# sudo mkfs -t ext4 <device>
$ sudo mkfs -t ext4 /dev/xvdb
mke2fs 1.42.9 (28-Dec-2013)
Filesystem label=
OS type: Linux
Block size=4096 (log=2)
Fragment size=4096 (log=2)
Stride=0 blocks, Stripe width=0 blocks
3276800 inodes, 13107200 blocks
655360 blocks (5.00%) reserved for the super user
First data block=0
Maximum filesystem blocks=2162163712
400 block groups
32768 blocks per group, 32768 fragments per group
8192 inodes per group
Superblock backups stored on blocks:
  32768, 98304, 163840, 229376, 294912, 819200, 884736, 1605632, 2654208,
  4096000, 7962624, 11239424

Allocating group tables: done                            
Writing inode tables: done                            
Creating journal (32768 blocks): done
Writing superblocks and filesystem accounting information: done
```

Now we can create a mount point, like `/data`, for our formatted volume:

```sh
# sudo mkdir <mount_point>
$ sudo mkdir /data
```

Then we can mount the volume to the mount point and check it with the `df -h` command:

```sh
# sudo mount <device> <mount_point>
$ sudo mount /dev/xvdb /data
$ df -h
Filesystem      Size  Used Avail Use% Mounted on
/dev/xvda1      8.0G  823M  7.2G  11% /
devtmpfs        3.6G     0  3.6G   0% /dev
tmpfs           3.5G     0  3.5G   0% /dev/shm
tmpfs           3.5G   17M  3.5G   1% /run
tmpfs           3.5G     0  3.5G   0% /sys/fs/cgroup
/dev/xvdb        50G   53M   47G   1% /data
```

So far, so good. Now, in order to preserve the mount on reboot, we need to add an entry to `fstab` like so:

```sh
# keep the original fstab config in case we mess up
sudo mv /etc/fstab /etc/fstab.orig
# copy the original fstab config
sudo cp /etc/fstab.orig /etc/fstab
# and modify the new fstab config
sudo vi /etc/fstab
```

_A word on editors:_

At npm, we’re non-partisan, go-along-to-get-along types. Your editor is your choice! You do you! We’re cool with anything you choose — except your angry notes telling us about your choice.

That being said: depending on the type of AMI you’re using, you might have to (/get to!) use `vi` to edit the file. (This is the case on CentOS, for example. On other systems, you may be able to use `nano`.) For the uninitiated, a step-by-step:

With the file open, add an entry under the last line: Go to the last line by hitting `Shift` + `G` then `Shift` + `4`. Insert a new line by hitting `i` to enter _insert_ mode, use the right arrow key to move the end of the line, then press `Enter` to add a new line as shown below.

On CentOS or RHEL, use `defaults,nofail` as the fs mount options. On Ubuntu or Debian, use `defaults,nofail,nobootwait`.

```sh
#<device>  <mount_point> <fs_type> <fs_mount_ops>   <fs_freq> <fs_passno>
/dev/xvdb  /data         ext4      defaults,nofail  0         2
```

Exit _insert_ mode with the `esc` key, then save and exit by entering `:wq`.

Now, test our new `fstab` config. If everything is okay, this command should give no output:

```sh
$ sudo mount -a
```

Let’s make sure we have proper file permissions on our new mount point, and create a new directory to house all of our registry data:

```sh
$ sudo chown -R $(whoami):$(id -gn) /data
$ mkdir /data/npmo
```

Our EBS volume is now ready to go, and we can install Node.js and npm Enterprise!

<a name="install-and-configure-npm-enterprise"></a>
## 4. Install and configure npm Enterprise

In this step, the walkthrough will follow our documentation’s [standard installation](/enterprise/installation), but we’ll hit the highlights here.

First, install Node.js and update npm. Note that this command is specific to CentOS or RHEL:

```sh
$ curl -sL https://rpm.nodesource.com/setup_4.x | sudo -E bash -
$ sudo yum -y install nodejs
$ sudo npm install npm@latest -g
```

Next, install `npmo` and answer any prompts:

```sh
$ sudo npm install npmo -g --unsafe
```

Once that’s done, complete the installation by configuring your Enterprise instance via the admin web console at `https://<your-server>:8800`. At this point we’ll defer to the [installation doc](/enterprise/installation#3-configure-your-installation-via-the-admin-web-console), with the exception that we should configure storage settings to use our mounted EBS volume.

When you reach the Settings page, find the “Storage” section and change the `/usr/local/lib/npme` path prefix to `/data/npmo` for all configured paths:

![Storage Settings](/images/npmo-aws13.png)

For testing purposes, you may want to select “Open” as the “Authentication” option.

Once you save your configuration settings, you’ll be prompted to start the registry components and go to the Dashboard view. All components will be downloaded and started as lightweight containers.

Once you see a status of “Started,” your registry is ready for use!

![Started](/images/npmo-aws14.png)

<a name="use-your-private-registry"></a>
## 5. Use your private registry

Back at your local machine’s terminal prompt, configure your npm CLI client to use your new private registry:

Authenticate with your registry and associate the registry to a _scope_ name. (The _scope_ is a namespace or prefix that you’ll use for your private packages.)

```sh
$ npm login --registry http://<your-server>:8080 --scope @demo
```

Now, whenever npm sees the `@demo` scope in a package name — like `@demo/test-pkg` — it automatically will publish to and install from the private npm Enterprise registry you’ve configured.

To quickly verify this, let’s create a tiny module and publish it as a private package:

```sh
$ mkdir test-pkg
$ cd test-pkg
$ npm init -y --scope @demo
$ echo "module.exports = 'test successful'\n" > index.js
$ npm publish
```

Visit your registry’s website at `http://<your-server>:8081/` and find the `@demo/test-pkg` package under “recently updated packages.”

![Published](/images/npmo-aws15.png)

Now, let’s make sure we can install our private package:

```sh
$ mkdir downstream
$ cd downstream
$ npm install @demo/test-pkg
$ node -e "console.log(require('@demo/test-pkg'))"
test successful
```

As you can see, your package was downloaded to a local `node_modules` directory, allowing you to `require()` and use it.

## Wrap-up

That’s it!

With luck, this has demonstrated how easy it is to run your own private registry with npm Enterprise and AWS.

What’s next? For more advanced topics or questions, check out the rest of [our docs](/enterprise/index). Also, don’t hesitate to drop us a line at support@npmjs.com.

Happy publishing!
