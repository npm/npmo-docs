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

Under **Authentication**, select **OAuth2**.

Paste the **Client ID** and **Client Secret** values from Google.

For **API Endpoint**, enter `https://accounts.google.com`.

For **Token Path**, enter `https://www.googleapis.com/oauth2/v4/token`.

For **Authorization Path**, enter `/o/oauth2/v2/auth`.

For **Redirect URI**, enter the same value you gave to Google when creating client credentials. A full example would be `http://npm.mycompany.com:8081/auth/oauth2/callback`.

For **Scope**, enter `profile email`.

For **Profile URL**, enter `https://www.googleapis.com/oauth2/v2/userinfo`.

For **Email Key**, enter `email`.

For **User Key**, enter `name`.

Click **Save** to save these settings and then **Restart now** (when prompted) to restart the appliance and apply these settings.

That's all the server-side configuration you need!

## Client Login

Now when you `npm login` against your registry, the user credentials you enter will be ignored and you will be granted an unresolved token, which is stored in your `~/.npmrc` file. Please _DO NOT_ enter your Google password on `npm login` - use a fake password instead, it will be discarded.

The first time you attempt to `npm publish`, the registry will see that your token is unresolved and it will initially fail the publication, displaying a Google URL you should visit in your browser to authenticate against your Google account. Once you authenticate with Google using that URL and grant npm Enterprise access to your profile information, you will be redirected back to your npm Enterprise website and your token will be resolved, overwriting the user credentials you entered on `npm login` with your Google account name and email. You should now `npm publish` again to publish the package succesfully.

Again, you _SHOULD NOT_ use your Google password with `npm login`. npm Enterprise should never see your Google password and will never ask for it. This is the point of OAuth.

Once you are authenticated with your Google account, you can use `npm` and the Enterprise website as you normally would.
