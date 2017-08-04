# npm Enterprise with Nexus

If you are using npm Enterprise for publishing your private packages and wish to use a Nexus repository to set up proxy for your private registry then follow the steps below:


* Open *http://your-host:8081/* in your browser.
* Sign in with admin credentials (You can create your own user and login with those credentials).

    ```User Name: admin
    Password: admin123```

* Click on the Settings icon from the top left menu.
* Select *Repository->Repositories* from the left panel options.
* Click on the `Create repository` button.

**Configuring Nexus as a npm repository.**

1. Select `npm (proxy)` from the repository list.
    * Add unique repository name.
    * Check the online option (This will allow repository to accept incoming requests).
2. Add remote storage url.
    Enter the url of your private registry.
    E.g *http://your_npme-registry-url/*
3. Save the changes.

This blog post provides more detail about configuring Nexus as an npm repository: *http://blog.sonatype.com/using-nexus-3-as-your-repository-part-2-npm-packages*

**Authentication**

1. Select *Security->Realms* from the left panel options.
2. Add `npm Bearer Token Realm` from available realms to active realms and save the changes.

This blog post provides more detail about authentication in Nexus for npm repositories: *http://www.sonatype.org/nexus/2015/11/19/new-npm-tools-for-your-nexus-repository-manager-tool-box/*.

Run `npm config set registry {repository path, likely your npm-proxy-repository-url}`.

To get your **npm-proxy-repository-url** go to *Repository->Repositories*, look for your *npm-proxy repository*, copy the url by clicking on **copy** button.

Run `npm login npm login --registry=http://your-host:8081/repository/your-npm-proxy-name/`.

It will prompt you for:

* *User Name*: Enter the Nexus repository username. (If you haven’t created any user then default is **‘admin’**).
* *Password*: Enter the Nexus repository password. (If you haven’t created any then default is **‘admin123’**).
* *Email*: Enter your email.

Now try installing your private packages from your Nexus repository.
