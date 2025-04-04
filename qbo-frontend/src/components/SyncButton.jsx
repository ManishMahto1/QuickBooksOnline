import React from 'react';
import axios from 'axios';

function SyncButton({ endpoint, label }) {
  const [status, setStatus] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSync = async () => {
    setLoading(true);
    setStatus('Syncing...');
    try {
      const response = await axios.get(`http://localhost:5000/api/qbo/${endpoint}`, {
        withCredentials: true,
      });
      setStatus(response.data.message || 'Sync complete!');
    } catch (err) {
      setStatus(`Error: ${err.response?.data?.error || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in w-full max-w-md mb-6">
      <button
        onClick={handleSync}
        disabled={loading}
        className={`w-full px-6 py-3 rounded-lg shadow-lg text-white font-semibold transition-all duration-300 ${
          loading
            ? 'bg-gray-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 hover:scale-105'
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg
              className="animate-spin h-5 w-5 mr-2 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
              ></path>
            </svg>
            Syncing...
          </span>
        ) : (
          label
        )}
      </button>
      <p className={`mt-2 text-sm ${status.includes('Error') ? 'text-red-500' : 'text-gray-600 dark:text-gray-400'}`}>
        {status}
      </p>
    </div>
  );
}

export default SyncButton;