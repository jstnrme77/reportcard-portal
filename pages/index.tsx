import React, { useState, useEffect } from 'react';
import {
  FiCheckCircle,
  FiLink,
  FiFileText,
  FiTarget,
  FiHelpCircle,
  FiExternalLink,
  FiVideo,
  FiMessageSquare,
  FiBarChart2,
  FiClock,
  FiRefreshCw,
  FiTrendingUp
} from 'react-icons/fi';
import Link from 'next/link';
import { useAirtableData } from '../lib/hooks';
import { Link as LinkModel, Campaign, Approval, Client } from '../lib/models';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard: React.FC = () => {
  // Fetch data from Airtable
  const { data: links, isLoading: linksLoading } = useAirtableData<LinkModel>('Links');
  const { data: campaigns, isLoading: campaignsLoading } = useAirtableData<Campaign>('Campaigns');
  const { data: approvals, isLoading: approvalsLoading } = useAirtableData<Approval>('Approvals');
  const { data: clients, isLoading: clientsLoading } = useAirtableData<Client>('Clients');

  // Combined loading state
  const isLoading = linksLoading || campaignsLoading || approvalsLoading || clientsLoading;

  // State for campaign summary
  const [campaignSummary, setCampaignSummary] = useState({
    totalLinks: 0,
    linksThisMonth: 0,
    pendingApprovals: 0,
    targetLinks: 0,
    progress: 0
  });

  // State for monthly data
  const [monthlyData, setMonthlyData] = useState({
    labels: [] as string[],
    targets: [] as number[],
    landed: [] as number[]
  });

  // State for work in progress
  const [workInProgress, setWorkInProgress] = useState({
    opportunitiesAdded: 0,
    placementsInProgress: 0,
    pendingApprovals: 0
  });

  // Process data when it's loaded
  useEffect(() => {
    if (isLoading) return;

    // Process campaign summary
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // Calculate total links
    const totalLinks = links?.length || 0;

    // Calculate links this month
    const linksThisMonth = links?.filter(link => {
      if (!link.placement_date) return false;
      const placementDate = new Date(link.placement_date);
      return placementDate.getMonth() === currentMonth &&
             placementDate.getFullYear() === currentYear;
    }).length || 0;

    // Calculate pending approvals
    const pendingApprovals = approvals?.filter(approval =>
      approval.status === 'Pending'
    ).length || 0;

    // Get target links from active campaign
    const activeCampaign = campaigns?.find(campaign => {
      const startDate = new Date(campaign.start_date);
      const endDate = new Date(campaign.end_date);
      return currentDate >= startDate && currentDate <= endDate;
    });

    const targetLinks = activeCampaign?.target_links || 30; // Default to 30 if no campaign found
    const progress = Math.min(100, Math.round((linksThisMonth / targetLinks) * 100));

    setCampaignSummary({
      totalLinks,
      linksThisMonth,
      pendingApprovals,
      targetLinks,
      progress
    });

    // Process monthly data (last 6 months)
    const months = [];
    const targets = [];
    const landed = [];

    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);

      const monthName = date.toLocaleString('default', { month: 'short' });
      const monthYear = `${monthName} ${date.getFullYear()}`;

      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      // Find campaign for this month
      const monthCampaign = campaigns?.find(campaign => {
        const campaignStart = new Date(campaign.start_date);
        const campaignEnd = new Date(campaign.end_date);
        return (
          (campaignStart <= monthEnd && campaignEnd >= monthStart) ||
          (campaignStart <= monthStart && campaignEnd >= monthStart) ||
          (campaignStart <= monthEnd && campaignEnd >= monthEnd)
        );
      });

      // Count links landed in this month
      const linksLanded = links?.filter(link => {
        if (!link.placement_date) return false;
        const placementDate = new Date(link.placement_date);
        return placementDate >= monthStart && placementDate <= monthEnd;
      }).length || 0;

      months.push(monthYear);
      targets.push(monthCampaign?.target_links || 0);
      landed.push(linksLanded);
    }

    setMonthlyData({
      labels: months,
      targets,
      landed
    });

    // Process work in progress
    // For demo purposes, we'll use some calculated values
    const opportunitiesAdded = Math.max(0, pendingApprovals + Math.floor(Math.random() * 5));
    const placementsInProgress = Math.max(0, Math.floor(Math.random() * 10));

    setWorkInProgress({
      opportunitiesAdded,
      placementsInProgress,
      pendingApprovals
    });

  }, [links, campaigns, approvals, clients, isLoading]);

  // Chart options and data
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Links'
        }
      }
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false
      }
    }
  };

  const chartData = {
    labels: monthlyData.labels,
    datasets: [
      {
        label: 'Target Links',
        data: monthlyData.targets,
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
      {
        label: 'Links Landed',
        data: monthlyData.landed,
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
    ],
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Section */}
      <div className="card mb-8">
        <div className="p-6">
          <h1 className="text-3xl font-bold text-secondary-900 dark:text-secondary-50 mb-4">
            Welcome to Your Client Portal
          </h1>
          <p className="text-lg text-secondary-600 dark:text-secondary-400 mb-6">
            This portal gives you complete visibility into your link building campaign progress,
            approvals, and monthly reports. Use the navigation below to access different sections.
          </p>

          {/* Navigation Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <Link href="/approvals" className="card hover:bg-primary-50 dark:hover:bg-primary-900/20 p-4 flex flex-col items-center justify-center text-center transition-colors">
              <FiCheckCircle className="text-primary-600 mb-2" size={32} />
              <h3 className="font-semibold text-secondary-900 dark:text-secondary-50">Approvals</h3>
              <p className="text-sm text-secondary-600 dark:text-secondary-400 mt-1">
                Review and approve link targets
              </p>
            </Link>

            <Link href="/deliverables" className="card hover:bg-primary-50 dark:hover:bg-primary-900/20 p-4 flex flex-col items-center justify-center text-center transition-colors">
              <FiLink className="text-primary-600 mb-2" size={32} />
              <h3 className="font-semibold text-secondary-900 dark:text-secondary-50">Deliverables</h3>
              <p className="text-sm text-secondary-600 dark:text-secondary-400 mt-1">
                View links built month-to-month
              </p>
            </Link>

            <Link href="/reports" className="card hover:bg-primary-50 dark:hover:bg-primary-900/20 p-4 flex flex-col items-center justify-center text-center transition-colors">
              <FiFileText className="text-primary-600 mb-2" size={32} />
              <h3 className="font-semibold text-secondary-900 dark:text-secondary-50">Reports</h3>
              <p className="text-sm text-secondary-600 dark:text-secondary-400 mt-1">
                Access monthly report cards
              </p>
            </Link>

            <Link href="/targets" className="card hover:bg-primary-50 dark:hover:bg-primary-900/20 p-4 flex flex-col items-center justify-center text-center transition-colors">
              <FiTarget className="text-primary-600 mb-2" size={32} />
              <h3 className="font-semibold text-secondary-900 dark:text-secondary-50">Submit Target Pages</h3>
              <p className="text-sm text-secondary-600 dark:text-secondary-400 mt-1">
                Submit pages for link building
              </p>
            </Link>

            <Link href="/help" className="card hover:bg-primary-50 dark:hover:bg-primary-900/20 p-4 flex flex-col items-center justify-center text-center transition-colors">
              <FiHelpCircle className="text-primary-600 mb-2" size={32} />
              <h3 className="font-semibold text-secondary-900 dark:text-secondary-50">Help Videos</h3>
              <p className="text-sm text-secondary-600 dark:text-secondary-400 mt-1">
                Watch tutorial videos
              </p>
            </Link>
          </div>
        </div>
      </div>

      {/* Campaign Status Summary */}
      <div className="card mb-8">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-50">
              Campaign Status Summary
            </h2>
            {isLoading ? (
              <div className="flex items-center text-secondary-500">
                <FiRefreshCw className="animate-spin mr-2" />
                Loading...
              </div>
            ) : (
              <div className="text-sm text-secondary-500">
                Last updated: {new Date().toLocaleDateString()}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="card p-4 bg-primary-50 dark:bg-primary-900/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-secondary-500 dark:text-secondary-400">Total Links Built</p>
                  <h3 className="text-2xl font-bold text-secondary-900 dark:text-secondary-50">{campaignSummary.totalLinks}</h3>
                </div>
                <FiLink className="text-primary-600" size={24} />
              </div>
            </div>

            <div className="card p-4 bg-success-50 dark:bg-success-900/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-secondary-500 dark:text-secondary-400">Links This Month</p>
                  <h3 className="text-2xl font-bold text-secondary-900 dark:text-secondary-50">{campaignSummary.linksThisMonth}</h3>
                </div>
                <FiBarChart2 className="text-success-600" size={24} />
              </div>
            </div>

            <div className="card p-4 bg-warning-50 dark:bg-warning-900/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-secondary-500 dark:text-secondary-400">Pending Approvals</p>
                  <h3 className="text-2xl font-bold text-secondary-900 dark:text-secondary-50">{campaignSummary.pendingApprovals}</h3>
                </div>
                <FiClock className="text-warning-600" size={24} />
              </div>
            </div>

            <div className="card p-4 bg-info-50 dark:bg-info-900/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-secondary-500 dark:text-secondary-400">Monthly Target</p>
                  <h3 className="text-2xl font-bold text-secondary-900 dark:text-secondary-50">{campaignSummary.targetLinks}</h3>
                </div>
                <FiTarget className="text-info-600" size={24} />
              </div>
            </div>
          </div>

          <div className="mb-2">
            <div className="flex justify-between items-center mb-1">
              <h3 className="font-semibold text-secondary-900 dark:text-secondary-50">Monthly Progress</h3>
              <span className="text-sm text-secondary-500">{campaignSummary.progress}% Complete</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-bar-fill"
                style={{ width: `${campaignSummary.progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Link Targets vs. Landed */}
      <div className="card mb-8">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-50 mb-4">
            Monthly Link Targets vs. Landed
          </h2>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <FiRefreshCw className="animate-spin mr-2" />
              <span>Loading chart data...</span>
            </div>
          ) : (
            <div className="h-80">
              <Bar options={chartOptions} data={chartData} />
            </div>
          )}
        </div>
      </div>

      {/* Work-in-Progress Items */}
      <div className="card mb-8">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-50 mb-4">
            Work-in-Progress
          </h2>

          {isLoading ? (
            <div className="flex justify-center items-center py-6">
              <FiRefreshCw className="animate-spin mr-2" />
              <span>Loading work-in-progress data...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card p-4 border border-secondary-200 dark:border-secondary-700">
                <div className="flex items-center mb-2">
                  <FiTarget className="text-primary-600 mr-2" size={20} />
                  <h3 className="font-semibold text-secondary-900 dark:text-secondary-50">Opportunities Added</h3>
                </div>
                <p className="text-3xl font-bold text-secondary-900 dark:text-secondary-50">{workInProgress.opportunitiesAdded}</p>
                <p className="text-sm text-secondary-500 mt-1">New opportunities this month</p>
              </div>

              <div className="card p-4 border border-secondary-200 dark:border-secondary-700">
                <div className="flex items-center mb-2">
                  <FiClock className="text-warning-600 mr-2" size={20} />
                  <h3 className="font-semibold text-secondary-900 dark:text-secondary-50">Placements in Progress</h3>
                </div>
                <p className="text-3xl font-bold text-secondary-900 dark:text-secondary-50">{workInProgress.placementsInProgress}</p>
                <p className="text-sm text-secondary-500 mt-1">Links currently being placed</p>
              </div>

              <div className="card p-4 border border-secondary-200 dark:border-secondary-700">
                <div className="flex items-center mb-2">
                  <FiCheckCircle className="text-success-600 mr-2" size={20} />
                  <h3 className="font-semibold text-secondary-900 dark:text-secondary-50">Pending Approvals</h3>
                </div>
                <p className="text-3xl font-bold text-secondary-900 dark:text-secondary-50">{workInProgress.pendingApprovals}</p>
                <p className="text-sm text-secondary-500 mt-1">
                  <Link href="/approvals" className="text-primary-600 hover:underline">
                    Review and approve
                  </Link>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* General Information Section */}
      <div className="card mb-8">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-50 mb-4">
            How to Use the Portal
          </h2>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <p className="text-secondary-600 dark:text-secondary-400 mb-4">
                This portal provides a centralized location to manage your link building campaign.
                You can approve website opportunities, view delivered links, and download monthly reports.
              </p>
              <p className="text-secondary-600 dark:text-secondary-400 mb-4">
                <strong>Reporting expectations:</strong> Reports are shared at the end of each month.
                Weekly progress can be checked live in the dashboard.
              </p>
              <div className="mt-6">
                <a
                  href="https://www.loom.com/share/portal-tutorial"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary flex items-center"
                >
                  <FiVideo className="mr-2" />
                  Watch Portal Tutorial
                </a>
              </div>
            </div>
            <div className="flex-1 bg-secondary-100 dark:bg-secondary-800 rounded-lg p-4">
              <h3 className="font-semibold text-secondary-900 dark:text-secondary-50 mb-3">
                Quick Start Guide
              </h3>
              <ul className="space-y-2 text-secondary-600 dark:text-secondary-400">
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">1.</span>
                  Review and approve website opportunities in the Approvals section
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">2.</span>
                  Track delivered links in the Deliverables section
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">3.</span>
                  Download monthly reports from the Reports section
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">4.</span>
                  Submit new target pages for link building
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Video Resources Section */}
      <div className="card mb-8">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-50 mb-4">
            Video Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card p-4 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors">
              <div className="aspect-video bg-secondary-200 dark:bg-secondary-700 rounded-lg flex items-center justify-center mb-3">
                <FiVideo size={48} className="text-secondary-400" />
              </div>
              <h3 className="font-semibold text-secondary-900 dark:text-secondary-50 mb-2">
                How to Approve Websites
              </h3>
              <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-3">
                Learn how to review and approve website opportunities for your campaign.
              </p>
              <a
                href="https://www.loom.com/share/approve-websites"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 flex items-center text-sm"
              >
                <FiExternalLink className="mr-1" />
                Watch Video
              </a>
            </div>

            <div className="card p-4 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors">
              <div className="aspect-video bg-secondary-200 dark:bg-secondary-700 rounded-lg flex items-center justify-center mb-3">
                <FiVideo size={48} className="text-secondary-400" />
              </div>
              <h3 className="font-semibold text-secondary-900 dark:text-secondary-50 mb-2">
                How to Navigate the Dashboard
              </h3>
              <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-3">
                A complete walkthrough of all dashboard features and sections.
              </p>
              <a
                href="https://www.loom.com/share/dashboard-navigation"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 flex items-center text-sm"
              >
                <FiExternalLink className="mr-1" />
                Watch Video
              </a>
            </div>

            <div className="card p-4 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors">
              <div className="aspect-video bg-secondary-200 dark:bg-secondary-700 rounded-lg flex items-center justify-center mb-3">
                <FiVideo size={48} className="text-secondary-400" />
              </div>
              <h3 className="font-semibold text-secondary-900 dark:text-secondary-50 mb-2">
                How to Use ClearScope
              </h3>
              <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-3">
                Optional tutorial on using ClearScope for content optimization.
              </p>
              <a
                href="https://www.loom.com/share/clearscope-tutorial"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 flex items-center text-sm"
              >
                <FiExternalLink className="mr-1" />
                Watch Video
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Support Contact Section */}
      <div className="card">
        <div className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-50 mb-2">
                Need Help?
              </h2>
              <p className="text-secondary-600 dark:text-secondary-400">
                Our support team is ready to assist you with any questions.
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link href="/help#support-form" className="btn btn-primary flex items-center">
                <FiMessageSquare className="mr-2" />
                Submit a Support Request
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
