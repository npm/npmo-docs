# SAML Authentication

### Configure npm Enterprise to work with your SAML SSO provider.

Under **Authentication**, select **SAML** and enter the following values:

| Config Field | Config Value |
| ---- | ----- |
| Entity ID       | http://npm.yourcompany.com:8081/auth/saml/metadata.xml |
| Assert Endpoint | http://npm.yourcompany.com:8081/auth/saml/assert |
| Logout Endpoint | http://npm.yourcompany.com:8081/auth/saml/logout |
| Format for Name ID | urn:oasis:names:tc:SAML:2.0:nameid-format:emailAddress |
| Identity Provider SSO Login URL | Enter SAML 2.0 endpoint URL from your SAML provider |
| Identity Provider Single Logout URL | Enter SLO endpoint URL from your SAML provider |
| Identity Provider Certificate | Copy your certificate from SAML provider|

Click **Save** to save these settings and then **Restart now** to restart the appliance and apply these settings.

That's all the server-side configuration you need!
## Client Login

Client login using SSO behaves differently than other authentication mechanisms, see
[Single Sign-On Authentication](/cli/configuration.md#single-sign-on-authentication-saml-oauth-20).