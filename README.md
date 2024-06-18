# Custom OAuth R&D using Express.js

> For example, I am using Google OAuth only

### Motivation
If we want to use our dedicated backend API server and multiple client-side application. In this case, using OAuth is hard to manage.
Without using any third-party service or providers, It is good to have the control without some black-boxes. 


### Workflow
The backend part could be any other backend/full-stack framework instead of `express.js`. But, the role of backend (api) server is the same.

**Client Side**
Imagine, we are using a React (or Next.js) or Vue (or Nuxt.js) or Angular or Svelte app. It can be SPA only or SSR or anything else. Whatever it is, the role is still the `Client-Side or Client-App`.

So, the client apps will be configured with Google credentials as requirements. Make sure you have,
```env
# For client apps
GOOGLE_CLIENT_ID=xxxxxxxxxxxxxxx_xxxxxxxxxxxxx_xxxxxxxxxxxxxx
GOOGLE_REDIRECT_URI=https://youapp.com/callback/google/xxxxxx
```

```js
function makeGoogleOAuthLink() {
  /*
  * Makes GOOGLE OAuth login-link
  * @returns JSON [code] Authorization Code
  */
    const { GOOGLE_CLIENT_ID, GOOGLE_REDIRECT_URI } = process.env;

    const scope = [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
      'openid'
    ].join(' ');

    const url = 'https://accounts.google.com/o/oauth2/v2/auth?' + querystring.stringify({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: GOOGLE_REDIRECT_URI,
      response_type: 'code',
      scope: scope,
      access_type: 'offline',
      prompt: 'consent'
    });

    return url;
  },
```
NOTE: Once you get the code, use it or pass it to the backend for validate the sign-in or sign-up request and get back your response from the API server as well.


**Server Workflow**

We can recieve the code from client apps and return our desired returns by custom processing as well.

```env
# Server-Side <Google Client Secret safe in env>
GOOGLE_CLIENT_ID=xxxxxxxxxxxxx__xxxxxxxxxxx__xxxxxxxxxxx
GOOGLE_CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
GOOGLE_REDIRECT_URI=http://localhost:5000/auth/callback/google
```
```js
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI } = process.env;
  const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', querystring.stringify({
    code: code, // comes from url-params or req-body through an API call
    client_id: GOOGLE_CLIENT_ID,
    client_secret: GOOGLE_CLIENT_SECRET,
    redirect_uri: GOOGLE_REDIRECT_URI,
    grant_type: 'authorization_code'
  }), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });

  const { access_token } = tokenResponse.data;

  const userResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: {
      Authorization: `Bearer ${access_token}`
    }
  });

  return /*
    === Options ===
    1. You can return the google's userResponse
    2. Use Google's provided tokens
    3. Custom: use user-details from userResponse & make your own JWT tokens or session, etc.
  */

 // Even, you can store the OAuth response for furthur usages.
```

NOTE: We only used the GOOGLE's OAuth v2 scopes for easy authentication. But If you want you can get more information or other services i.e. youtube, cloud, drive, mail, etc.


Thanks if you read it all! :smile:

Just another time-pass by `Noob<Mahabub>`
-- [@mahabubx7](https://github.com/mahabubx7)
