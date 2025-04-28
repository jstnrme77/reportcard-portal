import React, { useState, useEffect } from 'react';
import { FiDownload, FiFilter, FiRefreshCw, FiExternalLink, FiLink, FiCalendar, FiStar } from 'react-icons/fi';
import { useAirtableData } from '../lib/hooks';
import { Link as LinkModel, Campaign } from '../lib/models';
import { format } from 'date-fns';

// Define types for our data display
interface LinkDisplay {
  id: string;
  url: string;
  anchorText: string;
  placementDate: Date | null;
  formattedDate: string;
  domainRating: number;
  contentType: string;
  isReserved: boolean;
  isRecycled: boolean;
  campaignId?: string;
  campaignName?: string;
}

// Helper function to safely parse dates
const parseDate = (dateString: string | undefined): Date | null => {
  if (!dateString) return null;

  try {
    // Try different date formats
    if (dateString.includes('/')) {
      // Handle MM/DD/YYYY format
      const [month, day, year] = dateString.split('/');
      return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    } else if (dateString.includes('-')) {
      // Handle YYYY-MM-DD format
      return new Date(dateString);
    } else {
      // Try direct parsing
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? null : date;
    }
  } catch (error) {
    console.error('Error parsing date:', dateString, error);
    return null;
  }
};

