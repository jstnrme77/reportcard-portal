import React, { useState, useEffect } from 'react';
import { FiPlus, FiArrowRight, FiTrendingUp, FiRefreshCw, FiInfo, FiChevronDown, FiChevronUp, FiCheckCircle, FiAlertCircle, FiClock } from 'react-icons/fi';
import Link from 'next/link';
import { useAirtableData } from '../lib/hooks';
import { Opportunity, Campaign, Link as LinkModel, Client } from '../lib/models';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard: React.FC = () => {
  // Fetch data from Airtable
  const { data: opportunities, isLoading: opportunitiesLoading, error: opportunitiesError, refetch: refetchOpportunities } = useAirtableData<Opportunity>('Opportunities');
  const { data: campaigns, isLoading: campaignsLoading, error: campaignsError } = useAirtableData<Campaign>('Campaigns');
  const { data: links, isLoading: linksLoading, error: linksError } = useAirtableData<LinkModel>('Links');
  const { data: clients, isLoading: clientsLoading, error: clientsError } = useAirtableData<Client>('Clients');

  // Combined loading and error states
  const isLoading = opportunitiesLoading || campaignsLoading || linksLoading || clientsLoading;
  const error = opportunitiesError || campaignsError || linksError || clientsError;

  // State for welcome guide visibility
  const [showGuide, setShowGuide] = useState(false);

  // Dashboard statistics
  const [stats, setStats] = useState({
    totalOpportunities: 0,
    wonDeals: 0,
    totalDealValue: 0,
    recentlyAdded: 0,
    inProgress: 0,
    totalLinks: 0,
    totalTargetLinks: 0,
    activeCampaigns: 0,
    completedCampaigns: 0,
    pendingCampaigns: 0,
  });

  // Campaign status summary
  const [campaignStatuses, setCampaignStatuses] = useState<{
    name: string;
    status: 'active' | 'completed' | 'pending';
    progress: number;
    target: number;
    achieved: number;
  }[]>([]);

  // Monthly link data for chart
  const [monthlyLinkData, setMonthlyLinkData] = useState<{
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string;
    }[];
  }>({
    labels: [],
    datasets: [
      {
        label: 'Target Links',
        data: [],
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
      {
        label: 'Links Landed',
        data: [],
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
    ],
  });

  // Calculate statistics from data
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

      // Calculate campaign statistics
      let activeCampaigns = 0;
      let completedCampaigns = 0;
      let pendingCampaigns = 0;
      let totalTargetLinks = 0;

      if (campaigns && campaigns.length > 0) {
        const now = new Date();

        // Process campaign statuses
        const campaignStatusData = campaigns.map(campaign => {
          const startDate = new Date(campaign.start_date);
          const endDate = new Date(campaign.end_date);

          let status: 'active' | 'completed' | 'pending' = 'pending';
          if (now > endDate) {
            status = 'completed';
            completedCampaigns++;
          } else if (now >= startDate) {
            status = 'active';
            activeCampaigns++;
          } else {
            pendingCampaigns++;
          }

          // Count target links
          totalTargetLinks += campaign.target_links || 0;

          // Calculate achieved links for this campaign
          const achievedLinks = links ?
            links.filter(link => link.campaign_id === campaign.id).length : 0;

          // Calculate progress percentage
          const progress = campaign.target_links ?
            Math.min(Math.round((achievedLinks / campaign.target_links) * 100), 100) : 0;

          return {
            name: campaign.name,
            status,
            progress,
            target: campaign.target_links || 0,
            achieved: achievedLinks
          };
        });

        setCampaignStatuses(campaignStatusData);
      }

      // Calculate total links
      const totalLinks = links ? links.length : 0;

      // Update all stats
      setStats({
        totalOpportunities,
        wonDeals,
        totalDealValue,
        recentlyAdded,
        inProgress,
        totalLinks,
        totalTargetLinks,
        activeCampaigns,
        completedCampaigns,
        pendingCampaigns,
      });

      // Prepare monthly link data for chart
      if (links && links.length > 0 && campaigns && campaigns.length > 0) {
        // Get last 6 months
        const months = [];
        const targetData = [];
        const achievedData = [];

        for (let i = 5; i >= 0; i--) {
          const date = new Date();
          date.setMonth(date.getMonth() - i);

          const monthName = date.toLocaleString('default', { month: 'short' });
          const year = date.getFullYear();
          const monthLabel = `${monthName} ${year}`;

          months.push(monthLabel);

          // Calculate target for this month
          const monthTargets = campaigns
            .filter(campaign => {
              const campaignStart = new Date(campaign.start_date);
              const campaignEnd = new Date(campaign.end_date);
              return date >= campaignStart && date <= campaignEnd;
            })
            .reduce((sum, campaign) => {
              // Distribute target evenly across campaign months
              const campaignStart = new Date(campaign.start_date);
              const campaignEnd = new Date(campaign.end_date);
              const campaignMonths = (
                (campaignEnd.getFullYear() - campaignStart.getFullYear()) * 12 +
                campaignEnd.getMonth() - campaignStart.getMonth() + 1
              );
              return sum + (campaign.target_links / campaignMonths);
            }, 0);

          // Calculate achieved for this month
          const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
          const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

          const monthAchieved = links.filter(link => {
            if (!link.placement_date) return false;
            const placementDate = new Date(link.placement_date);
            return placementDate >= monthStart && placementDate <= monthEnd;
          }).length;

          targetData.push(Math.round(monthTargets));
          achievedData.push(monthAchieved);
        }

        setMonthlyLinkData({
          labels: months,
          datasets: [
            {
              label: 'Target Links',
              data: targetData,
              backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
            {
              label: 'Links Landed',
              data: achievedData,
              backgroundColor: 'rgba(75, 192, 192, 0.5)',
            },
          ],
        });
      }
    }
  }, [opportunities, campaigns, links]);

  // Calculate progress percentage for overall link target
  const progressData = {
    target: stats.totalTargetLinks,
    achieved: stats.totalLinks,
    percentage: stats.totalTargetLinks > 0
      ? Math.min(Math.round((stats.totalLinks / stats.totalTargetLinks) * 100), 100)
      : 0,
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
            onClick={() => refetchOpportunities()}
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

      {/* Welcome Section */}
      <div className="card bg-primary-50 border-primary-100 dark:bg-primary-900/20 dark:border-primary-800/30">
        <div className="flex justify-between items-start">
          <div className="flex items-start">
            <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-800/50 flex items-center justify-center text-primary-600 dark:text-primary-400 mr-4 flex-shrink-0">
              <FiInfo className="text-xl" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-primary-800 dark:text-primary-300 mb-1">Welcome to your Campaign Dashboard</h2>
              <p className="text-sm text-primary-700 dark:text-primary-400">
                Track your campaign performance, monitor link targets, and manage your opportunities all in one place.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowGuide(!showGuide)}
            className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 flex items-center text-sm font-medium"
          >
            {showGuide ? 'Hide Guide' : 'How to use'}
            {showGuide ? <FiChevronUp className="ml-1" /> : <FiChevronDown className="ml-1" />}
          </button>
        </div>

        {showGuide && (
          <div className="mt-4 pt-4 border-t border-primary-100 dark:border-primary-800/30">
            <h3 className="font-medium text-primary-800 dark:text-primary-300 mb-2">How to use this dashboard:</h3>
            <ul className="space-y-2 text-sm text-primary-700 dark:text-primary-400">
              <li className="flex items-start">
                <span className="mr-2">1.</span>
                <span>View your campaign status summary to track active, completed, and pending campaigns.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">2.</span>
                <span>Monitor your monthly link targets vs. actual links landed in the chart below.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">3.</span>
                <span>Check work-in-progress items to see recently added opportunities and placements in progress.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">4.</span>
                <span>Use the navigation menu to access detailed reports, approvals, and live link data.</span>
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Campaign Status Summary */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Campaign Status Summary</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="flex items-center p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
            <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-800 flex items-center justify-center text-primary-600 dark:text-primary-400 mr-3">
              <FiClock />
            </div>
            <div>
              <div className="text-sm text-primary-700 dark:text-primary-400">Active Campaigns</div>
              <div className="text-xl font-bold text-primary-800 dark:text-primary-300">{stats.activeCampaigns}</div>
            </div>
          </div>

          <div className="flex items-center p-3 bg-success-50 dark:bg-success-900/20 rounded-lg">
            <div className="w-10 h-10 rounded-full bg-success-100 dark:bg-success-800 flex items-center justify-center text-success-600 dark:text-success-400 mr-3">
              <FiCheckCircle />
            </div>
            <div>
              <div className="text-sm text-success-700 dark:text-success-400">Completed</div>
              <div className="text-xl font-bold text-success-800 dark:text-success-300">{stats.completedCampaigns}</div>
            </div>
          </div>

          <div className="flex items-center p-3 bg-secondary-50 dark:bg-secondary-800/40 rounded-lg">
            <div className="w-10 h-10 rounded-full bg-secondary-100 dark:bg-secondary-700 flex items-center justify-center text-secondary-600 dark:text-secondary-400 mr-3">
              <FiAlertCircle />
            </div>
            <div>
              <div className="text-sm text-secondary-700 dark:text-secondary-400">Pending</div>
              <div className="text-xl font-bold text-secondary-800 dark:text-secondary-300">{stats.pendingCampaigns}</div>
            </div>
          </div>
        </div>

        {campaignStatuses.length > 0 ? (
          <div className="space-y-4">
            {campaignStatuses.slice(0, 3).map((campaign, index) => (
              <div key={index} className="border border-secondary-200 dark:border-secondary-700 rounded-lg p-3">
                <div className="flex justify-between items-center mb-2">
                  <div className="font-medium">{campaign.name}</div>
                  <div className={`text-sm px-2 py-0.5 rounded-full ${
                    campaign.status === 'active' ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400' :
                    campaign.status === 'completed' ? 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400' :
                    'bg-secondary-100 text-secondary-700 dark:bg-secondary-800 dark:text-secondary-400'
                  }`}>
                    {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                  </div>
                </div>
                <div className="flex justify-between text-sm text-secondary-600 dark:text-secondary-400 mb-1.5">
                  <span>{campaign.achieved} of {campaign.target} links</span>
                  <span>{campaign.progress}%</span>
                </div>
                <div className="progress-bar">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      campaign.status === 'completed' ? 'bg-success-600' : 'bg-primary-600'
                    }`}
                    style={{ width: `${campaign.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}

            {campaignStatuses.length > 3 && (
              <Link href="/live-links" className="text-sm text-primary-600 hover:text-primary-700 flex items-center justify-center mt-2">
                View all campaigns
                <FiArrowRight className="ml-1" />
              </Link>
            )}
          </div>
        ) : (
          <div className="text-center py-6 text-secondary-500 dark:text-secondary-400">
            No active campaigns found. Add a campaign to get started.
          </div>
        )}
      </div>

      {/* Monthly Link Target vs. Links Landed */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Monthly Link Target vs. Links Landed</h2>

        <div className="h-64">
          {monthlyLinkData.labels.length > 0 ? (
            <Bar
              data={monthlyLinkData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  tooltip: {
                    mode: 'index',
                    intersect: false,
                  },
                },
                scales: {
                  x: {
                    grid: {
                      display: false,
                    },
                  },
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Number of Links',
                    },
                  },
                },
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-secondary-500 dark:text-secondary-400">
              No link data available. Add links to see the chart.
            </div>
          )}
        </div>
      </div>

      {/* Overall Progress Section */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Overall Link Target Progress</h2>
        <div className="mb-2 flex justify-between items-center">
          <span className="text-sm text-secondary-600 dark:text-secondary-400">
            {progressData.achieved} of {progressData.target} links placed
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

      {/* Work in Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Opportunities Added</h2>
            <span className="text-2xl font-bold text-primary-600">{opportunitySummary.added}</span>
          </div>
          <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-4">
            New opportunities added in the last 30 days
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
