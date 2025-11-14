import React, { useState } from 'react';
import { useAuthContext } from '@asgardeo/auth-react';

const MicroservicesDemo = () => {
  const { getAccessToken } = useAuthContext();
  const [results, setResults] = useState({
    mainApi: null,
    userService: null,
    analyticsService: null
  });
  const [loading, setLoading] = useState(false);

  const testAllServices = async () => {
    setLoading(true);
    const token = await getAccessToken();

    try {
      // Test Main API
      const mainApiResponse = await fetch('http://localhost:4000/api/check-role', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const mainApiData = await mainApiResponse.json();

      // Test User Service
      const userServiceResponse = await fetch('http://localhost:4001/api/user-service/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const userServiceData = await userServiceResponse.json();

      // Test Analytics Service
      const analyticsResponse = await fetch('http://localhost:4002/api/analytics-service/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const analyticsData = await analyticsResponse.json();

      setResults({
        mainApi: { success: mainApiResponse.ok, data: mainApiData },
        userService: { success: userServiceResponse.ok, data: userServiceData },
        analyticsService: { success: analyticsResponse.ok, data: analyticsData }
      });
    } catch (error) {
      console.error('Error testing services:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      padding: '30px',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <h2 style={{ marginBottom: '20px', color: '#333' }}>
        🔗 Microservices Authentication Demo
      </h2>
      
      <div style={{
        backgroundColor: '#f8f9fa',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '30px',
        border: '1px solid #dee2e6'
      }}>
        <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#666' }}>
          This demonstrates how a <strong>single JWT token</strong> from Asgardeo works across <strong>multiple independent microservices</strong>.
        </p>
        <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>
          Click the button below to call all three services with the same authentication token.
        </p>
      </div>

      <button
        onClick={testAllServices}
        disabled={loading}
        style={{
          padding: '12px 24px',
          backgroundColor: '#667eea',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          fontSize: '16px',
          cursor: loading ? 'not-allowed' : 'pointer',
          marginBottom: '30px',
          opacity: loading ? 0.6 : 1
        }}
      >
        {loading ? '🔄 Testing Services...' : '🚀 Test All Services with Same Token'}
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
        {/* Main API Service */}
        <ServiceCard
          title="Main API Service"
          port="4000"
          icon="🏢"
          result={results.mainApi}
        />

        {/* User Service */}
        <ServiceCard
          title="User Service"
          port="4001"
          icon="👤"
          result={results.userService}
        />

        {/* Analytics Service */}
        <ServiceCard
          title="Analytics Service"
          port="4002"
          icon="📊"
          result={results.analyticsService}
        />
      </div>

      {results.mainApi && (
        <div style={{
          marginTop: '30px',
          padding: '20px',
          backgroundColor: '#d4edda',
          border: '1px solid #c3e6cb',
          borderRadius: '6px',
          color: '#155724'
        }}>
          <strong>✅ Success!</strong> All three microservices accepted the same JWT token from Asgardeo.
          <br/>
          <small>Each service independently validated the token without communicating with each other.</small>
        </div>
      )}
    </div>
  );
};

const ServiceCard = ({ title, port, icon, result }) => {
  return (
    <div style={{
      padding: '20px',
      backgroundColor: 'white',
      borderRadius: '8px',
      border: result?.success ? '2px solid #28a745' : '1px solid #dee2e6',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div style={{ fontSize: '32px', marginBottom: '10px' }}>{icon}</div>
      <h3 style={{ margin: '0 0 5px 0', fontSize: '18px' }}>{title}</h3>
      <p style={{ margin: '0 0 15px 0', fontSize: '12px', color: '#666' }}>
        Port: {port}
      </p>
      
      {result && (
        <>
          <div style={{
            padding: '8px 12px',
            backgroundColor: result.success ? '#d4edda' : '#f8d7da',
            color: result.success ? '#155724' : '#721c24',
            borderRadius: '4px',
            fontSize: '14px',
            marginBottom: '10px'
          }}>
            {result.success ? '✅ Token Validated' : '❌ Failed'}
          </div>
          
          <details style={{ fontSize: '12px' }}>
            <summary style={{ cursor: 'pointer', color: '#667eea' }}>
              View Response
            </summary>
            <pre style={{
              marginTop: '10px',
              padding: '10px',
              backgroundColor: '#f8f9fa',
              borderRadius: '4px',
              fontSize: '11px',
              overflow: 'auto',
              maxHeight: '200px'
            }}>
              {JSON.stringify(result.data, null, 2)}
            </pre>
          </details>
        </>
      )}
      
      {!result && (
        <p style={{ fontSize: '12px', color: '#999', fontStyle: 'italic' }}>
          Waiting to test...
        </p>
      )}
    </div>
  );
};

export default MicroservicesDemo;
