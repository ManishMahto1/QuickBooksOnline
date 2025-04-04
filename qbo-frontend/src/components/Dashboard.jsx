import React from 'react';
import SyncButton from './SyncButton';
import SyncDashboard from './SyncDashboard';
function Dashboard() {
  return (
    <div className="fade-in w-full max-w-lg bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6">
      <h2 className="text-2xl font-semibold mb-6 text-center bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
        Sync Dashboard
      </h2>
      <SyncButton endpoint="chart-of-accounts" label="Sync Chart of Accounts" />
      <SyncButton endpoint="payees" label="Sync Payees" />
      <SyncButton endpoint="transactions" label="Sync Transactions" />
      <SyncDashboard />
    </div>
  );
}

export default Dashboard;