import React, { useState, useEffect } from 'react';
import { useAuthContext } from '@asgardeo/auth-react';

const useUserRole = () => {
  const { state, getAccessToken, getIDToken } = useAuthContext();
  const [userRole, setUserRole] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserRole = async () => {
      if (!state?.isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        // Try to get role from backend
        const token = await getAccessToken();
        const response = await fetch('http://localhost:4000/api/check-role', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          const roles = data.roles || [];
          
          // Check if user is admin
          const adminCheck = roles.some(
            role => role.toLowerCase() === 'admin' || role.toLowerCase() === 'administrator'
          );
          
          setIsAdmin(adminCheck);
          setUserRole(adminCheck ? 'admin' : 'user');
        } else {
          // Fallback: check email/username
          const userEmail = state?.email || '';
          const username = state?.username || '';
          const adminCheck = userEmail.toLowerCase().includes('admin') || 
                           username.toLowerCase().includes('admin');
          
          setIsAdmin(adminCheck);
          setUserRole(adminCheck ? 'admin' : 'user');
        }
      } catch (error) {
        console.error('Error checking role:', error);
        
        // Fallback: check email/username
        const userEmail = state?.email || '';
        const username = state?.username || '';
        const adminCheck = userEmail.toLowerCase().includes('admin') || 
                         username.toLowerCase().includes('admin');
        
        setIsAdmin(adminCheck);
        setUserRole(adminCheck ? 'admin' : 'user');
      } finally {
        setLoading(false);
      }
    };

    checkUserRole();
  }, [state?.isAuthenticated, state?.email, state?.username, getAccessToken]);

  return { userRole, isAdmin, loading };
};

export default useUserRole;
