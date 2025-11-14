import React from 'react';
import { useAuthContext } from '@asgardeo/auth-react';
import './HomePage.css';

const HomePage = () => {
  const { signIn } = useAuthContext();

  return (
    <div className="homepage-container">
      <nav className="navbar">
        <div className="nav-content">
          <div className="logo">UserAuth Demo</div>
          <button onClick={() => signIn()} className="nav-login-btn">
            Login
          </button>
        </div>
      </nav>

      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Secure Authentication <br />
            <span className="highlight">Made Simple</span>
          </h1>
          <p className="hero-description">
            Experience seamless authentication powered by Asgardeo.
            Role-based access control for your microservices architecture.
          </p>
          <div className="hero-buttons">
            <button onClick={() => signIn()} className="btn-primary">
              Get Started
            </button>
            <button className="btn-secondary">
              Learn More
            </button>
          </div>
        </div>
      </section>

      <section className="features-section">
        <h2 className="section-title">Key Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🔐</div>
            <h3>Secure Authentication</h3>
            <p>OAuth 2.0 and OpenID Connect powered by Asgardeo</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3>Role-Based Access</h3>
            <p>Control user permissions with RBAC implementation</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🚀</div>
            <h3>Microservices Ready</h3>
            <p>Share authentication across multiple services</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Fast & Scalable</h3>
            <p>Built with React and Node.js for performance</p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>&copy; 2025 User Auth Demo. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
