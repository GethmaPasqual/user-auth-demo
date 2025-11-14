import React, { useState, useEffect } from 'react';
import { useAuthContext } from '@asgardeo/auth-react';
import './Dashboard.css';

const Dashboard = () => {
  const { state, signOut, getAccessToken } = useAuthContext();
  const [backendData, setBackendData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 156,
    activeUsers: 89,
    newUsers: 12,
    apiCalls: 2547
  });

  const testBackendConnection = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getAccessToken();
      const response = await fetch('http://localhost:4000/api/protected', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Backend connection failed');
      }
      
      const data = await response.json();
      setBackendData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p className="header-subtitle">Manage and monitor your system</p>
        </div>
        <button onClick={() => signOut()} className="logout-button">
          Logout
        </button>
      </div>

      <div className="dashboard-content">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon purple">👥</div>
            <div className="stat-info">
              <p className="stat-label">Total Users</p>
              <h3 className="stat-value">{stats.totalUsers}</h3>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon green">✓</div>
            <div className="stat-info">
              <p className="stat-label">Active Users</p>
              <h3 className="stat-value">{stats.activeUsers}</h3>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon blue">+</div>
            <div className="stat-info">
              <p className="stat-label">New Users</p>
              <h3 className="stat-value">{stats.newUsers}</h3>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon orange">📊</div>
            <div className="stat-info">
              <p className="stat-label">API Calls</p>
              <h3 className="stat-value">{stats.apiCalls}</h3>
            </div>
          </div>
        </div>

        <div className="welcome-card">
          <h2>Welcome, Admin {state?.username || 'User'}!</h2>
          <p>You have full administrative access to the system.</p>
        </div>

        <div className="user-info-card">
          <h3>Administrator Information</h3>
          <div className="info-row">
            <span className="label">Email:</span>
            <span className="value">{state?.email || 'N/A'}</span>
          </div>
          <div className="info-row">
            <span className="label">Username:</span>
            <span className="value">{state?.username || 'N/A'}</span>
          </div>
          <div className="info-row">
            <span className="label">Role:</span>
            <span className="value badge-admin">Administrator</span>
          </div>
        </div>

        <div className="backend-test-card">
          <h3>Backend Connection Test</h3>
          <button 
            onClick={testBackendConnection} 
            className="test-button"
            disabled={loading}
          >
            {loading ? 'Testing...' : 'Test Backend API'}
          </button>
          
          {error && (
            <div className="error-message">
              ❌ Error: {error}
            </div>
          )}
          
          {backendData && (
            <div className="success-message">
              <p>✅ {backendData.message}</p>
              <div className="backend-data">
                <h4>User Data from Backend:</h4>
                <pre>{JSON.stringify(backendData.user, null, 2)}</pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
