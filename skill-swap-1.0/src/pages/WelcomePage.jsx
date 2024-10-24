// src/pages/WelcomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const WelcomePage = () => {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to Skill Swapper</h1>
      <p className="text-xl mb-8">Exchange skills, learn something new, and connect with others!</p>
      <div className="space-x-4">
        <Link to="/register" className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">Get Started</Link>
        <Link to="/login" className="bg-gray-200 text-gray-800 px-6 py-2 rounded hover:bg-gray-300">Login</Link>
      </div>
    </div>
  );
};

export default WelcomePage;