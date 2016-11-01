# Running npm Enterprise in AWS

Using our AMI, there is nothing to install. Just launch an instance, configure it using the npm Enterprise admin web UI, and you’re done: it’s a true point-and-click solution for sharing and managing private JavaScript packages within your company.

Let’s take a quick look at the details.

## 1. Find the AMI in your preferred AWS region

We have AMIs for several AWS regions. When you launch a new instance in the AWS EC2 Console, find the right one by searching for the relevant AMI ID under the _Community AMIs_ tab. Note that new AMI versions are published about every month and include the date of publication in the AMI name.

Here’s a list of the AMI IDs by region:

* `us-east-1` (N. Virginia): `ami-f23613e5`
* `us-west-1` (N. California): `ami-5c317b3c`
* `us-west-2` (Oregon): `ami-d6e445b6`
* `eu-central-1` (Frankfurt): `ami-34847f5b`
* `eu-west-1` (Ireland): `ami-8ae6acf9`
* `ap-southeast-2` (Sydney): `ami-8c1b27ef`

Make sure the AMI comes from owner `666882590071`.

If you don’t see your preferred region in the list above, [contact our support team](https://www.npmjs.com/support), and we’ll get one created for you!

  ![Search in Community AMIs](/gitbook/images/ami-search.png)

## 2. Launch it

When you launch an instance of the AMI, you’ll need to:

* Choose an instance type: use `m3.large` or better
* Enter a storage size: must be at least 16 GB; we recommend 75-150 GB for typical installs
* Select or create a security group: open ports `22` (ssh), `8080` (registry), `8081` (website), and `8800` (npm Enterprise admin UI)
* Select or create a `.pem` key pair: this allows you to `ssh` into your server instance

It’s not necessary, but if you’d prefer to attach an EBS volume for registry data that is separate from the root volume, you can. However, the root EBS volume cannot be smaller than 16 GB.

## 3. Configure and start the appliance

You don’t have to, but you can `ssh` into your EC2 instance to make sure it’s up and running. If you do, you should see a welcome message like the following:

![Terminal welcome message](/gitbook/images/ami-terminal.png)

Open your favorite web browser, access your server on port `8800`, and follow the prompts to configure and start your appliance.

For more information on configuring npm Enterprise, see [Server Configuration](/up-and-running/customization.html).

That’s it! Once you’ve configured and started the appliance, your private npm registry and website are ready for use. See [this document](/cli/configuration.html) for configuring your npm CLI to use your new private registry.
