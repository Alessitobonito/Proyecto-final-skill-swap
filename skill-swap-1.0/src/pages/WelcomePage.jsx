import React from 'react';
import { Link } from 'react-router-dom';

const WelcomePage = () => {
  return (
    <div className="welcome-page">
      <h1>Welcome to Skill Swap</h1>
      <p>Connect and exchange skills with others.</p>
      <div>
        <Link to="/login" className="btn">Login</Link>
        <Link to="/register" className="btn">Register</Link>
      </div>
    </div>
  );
};

export default WelcomePage;
