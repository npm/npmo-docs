# Running npm Enterprise in AWS

In a [previous blog post](http://blog.npmjs.org/post/138936231510/running-npm-on-site-in-aws) we showed you how easy it is to run npm Enterprise on Amazon Web Services. Today, we’re happy to announce the public availability of the npm Enterprise Amazon Machine Image (AMI). Now, it’s even easier to run your own private npm registry and website on AWS!

Using our AMI, there is nothing to install. Just launch an instance, configure it using the npm Enterprise admin web UI, and you’re done: it’s a true point-and-click solution for sharing and managing private JavaScript packages within your company.

Let’s take a quick look at the details.

## 1. Find the AMI in your preferred AWS region

We have AMIs for several AWS regions. When you launch a new instance in the AWS EC2 Console, find the right one by searching for the relevant AMI ID under the _Community AMIs_ tab. Note that new AMI versions are published about every month and include the date of publication in the AMI name.

Here’s a list of the AMI IDs by region:

* `us-east-1` (N. Virginia): `ami-8cc9ae9b`
* `us-west-1` (N. California): `ami-7189cb11`
* `us-west-2` (Oregon): `ami-dc60b5bc`
* `eu-central-1` (Frankfurt): `ami-1e18e971`
* `ap-southeast-2` (Sydney): `ami-36023555`

Ensure the AMI comes from owner `666882590071`.

If you don’t see your preferred region in the list above, [contact our support team](https://www.npmjs.com/support), and we’ll get one created for you!

![Search in Community AMIs](https://cloud.githubusercontent.com/assets/1929625/16884406/297760bc-4a97-11e6-9aa7-4cc7ed9a44c1.png)

## 2. Launch it

When you launch an instance of the AMI, you’ll need to:

* Choose an instance type: use `m3.large` or better
* Enter a storage size: must be at least 16 GB; we recommend 50-100 GB for typical installs
* Select or create a security group: open ports `22` (ssh), `8080` (registry), `8081` (website), and `8800` (npm Enterprise admin UI)
* Select or create a `.pem` key pair: this allows you to `ssh` into your server instance

It’s not necessary, but if you’d prefer to attach an EBS volume for registry data that is separate from the root volume, you can. However, the root EBS volume cannot be smaller than 16 GB.

For more information (or screenshots) on any of the above, see our docs for [Running npm Enterprise in AWS](https://docs.npmjs.com/enterprise/running-on-aws).

## 3. Configure and start the appliance

You don’t have to, but you can `ssh` into your EC2 instance to make sure it’s up and running. If you do, you should see a welcome message like the following:

<img width="532" alt="Terminal welcome message" src="https://cloud.githubusercontent.com/assets/1929625/16884411/3008d0be-4a97-11e6-9b7a-274db7f675e5.png">

Open your favorite web browser, access your server on port `8800`, and follow the prompts to configure and start your appliance.

You’ll need a license key. If you haven’t already purchased one, you can [get a free trial key here](https://www.npmjs.com/on-site#free-trial).

For more information on configuring npm Enterprise, [visit our docs](https://docs.npmjs.com/enterprise/installation#3-configure-your-installation-via-the-admin-web-console).

That’s it! Once you’ve configured and started the appliance, your private npm registry and website are ready for use. See [this document](https://docs.npmjs.com/enterprise/client-configuration) for configuring your npm CLI to use your new private registry.


We’re continually striving to provide you the best solutions for distributing, discovering, and reusing your JavaScript code and packages. We hope this AMI makes it just that much easier to leverage the same tools within your organization that work so well in open source communities around the world - a concept we refer to as [InnerSource](http://blog.npmjs.org/post/139373244435/practices-perfected-in-oss-can-reshape-enterprise).

As always, if you have questions or feedback, please [reach out](https://www.npmjs.com/support).
