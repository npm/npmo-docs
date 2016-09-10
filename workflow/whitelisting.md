# Whitelisting Packages

The default policy for mirroring is the whitelist policy. A whitelist provides a list of packages which should be copied to npm Enterprise and periodically updated from the public registry.

The default location for the whitelist is `/usr/local/lib/npme/data/whitelist`.

### Whitelisting from the server

You can configure what packages should be copied from the public registry to npm Enterprise on the server. Add packages to your whitelist by running this command on the server:

```
npme add-package <packagename>
```

This will trigger mirroring for that package and all of its dependencies.

### Whitelisting from the client

If you do not want to set up your whitelist manually in advance, you can also configure your server to copy packages to your npm Enterprise server (and add them to the whitelist automatically) when they are requested by a client. For example, if a client requested `lodash` from your npm Enterprise server and it did not exist, then npm Enterprise would look for `lodash` in the public registry, copy it over, add it to the whitelist, and then serve it to the client.

To allow clients to add packages to the whitelist, visit npm Enterprise's admin console and set `Read through cache` to `Yes`.
