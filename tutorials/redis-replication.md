
# Replicating Redis Session

To enable load balancing on npmE server for allowing users to install packages from replica servers you need to configure Redis session replication.

![Redis Replication](/gitbook/images/redis-replication.png)

Redis replication allows slave Redis servers to be exact copies of master servers so that can have the same login across servers.

First, [install Redis](https://redis.io/topics/quickstart/) on your primary server.

```
wget http://download.redis.io/releases/redis-3.0.4.tar.gz
tar xzf redis-3.0.4.tar.gz
cd redis-3.0.4
make
```

Then run `sudo make install`.

Run `redis-cli -v` to make sure that you are running Redis *version 3.0.4*.

Change bind address of server **Redis B** running outside of docker container by updating the `redis.conf` file.

* `sudo vi /etc/redis/redis.conf`
* Replace `bind 127.0.0.1` with `bind <your_primary_host>`

Now you will have two instances of Redis running on your primary server.

* One inside your docker container (shipped with npmE), let's say it **Redis A**.
* Other on your primary server that you have installed outside the docker container, **Redis B**.

Make the Redis running on the primary server (**Redis B**) slave of Redis running inside your docker container (**Redis A**).

Run
`redis-cli -h your_primary_host slaveof your_redis_server_ip_running_inside_docker_container 6379`.

#### Example

Consider Redis A IP is 172.17.0.1

Your primary host IP is 195.122.21.166

then your application command will look like
```
redis-cli -h 195.122.21.166 slaveof 172.17.0.1 6379
```

Now to configure Redis replication on your secondary servers Redis i.e **Redis C**.
Go to your secondary server, run `sudo docker exec -i -t npme-redis redis-cli -h 172.17.0.1 slaveof your_primary_host 6379`

By running the above command it will replicate Redis session for once when you restart the box.
In order to keep the continuous session replication add the above command to `cron tab`.

To check the replication status run `redis-cli info replication`

To confirm that the replication is successful run `redis-cli info keyspace` to compare the keys on both servers.

