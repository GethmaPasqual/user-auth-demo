import React from 'react';
import { useAuthContext } from '@asgardeo/auth-react';
import './Dashboard.css';

const Dashboard = () => {
  const { state, signOut } = useAuthContext();

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <button onClick={() => signOut()} className="logout-button">
          Logout
        </button>
      </div>

      <div className="dashboard-content">
        <div className="welcome-card">
          <h2>Welcome, {state?.username || 'User'}!</h2>
          <p>You have successfully logged in.</p>
        </div>

        <div className="user-info-card">
          <h3>User Information</h3>
          <div className="info-row">
            <span className="label">Email:</span>
            <span className="value">{state?.email || 'N/A'}</span>
          </div>
          <div className="info-row">
            <span className="label">Username:</span>
            <span className="value">{state?.username || 'N/A'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
