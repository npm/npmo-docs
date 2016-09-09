# Authentication

Rather than handling user accounts itself, npm Enterprise allows
you to connect to your company's existing authentication system.

Currently we support:

- [Open Authentication]
- [GitHub Enterprise]
- Bitbucket Cloud
- LDAP
- SAML
- OAuth 2

## Writing Custom Authentication Plugins

You can also opt to write your own [custom Auth-Plugin] for npm Enterprise.

Install your module on the host machine in the `Miscellaneous data files` storage directory (this defaults to `/usr/local/lib/npme/data`). The module will be available at `/etc/npme/data` inside your container.

[GitHub Enterprise]: /up-and-running/auth/github.html
[Open Authentication]: /up-and-running/auth/open.html
[custom Auth-Plugin]: http://blog.npmjs.org/post/102037553745/writing-your-own-auth-plugins-for-npm-enterprise
