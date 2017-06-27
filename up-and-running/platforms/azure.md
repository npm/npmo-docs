# Using Microsoft Azure

## Summary

To get npm Enterprise up and running on Microsoft Azure, you first need:

- An npm Enterprise license. Get a [free trial] here.
- A [Microsoft account] and an [Azure account].

...then we'll need to:

1. Set up and deploy an Ubuntu 14.04 LTS VM.
2. Install Node.js and npm.
3. Install npm Enterprise.
4. Set up endpoints for the admin panel, registry, and website.

Let's get started!

## Step 1: Get a VM Up and Running

Follow [this tutorial] for setting up
an Ubuntu 14.04 LTS VM.

While setting this up, make sure to:

- Pick a size that has *at least* 8 GB of RAM. **We strongly recommend 16 GB**.
- Take note of the name of the Security Group you assign. We'll need to edit it
  in Step 3.

Feel free to make any other configurations you wish. Once you are set, deploy
your VM and move on to Step 2!

## Step 2: Install npm and Node.js

Now that you have a VM deployed, let's install npm and Node.

```bash
curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm i -g npm@latest
node -v && npm -v
```

## Step 3: Install npm Enterprise itself

```bash
sudo npm i npme -g --unsafe
```

To confirm that it worked, type `npme`. If the install succeeded you should see the
`npme help` screen, which looks like this:

  ![npme help in terminal](/gitbook/images/npme-help.png)

## Step 4: Set up Endpoints

There are now 3 web services running on 3 ports on your VM. In order to access these
outside of the VM, we'll need to create rules to allow them to be accessed. The ports
we need to configure are:

| Service                   | Port  |
|-------------------------- |------ |
| Administrator Panel       | 8800  |
| Registry                  | 8080  |
| Website                   | 8081  |

## Step 5: Configuring npm Enterprise

Open your favorite web browser, access your server on port `8800`, and follow the prompts to configure and start your appliance.

For more information on configuring npm Enterprise, [read these docs](/up-and-running/customization.html).

[npm user account]: https://www.npmjs.com/signup
[free trial]: https://www.npmjs.com/enterprise#free-trial
[Microsoft account]: https://signup.live.com/signup
[Azure account]: https://azure.microsoft.com/free/
[Microsoft Azure portal]: https://portal.azure.com/
[this tutorial]: https://azure.microsoft.com/en-us/documentation/articles/virtual-machines-linux-tutorial-portal-rm/
