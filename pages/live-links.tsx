import React, { useState } from 'react';
import { FiDownload, FiFilter } from 'react-icons/fi';

// Define types for our data
interface Link {
  id: string;
  url: string;
  anchorText: string;
  placementDate: string;
  domainRating: number;
  contentType: string;
  campaign: string;
  isReserved: boolean;
  isRecycled: boolean;
}

const LiveLinks: React.FC = () => {
  // Mock data for links
  const linksData: Link[] = [
    {
      id: '1',
      url: 'https://example.com/blog/seo-tips',
      anchorText: 'SEO best practices',
      placementDate: '2025-04-15',
      domainRating: 72,
      contentType: 'Blog Post',
      campaign: 'Q2 Growth',
      isReserved: false,
      isRecycled: false,
    },
    {
      id: '2',
      url: 'https://techblog.io/digital-marketing',
      anchorText: 'digital marketing strategy',
      placementDate: '2025-04-10',
      domainRating: 65,
      contentType: 'Guest Post',
      campaign: 'Tech Outreach',
      isReserved: true,
      isRecycled: false,
    },
    {
      id: '3',
      url: 'https://marketingpro.com/link-building',
      anchorText: 'effective link building',
      placementDate: '2025-03-28',
      domainRating: 58,
      contentType: 'Resource Page',
      campaign: 'Q1 Authority',
      isReserved: false,
      isRecycled: true,
    },
    {
      id: '4',
      url: 'https://seotips.org/backlinks',
      anchorText: 'quality backlinks',
      placementDate: '2025-03-22',
      domainRating: 81,
      contentType: 'Blog Post',
      campaign: 'Q1 Authority',
      isReserved: false,
      isRecycled: false,
    },
    {
      id: '5',
      url: 'https://contentwriter.org/seo-guide',
      anchorText: 'comprehensive SEO guide',
      placementDate: '2025-04-18',
      domainRating: 69,
      contentType: 'Guest Post',
      campaign: 'Q2 Growth',
      isReserved: false,
      isRecycled: false,
    },
  ];

  // State for filters
  const [filters, setFilters] = useState({
    month: 'all',
    campaign: 'all',
    contentType: 'all',
    opportunityType: 'all', // 'all', 'reserved', 'recycled'
  });

  // Apply filters to the links data
  const filteredLinks = linksData.filter((link) => {
    // Month filter
    if (filters.month !== 'all') {
      const linkMonth = new Date(link.placementDate).getMonth();
      const selectedMonth = parseInt(filters.month);
      if (linkMonth !== selectedMonth) return false;
    }

    // Campaign filter
    if (filters.campaign !== 'all' && link.campaign !== filters.campaign) {
      return false;
    }

    // Content Type filter
    if (filters.contentType !== 'all' && link.contentType !== filters.contentType) {
      return false;
    }

    // Opportunity Type filter
    if (filters.opportunityType === 'reserved' && !link.isReserved) {
      return false;
    } else if (filters.opportunityType === 'recycled' && !link.isRecycled) {
      return false;
    }

    return true;
  });

  // Handle filter changes
  const handleFilterChange = (filterName: string, value: string) => {
    setFilters({
      ...filters,
      [filterName]: value,
    });
  };

  // Get unique campaigns and content types for filter options
  const campaigns = [...new Set(linksData.map((link) => link.campaign))];
  const contentTypes = [...new Set(linksData.map((link) => link.contentType))];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-secondary-50">Live Link Report</h1>
        
        <div className="mt-4 md:mt-0">
          <button className="btn btn-primary flex items-center">
            <FiDownload className="mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>
        <div className="filter-container">
          <div className="w-full sm:w-auto">
            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
              Month
            </label>
            <select
              className="filter-select w-full"
              value={filters.month}
              onChange={(e) => handleFilterChange('month', e.target.value)}
            >
              <option value="all">All Months</option>
              <option value="0">January</option>
              <option value="1">February</option>
              <option value="2">March</option>
              <option value="3">April</option>
              <option value="4">May</option>
              <option value="5">June</option>
              <option value="6">July</option>
              <option value="7">August</option>
              <option value="8">September</option>
              <option value="9">October</option>
              <option value="10">November</option>
              <option value="11">December</option>
            </select>
          </div>

          <div className="w-full sm:w-auto">
            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
              Campaign
            </label>
            <select
              className="filter-select w-full"
              value={filters.campaign}
              onChange={(e) => handleFilterChange('campaign', e.target.value)}
            >
              <option value="all">All Campaigns</option>
              {campaigns.map((campaign) => (
                <option key={campaign} value={campaign}>
                  {campaign}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full sm:w-auto">
            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
              Content Type
            </label>
            <select
              className="filter-select w-full"
              value={filters.contentType}
              onChange={(e) => handleFilterChange('contentType', e.target.value)}
            >
              <option value="all">All Content Types</option>
              {contentTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full sm:w-auto">
            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
              Opportunity Type
            </label>
            <select
              className="filter-select w-full"
              value={filters.opportunityType}
              onChange={(e) => handleFilterChange('opportunityType', e.target.value)}
            >
              <option value="all">All Opportunities</option>
              <option value="reserved">Reserved Only</option>
              <option value="recycled">Recycled Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Links Table */}
      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>URL</th>
                <th>Anchor Text</th>
                <th>Placement Date</th>
                <th>Domain Rating</th>
                <th>Content Type</th>
                <th>Campaign</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredLinks.length > 0 ? (
                filteredLinks.map((link) => (
                  <tr key={link.id}>
                    <td className="max-w-xs truncate">
                      <a 
                        href={link.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700 hover:underline"
                      >
                        {link.url}
                      </a>
                    </td>
                    <td>{link.anchorText}</td>
                    <td>{link.placementDate}</td>
                    <td>
                      <div className="flex items-center">
                        <span className={`font-medium ${
                          link.domainRating >= 70 ? 'text-success-700' : 
                          link.domainRating >= 50 ? 'text-warning-700' : 
                          'text-danger-700'
                        }`}>
                          {link.domainRating}
                        </span>
                      </div>
                    </td>
                    <td>{link.contentType}</td>
                    <td>{link.campaign}</td>
                    <td>
                      {link.isReserved && (
                        <span className="badge bg-primary-50 text-primary-700">
                          Reserved
                        </span>
                      )}
                      {link.isRecycled && (
                        <span className="badge bg-secondary-100 text-secondary-800 dark:bg-secondary-700 dark:text-secondary-300">
                          Recycled
                        </span>
                      )}
                      {!link.isReserved && !link.isRecycled && (
                        <span className="badge badge-approved">
                          Active
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-secondary-500">
                    No links found matching your filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LiveLinks;
