import express from 'express';
import QuickBooks from 'node-quickbooks';
import Token from '../models/Token.js';
import { syncChartOfAccounts, syncPayees, syncTransactions } from '../controllers/qboController.js';
import ChartOfAccounts from '../models/ChartOfAccounts.js';
import Payee from '../models/Payee.js';
import Transaction from '../models/Transaction.js';

export default (oauthClient) => {
  const router = express.Router();

  router.use(async (req, res, next) => {
    try {
      const tokenDoc = await Token.findOne({});
      if (tokenDoc) {
        oauthClient.token = {
          access_token: tokenDoc.accessToken,
          refresh_token: tokenDoc.refreshToken,
          realmId: tokenDoc.realmId,
          expires_in: tokenDoc.expiresIn,
        };
        console.log('Loaded tokens:', oauthClient.token);
      } else {
        console.log('No tokens found in MongoDB');
      }
      next();
    } catch (err) {
      console.error('Error loading tokens:', err);
      res.status(500).json({ error: 'Failed to load tokens' });
    }
  });

  const getQboInstance = () => {
    if (!oauthClient.token?.access_token) {
      throw new Error('No access token available');
    }
    return new QuickBooks(
      process.env.QBO_CLIENT_ID,
      process.env.QBO_CLIENT_SECRET,
      oauthClient.token.access_token,
      false,
      oauthClient.token.realmId,
      process.env.QBO_ENVIRONMENT === 'sandbox',
      true,
      oauthClient.token.refresh_token,
      '2.0'
    );
  };

  router.get('/chart-of-accounts', async (req, res) => {
    try {
      const qbo = getQboInstance();
      syncChartOfAccounts(req, res, qbo);
    } catch (err) {
      res.status(401).json({ error: err.message });
    }
  });

  router.get('/payees', async (req, res) => {
    try {
      const qbo = getQboInstance();
      syncPayees(req, res, qbo);
    } catch (err) {
      res.status(401).json({ error: err.message });
    }
  });

  router.get('/transactions', async (req, res) => {
    try {
      const qbo = getQboInstance();
      syncTransactions(req, res, qbo);
    } catch (err) {
      res.status(401).json({ error: err.message });
    }
  });

  // Fetch all synced data
router.get('/sync-data', async (req, res) => {
  try {
    const chartOfAccounts = await ChartOfAccounts.find();
    const transactions = await Transaction.find();
    const payees = await Payee.find();
    
    res.json({ chartOfAccounts, transactions, payees });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch data', details: err.message });
  }
});

  return router;
};