// src/components/Menu.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Menu = () => {
  return (
    <nav className="bg-gray-100 p-4">
      <div className="container mx-auto">
        <ul className="flex justify-center space-x-6">
          <li><Link to="/app/skills" className="hover:text-blue-600">Browse Skills</Link></li>
          <li><Link to="/app/skills/new" className="hover:text-blue-600">Offer a Skill</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default Menu;