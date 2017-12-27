# Mirroring the Public Registry

A full mirror will copy all packages from the public registry to your npm Enterprise server. Enable this by setting `policy to apply during replication` to `mirror` in npm Enterprise admin console (`http://myreg.mycompany.com:8800`).

_Note: Full mirror of public registry is no longer supported as the size of public registry has gotten too large and in addition to that no customer is using every package available in the public registry. Thus we recommend users to set white-list policy along with Read Through Cache set to Yes._

For more details regarding `white-list` policy see [Whitelisting Packages](whitelisting.md)