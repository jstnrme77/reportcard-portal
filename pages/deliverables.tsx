import React, { useState, useEffect } from 'react';
import { FiDownload, FiFilter, FiRefreshCw, FiExternalLink, FiLink, FiCalendar, FiDollarSign } from 'react-icons/fi';
import { useAirtableData } from '../lib/hooks';
import { Link as LinkModel, Campaign } from '../lib/models';
import { format } from 'date-fns';

// Define types for our data display
interface LinkDisplay {
  id: string;
  url: string;
  anchorText: string;
  targetPage: string;
  placementDate: Date | null;
  formattedDate: string;
  serviceType: string;
  linkCost: number;
  isReserved: boolean;
  isRecycled: boolean;
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

const Deliverables: React.FC = () => {
  // Fetch data from Airtable
  const { data: airtableLinks, isLoading: linksLoading, error: linksError, refetch: refetchLinks } = useAirtableData<LinkModel>('Links');
  const { data: campaigns, isLoading: campaignsLoading, error: campaignsError } = useAirtableData<Campaign>('Campaigns');

  // Combined loading and error states
  const isLoading = linksLoading || campaignsLoading;
  const error = linksError || campaignsError;

  // State for links data
  const [linksData, setLinksData] = useState<LinkDisplay[]>([]);

  // State for budget summary
  const [budgetSummary, setBudgetSummary] = useState({
    allocated: 0,
    used: 0,
    linksDelivered: 0,
    breakdown: {
      linkBuilding: 0,
      ppc: 0,
      development: 0,
      other: 0
    }
  });

  // State for filters
  const [filters, setFilters] = useState({
    month: 'current',
    serviceType: 'all',
    opportunityType: 'all', // 'all', 'reserved', 'recycled'
  });

  // Get current month and year
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Convert Airtable data to our display format
  useEffect(() => {
    if (airtableLinks && airtableLinks.length > 0) {
      const formattedLinks = airtableLinks.map(link => {
        const placementDate = parseDate(link.placement_date);

        // Extract target page from URL if available
        let targetPage = 'N/A';
        if (link.target_page) {
          targetPage = link.target_page;
        }

        return {
          id: link.id,
          url: link.url,
          anchorText: link.anchor_text,
          targetPage: targetPage,
          placementDate: placementDate,
          formattedDate: placementDate ? format(placementDate, 'MMM d, yyyy') : 'Not set',
          serviceType: link.content_type || 'Link Building',
          linkCost: link.link_cost || 0,
          isReserved: link.is_reserved || false,
          isRecycled: link.is_recycled || false
        };
      });

      setLinksData(formattedLinks);

      // Calculate budget summary
      calculateBudgetSummary(formattedLinks);
    } else if (!isLoading) {
      // If no Airtable data and not loading, use mock data
      const mockData = [
        {
          id: '1',
          url: 'https://example.com/blog/post1',
          anchorText: 'digital marketing strategies',
          targetPage: 'https://client.com/services',
          placementDate: new Date('2023-05-15'),
          formattedDate: 'May 15, 2023',
          serviceType: 'Link Building',
          linkCost: 350,
          isReserved: false,
          isRecycled: false
        },
        {
          id: '2',
          url: 'https://techblog.com/seo-tips',
          anchorText: 'SEO best practices',
          targetPage: 'https://client.com/seo',
          placementDate: new Date('2023-06-22'),
          formattedDate: 'Jun 22, 2023',
          serviceType: 'Link Building',
          linkCost: 275,
          isReserved: true,
          isRecycled: false
        },
        {
          id: '3',
          url: 'https://digitalmarketing.net/backlinks',
          anchorText: 'quality backlinks',
          targetPage: 'https://client.com/backlinks',
          placementDate: new Date('2023-06-10'),
          formattedDate: 'Jun 10, 2023',
          serviceType: 'Link Building',
          linkCost: 400,
          isReserved: false,
          isRecycled: true
        },
        {
          id: '4',
          url: 'https://adplatform.com/campaign123',
          anchorText: 'N/A',
          targetPage: 'https://client.com/products',
          placementDate: new Date('2023-06-05'),
          formattedDate: 'Jun 5, 2023',
          serviceType: 'PPC',
          linkCost: 1200,
          isReserved: false,
          isRecycled: false
        },
        {
          id: '5',
          url: 'https://webdev.com/client-project',
          anchorText: 'N/A',
          targetPage: 'https://client.com',
          placementDate: new Date('2023-05-30'),
          formattedDate: 'May 30, 2023',
          serviceType: 'Development',
          linkCost: 850,
          isReserved: false,
          isRecycled: false
        }
      ];

      setLinksData(mockData);
      calculateBudgetSummary(mockData);
    }
  }, [airtableLinks, isLoading]);

  // Calculate budget summary based on the filtered links
  const calculateBudgetSummary = (links: LinkDisplay[]) => {
    // Filter links by the selected month
    const filteredLinks = filterLinksByMonth(links, filters.month);

    // Calculate total links delivered
    const linksDelivered = filteredLinks.length;

    // Calculate total cost used
    const totalUsed = filteredLinks.reduce((sum, link) => sum + link.linkCost, 0);

    // Calculate breakdown by service type
    const linkBuilding = filteredLinks
      .filter(link => link.serviceType === 'Link Building')
      .reduce((sum, link) => sum + link.linkCost, 0);

    const ppc = filteredLinks
      .filter(link => link.serviceType === 'PPC')
      .reduce((sum, link) => sum + link.linkCost, 0);

    const development = filteredLinks
      .filter(link => link.serviceType === 'Development')
      .reduce((sum, link) => sum + link.linkCost, 0);

    const other = filteredLinks
      .filter(link => !['Link Building', 'PPC', 'Development'].includes(link.serviceType))
      .reduce((sum, link) => sum + link.linkCost, 0);

    // Set budget summary
    setBudgetSummary({
      allocated: totalUsed + 1000, // Mock allocated budget (actual would come from campaign data)
      used: totalUsed,
      linksDelivered,
      breakdown: {
        linkBuilding,
        ppc,
        development,
        other
      }
    });
  };

  // Filter links by month
  const filterLinksByMonth = (links: LinkDisplay[], monthFilter: string) => {
    if (monthFilter === 'all') return links;

    return links.filter(link => {
      if (!link.placementDate) return false;

      if (monthFilter === 'current') {
        return link.placementDate.getMonth() === currentMonth &&
               link.placementDate.getFullYear() === currentYear;
      }

      // Handle specific month selections (format: 'YYYY-MM')
      if (monthFilter.includes('-')) {
        const [year, month] = monthFilter.split('-').map(Number);
        return link.placementDate.getMonth() === month - 1 &&
               link.placementDate.getFullYear() === year;
      }

      return true;
    });
  };

  // Handle filter changes
  const handleFilterChange = (filterName: string, value: string) => {
    const newFilters = { ...filters, [filterName]: value };
    setFilters(newFilters);

    // Recalculate budget summary based on new filters
    calculateBudgetSummary(linksData);
  };

  // Get unique months for filter options
  const getUniqueMonths = () => {
    const months = new Set<string>();

    linksData.forEach(link => {
      if (link.placementDate) {
        const year = link.placementDate.getFullYear();
        const month = link.placementDate.getMonth() + 1;
        months.add(`${year}-${month.toString().padStart(2, '0')}`);
      }
    });

    return Array.from(months).sort().reverse();
  };

  // Get unique service types for filter options
  const getUniqueServiceTypes = () => {
    const types = new Set<string>();

    linksData.forEach(link => {
      if (link.serviceType) {
        types.add(link.serviceType);
      }
    });

    return Array.from(types).sort();
  };

  // Apply filters to links data
  const filteredLinks = linksData
    .filter(link => {
      // Filter by month
      if (filters.month !== 'all') {
        if (!link.placementDate) return false;

        if (filters.month === 'current') {
          return link.placementDate.getMonth() === currentMonth &&
                 link.placementDate.getFullYear() === currentYear;
        }

        // Handle specific month selections (format: 'YYYY-MM')
        if (filters.month.includes('-')) {
          const [year, month] = filters.month.split('-').map(Number);
          return link.placementDate.getMonth() === month - 1 &&
                 link.placementDate.getFullYear() === year;
        }
      }

      // Filter by service type
      if (filters.serviceType !== 'all' && link.serviceType !== filters.serviceType) {
        return false;
      }

      // Filter by opportunity type
      if (filters.opportunityType === 'reserved' && !link.isReserved) {
        return false;
      }
      if (filters.opportunityType === 'recycled' && !link.isRecycled) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      // Sort by date (newest first)
      if (!a.placementDate) return 1;
      if (!b.placementDate) return -1;
      return b.placementDate.getTime() - a.placementDate.getTime();
    });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-secondary-50 mb-2">Deliverables</h1>
          <p className="text-secondary-600 dark:text-secondary-400">
            Track and manage link building deliverables
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <button
            onClick={() => refetchLinks()}
            className="btn btn-primary flex items-center"
          >
            <FiRefreshCw className="mr-2" />
            Refresh Data
          </button>
        </div>
      </div>

      {/* Budget Summary Box */}
      <div className="card p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Budget Summary for {filters.month === 'current' ? format(new Date(), 'MMMM yyyy') : filters.month === 'all' ? 'All Time' : format(new Date(filters.month), 'MMMM yyyy')}</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
            <h3 className="text-sm font-medium text-secondary-500 mb-1">Budget Allocated</h3>
            <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-50">${budgetSummary.allocated.toLocaleString()}</p>
          </div>

          <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
            <h3 className="text-sm font-medium text-secondary-500 mb-1">Budget Used</h3>
            <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-50">${budgetSummary.used.toLocaleString()}</p>
          </div>

          <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
            <h3 className="text-sm font-medium text-secondary-500 mb-1">Links Delivered</h3>
            <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-50">{budgetSummary.linksDelivered}</p>
          </div>

          <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
            <h3 className="text-sm font-medium text-secondary-500 mb-1">Remaining Budget</h3>
            <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-50">${(budgetSummary.allocated - budgetSummary.used).toLocaleString()}</p>
          </div>
        </div>

        <h3 className="text-lg font-semibold mb-3">Cost Breakdown by Service</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-3 bg-secondary-100 dark:bg-secondary-800 rounded-lg">
            <h4 className="text-sm font-medium text-secondary-500 mb-1">Link Building</h4>
            <p className="text-xl font-bold text-secondary-900 dark:text-secondary-50">${budgetSummary.breakdown.linkBuilding.toLocaleString()}</p>
          </div>

          <div className="p-3 bg-secondary-100 dark:bg-secondary-800 rounded-lg">
            <h4 className="text-sm font-medium text-secondary-500 mb-1">PPC</h4>
            <p className="text-xl font-bold text-secondary-900 dark:text-secondary-50">${budgetSummary.breakdown.ppc.toLocaleString()}</p>
          </div>

          <div className="p-3 bg-secondary-100 dark:bg-secondary-800 rounded-lg">
            <h4 className="text-sm font-medium text-secondary-500 mb-1">Development</h4>
            <p className="text-xl font-bold text-secondary-900 dark:text-secondary-50">${budgetSummary.breakdown.development.toLocaleString()}</p>
          </div>

          <div className="p-3 bg-secondary-100 dark:bg-secondary-800 rounded-lg">
            <h4 className="text-sm font-medium text-secondary-500 mb-1">Other</h4>
            <p className="text-xl font-bold text-secondary-900 dark:text-secondary-50">${budgetSummary.breakdown.other.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-6">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
              <FiCalendar className="inline mr-1" />
              Month
            </label>
            <select
              className="form-select w-full"
              value={filters.month}
              onChange={(e) => handleFilterChange('month', e.target.value)}
            >
              <option value="current">Current Month</option>
              <option value="all">All Time</option>
              {getUniqueMonths().map((month) => (
                <option key={month} value={month}>
                  {format(new Date(`${month}-01`), 'MMMM yyyy')}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
              <FiFilter className="inline mr-1" />
              Service Type
            </label>
            <select
              className="form-select w-full"
              value={filters.serviceType}
              onChange={(e) => handleFilterChange('serviceType', e.target.value)}
            >
              <option value="all">All Service Types</option>
              {getUniqueServiceTypes().map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
              <FiFilter className="inline mr-1" />
              Opportunity Type
            </label>
            <select
              className="form-select w-full"
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
                <th>Link URL</th>
                <th>Anchor Text</th>
                <th>Target Page</th>
                <th>Date Delivered</th>
                <th>Service Type</th>
                <th>Status</th>
                <th>Link Cost</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-8">
                    <div className="flex justify-center items-center">
                      <FiRefreshCw className="animate-spin mr-2" />
                      Loading deliverables...
                    </div>
                  </td>
                </tr>
              ) : filteredLinks.length > 0 ? (
                filteredLinks.map((link) => (
                  <tr key={link.id}>
                    <td>
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
                      {link.anchorText !== 'N/A' ? `"${link.anchorText}"` : 'N/A'}
                    </td>
                    <td>
                      <a
                        href={link.targetPage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700 hover:underline flex items-center"
                      >
                        <FiLink className="mr-1 flex-shrink-0" />
                        <span className="truncate">{link.targetPage}</span>
                      </a>
                    </td>
                    <td>
                      <div className="flex items-center">
                        <FiCalendar className="text-secondary-400 mr-1.5" />
                        {link.formattedDate}
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${
                        link.serviceType === 'Link Building' ? 'badge-primary' :
                        link.serviceType === 'PPC' ? 'badge-success' :
                        link.serviceType === 'Development' ? 'badge-warning' :
                        'badge-secondary'
                      } text-xs px-1.5 py-0.5`}>
                        {link.serviceType}
                      </span>
                    </td>
                    <td>
                      {link.isReserved && (
                        <span className="badge badge-warning text-xs px-1.5 py-0.5 mr-1">
                          Reserved
                        </span>
                      )}
                      {link.isRecycled && (
                        <span className="badge badge-info text-xs px-1.5 py-0.5">
                          Recycled
                        </span>
                      )}
                      {!link.isReserved && !link.isRecycled && (
                        <span className="badge badge-secondary text-xs px-1.5 py-0.5">
                          Standard
                        </span>
                      )}
                    </td>
                    <td>
                      <div className="flex items-center">
                        <FiDollarSign className="text-secondary-400 mr-0.5" />
                        {link.linkCost.toLocaleString()}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-secondary-500">
                    No deliverables found matching your filter criteria.
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

export default Deliverables;
