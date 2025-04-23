import React from 'react';
import Link from 'next/link';
import { FiArrowLeft, FiHelpCircle, FiLink, FiCheckCircle, FiFileText } from 'react-icons/fi';

const Help: React.FC = () => {
  const helpSections = [
    {
      title: 'Dashboard Overview',
      icon: FiHelpCircle,
      content: 'The dashboard provides a quick overview of your link building progress, including monthly targets, opportunities added, and placements in progress. Use the progress bar to track your monthly link target achievement.'
    },
    {
      title: 'Managing Approvals',
      icon: FiCheckCircle,
      content: 'The Approvals section allows you to track websites awaiting client approval. You can approve websites directly or provide feedback. Use the status filter to quickly find pending, approved, or rejected websites.'
    },
    {
      title: 'Live Link Reports',
      icon: FiLink,
      content: 'The Live Link Report provides detailed information about all your active links. Use the filters to narrow down results by month, campaign, or content type. You can also toggle between reserved and recycled opportunities.'
    },
    {
      title: 'Reporting History',
      icon: FiFileText,
      content: 'The Reporting History section stores all your monthly reports. You can upload new reports, download existing ones, and add commentary notes. Filter reports by month or service type to find what you need quickly.'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <Link href="/" className="flex items-center text-primary-600 hover:text-primary-700">
          <FiArrowLeft className="mr-2" />
          Back to Dashboard
        </Link>
      </div>

      <div className="card">
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-secondary-50 mb-6">How to Use This Portal</h1>
        
        <div className="space-y-8">
          {helpSections.map((section, index) => (
            <div key={index} className="pb-6 border-b border-secondary-200 dark:border-secondary-700 last:border-0 last:pb-0">
              <div className="flex items-center mb-3">
                <section.icon className="text-primary-600 mr-3 h-6 w-6" />
                <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-50">{section.title}</h2>
              </div>
              <p className="text-secondary-600 dark:text-secondary-400 ml-9">{section.content}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-50 mb-4">Frequently Asked Questions</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-secondary-900 dark:text-secondary-50 mb-2">How often are reports generated?</h3>
            <p className="text-secondary-600 dark:text-secondary-400">Reports are generated on a monthly basis, typically within the first 5 days of the following month.</p>
          </div>
          
          <div>
            <h3 className="font-medium text-secondary-900 dark:text-secondary-50 mb-2">Can I export data from the dashboard?</h3>
            <p className="text-secondary-600 dark:text-secondary-400">Yes, most sections have an export option that allows you to download data in various formats including CSV and PDF.</p>
          </div>
          
          <div>
            <h3 className="font-medium text-secondary-900 dark:text-secondary-50 mb-2">How do I add a new opportunity?</h3>
            <p className="text-secondary-600 dark:text-secondary-400">Click the "Add Opportunity" button on the Dashboard page to create a new opportunity.</p>
          </div>
          
          <div>
            <h3 className="font-medium text-secondary-900 dark:text-secondary-50 mb-2">What does the Domain Rating represent?</h3>
            <p className="text-secondary-600 dark:text-secondary-400">Domain Rating (DR) is a metric that shows the strength of a website's backlink profile compared to others in our database on a scale from 0 to 100.</p>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-50 mb-4">Need More Help?</h2>
        <p className="text-secondary-600 dark:text-secondary-400 mb-4">
          If you need additional assistance, please contact our support team.
        </p>
        <div className="flex space-x-4">
          <a href="mailto:support@example.com" className="btn btn-primary">
            Email Support
          </a>
          <a href="#" className="btn btn-secondary">
            View Documentation
          </a>
        </div>
      </div>
    </div>
  );
};

export default Help;
