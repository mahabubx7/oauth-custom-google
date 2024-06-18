const querystring = require('querystring');

module.exports = {
  // @desc   Authenticate user with Google

  // makeOAuthUrl 
  makeUrl: () => {
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
}