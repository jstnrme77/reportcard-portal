import React, { useState, useEffect } from 'react';
import { FiPlus, FiArrowRight, FiTrendingUp, FiRefreshCw } from 'react-icons/fi';
import Link from 'next/link';
import { useAirtableData } from '../lib/hooks';
import { Opportunity } from '../lib/models';

const Dashboard: React.FC = () => {
  // Fetch opportunities from Airtable
  const { data: opportunities, isLoading, error, refetch } = useAirtableData<Opportunity>('Opportunities');

  // Dashboard statistics
  const [stats, setStats] = useState({
    totalOpportunities: 0,
    wonDeals: 0,
    totalDealValue: 0,
    recentlyAdded: 0,
    inProgress: 0,
  });

  // Calculate statistics from opportunities data
  useEffect(() => {
    if (opportunities && opportunities.length > 0) {
      // Count total opportunities
      const totalOpportunities = opportunities.length;

      // Count won deals
      const wonDeals = opportunities.filter(opp => opp['Is Deal Won?'] === 1).length;

      // Calculate total deal value
      const totalDealValue = opportunities.reduce((sum, opp) => sum + (opp['Deal Value'] || 0), 0);

      // Count recently added (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const recentlyAdded = opportunities.filter(opp => {
        if (!opp['Created Date']) return false;
        const createdDate = new Date(opp['Created Date']);
        return createdDate >= thirtyDaysAgo;
      }).length;

      // Count in progress (not won or lost)
      const inProgress = opportunities.filter(opp =>
        opp.Status !== 'Lost' && opp['Is Deal Won?'] !== 1
      ).length;

      setStats({
        totalOpportunities,
        wonDeals,
        totalDealValue,
        recentlyAdded,
        inProgress,
      });
    }
  }, [opportunities]);

  // Calculate progress percentage
  const progressData = {
    target: 50, // You can set this to a target from your data
    achieved: stats.wonDeals,
    percentage: Math.min(Math.round((stats.wonDeals / 50) * 100), 100),
  };

  const opportunitySummary = {
    added: stats.recentlyAdded,
    inProgress: stats.inProgress,
  };

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-secondary-50">Dashboard</h1>
        <div className="mt-4 md:mt-0 flex space-x-3">
          <button
            onClick={() => refetch()}
            className="btn btn-secondary flex items-center"
            disabled={isLoading}
          >
            <FiRefreshCw className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Loading...' : 'Refresh'}
          </button>
          <Link href="/live-links" className="btn btn-primary flex items-center">
            <FiPlus className="mr-2" />
            Add Opportunity
          </Link>
        </div>
      </div>

      {error && (
        <div className="card bg-danger-50 border-danger-200 text-danger-700">
          <p>Error loading data from Airtable. Please check your connection.</p>
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="card">
          <h2 className="text-lg font-semibold mb-2">Total Opportunities</h2>
          <div className="text-3xl font-bold text-primary-600">{stats.totalOpportunities}</div>
          <p className="text-sm text-secondary-600 dark:text-secondary-400 mt-2">
            Total opportunities in your pipeline
          </p>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-2">Won Deals</h2>
          <div className="text-3xl font-bold text-success-700">{stats.wonDeals}</div>
          <p className="text-sm text-secondary-600 dark:text-secondary-400 mt-2">
            Successfully closed deals
          </p>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-2">Total Deal Value</h2>
          <div className="text-3xl font-bold text-primary-600">${stats.totalDealValue.toLocaleString()}</div>
          <p className="text-sm text-secondary-600 dark:text-secondary-400 mt-2">
            Combined value of all opportunities
          </p>
        </div>
      </div>

      {/* Progress Section */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Monthly Deal Target</h2>
        <div className="mb-2 flex justify-between items-center">
          <span className="text-sm text-secondary-600 dark:text-secondary-400">
            {progressData.achieved} of {progressData.target} deals won
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
          <Link href="/live-links" className="text-sm text-primary-600 hover:text-primary-700 flex items-center">
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
          <Link href="/live-links" className="text-sm text-primary-600 hover:text-primary-700 flex items-center">
            View in-progress opportunities
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
