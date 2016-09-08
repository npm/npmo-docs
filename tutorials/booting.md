# npm Enterprise Won't Boot

In the rare occasion that npm Enterprise (or some of its services)
will not boot, here are some steps you can take to fix the problem:

## Step 1: Make Sure You Have Enough Disk Space

A common cause of npm Enterprise failing can be your machine running out of
disk space. run `du -h` and ensure that both your root volume, and the data
directories you've configured under settings in `:8800`, have space available.

## Step 2: Upgrade to the Newest Version of Replicated on Your npme Server

1. ssh into your npme server.
2. run `replicated --version`
3. if you you are on a version `< 2.0.0` run:
  > `curl -sSL https://get.replicated.com/migrate-v2 | sudo bash`
4. if you are on a version `> 2.0.0` run:
  > `sudo npm i npme -g --unsafe`

## Step 3: Upgrade to the Newest Versions of the npme Containers

To upgrade your containers, visit the admin console on `:8800` and
run "Check Now".

  ![Check Now](/gitbook/images/upgrade.png)

## Step 4: Force npm Enterprise to Reboot

To force npm Enterprise to reboot, run the following commands:

  > replicated app &#96;replicated apps | awk -F" " 'END{print $1}'&#96; stop

  > replicated app &#96;replicated apps | awk -F" " 'END{print $1}'&#96; start

## What Now?

If things still aren't working, please email [support@npmjs.com].

[support@npmjs.com]: mailto:support@npmjs.com
