import React from "react";
import { useAuthContext } from "@asgardeo/auth-react";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

export default function Dashboard() {
  const { state, signOut, getBasicUserInfo } = useAuthContext();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = React.useState(null);

  React.useEffect(() => {
    if (state?.isAuthenticated) {
      getBasicUserInfo()
        .then((info) => setUserInfo(info))
        .catch((error) => console.error(error));
    }
  }, [state?.isAuthenticated]);

  const handleSignOut = () => {
    signOut();
  };

  if (!state?.isAuthenticated) {
    navigate("/");
    return null;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h1>Welcome to Dashboard</h1>
        {userInfo && (
          <div className="user-info">
            <p><strong>Email:</strong> {userInfo.email}</p>
            <p><strong>Username:</strong> {userInfo.username}</p>
            {userInfo.displayName && (
              <p><strong>Name:</strong> {userInfo.displayName}</p>
            )}
          </div>
        )}
        <button className="signout-button" onClick={handleSignOut}>
          Sign Out
        </button>
      </div>
    </div>
  );
}
