# Migrating From Legacy Server

If you are running a legacy version of npm Enterprise (prior to npm
  Enterprise running on Docker) you can follow the following steps
  to migrate your data to a new installation:

* Provision the new server, [following a tutorial] for one of npm Enterprise's
  supported platforms.
* Once the new server is provisioned (and you've tested that it's handling publishes
  and installations appropriately) stop the appliance using the admin panel running on `:8800`.

  ![Stop Now](/gitbook/images/stop-now.png)

* Copy the packages folder form the old npm Enterprise server to the new server:

  > copy `/etc/npme/packages` on _old_, to `/var/lib/npme/packages` on _new_.

* Copy the CouchDB database files form the old npm Enterprise server to the new server:

  > copy `/etc/npme/couchdb` on _old_, to `/var/lib/npme/couchdb` on _new_.

_Note: `/var/lib/npme/packages`, and `/var/lib/npme/couchdb` are the default locations
 on the npm Enterprise server, you may have changed these in the admin console.

* Start the new npm Enterprise server, using the admin console running on `:8800`.
* Test publishing and installing (your old packages should now be available on the
   new npm Enterprise server).

[following a tutorial]: /up-and-running/platforms/
