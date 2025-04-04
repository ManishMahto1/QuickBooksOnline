import ChartOfAccounts from '../models/ChartOfAccounts.js';
import Payee from '../models/Payee.js';
import Transaction from '../models/Transaction.js';

export const syncChartOfAccounts = async (req, res, qbo) => {
  try {
    qbo.findAccounts(async (err, accounts) => {
      if (err) return res.status(500).json({ error: err.message || err });

      const data = accounts.QueryResponse.Account.map(account => ({
        qboId: account.qboId || account.Id, // Ensure `qboId` is always set
        Id: account.Id,
        Name: account.Name,
        AccountType: account.AccountType,
        AccountSubType: account.AccountSubType,
        Classification: account.Classification,
        CurrentBalance: account.CurrentBalance,
        FullyQualifiedName: account.FullyQualifiedName,
        realmId: qbo.realmId,
      }));
      

      try {
        const bulkOps = data.map(account => ({
          updateOne: {
            filter: { Id: account.Id },
            update: { $set: account },
            upsert: true,
          },
        }));

        console.log('Data to save:', data);
        const result = await ChartOfAccounts.bulkWrite(bulkOps);
        console.log('Chart of Accounts synced to DB:', {
          upserted: result.upsertedCount,
          modified: result.modifiedCount,
          matched: result.matchedCount,
        });
        res.json({
          message: 'Chart of Accounts synced',
          count: data.length,
          upserted: result.upsertedCount,
          modified: result.modifiedCount,
        });
      } catch (dbErr) {
        console.error('DB save error:', dbErr);
        res.status(500).json({ error: 'Failed to save to database', details: dbErr.message });
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const syncPayees = async (req, res, qbo) => {
  try {
    qbo.findVendors(async (err, vendors) => {
      if (err) return res.status(500).json({ error: err.message || err });

      const data = vendors.QueryResponse.Vendor.map(vendor => ({
        qboId: vendor.Id,
        name: vendor.DisplayName,
        /* realmId: qbo.realmId, */
        type: vendor.Vendor1099 ? 'vendor': 'customer' , // Default to 'vendor' if not specified
        active: vendor.Active || true, // Default to true if not specified
      }));

      try {
        const bulkOps = data.map(vendor => ({
          updateOne: {
            filter: { qboId: vendor.Id },
            update: { $set: vendor },
            upsert: true,
          },
        }));

        const result = await Payee.bulkWrite(bulkOps);
        console.log('Payees synced to DB:', {
          upserted: result.upsertedCount,
          modified: result.modifiedCount,
          matched: result.matchedCount,
        });
        res.json({
          message: 'Payees synced',
          count: data.length,
          upserted: result.upsertedCount,
          modified: result.modifiedCount,
        });
      } catch (dbErr) {
        console.error('DB save error:', dbErr);
        res.status(500).json({ error: 'Failed to save to database', details: dbErr.message });
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Sync transactions from QuickBooks Online to MongoDB
export const syncTransactions = async (req, res, qbo) => {
  try {
    qbo.findPurchases({}, async (err, purchases) => {  // Use findPurchases instead of qbo.query
      if (err) return res.status(500).json({ error: err.message || err });

      if (!purchases.QueryResponse || !purchases.QueryResponse.Purchase) {
        return res.json({ message: 'No transactions found' });
      }


     
      const data = purchases.QueryResponse.Purchase.map(txn => ({
        qboId: txn.Id,         // Changed `Id` to `qboId` to match schema
        type: 'purchase',      // Assuming all are purchases
        amount: txn.TotalAmt,  
        date: txn.TxnDate,     
        payeeId: txn.EntityRef?.value || null, 
      }));

      try {
        const bulkOps = data.map(txn => ({
          updateOne: {
            filter: { qboId: txn.qboId },
            update: { $set: txn },
            upsert: true,
          },
        }));

        const result = await Transaction.bulkWrite(bulkOps);
        console.log('Transactions synced to DB:', {
          upserted: result.upsertedCount,
          modified: result.modifiedCount,
          matched: result.matchedCount,
        });

        res.json({
          message: 'Transactions synced',
          count: data.length,
          upserted: result.upsertedCount,
          modified: result.modifiedCount,
        });
      } catch (dbErr) {
        console.error('DB save error:', dbErr);
        res.status(500).json({ error: 'Failed to save to database', details: dbErr.message });
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