const LiveLinks: React.FC = () => {
  // Fetch data from Airtable
  const { data: airtableLinks, isLoading: linksLoading, error: linksError, refetch: refetchLinks } = useAirtableData<LinkModel>('Links');
  const { data: campaigns, isLoading: campaignsLoading, error: campaignsError } = useAirtableData<Campaign>('Campaigns');

  // Combined loading and error states
  const isLoading = linksLoading || campaignsLoading;
  const error = linksError || campaignsError;

  // State for links data
  const [linksData, setLinksData] = useState<LinkDisplay[]>([]);

  // Convert Airtable data to our display format
  useEffect(() => {
    if (airtableLinks && airtableLinks.length > 0) {
      // Create a map of campaign IDs to names for quick lookup
      const campaignMap = new Map<string, string>();
      if (campaigns && campaigns.length > 0) {
        campaigns.forEach(campaign => {
          campaignMap.set(campaign.id, campaign.name);
        });
      }

      const formattedLinks = airtableLinks.map(link => {
        const placementDate = parseDate(link.placement_date);

        return {
          id: link.id,
          url: link.url,
          anchorText: link.anchor_text,
          placementDate: placementDate,
          formattedDate: placementDate ? format(placementDate, 'MMM d, yyyy') : 'Not set',
          domainRating: link.domain_rating || 0,
          contentType: link.content_type || 'Unknown',
          isReserved: link.is_reserved || false,
          isRecycled: link.is_recycled || false,
          campaignId: link.campaign_id,
          campaignName: link.campaign_id ? campaignMap.get(link.campaign_id) : undefined
        };
      });

      setLinksData(formattedLinks);
    } else if (!isLoading) {
      // If no Airtable data and not loading, use mock data
      setLinksData([
        {
          id: '1',
          url: 'https://example.com/blog/post1',
          anchorText: 'digital marketing strategies',
          placementDate: new Date('2023-05-15'),
          formattedDate: 'May 15, 2023',
          domainRating: 72,
          contentType: 'Blog Post',
          isReserved: false,
          isRecycled: false,
          campaignId: 'camp1',
          campaignName: 'Q2 Marketing Campaign'
        },
        {
          id: '2',
          url: 'https://techblog.com/seo-tips',
          anchorText: 'SEO best practices',
          placementDate: new Date('2023-06-22'),
          formattedDate: 'Jun 22, 2023',
          domainRating: 65,
          contentType: 'Guest Post',
          isReserved: true,
          isRecycled: false,
          campaignId: 'camp1',
          campaignName: 'Q2 Marketing Campaign'
        },
        {
          id: '3',
          url: 'https://industrysite.org/resources',
          anchorText: 'content marketing tools',
          placementDate: new Date('2023-07-10'),
          formattedDate: 'Jul 10, 2023',
          domainRating: 81,
          contentType: 'Resource Page',
          isReserved: false,
          isRecycled: true,
          campaignId: 'camp2',
          campaignName: 'Q3 Content Strategy'
        },
      ]);
    }
  }, [airtableLinks, campaigns, isLoading]);

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
    if (filters.month !== 'all' && link.placementDate) {
      const linkMonth = link.placementDate.getMonth();
      const selectedMonth = parseInt(filters.month);

      if (linkMonth !== selectedMonth) {
        return false;
      }
    }

    // Campaign filter
    if (filters.campaign !== 'all') {
      if (link.campaignId !== filters.campaign) return false;
    }

    // Content Type filter
    if (filters.contentType !== 'all') {
      if (link.contentType !== filters.contentType) return false;
    }

    // Opportunity Type filter
    if (filters.opportunityType === 'reserved') {
      if (!link.isReserved) return false;
    } else if (filters.opportunityType === 'recycled') {
      if (!link.isRecycled) return false;
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

  // Get unique values for filter options
  const campaignOptions = campaigns ? campaigns.map(campaign => ({
    id: campaign.id,
    name: campaign.name
  })) : [];

  // Get unique content types from the links data
  const contentTypes = Array.from(new Set(linksData.map(link => link.contentType))).filter(Boolean);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-secondary-50">Live Link Report</h1>

        <div className="mt-4 md:mt-0 flex space-x-3">
          <button
            onClick={() => refetchLinks()}
            className="btn btn-secondary flex items-center"
            disabled={isLoading}
          >
            <FiRefreshCw className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Loading...' : 'Refresh'}
          </button>
          <button className="btn btn-primary flex items-center">
            <FiDownload className="mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {error && (
        <div className="card bg-danger-50 border-danger-200 text-danger-700">
          <p>Error loading data from Airtable. Please check your API key and connection.</p>
        </div>
      )}

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
              {campaignOptions.map((campaign) => (
                <option key={campaign.id} value={campaign.id}>
                  {campaign.name}
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

      {/* Live Links Table */}
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
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-8">
                    <div className="flex justify-center items-center">
                      <FiRefreshCw className="animate-spin mr-2" />
                      Loading links...
                    </div>
                  </td>
                </tr>
              ) : filteredLinks.length > 0 ? (
                filteredLinks.map((link) => (
                  <tr key={link.id}>
                    <td className="max-w-xs truncate">
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700 hover:underline flex items-center"
                      >
                        <FiExternalLink className="mr-1 flex-shrink-0" />
                        <span className="truncate">{link.url}</span>
                      </a>
                    </td>
                    <td className="font-medium max-w-xs truncate">
                      "{link.anchorText}"
                    </td>
                    <td>
                      <div className="flex items-center">
                        <FiCalendar className="text-secondary-400 mr-1.5" />
                        {link.formattedDate}
                      </div>
                    </td>
                    <td className="text-center">
                      <div className="flex items-center justify-center">
                        <FiStar className={`mr-1 ${
                          link.domainRating >= 70 ? 'text-yellow-500' :
                          link.domainRating >= 50 ? 'text-primary-500' :
                          'text-secondary-400'
                        }`} />
                        <span>{link.domainRating}</span>
                      </div>
                    </td>
                    <td>
                      {link.contentType}
                    </td>
                    <td>
                      {link.campaignName || '-'}
                    </td>
                    <td>
                      <div className="flex space-x-1">
                        {link.isReserved && (
                          <span className="badge badge-primary text-xs px-1.5 py-0.5">
                            Reserved
                          </span>
                        )}
                        {link.isRecycled && (
                          <span className="badge badge-secondary text-xs px-1.5 py-0.5">
                            Recycled
                          </span>
                        )}
                        {!link.isReserved && !link.isRecycled && (
                          <span className="badge badge-approved text-xs px-1.5 py-0.5">
                            Placed
                          </span>
                        )}
                      </div>
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

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-4">
          <h3 className="text-sm font-medium text-secondary-500 mb-1">Total Links</h3>
          <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-50">{linksData.length}</p>
        </div>

        <div className="card p-4">
          <h3 className="text-sm font-medium text-secondary-500 mb-1">Average Domain Rating</h3>
          <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-50">
            {linksData.length > 0
              ? Math.round(linksData.reduce((sum, link) => sum + link.domainRating, 0) / linksData.length)
              : 0}
          </p>
        </div>

        <div className="card p-4">
          <h3 className="text-sm font-medium text-secondary-500 mb-1">Links This Month</h3>
          <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-50">
            {linksData.filter(link => {
              if (!link.placementDate) return false;
              const now = new Date();
              return link.placementDate.getMonth() === now.getMonth() &&
                     link.placementDate.getFullYear() === now.getFullYear();
            }).length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LiveLinks;
