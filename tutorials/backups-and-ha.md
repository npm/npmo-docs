# Backups and HA

Replication is built into the npm Enterprise product, and you can configure it using just the Settings page in the admin console UI. We typically recommend running at least one other npme instance as a live replica, which is easy to set up and makes restoration as simple as configuring your client to talk to a secondary instance if your primary instance goes down. This also makes it easy to set up a HA solution, where you could front the instances with a [load balancer](load-balancing-with-varnish.html), directing all writes to the primary instance while balancing reads across many instances. In case of failure, reads/installs will still be available but writes/publishes will be unavailable until you can make a secondary instance the new primary by directing writes to it.

To configure another instance as a replica, use the "Upstream registry" section of the Settings in the admin console:

- Set the **Upstream URL** to the registry URL (port 8080) of the primary instance.
- Set the **Upstream secret** to the **Secret used between services** of the primary instance.
- Set the **Policy to apply during replication** to `mirror`. 
- Optionally, set the **Publication Settings** to `Read Only` to prevent accidental publishes to the replica.

If you make these configuration changes after an instance has already been running, you should do one of the following on your replica instance:

1. Run `npme reset-follower`.
2. Stop the services/containers via admin console Dashboard, remove or truncate the `sequence` file in your replica instance (located in your configured "Miscellaneous data files" directory), and then start the services/containers.

This will ensure that your replica has the full set of package changes from the instance it's following.

_Note: Replicas must always be in **mirror** otherwise it will lead to the replicas being out of sync with the masters._

In this manner, you could set up multiple replicas of a single instance or daisy chain one replica behind another for redundancy. We do not limit the number of npm Enterprise instances you can run or the number of packages each instance holds - our license is only based on how many users benefit from your instances.

Although it's not necessary, you may also wish to store manual snapshots for backup purposes in addition to running live replicas. The host directories you should snapshot are represented on the Settings page as the following:

- **CouchDB storage path on host** which defaults to `/usr/local/lib/npme/couchdb`.

    CouchDB is used to hold package metadata for every package in your registry, including public and private packages. This is the directory that holds the critical db files representing this data.

- **Package storage path on host** which defaults to `/usr/local/lib/npme/packages`.

    Each version of every package in your registry is stored as a tarball on the host file system. This is the root directory for all package tarballs.

- **Miscellaneous data files** which defaults to `/usr/local/lib/npme/data`.

    The registry maintains some small files and runtime data to keep track of things like replication status and whitelist configuration. This is the directory that holds those files.

If all live replicas happen to fail, it is possible to recreate a warm instance by restoring snapshots of these directories after a new install. All other data can be rebuilt from the files in these key directories.

