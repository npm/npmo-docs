# npm Enterprise on Closed Network

You can use npm Enterprise on a private/closed network. Here are the two approaches:

1. Install npmE in an open network and move VM’s to a closed network.
2. Air-Gap installation.

### Install npmE in open network and move VM’s to closed network:

Create two VM's (`npmePrimary` and `npmeSource` for example) and install npm Enterprise on both using the instructions in the [up and running]( https://npme.npmjs.com/docs/up-and-running/platforms/other.html)
 section.

In this configuration, publication of internal packages and all installs will happen against `npmePrimary`. `npmeSource` will serve as the means for importing new public packages and new versions for existing public packages from the registry on a cadence you control.

To initialize your installation:

1. With `npmeSource` still connected to the internet, edit the `whitelist` file so that it's a new-line delimited list of the package names you'll want available on your closed network. The `white-list` file is in the data folder which is `/usr/local/lib/npme/data` by default unless you changed this under `Miscellaneous Data` in the npme Settings panel.
* Allow adequate time for the replication process to pull in all the packages added to the `whitelist` file.
* Bring `npmeSource` and `npmePrimary` into the closed network.
* In `npmePrimary's` Configuration Settings, under `Upstream Registry`:
    * Point the Upstream URL to `npmeSource`.
    * Set the `Upstream Secret` to match `npmeSource's`.
    * Set the `Policy to mirror`.

To add new packages from the public registry to your closed network:

1. Clone `npmeSource` and grant it access to the internet.
2.  Add any new packages to the `whitelist` that were missing from the initial install.
3. Copy `/usr/local/lib/npme` to a memory stick or portable drive. If you changed the location of the storage paths, be sure to copy the contents from all the folders.
4.  Stop `npmeSource's` npmE instance that's running inside your network from the npmE Dashboard.
5.  Copy over all the files from the cloned instance to the correct destination path on `npmeSource`.
6.  Restart the npmE instance on `npmeSource` from the npmE Dashboard.
7.  Restart replication on `npmePrimary` with the command `npme reset-follower` from the shell.

### Air-Gap installation

An “Air-Gap” environment is a network that has no path for inbound or outbound internet traffic at all.

* Install Docker on the VM running on a closed network.

Install a supported version of Docker on your server. At the time of this writing, Replicated still supported Docker versions as old as `1.7.1`. We recommend installing the latest version of Docker available for the range of your [operating system](https://www.replicated.com/docs/kb/supporting-your-customers/installing-docker-in-airgapped/).

* Install Replicated.

Download the latest release of Replicated from [replicated official site](https://s3.amazonaws.com/replicated-airgap-work/replicated.tar.gz) and move it to the VM running on your closed network.

Run the commands below:

```
 tar xzvf replicated.tar.gz
 cat ./install.sh | sudo bash -s airgap

```
You can request that we enable the air-gap solution for your npm Enterprise server license and also provide you the air-gap enabled license (.rli) file for activating your Enterprise server.

Along with that we will also provide you the download link and password for the air-gap package.

Move both these files to your VM running on a closed network.

Now navigate to the management console at https://your-host-server:8800.

Accept the self-signed certificate, pass the preflight checks, and you will see the license upload screen. Select the Airgapped install option, then provide the path of `.airgap` file and upload the `license (.rli) file` here.

Once this screen is completed, Replicated runs as normal. In the https://your-host-server:8800/console/settings page, there is a section to set the Air-Gap mode settings.

You can install updates and sync the license by downloading new versions and renaming them with the .airgap extension after that place them in the locations specified on the /console/settings page.