# npmO-vagrant
> a vagrant setup for trialing npm On-Site

## Prerequisites

To get up and running all you'll need is:

- [Vagrant]
- [VirtualBox]
- a FREE [npm On-site Trial Key]

## Up and Running

1. Install and/or retrieve all the [Prerequisites]
2. Type `vagrant up` in your terminal
3. Open [`localhost:8800`] in your browser
4. You'll see a screen that looks like this ![not safe](images/1.png)
5. Click `Advanced`. It will show another panel that looks like this ![advanced](images/2.png)
6. Click `Proceed to localhost(unsafe)` (it's safe. i promise :smile:)
7. You'll see a screen that looks like this ![certificate](images/3.png)
   Type `localhost` and then click `Use Self-Signed Certificate`
8. You'll see a screen that asks for your email address and License key, type those in and press the button to continue
9. You'll see a screen that looks like this ![settings](images/4.png)
  Replace what is pre-filled with:
    - Full URL of npm On-Site registry: `localhost:8081`
    - Full URL of npm On-Site website: `localhost:8082`
10. Scroll down until you see a section called "Authentication" that looks like the image below. Select `Open`. ![auth](images/5.png)
11. Save. You'll see a dialog to restart your service. Click Restart Now.
12. Visit [`localhost:8082`]. You have the npm website running! You registry is running at [`localhost:8081`]

[npm On-Site]: https://www.npmjs.com/npm/on-site
[Vagrant]: https://www.vagrantup.com/
[VirtualBox]: https://www.virtualbox.org/wiki/Downloads
[npm On-site Trial Key]: https://www.npmjs.com/on-site#free-trial
[Prerequisites]: #Prerequisites
[`localhost:8800`]: http://localhost:8800
[`localhost:8081`]: http://localhost:8081
[`localhost:8082`]: http://localhost:8082
