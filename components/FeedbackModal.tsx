import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';

interface FeedbackModalProps {
  websiteName: string;
  isOpen: boolean;
  isRejection?: boolean;
  onClose: () => void;
  onSubmit: (comments: string, clientNotes?: string) => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({
  websiteName,
  isOpen,
  isRejection = false,
  onClose,
  onSubmit
}) => {
  const [comments, setComments] = useState('');
  const [clientNotes, setClientNotes] = useState('');
  const [error, setError] = useState('');

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setComments('');
      setClientNotes('');
      setError('');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate if rejection reason is required
    if (isRejection && !comments.trim()) {
      setError('Please provide a reason for rejection.');
      return;
    }
    
    onSubmit(comments, clientNotes);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-secondary-900 opacity-75 dark:opacity-90"></div>
        </div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white dark:bg-secondary-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              onClick={onClose}
              className="text-secondary-400 hover:text-secondary-500 dark:text-secondary-500 dark:hover:text-secondary-400 focus:outline-none"
            >
              <FiX size={24} />
            </button>
          </div>

          <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 className="text-lg font-medium leading-6 text-secondary-900 dark:text-secondary-50 mb-4">
              {isRejection ? 'Reject Website' : 'Provide Feedback'}
            </h3>
            
            <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-4">
              {isRejection 
                ? `Please provide a reason for rejecting ${websiteName}. This helps us improve future opportunities.` 
                : `Add notes or feedback for ${websiteName}.`}
            </p>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="comments" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                  {isRejection ? 'Rejection Reason' : 'Comments'} {isRejection && <span className="text-danger-600">*</span>}
                </label>
                <textarea
                  id="comments"
                  rows={4}
                  className={`w-full p-2 border rounded-md bg-white dark:bg-secondary-700 text-secondary-900 dark:text-secondary-50 ${
                    error ? 'border-danger-500 dark:border-danger-400' : 'border-secondary-300 dark:border-secondary-600'
                  }`}
                  placeholder={isRejection ? "Why are you rejecting this website?" : "Add your comments here..."}
                  value={comments}
                  onChange={(e) => {
                    setComments(e.target.value);
                    if (error) setError('');
                  }}
                ></textarea>
                {error && <p className="mt-1 text-sm text-danger-600 dark:text-danger-400">{error}</p>}
              </div>
              
              <div className="mb-4">
                <label htmlFor="clientNotes" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                  Client Notes (Optional)
                </label>
                <textarea
                  id="clientNotes"
                  rows={3}
                  className="w-full p-2 border border-secondary-300 dark:border-secondary-600 rounded-md bg-white dark:bg-secondary-700 text-secondary-900 dark:text-secondary-50"
                  placeholder="Add any additional notes for internal reference..."
                  value={clientNotes}
                  onChange={(e) => setClientNotes(e.target.value)}
                ></textarea>
                <p className="mt-1 text-xs text-secondary-500 dark:text-secondary-400">
                  These notes will be stored for your reference but won't be shared with the website owner.
                </p>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`btn ${isRejection ? 'btn-danger' : 'btn-primary'}`}
                >
                  {isRejection ? 'Reject Website' : 'Submit Feedback'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;
