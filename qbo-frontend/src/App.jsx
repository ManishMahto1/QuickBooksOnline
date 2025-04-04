import React from 'react';
import AuthButton from './components/AuthButton';
import Dashboard from './components/Dashboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [darkMode, setDarkMode] = React.useState(false);

  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/qbo/check-auth', {
          credentials: 'include',
        });
        if (response.ok) setIsAuthenticated(true);
      } catch (err) {
        console.error('Auth check failed:', err);
      }
    };
    checkAuth();
  }, []);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} transition-colors duration-300`}>
      <header className="p-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          QBO Sync
        </h1>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      </header>
      <main className="flex flex-col items-center justify-center p-6">
        {isAuthenticated ? (
          <Dashboard />
        ) : (
          <AuthButton setIsAuthenticated={setIsAuthenticated} />
        )}
      </main>
    </div>
  );
}

export default App;