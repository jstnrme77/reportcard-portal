import React from 'react';
import Link from 'next/link';
import { FiHelpCircle, FiBell, FiUser } from 'react-icons/fi';

const Header: React.FC = () => {
  return (
    <header className="bg-white dark:bg-secondary-800 border-b border-secondary-200 dark:border-secondary-700 py-4 px-6 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-semibold text-secondary-900 dark:text-secondary-50">
          Welcome, <span className="text-primary-600">John</span>
        </h1>
        <Link 
          href="/help" 
          className="text-sm text-primary-600 hover:text-primary-700 flex items-center mt-1"
        >
          <FiHelpCircle className="mr-1" size={14} />
          How to use this portal
        </Link>
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-full hover:bg-secondary-100 dark:hover:bg-secondary-700">
          <FiBell size={20} className="text-secondary-600 dark:text-secondary-400" />
        </button>
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white">
            <FiUser size={16} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
