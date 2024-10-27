import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:5000/auth/logout');
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-gray-800">
              CollabConnect
            </Link>
          </div>
          <div className="flex items-center">
            {user ? (
              <>
                <span className="mr-4">{user.name}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <a
                href="http://localhost:5000/auth/google"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Login with Google
              </a>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;