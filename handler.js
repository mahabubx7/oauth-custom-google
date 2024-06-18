const { Router } = require("express");
const { makeUrl } = require("./oauth");
const querystring = require('querystring');
const { default: axios } = require("axios");


const handler = Router();

// --------------------------------- //

handler.get('/auth/google', (_req, res) => {
  res.redirect(makeUrl());
});

handler.get('/auth/callback/google', (req, res) => {
  res.json(req.query);
});


handler.get('/auth/info', async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: 'Authorization code is missing' });
  }

  try {
    const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI } = process.env;
    const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', querystring.stringify({
      code: code,
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

    const userInfo = userResponse.data;

    res.json({
      profile: userInfo,
      email: userInfo.email,
      openid: userInfo.id
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user information' });
  }
});

handler.use((err, _req, res, _next) => {
  res.status(500).json({
    message: 'Internal Server Error',
    error: err.message,
  });
});

// --------------------------------- //
module.exports = handler;