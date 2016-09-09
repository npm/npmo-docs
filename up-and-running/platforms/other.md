# Other Linux Platforms

npm Enterprise works on most modern versions of Linux:

- Ubuntu 14.04 / 15.10
- CentOS 7.x
- Red Hat Enterprise Linux (RHEL) 7.x
- Debian 7.7

Simply follow the steps listed below:

## Step 1: Install npm and Node.js

Now that you have a server provisioned, let's install npm and Node.js

_On Ubuntu:_

```bash
curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm i -g npm@latest
node -v && npm -v
```

_On Centos/RHEL:_

```bash
curl -sL https://rpm.nodesource.com/setup_4.x | sudo -E bash -
sudo yum -y install nodejs
sudo npm i -g npm@latest
node -v && npm -v
```

## Step 2: Install npm Enterprise Itself

```bash
sudo npm i npme -g --unsafe
```

To confirm that it worked, type `npme`. If the install succeeded you should see the
`npme help` screen, which looks like this:

  ![npmo help in terminal](/gitbook/images/npmo-help.png)

## Step 3: Set up Endpoints

There are now 3 web services running on 3 ports on your VM. Make sure that these
ports are open on your server:

| Service                   | Port  |
|-------------------------- |------ |
| Administrator Panel       | 8800  |
| Registry                  | 8080  |
| Website                   | 8081  |

On Centos/RHEL servers, you may need to disable `firewalld`. It's also worth checking
that your default [iptable rules] aren't blocking any traffic.

On Ubuntu, you should double check that `ufw` is not blocking traffic to any of these
ports.

## Step 4: Configuring npm Enterprise

Open your favorite web browser, access your server on port `8800`, and follow the prompts to configure and start your appliance.

For more information on configuring npm Enterprise, [read these docs](/up-and-running/customization.html).

[iptable rules]: https://www.digitalocean.com/community/tutorials/how-to-list-and-delete-iptables-firewall-rules
