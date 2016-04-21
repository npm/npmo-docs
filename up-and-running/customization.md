# Customizating Server Configuration

You can customize the server's configuration by visiting npm
Enterprise's admin console (_http://myreg.mycompany.com:8800_).

## Authentication

Authentication method.

Possible values: [`"GitHub"`](/enterprise/github), [`"Open"`](/enterprise/no-authentication), "LDAP"

## Upstream registry

Configure npm Enterprise to replicate from an upstream registry.
This can be useful for creating backups.

## Storage

Configure where npm Enterprises persistent data is stored. You may, for instance, want to store to an NFS drive that you regularly back up.

## Proxy URL

Allows npm Enterprise to be configured with a corporate proxy.

## npm Enterprise registry URL

Specify an alternative package URL to store in the database, rather than
the IP that npm Enterprise auto-detects. This is useful if you wish
to place an HTTPs load-balancer in front of npm Enterprise, for example:

[using nginx for SSL termination](https://gist.github.com/bcoe/c073859d060b802b15aa)
