import React, { useState } from 'react';
import { FiFilter, FiCheck, FiMessageSquare } from 'react-icons/fi';

// Define types for our data
type ApprovalStatus = 'Pending' | 'Approved' | 'Rejected';

interface Approval {
  id: string;
  websiteName: string;
  status: ApprovalStatus;
  decisionDate: string | null;
  comments: string;
}

const Approvals: React.FC = () => {
  // Mock data for approvals
  const [approvals, setApprovals] = useState<Approval[]>([
    {
      id: '1',
      websiteName: 'example.com',
      status: 'Pending',
      decisionDate: null,
      comments: 'Awaiting client review',
    },
    {
      id: '2',
      websiteName: 'techblog.io',
      status: 'Approved',
      decisionDate: '2025-04-15',
      comments: 'Client approved placement',
    },
    {
      id: '3',
      websiteName: 'digitalmarketing.net',
      status: 'Rejected',
      decisionDate: '2025-04-10',
      comments: 'Client requested different site',
    },
    {
      id: '4',
      websiteName: 'seoguide.com',
      status: 'Pending',
      decisionDate: null,
      comments: 'Sent to client on 2025-04-20',
    },
    {
      id: '5',
      websiteName: 'contentwriter.org',
      status: 'Pending',
      decisionDate: null,
      comments: 'Awaiting client feedback',
    },
  ]);

  // Filter state
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Handle approve action
  const handleApprove = (id: string) => {
    setApprovals(
      approvals.map((approval) =>
        approval.id === id
          ? {
              ...approval,
              status: 'Approved',
              decisionDate: new Date().toISOString().split('T')[0],
            }
          : approval
      )
    );
  };

  // Handle feedback action
  const handleFeedback = (id: string) => {
    // In a real app, this would open a modal for feedback
    alert(`Provide feedback for ${approvals.find(a => a.id === id)?.websiteName}`);
  };

  // Filter approvals based on selected status
  const filteredApprovals = statusFilter === 'all'
    ? approvals
    : approvals.filter(approval => approval.status.toLowerCase() === statusFilter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-secondary-50">Website Approvals</h1>
        
        <div className="mt-4 md:mt-0 flex items-center">
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

      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Website Name</th>
                <th>Status</th>
                <th>Decision Date</th>
                <th>Comments</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApprovals.length > 0 ? (
                filteredApprovals.map((approval) => (
                  <tr key={approval.id}>
                    <td className="font-medium">{approval.websiteName}</td>
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
                    <td>{approval.decisionDate || 'Pending'}</td>
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
                              onClick={() => handleFeedback(approval.id)}
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
    </div>
  );
};

export default Approvals;
