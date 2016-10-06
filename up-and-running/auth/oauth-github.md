# GitHub Enterprise OAuth2 Integration

npm Enterprise allows you to log in to your private registry and website using your GitHub Enterprise account.

Follow these steps to set it up:

## Server Configuration

There are two basic steps to server-side configuration: creating an OAuth client in Github Enterprise, and configuring authentication in npm Enterprise.

### Setup OAuth2 client credentials in GitHub Enterprise

1. login to your GitHub Enterprise appliance.
2. Click on `Settings`, `OAuth Applications`, `Register a new OAuth application`.
3. Fill in the requested information:
  * `Application Name`: npm Enterprise.
  * `Homepage URL`: URL of your npm Enterprise website.
  * `Authorization callback URL`: `http://npm.mycompany.com:8081/auth/oauth2/callback`, where
    `npm.mycompany.com:8081` is the address your npm Enterprise website.
4. Create the application and take note of the values `Client ID`, and `Client Secret`.

### Configure authentication settings in npm Enterprise

In another browser tab, go to the `/settings` page of the npm Enterprise admin console (port `:8800`).

Under **Authentication**, select **OAuth2** and enter the following values:

| Config Field       | Config Value |
| ------------------ | ------------ |
| Client ID          | Paste value from GitHub Enterprise |
| Client Secret      | Paste value from GitHub Enterprise |
| API Endpoint       | ```https://your-github-enterprise-server/login``` |
| Token Path         | /oauth/access_token |
| Authorization Path | /oauth/authorize |
| Redirect URI       | Enter the same value you gave to GitHub Enterprise when creating client credentials, e.g., ```http://npm.mycompany.com:8081/auth/oauth2/callback``` |
| Scope              | user |
| Profile URL        | ```https://your-github-enterprise-server/api/v3/user``` |
| Email Key          | email |
| User Key           | login |

Click **Save** to save these settings and then **Restart now** (when prompted) to restart the appliance and apply these settings.

That's all the server-side configuration you need!

## Client Login

Client login using SSO behaves differently than other authentication mechanisms, see
[Single Sign-On Authentication](/cli/configuration.html#single-sign-on-authentication-saml-oauth-20).
