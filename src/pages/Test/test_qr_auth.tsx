import { useEffect, useState } from "react";
import { useAuthStore } from "../../stores/Visitor/auth.store";

export default function TestQrAuth() {
  const { user, isAuthenticated, authLoading } = useAuthStore();
  const [token, setToken] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<string[]>([]);

  useEffect(() => {
    // ดึง token จาก localStorage
    const authToken = localStorage.getItem('auth-token');
    setToken(authToken);

    const results = [
      `🔍 Auth Store State:`,
      `  - isAuthenticated: ${isAuthenticated}`,
      `  - authLoading: ${authLoading}`,
      `  - user: ${user ? JSON.stringify(user, null, 2) : 'null'}`,
      `🔑 Token Check:`,
      `  - localStorage token: ${authToken ? 'EXISTS' : 'NOT FOUND'}`,
      `  - token length: ${authToken?.length || 0}`,
      `  - token preview: ${authToken ? `${authToken.substring(0, 20)}...` : 'N/A'}`,
    ];

    setTestResults(results);
  }, [user, isAuthenticated, authLoading]);

  const handleTestQRCode = async () => {
    try {
      const response = await fetch('/api/teacher/qr-code/generate/1', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      setTestResults(prev => [...prev, `🔐 QR Code Test: ${response.status} - ${JSON.stringify(result)}`]);
    } catch (error) {
      setTestResults(prev => [...prev, `❌ QR Code Test Error: ${error.message}`]);
    }
  };

  const handleClearToken = () => {
    localStorage.removeItem('auth-token');
    setToken(null);
    setTestResults(prev => [...prev, '🗑️ Token cleared from localStorage']);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">QR Code Authentication Test</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Authentication Status</h2>
          <p>Authenticated: {isAuthenticated ? '✅ Yes' : '❌ No'}</p>
          <p>Loading: {authLoading ? '⏳ Yes' : '✅ No'}</p>
          <p>Token: {token ? '✅ Found' : '❌ Missing'}</p>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">User Info</h2>
          {user ? (
            <div>
              <p>Role: {user.role}</p>
              <p>Role ID: {user.role_id}</p>
              <p>User ID: {user.users_id}</p>
            </div>
          ) : (
            <p>No user data</p>
          )}
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-2">Actions</h2>
        <div className="space-x-4">
          <button
            onClick={handleTestQRCode}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            disabled={!token}
          >
            Test QR Code API
          </button>
          <button
            onClick={handleClearToken}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Clear Token
          </button>
        </div>
      </div>

      <div className="bg-white border rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-2">Debug Information</h2>
        <pre className="text-sm bg-gray-100 p-4 rounded overflow-auto max-h-96">
          {testResults.map((result, index) => (
            <div key={index} className="mb-1">{result}</div>
          ))}
        </pre>
      </div>
    </div>
  );
}

