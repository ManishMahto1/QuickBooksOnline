const TransactionsTable = ({ data }) => {
    return (
      <div className="bg-white shadow-md rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-3">Transactions</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">ID</th>
                <th className="border p-2">Type</th>
                <th className="border p-2">Amount</th>
                <th className="border p-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {data.map((txn) => (
                <tr key={txn.qboId} className="hover:bg-gray-50">
                  <td className="border p-2">{txn.qboId}</td>
                  <td className="border p-2">{txn.type}</td>
                  <td className="border p-2">${txn.amount.toFixed(2)}</td>
                  <td className="border p-2">{new Date(txn.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  
  export default TransactionsTable;
  