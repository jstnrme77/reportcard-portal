import React from 'react';
import { FiPlus, FiArrowRight, FiTrendingUp } from 'react-icons/fi';
import Link from 'next/link';

const Dashboard: React.FC = () => {
  // Mock data for the dashboard
  const progressData = {
    target: 50,
    achieved: 32,
    percentage: 64,
  };

  const opportunitySummary = {
    added: 28,
    inProgress: 15,
  };

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-secondary-50">Dashboard</h1>
        <div className="mt-4 md:mt-0 flex space-x-3">
          <button className="btn btn-primary flex items-center">
            <FiPlus className="mr-2" />
            Add Opportunity
          </button>
        </div>
      </div>

      {/* Progress Section */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Monthly Link Target</h2>
        <div className="mb-2 flex justify-between items-center">
          <span className="text-sm text-secondary-600 dark:text-secondary-400">
            {progressData.achieved} of {progressData.target} links landed
          </span>
          <span className="text-sm font-medium text-primary-600">
            {progressData.percentage}%
          </span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-bar-fill" 
            style={{ width: `${progressData.percentage}%` }}
          ></div>
        </div>
      </div>

      {/* Opportunity Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Opportunities Added</h2>
            <span className="text-2xl font-bold text-primary-600">{opportunitySummary.added}</span>
          </div>
          <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-4">
            New opportunities added this month
          </p>
          <Link href="/opportunities" className="text-sm text-primary-600 hover:text-primary-700 flex items-center">
            View all opportunities
            <FiArrowRight className="ml-1" />
          </Link>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Placements In Progress</h2>
            <span className="text-2xl font-bold text-primary-600">{opportunitySummary.inProgress}</span>
          </div>
          <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-4">
            Placements currently in progress
          </p>
          <Link href="/placements" className="text-sm text-primary-600 hover:text-primary-700 flex items-center">
            View all placements
            <FiArrowRight className="ml-1" />
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex items-start pb-4 border-b border-secondary-200 dark:border-secondary-700 last:border-0 last:pb-0">
              <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center text-primary-600 mr-3 flex-shrink-0">
                <FiTrendingUp />
              </div>
              <div>
                <p className="text-sm font-medium text-secondary-900 dark:text-secondary-50">
                  New link placement confirmed
                </p>
                <p className="text-xs text-secondary-600 dark:text-secondary-400 mt-1">
                  example.com - "anchor text example"
                </p>
                <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-1">
                  2 hours ago
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
