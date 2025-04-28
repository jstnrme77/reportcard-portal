import React, { useState, useEffect } from 'react';
import { FiFilter, FiCheck, FiX, FiMessageSquare, FiRefreshCw, FiExternalLink, FiInfo } from 'react-icons/fi';
import { useAirtableData } from '../lib/hooks';
import { Approval, Link } from '../lib/models';
import FeedbackModal from '../components/FeedbackModal';
import { format } from 'date-fns';

// Define types for our data display
interface ApprovalDisplay {
  id: string;
  websiteName: string;
  websiteUrl: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  decisionDate: Date | null;
  formattedDate: string;
  comments: string;
  linkId: string;
  domainRating: number;
  estimatedTraffic: number;
  price: number;
  clientNotes: string;
}

// Helper function to parse date strings
const parseDate = (dateString: string | null | undefined): Date | null => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date;
};

const Approvals: React.FC = () => {
  // Fetch data from Airtable
  const {
    data: airtableApprovals,
    isLoading: approvalsLoading,
    error: approvalsError,
    refetch: refetchApprovals,
    update: updateApproval
  } = useAirtableData<Approval>('Approvals');

  const {
    data: links,
    isLoading: linksLoading,
    error: linksError
  } = useAirtableData<Link>('Links');

  // Combined loading and error states
  const isLoading = approvalsLoading || linksLoading;
  const error = approvalsError || linksError;

  // State for approvals data
  const [approvalsData, setApprovalsData] = useState<ApprovalDisplay[]>([]);

  // Filter state
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modal state
  const [feedbackModal, setFeedbackModal] = useState({
    isOpen: false,
    approvalId: '',
    websiteName: '',
    isRejection: false
  });

  // Convert Airtable data to our display format
  useEffect(() => {
    if (airtableApprovals && airtableApprovals.length > 0 && links) {
      // Create a map of link IDs to URLs for quick lookup
      const linkMap = new Map<string, { 
        url: string, 
        anchor_text: string, 
        domain_rating: number,
        estimated_traffic: number,
        price: number
      }>();
      
      if (links && links.length > 0) {
        links.forEach(link => {
          linkMap.set(link.id, {
            url: link.url,
            anchor_text: link.anchor_text,
            domain_rating: link.domain_rating || 0,
            estimated_traffic: link.estimated_traffic || 0,
            price: link.price || 0
          });
        });
      }

      const formattedApprovals = airtableApprovals.map(approval => {
        const decisionDate = parseDate(approval.decision_date);
        const link = linkMap.get(approval.website_id);

        return {
          id: approval.id,
          websiteName: link?.url.replace(/^https?:\/\//, '').split('/')[0] || 'Unknown Website',
          websiteUrl: link?.url || '#',
          status: approval.status,
          decisionDate: decisionDate,
          formattedDate: decisionDate ? format(decisionDate, 'MMM d, yyyy') : 'Not set',
          comments: approval.comments || '',
          linkId: approval.website_id,
          domainRating: link?.domain_rating || 0,
          estimatedTraffic: link?.estimated_traffic || 0,
          price: link?.price || 0,
          clientNotes: approval.client_notes || ''
        };
      });

      setApprovalsData(formattedApprovals);
    } else if (!isLoading) {
      // If no Airtable data and not loading, use mock data
      setApprovalsData([
        {
          id: '1',
          websiteName: 'example.com',
          websiteUrl: 'https://example.com',
          status: 'Pending',
          decisionDate: null,
          formattedDate: 'Not set',
          comments: 'Awaiting client review',
          linkId: 'link1',
          domainRating: 72,
          estimatedTraffic: 15000,
          price: 350,
          clientNotes: ''
        },
        {
          id: '2',
          websiteName: 'techblog.io',
          websiteUrl: 'https://techblog.io',
          status: 'Approved',
          decisionDate: new Date('2023-04-15'),
          formattedDate: 'Apr 15, 2023',
          comments: 'Client approved placement',
          linkId: 'link2',
          domainRating: 65,
          estimatedTraffic: 8500,
          price: 275,
          clientNotes: 'Good tech site, relevant to our audience'
        },
        {
          id: '3',
          websiteName: 'digitalmarketing.net',
          websiteUrl: 'https://digitalmarketing.net',
          status: 'Rejected',
          decisionDate: new Date('2023-04-10'),
          formattedDate: 'Apr 10, 2023',
          comments: 'Client requested different site',
          linkId: 'link3',
          domainRating: 45,
          estimatedTraffic: 3000,
          price: 150,
          clientNotes: 'Too low domain rating, not a good fit'
        },
        {
          id: '4',
          websiteName: 'seoguide.com',
          websiteUrl: 'https://seoguide.com',
          status: 'Pending',
          decisionDate: null,
          formattedDate: 'Not set',
          comments: 'Awaiting client feedback',
          linkId: 'link4',
          domainRating: 68,
          estimatedTraffic: 12000,
          price: 300,
          clientNotes: ''
        },
        {
          id: '5',
          websiteName: 'contentmarketing.org',
          websiteUrl: 'https://contentmarketing.org',
          status: 'Pending',
          decisionDate: null,
          formattedDate: 'Not set',
          comments: 'Pending review',
          linkId: 'link5',
          domainRating: 75,
          estimatedTraffic: 25000,
          price: 450,
          clientNotes: ''
        }
      ]);
    }
  }, [airtableApprovals, links, isLoading]);

  // Filter approvals by status
  const filteredApprovals = approvalsData.filter(approval => {
    if (statusFilter === 'all') return true;
    return approval.status.toLowerCase() === statusFilter.toLowerCase();
  });

  // Handle approve action
  const handleApprove = (id: string) => {
    const approval = approvalsData.find(a => a.id === id);
    if (!approval) return;

    // Update approval status in state
    const updatedApprovals = approvalsData.map(a => {
      if (a.id === id) {
        return {
          ...a,
          status: 'Approved' as const,
          decisionDate: new Date(),
          formattedDate: format(new Date(), 'MMM d, yyyy')
        };
      }
      return a;
    });

    setApprovalsData(updatedApprovals);

    // Update in Airtable
    if (updateApproval) {
      updateApproval(id, {
        status: 'Approved',
        decision_date: new Date().toISOString()
      }).then(() => {
        refetchApprovals();
      }).catch(error => {
        console.error('Error updating approval:', error);
      });
    }
  };
  
  // Handle reject action
  const handleReject = (id: string) => {
    const approval = approvalsData.find(a => a.id === id);
    if (!approval) return;
    
    // Open feedback modal for rejection reason
    setFeedbackModal({
      isOpen: true,
      approvalId: id,
      websiteName: approval.websiteName,
      isRejection: true
    });
  };

  // Handle opening feedback modal
  const handleOpenFeedback = (id: string, websiteName: string, isRejection: boolean = false) => {
    setFeedbackModal({
      isOpen: true,
      approvalId: id,
      websiteName,
      isRejection
    });
  };

  // Handle feedback submission
  const handleFeedbackSubmit = (comments: string, clientNotes: string = '') => {
    const { approvalId, isRejection } = feedbackModal;
    const approval = approvalsData.find(a => a.id === approvalId);
    if (!approval) return;

    // If this is a rejection and no comments were provided, don't proceed
    if (isRejection && !comments.trim()) {
      alert('Please provide a reason for rejection.');
      return;
    }

    // Update approval status in state
    const updatedApprovals = approvalsData.map(a => {
      if (a.id === approvalId) {
        return {
          ...a,
          status: isRejection ? 'Rejected' as const : a.status,
          comments: comments,
          clientNotes: clientNotes,
          decisionDate: isRejection ? new Date() : a.decisionDate,
          formattedDate: isRejection ? format(new Date(), 'MMM d, yyyy') : a.formattedDate
        };
      }
      return a;
    });

    setApprovalsData(updatedApprovals);

    // Close modal
    setFeedbackModal({
      isOpen: false,
      approvalId: '',
      websiteName: '',
      isRejection: false
    });

    // Update in Airtable
    if (updateApproval) {
      const updateData: any = {
        comments: comments,
        client_notes: clientNotes
      };
      
      if (isRejection) {
        updateData.status = 'Rejected';
        updateData.decision_date = new Date().toISOString();
      }
      
      updateApproval(approvalId, updateData)
        .then(() => {
          refetchApprovals();
        })
        .catch(error => {
          console.error('Error updating approval:', error);
        });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-secondary-50 mb-2">Website Approvals</h1>
          <p className="text-secondary-600 dark:text-secondary-400">
            Review and approve website opportunities for your link building campaign
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <button
            onClick={() => refetchApprovals()}
            className="btn btn-primary flex items-center"
          >
            <FiRefreshCw className="mr-2" />
            Refresh Data
          </button>
        </div>
      </div>

      {/* Instruction Note */}
      <div className="card bg-primary-50 dark:bg-primary-900/20 p-4 mb-6 flex items-start">
        <FiInfo className="text-primary-600 mt-1 mr-3 flex-shrink-0" />
        <div>
          <p className="text-primary-800 dark:text-primary-300 text-sm">
            <strong>Important:</strong> If you reject a website, please leave a reason (e.g., not a good fit, poor design, etc.). 
            This helps us improve future opportunities.
          </p>
          <p className="text-primary-700 dark:text-primary-400 text-sm mt-2">
            Approved websites automatically move into the deliverables queue for next month's builds.
            Websites not used this month may be used in the following month if still relevant.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-6">
        <div className="flex items-center">
          <span className="text-sm font-medium text-secondary-700 dark:text-secondary-300 mr-3">
            <FiFilter className="inline mr-1" />
            Filter by Status:
          </span>
          <div className="flex space-x-2">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded-md text-sm ${
                statusFilter === 'all'
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                  : 'bg-secondary-100 text-secondary-700 dark:bg-secondary-800 dark:text-secondary-400'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-3 py-1 rounded-md text-sm ${
                statusFilter === 'pending'
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                  : 'bg-secondary-100 text-secondary-700 dark:bg-secondary-800 dark:text-secondary-400'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setStatusFilter('approved')}
              className={`px-3 py-1 rounded-md text-sm ${
                statusFilter === 'approved'
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                  : 'bg-secondary-100 text-secondary-700 dark:bg-secondary-800 dark:text-secondary-400'
              }`}
            >
              Approved
            </button>
            <button
              onClick={() => setStatusFilter('rejected')}
              className={`px-3 py-1 rounded-md text-sm ${
                statusFilter === 'rejected'
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                  : 'bg-secondary-100 text-secondary-700 dark:bg-secondary-800 dark:text-secondary-400'
              }`}
            >
              Rejected
            </button>
          </div>
        </div>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card p-4 bg-secondary-50 dark:bg-secondary-800/50">
          <h3 className="text-sm font-medium text-secondary-500 mb-1">Pending Approvals</h3>
          <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-50">
            {approvalsData.filter(a => a.status === 'Pending').length}
          </p>
        </div>

        <div className="card p-4 bg-success-50 dark:bg-success-900/20">
          <h3 className="text-sm font-medium text-success-600 dark:text-success-400 mb-1">Approved</h3>
          <p className="text-2xl font-bold text-success-700 dark:text-success-300">
            {approvalsData.filter(a => a.status === 'Approved').length}
          </p>
        </div>

        <div className="card p-4 bg-danger-50 dark:bg-danger-900/20">
          <h3 className="text-sm font-medium text-danger-600 dark:text-danger-400 mb-1">Rejected</h3>
          <p className="text-2xl font-bold text-danger-900 dark:text-danger-200">
            {approvalsData.filter(a => a.status === 'Rejected').length}
          </p>
        </div>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Website</th>
                <th>DR/DA</th>
                <th>Est. Traffic</th>
                <th>Price</th>
                <th>Status</th>
                <th>Client Notes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-8">
                    <div className="flex justify-center items-center">
                      <FiRefreshCw className="animate-spin mr-2" />
                      Loading approvals...
                    </div>
                  </td>
                </tr>
              ) : filteredApprovals.length > 0 ? (
                filteredApprovals.map((approval) => (
                  <tr key={approval.id}>
                    <td className="font-medium">
                      <a
                        href={approval.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700 hover:underline flex items-center"
                      >
                        <FiExternalLink className="mr-1 flex-shrink-0" />
                        <span>{approval.websiteName}</span>
                      </a>
                    </td>
                    <td className="text-center">
                      <span className={`font-medium ${
                        approval.domainRating >= 70 ? 'text-success-600' :
                        approval.domainRating >= 50 ? 'text-primary-600' :
                        'text-secondary-600'
                      }`}>
                        {approval.domainRating}
                      </span>
                    </td>
                    <td>
                      {approval.estimatedTraffic.toLocaleString()}
                    </td>
                    <td>
                      ${approval.price}
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          approval.status === 'Pending'
                            ? 'badge-pending'
                            : approval.status === 'Approved'
                            ? 'badge-approved'
                            : 'badge-rejected'
                        }`}
                      >
                        {approval.status}
                      </span>
                    </td>
                    <td className="max-w-xs truncate">
                      {approval.clientNotes || (
                        <span className="text-secondary-400 italic text-sm">Add notes...</span>
                      )}
                    </td>
                    <td>
                      <div className="flex space-x-2">
                        {approval.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(approval.id)}
                              className="p-1.5 rounded bg-success-500 hover:bg-success-600 text-white"
                              title="Approve"
                            >
                              <FiCheck size={16} />
                            </button>
                            <button
                              onClick={() => handleReject(approval.id)}
                              className="p-1.5 rounded bg-danger-500 hover:bg-danger-600 text-white"
                              title="Reject"
                            >
                              <FiX size={16} />
                            </button>
                            <button
                              onClick={() => handleOpenFeedback(approval.id, approval.websiteName, false)}
                              className="p-1.5 rounded bg-primary-500 hover:bg-primary-600 text-white"
                              title="Add Notes"
                            >
                              <FiMessageSquare size={16} />
                            </button>
                          </>
                        )}
                        {approval.status !== 'Pending' && (
                          <button
                            onClick={() => handleOpenFeedback(approval.id, approval.websiteName, false)}
                            className="p-1.5 rounded bg-secondary-500 hover:bg-secondary-600 text-white"
                            title="View/Edit Notes"
                          >
                            <FiMessageSquare size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-secondary-500">
                    No approvals found matching your filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Feedback Modal */}
      <FeedbackModal
        websiteName={feedbackModal.websiteName}
        isOpen={feedbackModal.isOpen}
        isRejection={feedbackModal.isRejection}
        onClose={() => setFeedbackModal({ ...feedbackModal, isOpen: false })}
        onSubmit={handleFeedbackSubmit}
      />
    </div>
  );
};

export default Approvals;
