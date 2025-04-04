import { useState, useEffect } from "react";

// Table Components
import ChartOfAccountsTable from "./ChartOfAccountsTable";
import TransactionsTable from "./TransactionsTable";
import PayeesTable from "./PayeesTable";

const SyncDashboard = () => {
  const [data, setData] = useState({ chartOfAccounts: [], transactions: [], payees: [] });
  const [loading, setLoading] = useState(false);

  // Fetch Data from API
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/qbo/sync-data");
      const result = await res.json();
      setData(result);
    } catch {
      console.error("Error fetching data:");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Sync data Tables</h1>

      {/* Sync Button */}
      <div className="flex justify-center mb-4">
        <button 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
          onClick={fetchData}
          disabled={loading}
        >
          {loading ? "Syncing..." : "Sync Data"}
        </button>
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ChartOfAccountsTable data={data.chartOfAccounts} />
        <TransactionsTable data={data.transactions} />
        <PayeesTable data={data.payees} />
      </div>
    </div>
  );
};

export default SyncDashboard;
