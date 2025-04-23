import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  FiHome,
  FiCheckCircle,
  FiLink,
  FiFileText,
  FiSettings,
  FiMenu,
  FiX,
  FiDatabase
} from 'react-icons/fi';

const Sidebar: React.FC = () => {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: FiHome },
    { name: 'Approvals', href: '/approvals', icon: FiCheckCircle },
    { name: 'Live Links', href: '/live-links', icon: FiLink },
    { name: 'Reports', href: '/reports', icon: FiFileText },
    { name: 'Settings', href: '/settings', icon: FiSettings },
  ];

  const isActive = (path: string) => {
    return router.pathname === path;
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-20">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-md bg-white dark:bg-secondary-800 shadow-md"
        >
          {isMobileMenuOpen ? (
            <FiX size={24} className="text-secondary-900 dark:text-secondary-50" />
          ) : (
            <FiMenu size={24} className="text-secondary-900 dark:text-secondary-50" />
          )}
        </button>
      </div>

      {/* Mobile sidebar */}
      <div
        className={`md:hidden fixed inset-0 z-10 bg-secondary-900 bg-opacity-50 transition-opacity duration-300 ${
          isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      <aside
        className={`w-64 bg-white dark:bg-secondary-800 border-r border-secondary-200 dark:border-secondary-700 flex-shrink-0 flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed md:static inset-y-0 left-0 z-10`}
      >
        <div className="p-6">
          <h2 className="text-2xl font-bold text-primary-600">ReportCard</h2>
        </div>

        <nav className="flex-1 px-4 pb-4 space-y-1">
          {navigation.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400'
                    : 'text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-700'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <item.icon
                  className={`mr-3 h-5 w-5 ${
                    active ? 'text-primary-600 dark:text-primary-400' : 'text-secondary-500 dark:text-secondary-400'
                  }`}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-secondary-200 dark:border-secondary-700 space-y-4">
          {/* Airtable Connection Status */}
          <Link
            href="/settings"
            className="flex items-center px-3 py-2 text-xs rounded-md bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/30"
          >
            <FiDatabase className="mr-2 h-4 w-4" />
            <span>Airtable Connected</span>
          </Link>

          {/* User Profile */}
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white">
              <span className="text-sm font-medium">JD</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-secondary-900 dark:text-secondary-50">John Doe</p>
              <p className="text-xs text-secondary-500 dark:text-secondary-400">Account Manager</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
