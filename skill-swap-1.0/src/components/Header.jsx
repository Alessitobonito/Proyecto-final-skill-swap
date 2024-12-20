import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const isPublicRoute = ['/', '/login', '/register'].includes(location.pathname);

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold hover:text-blue-200 transition duration-300">Skill Swapper</Link>
        <nav>
          <ul className="flex space-x-6">
            {currentUser ? (
              <>
                <li><Link to="/app" className="hover:text-blue-200 transition duration-300">Home</Link></li>
                <li><button onClick={logout} className="hover:text-blue-200 transition duration-300">Logout</button></li>
              </>
            ) : (
              <>
                <li><Link to="/login" className="hover:text-blue-200 transition duration-300">Login</Link></li>
                <li><Link to="/register" className="bg-white text-blue-600 px-4 py-2 rounded-full hover:bg-blue-100 transition duration-300">Register</Link></li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;