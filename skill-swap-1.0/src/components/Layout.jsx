import React from 'react';
import Header from './Header';
import Menu from './Menu';
import { useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const location = useLocation();
  const isPublicRoute = ['/', '/login', '/register'].includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      {!isPublicRoute && <Menu />}
      <main className="flex-grow container mx-auto mt-8 px-4">
        {children}
      </main>
      <footer className="bg-gray-200 p-4 mt-8">
        <div className="container mx-auto text-center">
          © 2024 Skill Swapper. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Layout;