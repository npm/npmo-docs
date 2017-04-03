# Custom Authentication

If your authentication system is not listed in [npme's supported authentication methods](/up-and-running/auth/#authentication) you may be able to use an external open-source plugin (or write your own). Here are some of the SSO plugins that exist:
 * [npme-auth-atlassian-stash](https://github.com/bcoe/npme-auth-atlassian-stash)
 * [npme-auth-gitlab](https://github.com/nexdrew/npme-auth-gitlab)

You can also opt to write your own `custom auth-plugin` for npm Enterprise using one of the open-source plugins listed above as a starting point.

## 1. Atlassian Stash authentication and authorization strategy for npm Enterprise.

### Installation

Install `npme-auth-atlassian-stash` in npme's data directory. By default this can be found in `/usr/local/lib/npme/data`.

```
npm install @bcoe/npme-auth-atlassian-stash
```

### Configuration

This module will use `stash.json` which you should create in npme's data directory (by default this can be found in `/usr/local/lib/npme/data`).
```
{
  "host": "https://stash.domain.com",
  "user": "npme",
  "pass": "npmepass",
  "logFile": "/etc/npme/data/npme-auth-atlassian-stash.log",
  "logLevel": "info"
}
```

* **host**: your Stash repository
* **name**: admin Stash user login used for basic authorization
* **pass**: admin Stash user password
* **logFile**: location of module log file
* **logLevel**: logging level

### Stash user

`npme-auth-atlassian-stash` will use the admin Stash account to get information about users, groups, projects and repositories. This account should be created only for the purpose of `npme-auth-atlassian-stash` and should have administrative privileges to be able to acquire needed information.

Go to your npm Enterprise admin console (on port 8800 of your server), go to Authentication section on Settings page, select Custom , and populate plugin value as


|Config Field           |Config Value|
|-----------------------|------------|
|Authorization plugin  | /etc/npme/data/node_modules/@bcoe/npme-auth-atlassian-stash  |
|Authentication plugin | /etc/npme/data/node_modules/@bcoe/npme-auth-atlassian-stash  |
|Session plugin        | /etc/npme/data/node_modules/@bcoe/npme-auth-atlassian-stash  |

Click **Save** to save these settings and then **Restart now** (when prompted) to restart the appliance and apply these settings.

That's all the server-side configuration you need!

## 2. GitLab authentication and authorization strategy for npm Enterprise.

Login to npm Enterprise using GitLab credentials
Based on GitLab's API

### Installation

To install on your npm Enterprise instance:

`cd /usr/local/lib/npme/data` (or the directory configured for Miscellaneous data files in the admin console)

```
sudo npm i npme-auth-gitlab
```

### Configuration

`sudo touch gitlab.json` and populate it with data like the following:

```
{
  "url": "https://gitlab.example.com",
  "strictSSL": false
}
```

Point the "url" to your GitLab instance. If it's using https with a self-signed cert, then make sure "strictSSL" is false.

Go to your npm Enterprise admin console (on port 8800 of your server), go to Settings, select Custom for Authentication, and populate each plugin value as `/etc/npme/data/node_modules/npme-auth-gitlab`


|Config Field           |Config Value|
|-----------------------|------------|
|Authorization plugin  | /etc/npme/data/node_modules/npme-auth-gitlab  |
|Authentication plugin | /etc/npme/data/node_modules/npme-auth-gitlab  |
|Session plugin        | /etc/npme/data/node_modules/npme-auth-gitlab  |

Click **Save** to save these settings and then **Restart now** (when prompted) to restart the appliance and apply these settings.
