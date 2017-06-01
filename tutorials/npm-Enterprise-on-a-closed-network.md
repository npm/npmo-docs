# Npm Enterprise on closed network

You can use npm Enterprise on the private/closed network. Here are the two approaches:

1. Install npmE in open network and move VM’s to closed network
2. Air-Gap installation

### Install npmE in open network and move VM’s to closed network

To achieve this create two VM’s let’s say npmBlank and npmSource on open-network and install npm Enterprise on both these VM’s.

Both these VM’s originate as npm Enterprise servers, provisioned using the instructions provided [up and running section]( https://npme.npmjs.com/docs/up-and-running/platforms/other.html)

Now, follow the instructions below.

* Seed the VM npmSource (currently connected to the Internet) with the packages you need.
* For seeding packages to this VM you can use White-listing or mirror policy.
* Bring this VM (npmSource) to the closed network.
* Also bring npmBlank that has no packages on it to the closed network. (It’s just a blank installation of npm Enterprise).
* Now set up the blank npm Enterprise (i.e npmBlank) to mirror the npmSource VM with your packages on it.

Follow the steps below to bring new packages from public Internet to your closed network.

* First, seed an instance on the public Internet with your full white-list (that has all new and old packages)
* Once it finishes replicating, then place /usr/local/lib/npme onto a memory stick.
* Now stop the instance inside your network that your secondary instance replicates from, copy over these files, and boot it.
* Restart replication on your primary instance (it will now pull down the new set of files).
You will publish your own private modules to the instance that started out as blank; You’ll keep replacing the packages on the secondary server it replicates from.


### Air-Gap installation

An “Air-Gap” environment is a network that has no path for inbound or outbound internet traffic at all.

* Install Docker on the VM running on a closed network.

Install a supported version of Docker on your server. Replicated supports Docker from 1.7.1 to 1.13.1. We recommend installing the latest version of Docker available for the range of your [operating system](https://www.replicated.com/docs/kb/supporting-your-customers/installing-docker-in-airgapped/).

* Install Replicated.

Download the latest release of Replicated from [replicated official site](https://s3.amazonaws.com/replicated-airgap-work/replicated.tar.gz) and move it to the VM running on your closed network.

Run the commands below.

```
 tar xzvf replicated.tar.gz
 cat ./install.sh | sudo bash -s airgap

```
On your request, we will enable the air-gap solution for your npm Enterprise server license and also provide you the air-gap enabled license (.rli) file for activating your Enterprise server.

Along with that will also provide you the download link and password for the air-gap package.

Move both these files to your VM running on a closed network.

Now navigate to the management console at https://your-host-server:8800.

Accept the self-signed certificate, pass the preflight checks, and you will see the license upload screen. Select the Airgapped install option, then provide the path of `.airgap` file and upload the `license (.rli) file` here.

Once this screen is completed, Replicated runs as normal. In the https://your-host-server:8800/console/settings page, there is a section to set the Air-Gap mode settings.

You can install updates and sync the license by downloading new versions and renaming them with the .airgap extension after that place them in the locations specified on the /console/settings page.