import React, { useEffect, useState } from "react";
import { useAsgardeo } from "@asgardeo/auth-react";

export default function App() {
  const { state, signIn, signOut, getBasicUserInfo, getAccessToken } = useAsgardeo();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (state.isAuthenticated) {
      getBasicUserInfo().then(setProfile).catch(console.error);
    } else {
      setProfile(null);
    }
  }, [state.isAuthenticated, getBasicUserInfo]);

  const callProtectedApi = async () => {
    try {
      const token = await getAccessToken();
      const res = await fetch("http://localhost:4000/api/protected", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      alert(JSON.stringify(data, null, 2));
    } catch (e) {
      alert("API call failed: " + e.message);
    }
  };

  return (
    <div style={{ padding: 24, fontFamily: "Segoe UI, Arial" }}>
      <h1>Task Management — Auth Demo</h1>

      {!state.isAuthenticated ? (
        <button onClick={() => signIn()}>Sign In</button>
      ) : (
        <>
          <div>
            <strong>Signed in as:</strong> {profile?.username || profile?.email}
          </div>
          <div style={{ marginTop: 12 }}>
            <button onClick={callProtectedApi}>Call Protected API</button>
            <button style={{ marginLeft: 8 }} onClick={() => signOut()}>
              Sign Out
            </button>
          </div>
        </>
      )}
    </div>
  );
}
