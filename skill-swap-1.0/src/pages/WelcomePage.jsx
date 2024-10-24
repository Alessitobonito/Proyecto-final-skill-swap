import React from 'react';
import { Link } from 'react-router-dom';

function WelcomePage() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-400 to-blue-500 overflow-hidden">
      {/* Background SVG */}
      <svg className="absolute w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d="M0,0 L100,0 L100,100 L0,100 Z" fill="rgba(255,255,255,0.1)" />
        <path d="M0,0 C40,20 60,80 100,100 L0,100 Z" fill="rgba(255,255,255,0.05)" />
      </svg>

      <div className="z-10 text-center">
        <h1 className="text-6xl font-bold mb-8 text-white shadow-lg">Welcome to Skill Swap</h1>
        <p className="text-xl mb-8 text-white">Connect, Learn, and Grow with Skill Swap</p>
        <Link 
          to="/register" 
          className="bg-white text-green-500 font-bold py-3 px-6 rounded-full text-xl hover:bg-green-100 transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
}

export default WelcomePage;