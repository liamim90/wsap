import React from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../../stores/authStore';
import { Button } from '../Button';
import { Typography } from '../Typography';

const Header: React.FC = () => {
  const { isAuthenticated, logout } = useAuthStore();

  return (
    <header className="bg-white shadow-sm">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to="/">
              <Typography variant="h5" weight="bold" className="text-gray-800">
                WSAP
              </Typography>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard">
                    <Button variant="ghost">Dashboard</Button>
                  </Link>
                  <Button variant="ghost" onClick={logout}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost">Login</Button>
                  </Link>
                  <Link to="/signup">
                    <Button variant="primary">Sign Up</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header; 