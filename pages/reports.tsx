import React, { useState } from 'react';
import { FiDownload, FiUpload, FiCalendar, FiFilter } from 'react-icons/fi';

// Define types for our data
interface Report {
  id: string;
  month: string;
  serviceType: 'Link Building' | 'PPC';
  pdfUrl: string;
  notes: string;
  createdAt: string;
}

const Reports: React.FC = () => {
  // Mock data for reports
  const reportsData: Report[] = [
    {
      id: '1',
      month: '2025-04-01',
      serviceType: 'Link Building',
      pdfUrl: '/reports/april-2025-link-building.pdf',
      notes: 'Successfully placed 45 links, exceeding the monthly target by 15%. Domain ratings averaged 68.',
      createdAt: '2025-05-02',
    },
    {
      id: '2',
      month: '2025-04-01',
      serviceType: 'PPC',
      pdfUrl: '/reports/april-2025-ppc.pdf',
      notes: 'Achieved 12% CTR with a 5% conversion rate. Budget utilization at 98%.',
      createdAt: '2025-05-03',
    },
    {
      id: '3',
      month: '2025-03-01',
      serviceType: 'Link Building',
      pdfUrl: '/reports/march-2025-link-building.pdf',
      notes: 'Placed 38 links with an average domain rating of 72. Two high-authority placements secured.',
      createdAt: '2025-04-05',
    },
    {
      id: '4',
      month: '2025-03-01',
      serviceType: 'PPC',
      pdfUrl: '/reports/march-2025-ppc.pdf',
      notes: 'Optimized campaigns resulted in 15% lower CPC compared to February. Conversion rate improved to 6.2%.',
      createdAt: '2025-04-04',
    },
    {
      id: '5',
      month: '2025-02-01',
      serviceType: 'Link Building',
      pdfUrl: '/reports/february-2025-link-building.pdf',
      notes: 'Placed 32 links with focus on industry-specific websites. Domain ratings averaged 65.',
      createdAt: '2025-03-03',
    },
  ];

  // State for filters
  const [filters, setFilters] = useState({
    month: 'all',
    serviceType: 'all',
  });

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  // Apply filters to the reports data
  const filteredReports = reportsData.filter((report) => {
    // Month filter
    if (filters.month !== 'all' && report.month !== filters.month) {
      return false;
    }

    // Service Type filter
    if (filters.serviceType !== 'all' && report.serviceType !== filters.serviceType) {
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

  // Get unique months for filter options
  const months = [...new Set(reportsData.map((report) => report.month))];

  // Handle file upload
  const handleUpload = () => {
    // In a real app, this would open a file dialog
    alert('Upload functionality would be implemented here');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-secondary-50">Reporting History</h1>
        
        <div className="mt-4 md:mt-0">
          <button onClick={handleUpload} className="btn btn-primary flex items-center">
            <FiUpload className="mr-2" />
            Upload Report
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
              {months.map((month) => (
                <option key={month} value={month}>
                  {formatDate(month)}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full sm:w-auto">
            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
              Service Type
            </label>
            <select
              className="filter-select w-full"
              value={filters.serviceType}
              onChange={(e) => handleFilterChange('serviceType', e.target.value)}
            >
              <option value="all">All Services</option>
              <option value="Link Building">Link Building</option>
              <option value="PPC">PPC</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReports.length > 0 ? (
          filteredReports.map((report) => (
            <div key={report.id} className="card flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <FiCalendar className="text-primary-600 mr-2" />
                  <h3 className="font-semibold">{formatDate(report.month)}</h3>
                </div>
                <span className="badge bg-primary-50 text-primary-700">
                  {report.serviceType}
                </span>
              </div>
              
              <div className="flex-grow">
                <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-4">
                  {report.notes}
                </p>
              </div>
              
              <div className="mt-4 pt-4 border-t border-secondary-200 dark:border-secondary-700 flex justify-between items-center">
                <span className="text-xs text-secondary-500 dark:text-secondary-400">
                  Created: {new Date(report.createdAt).toLocaleDateString()}
                </span>
                <a 
                  href={report.pdfUrl} 
                  className="btn btn-secondary text-sm py-1.5 flex items-center"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FiDownload className="mr-1" size={14} />
                  Download
                </a>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-secondary-500 card">
            No reports found matching your filter criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
