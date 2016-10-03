# LDAP Authentication

npm Enterprise supports most LDAP corporate directories, including Active Directory and OpenLDAP.

It's important to note that, when using LDAP integration, your npm Enterprise instance(s) should typically be running on the same subnet as your LDAP servers.

Note that you can also use LDAP integration for logging into the admin console (port `:8800`) as well. If you'd like to set that up, visit the `/create-password` page once you're logged in, choose `LDAP`, and enter the settings just as you would below.

## Server Settings

### LDAP Type

_Required._ What type of LDAP does your corporate directory use?

Options are `OpenLDAP`, `Active Directory`, and `Other`.

### Hostname

_Required._ The hostname or domain name that represents your LDAP server.

### Port

_Required._ The port that should be used when accessing the LDAP server.

Default is `389`.

### Encryption Type

_Required._ The type of encryption your LDAP provider supports.

Options are `Plain`, `StartTLS`, and `LDAPS`.

### Search user

_Required._ The user, in distinguished name (DN) format, that npm Enterprise should use to log into LDAP. When users attempt to authenticate against the private npm registry or website, npm Enterprise will use this user to query the corporate directory service. This should typically include at least one common name (CN) representing a read-only service or admin user.

### Search password

_Required._  The password associated with the "Search user" above.

## LDAP Schema

### Base DN

_Required._ The root node, in distinguished name (DN) format, in the LDAP tree. The root node should be a parent of the "User search DN" below.

### User search DN

_Required._ The tree node, in distinguished name (DN) format, relative to the "Base DN" above, that all npm Enterprise users should belong to. This is typically a single common name (CN) or organizational unit (OU).

### Restricted User Group

_Optional._ A group name that users must be a part of, used as an additional criterion in the LDAP query when looking up users. This is typically **not** a distinguished name (DN).

### Username field

_Required._ The attribute of a user entry that represents the username to be used when authenticating. Active Directory uses `sAMAccountName` as its default.

## Test LDAP Settings

You can test your LDAP configuration directly from the admin console UI. Just provide a test username and password and click the **Test LDAP** button. The result of the test will be displayed next to the button.

### Test username

The username value to test LDAP configuration with.

### Test password

The password value to test LDAP configuration with.

## Example Configuration

| Config Field          | Example Value                                       |
| --------------------- | --------------------------------------------------- |
| LDAP Type             | `Active Directory`                                  |
| Hostname              | `ad.example.com`                                    |
| Port                  | `389`                                               |
| Encryption Type       | `Plain`                                             |
| Search user           | `CN=Administrator,CN=Users,DC=ad,DC=example,DC=com` |
| Search password       | [SECRET]                                            |
| Base DN               | `DC=ad,DC=example,DC=com`                           |
| User search DN        | `CN=Users`                                          |
| Restricted User Group | `Developers`                                        |
| Username field        | `sAMAccountName`                                    |
