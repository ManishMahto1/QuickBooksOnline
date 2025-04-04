const PayeesTable = ({ data }) => {
    return (
      <div className="bg-white shadow-md rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-3">Payees</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">ID</th>
                <th className="border p-2">Name</th>
                <th className="border p-2">Type</th>
                <th className="border p-2">Active</th>
              </tr>
            </thead>
            <tbody>
              {data.map((payee) => (
                <tr key={payee.qboId} className="hover:bg-gray-50">
                  <td className="border p-2">{payee.qboId}</td>
                  <td className="border p-2">{payee.name}</td>
                  <td className="border p-2">{payee.type}</td>
                  <td className="border p-2">{payee.active ? "Yes" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  
  export default PayeesTable;
  