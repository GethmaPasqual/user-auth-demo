import React, { useState, useEffect } from 'react';
import { useAuthContext } from '@asgardeo/auth-react';
import './UserHome.css';

const UserHome = () => {
  const { state, signOut, getAccessToken } = useAuthContext();
  const [backendData, setBackendData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
    <div className="user-home-container">
      <nav className="user-navbar">
        <div className="nav-content">
          <div className="logo">UserAuth Demo</div>
          <div className="nav-right">
            <span className="user-greeting">Hello, {state?.username || 'User'}</span>
            <button onClick={() => signOut()} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="user-content">
        <div className="welcome-section">
          <h1>Welcome to Your Home</h1>
          <p>You're logged in as a regular user.</p>
        </div>

        <div className="user-cards">
          <div className="user-card">
            <div className="card-icon">👤</div>
            <h3>My Profile</h3>
            <div className="profile-info">
              <p><strong>Username:</strong> {state?.username || 'N/A'}</p>
              <p><strong>Email:</strong> {state?.email || 'N/A'}</p>
            </div>
          </div>

          <div className="user-card">
            <div className="card-icon">🔐</div>
            <h3>Test Backend</h3>
            <button 
              onClick={testBackendConnection} 
              className="test-btn"
              disabled={loading}
            >
              {loading ? 'Testing...' : 'Test API Connection'}
            </button>
            
            {error && (
              <div className="error-box">
                ❌ {error}
              </div>
            )}
            
            {backendData && (
              <div className="success-box">
                ✅ {backendData.message}
              </div>
            )}
          </div>

          <div className="user-card">
            <div className="card-icon">📊</div>
            <h3>My Activity</h3>
            <p>View your recent activities and updates.</p>
          </div>

          <div className="user-card">
            <div className="card-icon">⚙️</div>
            <h3>Settings</h3>
            <p>Manage your account settings and preferences.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserHome;
