# Uninstalling npm Enterprise

Although the `npme` installer can conveniently install all dependencies required to run an npm Enterprise instance, it cannot uninstall everything on its own. Here's a quick guide to uninstall and remove the different components that make up the Enterprise product.

1. Uninstall the `npme` package.

    ```
    sudo npm uninstall -g npme
    ```

    This removes the installer but not the Enterprise appliance.

2. Note storage paths in admin console settings.

    If you wish to remove all packages and data from your registry, please make a note of all the Storage paths you have configured for your instance at `https://<your-server>:8800/settings`.

    The default root is `/usr/local/lib/npme`. You can remove these in step 6 below.

3. Uninstall the orchestration layer and admin console.

    To uninstall and remove Replicated, please [follow the instructions found here](https://www.replicated.com/docs/distributing-an-application/installing/#removing-replicated).

    Ubuntu/Debian:

    ```
    sudo service replicated stop
    sudo service replicated-ui stop
    sudo service replicated-operator stop
    sudo docker rm -f replicated replicated-ui replicated-operator
    sudo docker images | grep "quay\.io/replicated" | awk '{print $3}' | xargs sudo docker rmi -f
    sudo apt-get remove -y replicated replicated-ui replicated-operator
    sudo apt-get purge -y replicated replicated-ui replicated-operator
    sudo rm -rf /var/lib/replicated* /etc/replicated* /etc/init/replicated* /etc/init.d/replicated* /etc/default/replicated* /var/log/upstart/replicated* /etc/systemd/system/replicated*
    ```

    CentOS/RHEL:

    ```
    sudo systemctl stop replicated replicated-ui replicated-operator
    sudo service replicated stop
    sudo service replicated-ui stop
    sudo service replicated-operator stop
    sudo docker rm -f replicated replicated-ui replicated-operator
    sudo docker images | grep "quay\.io/replicated" | awk '{print $3}' | xargs sudo docker rmi -f
    sudo yum remove -y replicated replicated-ui replicated-operator
    sudo rm -rf /var/lib/replicated* /etc/replicated* /etc/init/replicated* /etc/default/replicated* /etc/systemd/system/replicated* /etc/sysconfig/replicated* /etc/systemd/system/multi-user.target.wants/replicated* /run/replicated*
    ```

    You can ignore any commands that might have failed.

4. Stop and remove all Docker containers and images.

    Assuming you are not using Docker for anything else on your server, you may remove all running Docker containers and images with the following commands:

    ```
    # stop all containers
    sudo docker stop $(sudo docker ps -aq)
    # remove all containers
    sudo docker rm -f $(sudo docker ps -aq)
    # remove all images
    sudo docker rmi -f $(sudo docker images -q)
    ```

    Be careful! This will remove any other services using Docker on your system.

5. Optionally uninstall Docker.

    If you wish, you may also remove Docker itself. Use the instructions for your Linux distribution:

    [Ubuntu/Debian instructions](https://docs.docker.com/engine/installation/linux/ubuntulinux/#uninstallation), sample:

    ```
    sudo apt-get autoremove --purge docker-engine
    sudo rm -rf /var/lib/docker
    ```

    [CentOS/RHEL instructions](https://docs.docker.com/engine/installation/linux/rhel/#uninstall), sample:

    ```
    sudo yum -y remove docker-engine.x86_64
    sudo rm -rf /var/lib/docker
    ```

    If you have configured Docker to store data in a directory other than `/var/lib/docker`, remove it instead.

6. Optionally remove packages and Enterprise data.

    To completely wipe the Enterprise data, you should also remove the directories noted from step 2. Note that this will remove all packages you have published thus far!

    ```
    # caution! make sure the directory below is correct
    # caution! this will remove all published packages
    sudo rm -r /usr/local/lib/npme
    ```

    If you configured npm Enterprise to store data in directories other than the defaults, remove those instead.

7. Optionally uninstall Node.js and npm.

    Assuming you do not need Node.js or npm for anything else on your server, you may uninstall them via the system package manager you used to install Node.js.

    Ubuntu/Debian:

    ```
    sudo apt-get autoremove --purge nodejs
    ```

    CentOS/RHEL:

    ```
    sudo yum -y remove nodejs
    ```

This should remove all traces of npm Enterprise from your server.

If you wish to reinstall npm Enterprise, use the standard [installation docs](../up-and-running/).
