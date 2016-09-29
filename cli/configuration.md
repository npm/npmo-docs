# Configuring the CLI client

The client you use to interact with your npm Enterprise server is the same client
that you use with the public npm registry.

## Install the latest npm client

npm Enterprise requires a 2.x or newer version of the npm client. You can get this
by running:

```
[sudo] npm install npm -g
 ```

<a name="pointing-your-client-to-the-registry"></a>
## Pointing your client to the Enterprise registry

Once you have an up-to-date client, you can configure it to install from and
publish to your private npm Enterprise registry.

You can do this in one of two ways:

1. [Using Enterprise for private _and public_ packages](#option-1-using-enterprise-for-private-and-public-packages)
2. [Using Enterprise for private packages only](#option-2-using-enterprise-for-private-packages-only)

Read about each option below.

### Option 1: Using Enterprise for private and public packages

If you want all packages, whether they are under a scope or not, to be stored in
your private registry, then you should configure the npm client to use your
private npm Enterprise appliance as the top level registry.

To do this, first set your Enterprise registry as the CLI's default registry:

```
npm config set registry http://myreg.mycompany.com:8080
```

And then authenticate against your registry without a scope:

```
npm login
```

When clients are configured this way, they will always use your private npm
Enterprise registry as their main registry. When using `npm install`, it will only
look in the private registry to find the package.

To make sure your Enterprise instance supports this functionality, you should
enable the "Read Through Cache" setting (enabled by default) in the server's
admin console (`https://myreg.mycompany.com:8800/settings`) so that public
packages are automatically mirrored from the public registry and automatically
added to your registry's whitelist.

### Option 2: Using Enterprise for private packages only

If you want to default to using the public npm registry for most packages and
only use your private registry for packages under a particular scope, then you
can specify that the registry should only be used for that scope.

To do so, use `npm login` with a registry and scope:

```
npm login --registry=http://myreg.mycompany.com:8080 --scope=@myco
```

_As a scope, it's recommended that you use your company name, e.g., `@npm`,
or for large organizations a business unit within your company, e.g., `@npm-cli`._

By running the `npm login` command  above, we tell the npm CLI that all
packages using the `@myco` scope should be published to, and installed from,
`http://myreg.mycompany.com:8080` rather than `https://registry.npmjs.org`.

_example of package using the `@myco` scope:_

```json
{
  "name": "@myco/credit-card-widget",
  "version": "1.0.0",
  "description": "example of scoped module",
  "main": "index.js"
}
```

For a more detailed discussion on the topic of scopes, visit the section of our
FAQ on [Scopes and Packages](/troubleshooting/faq.md#whats-the-difference-between-a-scoped-package-and-an-unscoped-package).

## Logging in

The `npm login` command will prompt you for your credentials. The credentials
you use should match the authentication strategy configured in the Settings of
your instance's admin console (`https://myreg.mycompany.com:8800/settings`).

_Note: by default `Open` authentication is enabled, this will allow you to
 test your npm Enterprise instance using any combination of `username` and `password`._

For details on GitHub Enterprise integration, please see
[this page](/up-and-running/auth/github.md).

For details on configuring custom authentication, please see
[this page](/up-and-running/auth/).

## Single Sign-On Authentication (SAML, OAuth 2.0)

When using a SSO provider for authentication the `Username`, `Password`, and
`Email` that you are prompted for are not used. We recommend providing the following:

```
Username: sso
Password: sso
Email: (this IS public) sso@example.com
```

_Note: newer versions of the npm CLI will eliminate the need for entering a `Username`/`Password`/`Email`
  when SSO is used._

The first time that you publish or install a private
module you will be asked to visit a URL to validate your session with the SSO provider:

![SSO Validate](/gitbook/images/sso-validate.png)

Simply copy the url nested between the phrases `visit` and `to validate`, and open it
in your favorite web-browser. This will direct you direct you through a SSO flow, after which
the token stored in your local `~/.npmrc` file will work for all future publishes and installs.
