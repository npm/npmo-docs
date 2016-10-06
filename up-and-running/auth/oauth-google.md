# Google OAuth2 Integration

npm Enterprise allows you to log in to your private registry and website using your Google account. Follow these steps to set it up.

## Server Configuration

There are two basic steps to server-side configuration: creating an oauth client in Google and configuring authentication in npm Enterprise.

### Setup oauth client credentials in Google

These steps are based on [Google's documentation](https://developers.google.com/identity/protocols/OAuth2WebServer).

First log in to the Google Developers API console at https://console.developers.google.com/apis/credentials

Click the **Create credentials** button and choose **OAuth client ID**.

Choose **Web application** as the "Application type".

Enter a name like `npm Enterprise`.

Under **Restrictions**, enter a callback URL for your npm Enterprise instance under **Authorized redirect URIs**. The value should be the **Full URL of npm Enterprise website** (e.g. `http://npm.mycompany.com:8081`) from the npm Enterprise admin console settings, plus the `/auth/oauth2/callback` route. A full example would be `http://npm.mycompany.com:8081/auth/oauth2/callback`. Note that you _must_ use a domain name (IP address not allowed). We will enter this same URL as the **Redirect URI** in npm Enterprise's admin console when configuring authentication.

Click the **Create** button. On the next page, you will be shown the client ID and client secret that we will plug into npm Enterprise's admin console.

### Configure authentication settings in npm Enterprise

In another browser tab, go to the `/settings` page of the npm Enterprise admin console (port `:8800`).

Under **Authentication**, select **OAuth2** and enter the following values:

| Config Field       | Config Value |
| ------------------ | ------------ |
| Client ID          | Paste value from Google |
| Client Secret      | Paste value from Google |
| API Endpoint       | ```https://accounts.google.com``` |
| Token Path         | ```https://www.googleapis.com/oauth2/v4/token``` |
| Authorization Path | ```/o/oauth2/v2/auth``` |
| Redirect URI       | Enter the same value you gave to Google when creating client credentials, e.g., ```http://npm.mycompany.com:8081/auth/oauth2/callback``` |
| Scope              | ```profile email``` |
| Profile URL        | ```https://www.googleapis.com/oauth2/v2/userinfo``` |
| Email Key          | ```email``` |
| User Key           | ```name``` |

Click **Save** to save these settings and then **Restart now** (when prompted) to restart the appliance and apply these settings.

That's all the server-side configuration you need!

## Client Login

Client login using SSO behaves differently than other authentication mechanisms, see
[Single Sign-On Authentication](/cli/configuration.md#single-sign-on-authentication-saml-oauth-20).
