import React, { useState, useEffect } from 'react';
import { FiFilter, FiCheck, FiMessageSquare, FiRefreshCw, FiExternalLink } from 'react-icons/fi';
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
    websiteName: ''
  });

  // Convert Airtable data to our display format
  useEffect(() => {
    if (airtableApprovals && airtableApprovals.length > 0 && links) {
      // Create a map of link IDs to URLs for quick lookup
      const linkMap = new Map<string, { url: string, anchor_text: string }>();
      if (links && links.length > 0) {
        links.forEach(link => {
          linkMap.set(link.id, {
            url: link.url,
            anchor_text: link.anchor_text
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
          linkId: approval.website_id
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
          linkId: 'link1'
        },
        {
          id: '2',
          websiteName: 'techblog.io',
          websiteUrl: 'https://techblog.io',
          status: 'Approved',
          decisionDate: new Date('2023-04-15'),
          formattedDate: 'Apr 15, 2023',
          comments: 'Client approved placement',
          linkId: 'link2'
        },
        {
          id: '3',
          websiteName: 'digitalmarketing.net',
          websiteUrl: 'https://digitalmarketing.net',
          status: 'Rejected',
          decisionDate: new Date('2023-04-10'),
          formattedDate: 'Apr 10, 2023',
          comments: 'Client requested different site',
          linkId: 'link3'
        },
        {
          id: '4',
          websiteName: 'seoguide.com',
          websiteUrl: 'https://seoguide.com',
          status: 'Pending',
          decisionDate: null,
          formattedDate: 'Not set',
          comments: 'Sent to client on 2023-04-20',
          linkId: 'link4'
        },
        {
          id: '5',
          websiteName: 'contentwriter.org',
          websiteUrl: 'https://contentwriter.org',
          status: 'Pending',
          decisionDate: null,
          formattedDate: 'Not set',
          comments: 'Awaiting client feedback',
          linkId: 'link5'
        },
      ]);
    }
  }, [airtableApprovals, links, isLoading]);

  // Handle approve action
  const handleApprove = async (id: string) => {
    try {
      const today = new Date().toISOString().split('T')[0];

      // Update in Airtable
      if (updateApproval) {
        await updateApproval(id, {
          status: 'Approved',
          decision_date: today,
          comments: 'Client approved'
        });
      }

      // Update local state
      setApprovalsData(
        approvalsData.map((approval) =>
          approval.id === id
            ? {
                ...approval,
                status: 'Approved',
                decisionDate: new Date(),
                formattedDate: format(new Date(), 'MMM d, yyyy'),
                comments: 'Client approved'
              }
            : approval
        )
      );
    } catch (error) {
      console.error('Error approving website:', error);
      alert('Failed to approve website. Please try again.');
    }
  };

  // Handle opening feedback modal
  const handleOpenFeedback = (id: string, websiteName: string) => {
    setFeedbackModal({
      isOpen: true,
      approvalId: id,
      websiteName
    });
  };

  // Handle feedback submission
  const handleFeedbackSubmit = async (comments: string) => {
    try {
      const id = feedbackModal.approvalId;
      const today = new Date().toISOString().split('T')[0];

      // Update in Airtable
      if (updateApproval) {
        await updateApproval(id, {
          status: 'Rejected',
          decision_date: today,
          comments: comments
        });
      }

      // Update local state
      setApprovalsData(
        approvalsData.map((approval) =>
          approval.id === id
            ? {
                ...approval,
                status: 'Rejected',
                decisionDate: new Date(),
                formattedDate: format(new Date(), 'MMM d, yyyy'),
                comments: comments
              }
            : approval
        )
      );
    } catch (error) {
      console.error('Error rejecting website:', error);
      alert('Failed to reject website. Please try again.');
    }
  };

  // Filter approvals based on selected status
  const filteredApprovals = statusFilter === 'all'
    ? approvalsData
    : approvalsData.filter(approval => approval.status.toLowerCase() === statusFilter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-secondary-50">Website Approvals</h1>

        <div className="mt-4 md:mt-0 flex items-center space-x-3">
          <button
            onClick={() => refetchApprovals()}
            className="btn btn-secondary flex items-center"
            disabled={isLoading}
          >
            <FiRefreshCw className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Loading...' : 'Refresh'}
          </button>

          <div className="relative">
            <select
              className="filter-select pr-8 appearance-none"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <FiFilter className="absolute right-2 top-1/2 transform -translate-y-1/2 text-secondary-500" />
          </div>
        </div>
      </div>

      {error && (
        <div className="card bg-danger-50 border-danger-200 text-danger-700">
          <p>Error loading data from Airtable. Please check your connection.</p>
        </div>
      )}

      {/* Status Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-4 bg-warning-50 dark:bg-warning-900/20 border border-warning-100 dark:border-warning-800/30">
          <h3 className="text-sm font-medium text-warning-800 dark:text-warning-300 mb-1">Pending Approvals</h3>
          <p className="text-2xl font-bold text-warning-900 dark:text-warning-200">
            {approvalsData.filter(a => a.status === 'Pending').length}
          </p>
        </div>

        <div className="card p-4 bg-success-50 dark:bg-success-900/20 border border-success-100 dark:border-success-800/30">
          <h3 className="text-sm font-medium text-success-800 dark:text-success-300 mb-1">Approved Websites</h3>
          <p className="text-2xl font-bold text-success-900 dark:text-success-200">
            {approvalsData.filter(a => a.status === 'Approved').length}
          </p>
        </div>

        <div className="card p-4 bg-danger-50 dark:bg-danger-900/20 border border-danger-100 dark:border-danger-800/30">
          <h3 className="text-sm font-medium text-danger-800 dark:text-danger-300 mb-1">Rejected Websites</h3>
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
                <th>Status</th>
                <th>Decision Date</th>
                <th>Comments</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="text-center py-8">
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
                    <td>{approval.formattedDate}</td>
                    <td className="max-w-xs truncate">{approval.comments}</td>
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
                              onClick={() => handleOpenFeedback(approval.id, approval.websiteName)}
                              className="p-1.5 rounded bg-primary-500 hover:bg-primary-600 text-white"
                              title="Provide Feedback"
                            >
                              <FiMessageSquare size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-secondary-500">
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
        onClose={() => setFeedbackModal({ ...feedbackModal, isOpen: false })}
        onSubmit={handleFeedbackSubmit}
      />
    </div>
  );
};

export default Approvals;
