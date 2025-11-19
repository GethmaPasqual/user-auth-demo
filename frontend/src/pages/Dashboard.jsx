import React from "react";
import { useAuthContext } from "@asgardeo/auth-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Dashboard.css";

export default function Dashboard() {
  const { state, signOut, getBasicUserInfo, getAccessToken } = useAuthContext();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = React.useState(null);
  const [roles, setRoles] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (state?.isAuthenticated) {
      fetchUserData();
    }
  }, [state?.isAuthenticated]);

  const fetchUserData = async () => {
    try {
      const info = await getBasicUserInfo();
      setUserInfo(info);

      // Get JWT token and fetch roles
      const token = await getAccessToken();
      const response = await axios.get("http://localhost:4000/api/user/roles", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRoles(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const testAdminEndpoint = async () => {
    try {
      const token = await getAccessToken();
      const response = await axios.get("http://localhost:4000/api/admin/dashboard", {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("✅ Admin Access Granted!\n\n" + JSON.stringify(response.data, null, 2));
    } catch (error) {
      alert("❌ Access Denied!\n\n" + (error.response?.data?.error || error.message));
    }
  };

  const handleSignOut = () => {
    signOut();
  };

  if (!state?.isAuthenticated) {
    navigate("/");
    return null;
  }

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="user-info-header">
          <h1>User & Identity Service</h1>
          {userInfo && (
            <div className="user-badge">
              <span>👤 {userInfo.email || userInfo.username}</span>
            </div>
          )}
        </div>
        <button className="signout-button" onClick={handleSignOut}>
          Sign Out
        </button>
      </div>
      
      <div className="demo-card">
        <h2>🔐 Authentication Demo</h2>
        <p className="team-badge">Team 1: User & Identity Service</p>
        
        {userInfo && (
          <div className="info-section">
            <h3>User Information</h3>
            <div className="info-grid">
              <div><strong>Email:</strong> {userInfo.email || "N/A"}</div>
              <div><strong>Username:</strong> {userInfo.username || "N/A"}</div>
              <div><strong>User ID:</strong> {userInfo.sub}</div>
            </div>
          </div>
        )}

        {roles && (
          <div className="info-section">
            <h3>Role-Based Access Control (RBAC)</h3>
            <div className="role-badges">
              {roles.roles && roles.roles.length > 0 ? (
                roles.roles.map((role) => (
                  <span key={role} className={`role-badge ${role}`}>
                    {role}
                  </span>
                ))
              ) : (
                <span className="role-badge no-role">No roles assigned</span>
              )}
            </div>
            <div className="role-info">
              <p>✅ Is User: {roles.isUser ? "Yes" : "No"}</p>
              <p>✅ Is Admin: {roles.isAdmin ? "Yes" : "No"}</p>
            </div>
          </div>
        )}

        <div className="info-section">
          <h3>Test RBAC</h3>
          <p>Click the button below to test admin-only endpoint:</p>
          <button className="test-button" onClick={testAdminEndpoint}>
            🔒 Test Admin Endpoint
          </button>
          <p className="hint">
            {roles?.isAdmin 
              ? "✅ You have admin role - this should succeed" 
              : "❌ You don't have admin role - this should fail"}
          </p>
        </div>

        <div className="info-section">
          <h3>Integration Points</h3>
          <ul className="integration-list">
            <li>✅ Asgardeo authentication integrated</li>
            <li>✅ JWT tokens validated on backend</li>
            <li>✅ Role-based access control implemented</li>
            <li>✅ Ready for microservice communication</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
