import React from 'react';
import { 
  FiCheckCircle, 
  FiLink, 
  FiFileText, 
  FiTarget, 
  FiHelpCircle,
  FiExternalLink,
  FiVideo,
  FiMessageSquare
} from 'react-icons/fi';
import Link from 'next/link';

const Dashboard: React.FC = () => {
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
