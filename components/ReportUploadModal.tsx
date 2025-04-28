import React, { useState, useRef } from 'react';
import { FiX, FiUpload, FiFile } from 'react-icons/fi';

interface ReportUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { month: string; serviceType: string; notes: string; file: File | null }) => void;
}

const ReportUploadModal: React.FC<ReportUploadModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [month, setMonth] = useState('');
  const [serviceType, setServiceType] = useState('Link Building');
  const [notes, setNotes] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ month, serviceType, notes, file });
    resetForm();
  };

  const resetForm = () => {
    setMonth('');
    setServiceType('Link Building');
    setNotes('');
    setFile(null);
    setFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  // Generate month options (current month and 11 months back)
  const generateMonthOptions = () => {
    const options = [];
    const today = new Date();
    
    for (let i = 0; i < 12; i++) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const value = date.toISOString().split('T')[0].substring(0, 7); // YYYY-MM format
      const label = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
      options.push({ value, label });
    }
    
    return options;
  };

  const monthOptions = generateMonthOptions();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-secondary-900 opacity-75"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white dark:bg-secondary-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white dark:bg-secondary-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg leading-6 font-medium text-secondary-900 dark:text-secondary-50">
                    Upload Monthly Report
                  </h3>
                  <button
                    type="button"
                    className="text-secondary-500 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-200"
                    onClick={handleCancel}
                  >
                    <FiX size={20} />
                  </button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="month" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                      Month
                    </label>
                    <select
                      id="month"
                      className="w-full p-2 border border-secondary-300 dark:border-secondary-700 rounded-md bg-white dark:bg-secondary-800 text-secondary-900 dark:text-secondary-50"
                      value={month}
                      onChange={(e) => setMonth(e.target.value)}
                      required
                    >
                      <option value="">Select Month</option>
                      {monthOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="serviceType" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                      Service Type
                    </label>
                    <select
                      id="serviceType"
                      className="w-full p-2 border border-secondary-300 dark:border-secondary-700 rounded-md bg-white dark:bg-secondary-800 text-secondary-900 dark:text-secondary-50"
                      value={serviceType}
                      onChange={(e) => setServiceType(e.target.value)}
                      required
                    >
                      <option value="Link Building">Link Building</option>
                      <option value="PPC">PPC</option>
                      <option value="Content Marketing">Content Marketing</option>
                      <option value="SEO">SEO</option>
                    </select>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="notes" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                      Commentary / Notes
                    </label>
                    <textarea
                      id="notes"
                      className="w-full p-2 border border-secondary-300 dark:border-secondary-700 rounded-md bg-white dark:bg-secondary-800 text-secondary-900 dark:text-secondary-50"
                      rows={4}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add PM/strategist notes about this report"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                      Report PDF
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-secondary-300 dark:border-secondary-700 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        <FiFile className="mx-auto h-12 w-12 text-secondary-400" />
                        <div className="flex text-sm text-secondary-600 dark:text-secondary-400">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer bg-white dark:bg-secondary-800 rounded-md font-medium text-primary-600 hover:text-primary-500"
                          >
                            <span>Upload a file</span>
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              className="sr-only"
                              accept=".pdf"
                              onChange={handleFileChange}
                              ref={fileInputRef}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-secondary-500 dark:text-secondary-400">
                          PDF up to 10MB
                        </p>
                        {fileName && (
                          <p className="text-sm text-primary-600 mt-2">
                            Selected: {fileName}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary flex items-center"
                      disabled={!month || !serviceType}
                    >
                      <FiUpload className="mr-2" />
                      Upload Report
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportUploadModal;
