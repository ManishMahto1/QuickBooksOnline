import React from 'react';

function AuthButton({ setIsAuthenticated }) {
  const handleAuth = () => {
    window.location.href = 'http://localhost:5000/auth';
  };

  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('authenticated') === 'true') {
      setIsAuthenticated(true);
      window.history.replaceState({}, document.title, '/');
    }
  }, [setIsAuthenticated]);

  return (
    <div className="fade-in text-center">
      <p className="text-lg mb-4 dark:text-gray-300">
        Connect to QuickBooks Online to start syncing your data.
      </p>
      <button
        onClick={handleAuth}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105"
      >
        Connect to QuickBooks
      </button>
    </div>
  );
}

export default AuthButton;