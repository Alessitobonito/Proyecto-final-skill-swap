import React from 'react';
import { Link } from 'react-router-dom';

const WelcomePage = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
          <div className="text-center bg-white p-8 rounded-lg shadow-2xl">
            <h1 className="text-4xl font-bold mb-4 text-gray-800">Welcome to Skill Swap</h1>
            <p className="mb-6 text-gray-600">Exchange skills with people around the world.</p>
            <div className="space-x-4">
              <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300">
                Register
              </Link>
              <Link to="/login" className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition duration-300">
                Login
              </Link>
            </div>
          </div>
        </div>
      );
};

export default WelcomePage;
