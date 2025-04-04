const ChartOfAccountsTable = ({ data }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-3">Chart of Accounts</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">ID</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Type</th>
              <th className="border p-2">Balance</th>
            </tr>
          </thead>
          <tbody>
            {data.map((account) => (
              <tr key={account.qboId} className="hover:bg-gray-50">
                <td className="border p-2">{account.qboId}</td>
                <td className="border p-2">{account.Name}</td>
                <td className="border p-2">{account.AccountType}</td>
                <td className="border p-2">${account.CurrentBalance.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ChartOfAccountsTable;
