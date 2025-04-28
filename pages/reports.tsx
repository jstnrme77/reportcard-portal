import React, { useState, useEffect } from 'react';
import { FiDownload, FiUpload, FiCalendar, FiFilter, FiRefreshCw, FiEdit2, FiTrash2, FiFileText } from 'react-icons/fi';
import { useAirtableData } from '../lib/hooks';
import { Report as ReportModel } from '../lib/models';
import ReportUploadModal from '../components/ReportUploadModal';
import { format, parseISO } from 'date-fns';

// Define types for our data display
interface ReportDisplay {
  id: string;
  month: string;
  formattedMonth: string;
  serviceType: string;
  pdfUrl: string;
  notes: string;
  createdAt: Date;
  formattedCreatedAt: string;
}

// Helper function to parse date strings
const parseDate = (dateString: string | null | undefined): Date | null => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date;
};

const Reports: React.FC = () => {
  // Fetch data from Airtable
  const {
    data: airtableReports,
    isLoading,
    error,
    refetch: refetchReports,
    create: createReport,
    update: updateReport,
    remove: deleteReport
  } = useAirtableData<ReportModel>('Reports');

  // State for reports data
  const [reportsData, setReportsData] = useState<ReportDisplay[]>([]);

  // State for filters
  const [filters, setFilters] = useState({
    month: 'all',
    serviceType: 'all',
  });

  // State for upload modal
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // State for edit mode
  const [editingReport, setEditingReport] = useState<string | null>(null);
  const [editNotes, setEditNotes] = useState('');

  // Convert Airtable data to our display format
  useEffect(() => {
    if (airtableReports && airtableReports.length > 0) {
      const formattedReports = airtableReports.map(report => {
        const createdAt = parseDate(report.created_at) || new Date();
        const monthDate = parseISO(report.month);

        return {
          id: report.id,
          month: report.month,
          formattedMonth: format(monthDate, 'MMMM yyyy'),
          serviceType: report.service_type,
          pdfUrl: report.pdf_url,
          notes: report.notes || '',
          createdAt: createdAt,
          formattedCreatedAt: format(createdAt, 'MMM d, yyyy')
        };
      });

      // Sort by month (newest first)
      formattedReports.sort((a, b) => new Date(b.month).getTime() - new Date(a.month).getTime());

      setReportsData(formattedReports);
    } else if (!isLoading) {
      // If no Airtable data and not loading, use mock data
      const currentYear = new Date().getFullYear();
      setReportsData([
        {
          id: '1',
          month: `${currentYear}-04-01`,
          formattedMonth: `April ${currentYear}`,
          serviceType: 'Link Building',
          pdfUrl: '/reports/april-2025-link-building.pdf',
          notes: 'Successfully placed 45 links, exceeding the monthly target by 15%. Domain ratings averaged 68.',
          createdAt: new Date(`${currentYear}-05-02`),
          formattedCreatedAt: `May 2, ${currentYear}`,
        },
        {
          id: '2',
          month: `${currentYear}-04-01`,
          formattedMonth: `April ${currentYear}`,
          serviceType: 'PPC',
          pdfUrl: '/reports/april-2025-ppc.pdf',
          notes: 'Achieved 12% CTR with a 5% conversion rate. Budget utilization at 98%.',
          createdAt: new Date(`${currentYear}-05-03`),
          formattedCreatedAt: `May 3, ${currentYear}`,
        },
        {
          id: '3',
          month: `${currentYear}-03-01`,
          formattedMonth: `March ${currentYear}`,
          serviceType: 'Link Building',
          pdfUrl: '/reports/march-2025-link-building.pdf',
          notes: 'Placed 38 links with an average domain rating of 72. Two high-authority placements secured.',
          createdAt: new Date(`${currentYear}-04-05`),
          formattedCreatedAt: `April 5, ${currentYear}`,
        },
        {
          id: '4',
          month: `${currentYear}-03-01`,
          formattedMonth: `March ${currentYear}`,
          serviceType: 'PPC',
          pdfUrl: '/reports/march-2025-ppc.pdf',
          notes: 'Optimized campaigns resulted in 15% lower CPC compared to February. Conversion rate improved to 6.2%.',
          createdAt: new Date(`${currentYear}-04-04`),
          formattedCreatedAt: `April 4, ${currentYear}`,
        },
        {
          id: '5',
          month: `${currentYear}-02-01`,
          formattedMonth: `February ${currentYear}`,
          serviceType: 'Link Building',
          pdfUrl: '/reports/february-2025-link-building.pdf',
          notes: 'Placed 32 links with focus on industry-specific websites. Domain ratings averaged 65.',
          createdAt: new Date(`${currentYear}-03-03`),
          formattedCreatedAt: `March 3, ${currentYear}`,
        },
      ]);
    }
  }, [airtableReports, isLoading]);

  // Apply filters to the reports data
  const filteredReports = reportsData.filter((report) => {
    // Month filter (compare YYYY-MM part only)
    if (filters.month !== 'all') {
      const reportMonthYearPart = report.month.substring(0, 7); // YYYY-MM
      if (reportMonthYearPart !== filters.month) {
        return false;
      }
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
  const getUniqueMonths = () => {
    const uniqueMonths = new Map<string, string>();

    reportsData.forEach(report => {
      const monthYearPart = report.month.substring(0, 7); // YYYY-MM
      if (!uniqueMonths.has(monthYearPart)) {
        uniqueMonths.set(monthYearPart, report.formattedMonth);
      }
    });

    return Array.from(uniqueMonths).map(([value, label]) => ({ value, label }));
  };

  const uniqueMonths = getUniqueMonths();

  // Get unique service types
  const uniqueServiceTypes = Array.from(new Set(reportsData.map(report => report.serviceType)));

  // Handle file upload
  const handleUploadClick = () => {
    setIsUploadModalOpen(true);
  };

  // Handle report submission
  const handleReportSubmit = async (data: { month: string; serviceType: string; notes: string; file: File | null }) => {
    try {
      // In a real implementation, we would upload the file to a storage service
      // and get back a URL. For now, we'll create a mock URL.
      const mockPdfUrl = data.file
        ? `https://storage.example.com/reports/${data.month}-${data.serviceType.toLowerCase().replace(' ', '-')}.pdf`
        : '';

      // Create the report in Airtable
      if (createReport) {
        await createReport({
          month: `${data.month}-01`, // Add day to make a valid date
          service_type: data.serviceType,
          pdf_url: mockPdfUrl,
          notes: data.notes
        });

        // Refresh the data
        await refetchReports();
      }

      setIsUploadModalOpen(false);
    } catch (error) {
      console.error('Error creating report:', error);
      alert('Failed to upload report. Please try again.');
    }
  };

  // Handle edit mode toggle
  const handleEditClick = (reportId: string, currentNotes: string) => {
    setEditingReport(reportId);
    setEditNotes(currentNotes);
  };

  // Handle notes update
  const handleNotesUpdate = async (reportId: string) => {
    try {
      if (updateReport) {
        await updateReport(reportId, {
          notes: editNotes
        });

        // Update local state
        setReportsData(
          reportsData.map(report =>
            report.id === reportId
              ? { ...report, notes: editNotes }
              : report
          )
        );

        // Exit edit mode
        setEditingReport(null);
      }
    } catch (error) {
      console.error('Error updating report notes:', error);
      alert('Failed to update notes. Please try again.');
    }
  };

  // Handle report deletion
  const handleDeleteReport = async (reportId: string) => {
    if (confirm('Are you sure you want to delete this report? This action cannot be undone.')) {
      try {
        if (deleteReport) {
          await deleteReport(reportId);

          // Update local state
          setReportsData(reportsData.filter(report => report.id !== reportId));
        }
      } catch (error) {
        console.error('Error deleting report:', error);
        alert('Failed to delete report. Please try again.');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-secondary-50">Reporting History</h1>

        <div className="mt-4 md:mt-0 flex space-x-3">
          <button
            onClick={() => refetchReports()}
            className="btn btn-secondary flex items-center"
            disabled={isLoading}
          >
            <FiRefreshCw className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Loading...' : 'Refresh'}
          </button>
          <button
            onClick={handleUploadClick}
            className="btn btn-primary flex items-center"
          >
            <FiUpload className="mr-2" />
            Upload Report
          </button>
        </div>
      </div>

      {error && (
        <div className="card bg-danger-50 border-danger-200 text-danger-700">
          <p>Error loading data from Airtable. Please check your connection.</p>
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
              {uniqueMonths.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
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
              {uniqueServiceTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-4">
          <h3 className="text-sm font-medium text-secondary-500 mb-1">Total Reports</h3>
          <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-50">{reportsData.length}</p>
        </div>

        <div className="card p-4">
          <h3 className="text-sm font-medium text-secondary-500 mb-1">Link Building Reports</h3>
          <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-50">
            {reportsData.filter(report => report.serviceType === 'Link Building').length}
          </p>
        </div>

        <div className="card p-4">
          <h3 className="text-sm font-medium text-secondary-500 mb-1">PPC Reports</h3>
          <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-50">
            {reportsData.filter(report => report.serviceType === 'PPC').length}
          </p>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full text-center py-8 card">
            <div className="flex justify-center items-center">
              <FiRefreshCw className="animate-spin mr-2" />
              Loading reports...
            </div>
          </div>
        ) : filteredReports.length > 0 ? (
          filteredReports.map((report) => (
            <div key={report.id} className="card flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <FiCalendar className="text-primary-600 mr-2" />
                  <h3 className="font-semibold">{report.formattedMonth}</h3>
                </div>
                <span className={`badge ${
                  report.serviceType === 'Link Building'
                    ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                    : report.serviceType === 'PPC'
                      ? 'bg-success-50 text-success-700 dark:bg-success-900/20 dark:text-success-400'
                      : 'bg-secondary-50 text-secondary-700 dark:bg-secondary-800 dark:text-secondary-300'
                }`}>
                  {report.serviceType}
                </span>
              </div>

              <div className="flex-grow">
                {editingReport === report.id ? (
                  <div className="mb-4">
                    <textarea
                      className="w-full p-2 border border-secondary-300 dark:border-secondary-700 rounded-md bg-white dark:bg-secondary-800 text-secondary-900 dark:text-secondary-50 text-sm"
                      rows={4}
                      value={editNotes}
                      onChange={(e) => setEditNotes(e.target.value)}
                      placeholder="Add PM/strategist notes about this report"
                    />
                    <div className="flex justify-end space-x-2 mt-2">
                      <button
                        onClick={() => setEditingReport(null)}
                        className="text-xs text-secondary-600 hover:text-secondary-800 dark:text-secondary-400 dark:hover:text-secondary-200"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleNotesUpdate(report.id)}
                        className="text-xs text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
                      >
                        Save Notes
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="relative group">
                    <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-4">
                      {report.notes || 'No notes added yet.'}
                    </p>
                    <button
                      onClick={() => handleEditClick(report.id, report.notes)}
                      className="absolute top-0 right-0 p-1 text-secondary-400 hover:text-secondary-600 dark:text-secondary-500 dark:hover:text-secondary-300 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Edit Notes"
                    >
                      <FiEdit2 size={14} />
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-secondary-200 dark:border-secondary-700 flex justify-between items-center">
                <div className="flex items-center">
                  <span className="text-xs text-secondary-500 dark:text-secondary-400">
                    Created: {report.formattedCreatedAt}
                  </span>
                  <button
                    onClick={() => handleDeleteReport(report.id)}
                    className="ml-2 text-danger-500 hover:text-danger-700 dark:text-danger-400 dark:hover:text-danger-300"
                    title="Delete Report"
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>
                {report.pdfUrl ? (
                  <a
                    href={report.pdfUrl}
                    className="btn btn-secondary text-sm py-1.5 flex items-center"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FiDownload className="mr-1" size={14} />
                    Download
                  </a>
                ) : (
                  <span className="text-xs text-secondary-500 dark:text-secondary-400 italic">
                    No PDF available
                  </span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-secondary-500 card">
            No reports found matching your filter criteria.
          </div>
        )}
      </div>

      {/* Upload Modal */}
      <ReportUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSubmit={handleReportSubmit}
      />
    </div>
  );
};

export default Reports;
