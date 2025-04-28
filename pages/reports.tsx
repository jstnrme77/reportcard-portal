import React, { useState, useEffect } from 'react';
import { FiDownload, FiUpload, FiCalendar, FiFilter, FiRefreshCw, FiEdit2, FiTrash2, FiFileText, FiInfo, FiDollarSign, FiLink, FiExternalLink, FiX } from 'react-icons/fi';
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
  linksBuilt?: number;
  budgetSpent?: number;
  keyTargetPages?: string[];
  locationBreakdown?: { [key: string]: number };
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
  
  // State for pricing table modal
  const [isPricingTableVisible, setIsPricingTableVisible] = useState(false);

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
          formattedCreatedAt: format(createdAt, 'MMM d, yyyy'),
          linksBuilt: Math.floor(Math.random() * 50) + 20, // Mock data
          budgetSpent: Math.floor(Math.random() * 5000) + 2000, // Mock data
          keyTargetPages: [
            'https://client.com/services',
            'https://client.com/about',
            'https://client.com/products'
          ],
          locationBreakdown: {
            'US': Math.floor(Math.random() * 2000) + 1000,
            'UK': Math.floor(Math.random() * 1000) + 500,
            'Canada': Math.floor(Math.random() * 800) + 300
          }
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
          linksBuilt: 45,
          budgetSpent: 4500,
          keyTargetPages: [
            'https://client.com/services',
            'https://client.com/about',
            'https://client.com/products'
          ],
          locationBreakdown: {
            'US': 2500,
            'UK': 1200,
            'Canada': 800
          }
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
          linksBuilt: 0,
          budgetSpent: 3500,
          keyTargetPages: [
            'https://client.com/services',
            'https://client.com/products'
          ],
          locationBreakdown: {
            'US': 2000,
            'UK': 1000,
            'Canada': 500
          }
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
          linksBuilt: 38,
          budgetSpent: 4200,
          keyTargetPages: [
            'https://client.com/blog',
            'https://client.com/services'
          ],
          locationBreakdown: {
            'US': 2300,
            'UK': 1100,
            'Canada': 800
          }
        },
        {
          id: '4',
          month: `${currentYear}-03-01`,
          formattedMonth: `March ${currentYear}`,
          serviceType: 'PPC',
          pdfUrl: '/reports/march-2025-ppc.pdf',
          notes: 'Optimized ad spend resulted in 15% increase in conversions compared to previous month.',
          createdAt: new Date(`${currentYear}-04-06`),
          formattedCreatedAt: `April 6, ${currentYear}`,
          linksBuilt: 0,
          budgetSpent: 3200,
          keyTargetPages: [
            'https://client.com/products',
            'https://client.com/special-offer'
          ],
          locationBreakdown: {
            'US': 1800,
            'UK': 900,
            'Canada': 500
          }
        },
        {
          id: '5',
          month: `${currentYear}-02-01`,
          formattedMonth: `February ${currentYear}`,
          serviceType: 'Link Building',
          pdfUrl: '/reports/february-2025-link-building.pdf',
          notes: 'Completed 32 link placements with focus on industry-specific websites.',
          createdAt: new Date(`${currentYear}-03-05`),
          formattedCreatedAt: `March 5, ${currentYear}`,
          linksBuilt: 32,
          budgetSpent: 3800,
          keyTargetPages: [
            'https://client.com/services',
            'https://client.com/about'
          ],
          locationBreakdown: {
            'US': 2100,
            'UK': 1000,
            'Canada': 700
          }
        },
        {
          id: '6',
          month: `${currentYear}-02-01`,
          formattedMonth: `February ${currentYear}`,
          serviceType: 'PPC',
          pdfUrl: '/reports/february-2025-ppc.pdf',
          notes: 'Implemented new ad creative with 8% higher CTR than previous versions.',
          createdAt: new Date(`${currentYear}-03-06`),
          formattedCreatedAt: `March 6, ${currentYear}`,
          linksBuilt: 0,
          budgetSpent: 3000,
          keyTargetPages: [
            'https://client.com/products',
            'https://client.com/services'
          ],
          locationBreakdown: {
            'US': 1700,
            'UK': 850,
            'Canada': 450
          }
        }
      ]);
    }
  }, [airtableReports, isLoading]);

  // Handle filter changes
  const handleFilterChange = (filterName: string, value: string) => {
    setFilters({
      ...filters,
      [filterName]: value
    });
  };

  // Get unique months for filter options
  const getUniqueMonths = () => {
    const months = new Set<string>();
    
    reportsData.forEach(report => {
      const [year, month] = report.month.split('-');
      months.add(`${year}-${month}`);
    });
    
    return Array.from(months).sort().reverse();
  };

  // Get unique service types for filter options
  const getUniqueServiceTypes = () => {
    const types = new Set<string>();
    
    reportsData.forEach(report => {
      types.add(report.serviceType);
    });
    
    return Array.from(types).sort();
  };

  // Handle file upload
  const handleUploadClick = () => {
    setIsUploadModalOpen(true);
  };

  // Handle report submission
  const handleReportSubmit = async (data: { month: string; serviceType: string; notes: string; file: File | null }) => {
    try {
      // In a real app, we would upload the file to a storage service
      // and get back a URL to store in the database
      const mockPdfUrl = `/reports/${data.month.replace('-', '')}-${data.serviceType.toLowerCase().replace(' ', '-')}.pdf`;
      
      // Create new report in Airtable
      if (createReport) {
        await createReport({
          month: data.month,
          service_type: data.serviceType as 'Link Building' | 'PPC',
          pdf_url: mockPdfUrl,
          notes: data.notes,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
        
        // Refresh reports data
        refetchReports();
      }
      
      // Close modal
      setIsUploadModalOpen(false);
    } catch (error) {
      console.error('Error creating report:', error);
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
      // Update report in Airtable
      if (updateReport) {
        await updateReport(reportId, {
          notes: editNotes,
          updated_at: new Date().toISOString()
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
        setEditNotes('');
        
        // Refresh reports data
        refetchReports();
      }
    } catch (error) {
      console.error('Error updating report:', error);
    }
  };

  // Handle report deletion
  const handleDeleteReport = async (reportId: string) => {
    if (!confirm('Are you sure you want to delete this report?')) return;
    
    try {
      // Delete report from Airtable
      if (deleteReport) {
        await deleteReport(reportId);
        
        // Update local state
        setReportsData(reportsData.filter(report => report.id !== reportId));
        
        // Refresh reports data
        refetchReports();
      }
    } catch (error) {
      console.error('Error deleting report:', error);
    }
  };

  // Apply filters to reports data
  const filteredReports = reportsData.filter(report => {
    // Filter by month
    if (filters.month !== 'all') {
      const [year, month] = filters.month.split('-');
      const reportDate = new Date(report.month);
      if (reportDate.getFullYear() !== parseInt(year) || reportDate.getMonth() + 1 !== parseInt(month)) {
        return false;
      }
    }
    
    // Filter by service type
    if (filters.serviceType !== 'all' && report.serviceType !== filters.serviceType) {
      return false;
    }
    
    return true;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-secondary-50 mb-2">Monthly Reports</h1>
          <p className="text-secondary-600 dark:text-secondary-400">
            Access and download your monthly campaign reports
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-3">
          <button
            onClick={() => setIsPricingTableVisible(!isPricingTableVisible)}
            className="btn btn-secondary flex items-center"
          >
            <FiDollarSign className="mr-2" />
            Pricing Table
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

      {/* Pricing Table */}
      {isPricingTableVisible && (
        <div className="card mb-6 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Link Pricing Tiers</h2>
            <button 
              onClick={() => setIsPricingTableVisible(false)}
              className="text-secondary-500 hover:text-secondary-700"
            >
              <FiX size={20} />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-secondary-200 dark:divide-secondary-700">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">DR/DA Range</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Price Tier</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-200 dark:divide-secondary-700">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">70+</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">$350-500</td>
                  <td className="px-6 py-4 text-sm">Premium tier with high authority sites</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">50-69</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">$200-349</td>
                  <td className="px-6 py-4 text-sm">Mid-tier sites with good authority</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">30-49</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">$100-199</td>
                  <td className="px-6 py-4 text-sm">Standard tier sites</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">Below 30</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">$50-99</td>
                  <td className="px-6 py-4 text-sm">Entry level sites, good for diversity</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-secondary-500">
            <FiInfo className="inline mr-1" />
            Prices may vary based on site relevance, traffic, and placement difficulty.
          </p>
        </div>
      )}

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
              <option value="all">All Months</option>
              {getUniqueMonths().map((month) => {
                const [year, monthNum] = month.split('-');
                const date = new Date(parseInt(year), parseInt(monthNum) - 1);
                return (
                  <option key={month} value={month}>
                    {format(date, 'MMMM yyyy')}
                  </option>
                );
              })}
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
        </div>
      </div>

      {/* Report Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full flex justify-center items-center py-12">
            <FiRefreshCw className="animate-spin mr-2" />
            <span>Loading reports...</span>
          </div>
        ) : filteredReports.length > 0 ? (
          filteredReports.map((report) => (
            <div key={report.id} className="card overflow-hidden">
              <div className="p-6 border-b border-secondary-200 dark:border-secondary-700">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-secondary-900 dark:text-secondary-50">
                    {report.formattedMonth}
                  </h3>
                  <span className={`badge ${
                    report.serviceType === 'Link Building' ? 'badge-primary' : 'badge-success'
                  }`}>
                    {report.serviceType}
                  </span>
                </div>
                
                {/* Overview Data */}
                <div className="space-y-3 mb-4">
                  {report.serviceType === 'Link Building' && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-secondary-600 dark:text-secondary-400">Links Built:</span>
                      <span className="font-semibold">{report.linksBuilt}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-secondary-600 dark:text-secondary-400">Budget Spent:</span>
                    <span className="font-semibold">${report.budgetSpent?.toLocaleString()}</span>
                  </div>
                  
                  <div>
                    <div className="text-sm text-secondary-600 dark:text-secondary-400 mb-1">Key Target Pages:</div>
                    <div className="space-y-1">
                      {report.keyTargetPages?.slice(0, 2).map((page, index) => (
                        <div key={index} className="text-xs text-primary-600 truncate">
                          <FiLink className="inline mr-1" size={12} />
                          {page.replace('https://', '')}
                        </div>
                      ))}
                      {(report.keyTargetPages?.length || 0) > 2 && (
                        <div className="text-xs text-secondary-500">
                          +{(report.keyTargetPages?.length || 0) - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {Object.keys(report.locationBreakdown || {}).length > 0 && (
                    <div>
                      <div className="text-sm text-secondary-600 dark:text-secondary-400 mb-1">Cost by Location:</div>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(report.locationBreakdown || {}).map(([location, cost]) => (
                          <div key={location} className="text-xs">
                            <span className="text-secondary-600 dark:text-secondary-400">{location}:</span>
                            <span className="ml-1 font-medium">${cost}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="p-6">
                {editingReport === report.id ? (
                  <div className="mb-4">
                    <textarea
                      className="w-full p-2 border border-secondary-300 dark:border-secondary-700 rounded-md bg-white dark:bg-secondary-800 text-secondary-900 dark:text-secondary-50 text-sm"
                      rows={4}
                      value={editNotes}
                      onChange={(e) => setEditNotes(e.target.value)}
                      placeholder="Add notes about this report"
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
                  <div className="relative group min-h-[80px]">
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
                
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-secondary-200 dark:border-secondary-700">
                  <div className="flex items-center">
                    <span className="text-xs text-secondary-500 dark:text-secondary-400">
                      {report.formattedCreatedAt}
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
