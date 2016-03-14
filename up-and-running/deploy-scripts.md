# OS-Specific Deploy Scripts

If you feel comfortable setting up a VM with the proper [Requirements],
all you may need from us is a deploy script that works for your set up.
We currently have a few available for use.

If you don't see a script that you'd like, please file an issue [here][9]
or email [support@npmjs.com].

- `apt-get` and `sudo` [source](1) [link](2)
  - Ubuntu and Debian
  - logged in as not root user, with access to root password
  - usage example: [VMWare Debian Tutorial]

- `apt-get` [source](3) [link](4)
  - Ubuntu and Debian
  - logged in as root user
  - usage example: [Microsoft Azure Tutorial]

- `yum` [source](5) [link](6)
  - CentOS and RedHat Enterprise Linux (RHEL)
  - logged in as root user
  - usage example: [VMWare CentOS Tutorial]

Also: 
- `Vagrantfile` [source](7) [link](8)
  - usage example: [Vagrant Tutorial]

[1]: https://github.com/ashleygwilliams/npmo-deploy/blob/master/deploy.sh
[2]: https://raw.githubusercontent.com/ashleygwilliams/npmo-deploy/master/deploy.sh
[3]: https://github.com/ashleygwilliams/npmo-deploy/blob/master/deploy-nosudo.sh
[4]: https://raw.githubusercontent.com/ashleygwilliams/npmo-deploy/master/deploy-nosudo.sh
[5]: https://github.com/ashleygwilliams/npmo-deploy/blob/master/deploy-centos.sh
[6]: https://raw.githubusercontent.com/ashleygwilliams/npmo-deploy/master/deploy-centos.sh
[7]: https://github.com/ashleygwilliams/npmo-deploy/blob/master/Vagrantfile
[8]: https://raw.githubusercontent.com/ashleygwilliams/npmo-deploy/master/Vagrantfile   
[9]: https://github.com/ashleygwilliams/npmo-deploy/issues
[support@npmjs.com]: mailto:support@npmjs.com
[VMWare Debian Tutorial]: up-and-running/platforms/vmware.html
[Microsoft Azure Tutorial]: up-and-running/platforms/azure.html
[VMWare CentOS Tutorial]: up-and-running/platforms/vmware.html
[Vagrant Tutorial]: up-and-running/platforms/vagrant.html
