
# Replicating Redis Session

To enable load balancing on npmE server for allowing users to install packages from replica servers you need to configure Redis session replication.

Redis replication allows slave Redis servers to be exact copies of master servers so that can have the same login across servers.

To replicate Redis session follow the steps below:

1. Go to your primary server's admin dashboard settings page.

2. Select **Expose Redis For Replication** option from left panel.

3. To enable replication, select `Yes` in `Expose Redis For Replication` section and keep the `Upstream Redis` section blank.


Now go to your secondary server's admin dashboard settings page:

1. Go to `Expose Redis For Replication` and select `No`.

2. Set the address of your primary server in `Upstream Redis` section (Please note that `port` is not required with the address of the primary server).

To check the replication status run `sudo docker exec -i npme-redis redis-cli info replication` and verify the output shown as below:

```
role:slave
master_host:your_primary_server_ip
master_port:6379
master_link_status:up
```
To verify the Redis replication, run `redis-cli info keyspace` on both Upstream and Replica server and make sure the keys count matches on both servers.



