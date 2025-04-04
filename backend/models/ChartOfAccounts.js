import mongoose from 'mongoose';

const chartOfAccountsSchema = new mongoose.Schema({
  qboId: { type: String, unique: true, sparse: true },
  Id: String,
  Name: String,
  AccountType: String,
  AccountSubType: String,
  Classification: String,
  CurrentBalance: Number,
  FullyQualifiedName: String,
  realmId: String,
});

export default mongoose.model('ChartOfAccounts', chartOfAccountsSchema);