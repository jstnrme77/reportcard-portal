import React, { useState } from 'react';
import { FiSave, FiBell, FiMoon, FiSun } from 'react-icons/fi';

const Settings: React.FC = () => {
  // Mock settings state
  const [settings, setSettings] = useState({
    notifications: {
      emailAlerts: true,
      appNotifications: true,
      weeklyDigest: false,
    },
    display: {
      darkMode: false,
      compactView: false,
    },
    account: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'Account Manager',
    }
  });

  // Handle toggle change
  const handleToggleChange = (category: string, setting: string) => {
    setSettings({
      ...settings,
      [category]: {
        ...settings[category as keyof typeof settings],
        [setting]: !settings[category as keyof typeof settings][setting as any],
      },
    });
  };

  // Handle save settings
  const handleSaveSettings = () => {
    // In a real app, this would save to a database
    alert('Settings saved successfully!');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-secondary-50">Settings</h1>
        
        <div className="mt-4 md:mt-0">
          <button 
            onClick={handleSaveSettings}
            className="btn btn-primary flex items-center"
          >
            <FiSave className="mr-2" />
            Save Settings
          </button>
        </div>
      </div>

      {/* Account Settings */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Account Information</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
              Name
            </label>
            <input
              type="text"
              className="w-full p-2 border border-secondary-300 dark:border-secondary-600 rounded-md bg-white dark:bg-secondary-800"
              value={settings.account.name}
              onChange={(e) => setSettings({
                ...settings,
                account: {
                  ...settings.account,
                  name: e.target.value
                }
              })}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full p-2 border border-secondary-300 dark:border-secondary-600 rounded-md bg-white dark:bg-secondary-800"
              value={settings.account.email}
              onChange={(e) => setSettings({
                ...settings,
                account: {
                  ...settings.account,
                  email: e.target.value
                }
              })}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
              Role
            </label>
            <input
              type="text"
              className="w-full p-2 border border-secondary-300 dark:border-secondary-600 rounded-md bg-white dark:bg-secondary-800 bg-gray-100 dark:bg-secondary-700"
              value={settings.account.role}
              disabled
            />
            <p className="text-xs text-secondary-500 mt-1">Role cannot be changed. Contact an administrator for role changes.</p>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Notification Preferences</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FiBell className="text-secondary-600 dark:text-secondary-400 mr-3" />
              <div>
                <p className="font-medium text-secondary-900 dark:text-secondary-50">Email Alerts</p>
                <p className="text-sm text-secondary-500 dark:text-secondary-400">Receive important updates via email</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={settings.notifications.emailAlerts}
                onChange={() => handleToggleChange('notifications', 'emailAlerts')}
              />
              <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none rounded-full peer dark:bg-secondary-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FiBell className="text-secondary-600 dark:text-secondary-400 mr-3" />
              <div>
                <p className="font-medium text-secondary-900 dark:text-secondary-50">App Notifications</p>
                <p className="text-sm text-secondary-500 dark:text-secondary-400">Receive in-app notifications</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={settings.notifications.appNotifications}
                onChange={() => handleToggleChange('notifications', 'appNotifications')}
              />
              <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none rounded-full peer dark:bg-secondary-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FiBell className="text-secondary-600 dark:text-secondary-400 mr-3" />
              <div>
                <p className="font-medium text-secondary-900 dark:text-secondary-50">Weekly Digest</p>
                <p className="text-sm text-secondary-500 dark:text-secondary-400">Receive a weekly summary of activities</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={settings.notifications.weeklyDigest}
                onChange={() => handleToggleChange('notifications', 'weeklyDigest')}
              />
              <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none rounded-full peer dark:bg-secondary-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Display Settings */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Display Preferences</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {settings.display.darkMode ? (
                <FiMoon className="text-secondary-600 dark:text-secondary-400 mr-3" />
              ) : (
                <FiSun className="text-secondary-600 dark:text-secondary-400 mr-3" />
              )}
              <div>
                <p className="font-medium text-secondary-900 dark:text-secondary-50">Dark Mode</p>
                <p className="text-sm text-secondary-500 dark:text-secondary-400">Toggle between light and dark theme</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={settings.display.darkMode}
                onChange={() => handleToggleChange('display', 'darkMode')}
              />
              <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none rounded-full peer dark:bg-secondary-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-secondary-600 dark:text-secondary-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
              <div>
                <p className="font-medium text-secondary-900 dark:text-secondary-50">Compact View</p>
                <p className="text-sm text-secondary-500 dark:text-secondary-400">Reduce spacing for more content</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={settings.display.compactView}
                onChange={() => handleToggleChange('display', 'compactView')}
              />
              <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none rounded-full peer dark:bg-secondary-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
