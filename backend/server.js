import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import OAuthClient from 'intuit-oauth';
import connectDB from './config/db.js';
import qboRoutes from './routes/qbo.js';
import Token from './models/Token.js';
import axios from 'axios';

const app = express();
const port = process.env.PORT || 5000;

connectDB();

const oauthClient = new OAuthClient({
  clientId: process.env.QBO_CLIENT_ID,
  clientSecret: process.env.QBO_CLIENT_SECRET,
  environment: process.env.QBO_ENVIRONMENT,
  redirectUri: process.env.QBO_REDIRECT_URI,
});

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.get('/auth', (req, res) => {
  const authUrl = `https://appcenter.intuit.com/connect/oauth2?` +
    `client_id=${process.env.QBO_CLIENT_ID}&` +
    `response_type=code&` +
    `scope=com.intuit.quickbooks.accounting&` +
    `redirect_uri=${encodeURIComponent(process.env.QBO_REDIRECT_URI)}&` +
    `state=testState`;
  console.log('Generated Auth URL:', authUrl);
  res.redirect(authUrl);
});

app.get('/auth/callback', async (req, res) => {
  const { code, state, realmId } = req.query;
  if (!code) return res.status(400).send('No authorization code provided');
  if (state !== 'testState') return res.status(400).send('Invalid state parameter');

  try {
    const response = await axios.post(
      'https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer',
      new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.QBO_REDIRECT_URI,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(
            `${process.env.QBO_CLIENT_ID}:${process.env.QBO_CLIENT_SECRET}`
          ).toString('base64')}`,
        },
      }
    );

    const tokens = response.data;
    console.log('Access Token:', tokens.access_token);
    console.log('Refresh Token:', tokens.refresh_token);
    console.log('Realm ID:', realmId);

    await Token.findOneAndUpdate(
      {},
      {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        realmId: realmId,
        expiresIn: tokens.expires_in,
      },
      { upsert: true, new: true }
    );

    oauthClient.token = {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      realmId: realmId,
      expires_in: tokens.expires_in,
    };

    res.redirect('http://localhost:5173/?authenticated=true');
  } catch (err) {
    console.error('Token exchange failed:', err.response?.data || err.message);
    res.status(500).send('Authentication failed');
  }
});

app.get('/api/qbo/check-auth', async (req, res) => {
  try {
    const tokenDoc = await Token.findOne({});
    if (!tokenDoc || !tokenDoc.accessToken) {
      console.log('No tokens found in MongoDB');
      return res.status(401).json({ authenticated: false });
    }

    oauthClient.token = {
      access_token: tokenDoc.accessToken,
      refresh_token: tokenDoc.refreshToken,
      realmId: tokenDoc.realmId,
      expires_in: tokenDoc.expiresIn,
    };

    console.log('Current token:', oauthClient.token);

    if (!oauthClient.isAccessTokenValid()) {
      console.log('Refreshing token...');
      const refreshedToken = await oauthClient.refresh();
      const newTokens = refreshedToken.getJson();
      console.log('Refreshed token:', newTokens);

      await Token.findOneAndUpdate(
        {},
        {
          accessToken: newTokens.access_token,
          refreshToken: newTokens.refresh_token,
          realmId: newTokens.realmId,
          expiresIn: newTokens.expires_in,
        },
        { upsert: true }
      );

      oauthClient.token = newTokens;
    }

    res.status(200).json({ authenticated: true });
  } catch (err) {
    console.error('Error checking auth:', err.message, err.stack);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

app.use('/api/qbo', qboRoutes(oauthClient));

app.listen(port, () => console.log(`Server running on port ${port}`));