import React, { useState, useEffect } from 'react';
import { FiDownload, FiFilter, FiRefreshCw, FiExternalLink } from 'react-icons/fi';
import { useAirtableData } from '../lib/hooks';
import { Client } from '../lib/models';

// Define types for our data display
interface ClientDisplay {
  id: string;
  companyName: string;
  status: string;
  liveLinks: number;
  budgetSpent: number;
  totalCosts: number;
  grossProfit: number;
  months: string[];
  monthsWithUs: number;
  targetURLs: string[];
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
  // Fetch clients from Airtable
  const { data: airtableClients, isLoading, error, refetch } = useAirtableData<Client>('Clients');

  // State for clients data
  const [clientsData, setClientsData] = useState<ClientDisplay[]>([]);

  // Convert Airtable data to our display format
  useEffect(() => {
    if (airtableClients && airtableClients.length > 0) {
      // Log the first client to see the data format
      console.log('Sample client data:', airtableClients[0]);

      const formattedClients = airtableClients.map(client => {
        return {
          id: client.id,
          companyName: client['Company Name'] || 'Unnamed Client',
          status: client.Status || 'Unknown',
          liveLinks: client['Live Links'] || 0,
          budgetSpent: client['Budget Spent'] || 0,
          totalCosts: client['Total Costs'] || 0,
          grossProfit: client['Gross Profit'] || 0,
          months: client.Months || [],
          monthsWithUs: client['Months With Us'] || 0,
          targetURLs: client['Target URLs'] || []
        };
      });
      setClientsData(formattedClients);
    } else if (!isLoading) {
      // If no Airtable data and not loading, use mock data
      setClientsData([
        {
          id: '1',
          companyName: 'ABC Company',
          status: 'Active',
          liveLinks: 12,
          budgetSpent: 5000,
          totalCosts: 3500,
          grossProfit: 1500,
          months: ['January', 'February', 'March'],
          monthsWithUs: 3,
          targetURLs: ['https://example.com/page1', 'https://example.com/page2']
        },
        {
          id: '2',
          companyName: 'XYZ Corporation',
          status: 'Inactive',
          liveLinks: 8,
          budgetSpent: 3000,
          totalCosts: 2000,
          grossProfit: 1000,
          months: ['January', 'February'],
          monthsWithUs: 2,
          targetURLs: ['https://xyz.com/blog']
        },
        {
          id: '3',
          companyName: 'Acme Inc',
          status: 'Active',
          liveLinks: 15,
          budgetSpent: 7500,
          totalCosts: 5000,
          grossProfit: 2500,
          months: ['February', 'March', 'April'],
          monthsWithUs: 3,
          targetURLs: ['https://acme.com/services', 'https://acme.com/products']
        },
      ]);
    }
  }, [airtableClients, isLoading]);

  // State for filters
  const [filters, setFilters] = useState({
    month: 'all',
    campaign: 'all',
    contentType: 'all',
    opportunityType: 'all', // 'all', 'reserved', 'recycled'
  });

  // Debug the month filter
  useEffect(() => {
    if (filters.month !== 'all') {
      console.log('Selected month:', filters.month);
      // Log a few sample clients to debug
      clientsData.slice(0, 3).forEach(client => {
        console.log(
          'Client:', client.companyName,
          'Months:', client.months
        );
      });
    }
  }, [filters.month, clientsData]);

  // Apply filters to the clients data
  const filteredClients = clientsData.filter((client) => {
    // Month filter
    if (filters.month !== 'all') {
      // Check if the client has the selected month in their Months array
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      const selectedMonthIndex = parseInt(filters.month);
      const selectedMonthName = monthNames[selectedMonthIndex];

      if (!client.months.includes(selectedMonthName)) {
        return false;
      }
    }

    // Campaign filter - using status as a proxy for campaign
    if (filters.campaign !== 'all') {
      if (client.status !== filters.campaign) return false;
    }

    // Content Type filter - not directly applicable, but we can use it for filtering by number of live links
    if (filters.contentType !== 'all') {
      // For demonstration, let's categorize by number of live links
      if (filters.contentType === 'Blog Post' && client.liveLinks < 5) return false;
      if (filters.contentType === 'Guest Post' && (client.liveLinks < 5 || client.liveLinks >= 10)) return false;
      if (filters.contentType === 'Resource Page' && client.liveLinks < 10) return false;
    }

    // Opportunity Type filter
    if (filters.opportunityType === 'reserved') {
      // Consider active clients as "reserved"
      if (client.status !== 'Active') return false;
    } else if (filters.opportunityType === 'recycled') {
      // Consider inactive clients as "recycled"
      if (client.status !== 'Inactive') return false;
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
  const statuses = Array.from(new Set(clientsData.map((client) => client.status))).filter(Boolean);
  // For content types, we'll use predefined values since we're using it for live links categorization
  const contentTypes = ['Blog Post', 'Guest Post', 'Resource Page'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-secondary-50">Live Link Report</h1>

        <div className="mt-4 md:mt-0 flex space-x-3">
          <button
            onClick={() => refetch()}
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
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
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
                <th>Company Name</th>
                <th>Status</th>
                <th>Live Links</th>
                <th>Budget Spent</th>
                <th>Total Costs</th>
                <th>Gross Profit</th>
                <th>Months With Us</th>
                <th>Target URLs</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="text-center py-8">
                    <div className="flex justify-center items-center">
                      <FiRefreshCw className="animate-spin mr-2" />
                      Loading clients...
                    </div>
                  </td>
                </tr>
              ) : filteredClients.length > 0 ? (
                filteredClients.map((client) => (
                  <tr key={client.id}>
                    <td className="font-medium">
                      {client.companyName}
                    </td>
                    <td>
                      <span className={`badge ${
                        client.status === 'Active' ? 'badge-approved' :
                        client.status === 'Inactive' ? 'badge-rejected' :
                        'badge-pending'
                      }`}>
                        {client.status}
                      </span>
                    </td>
                    <td className="text-center">
                      {client.liveLinks}
                    </td>
                    <td>
                      ${client.budgetSpent.toLocaleString()}
                    </td>
                    <td>
                      ${client.totalCosts.toLocaleString()}
                    </td>
                    <td>
                      ${client.grossProfit.toLocaleString()}
                    </td>
                    <td className="text-center">
                      {client.monthsWithUs}
                    </td>
                    <td>
                      {client.targetURLs.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {client.targetURLs.slice(0, 1).map((url, index) => (
                            <a
                              key={index}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary-600 hover:text-primary-700 hover:underline flex items-center"
                            >
                              <FiExternalLink className="mr-1" />
                              View URL
                            </a>
                          ))}
                          {client.targetURLs.length > 1 && (
                            <span className="text-xs text-secondary-500">
                              +{client.targetURLs.length - 1} more
                            </span>
                          )}
                        </div>
                      ) : '-'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-secondary-500">
                    No clients found matching your filter criteria.
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
