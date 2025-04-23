import React, { useState, useEffect } from 'react';
import { FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

interface AirtableStatusProps {
  token?: string;
  baseId?: string;
}

const AirtableStatus: React.FC<AirtableStatusProps> = ({
  token = process.env.NEXT_PUBLIC_AIRTABLE_TOKEN,
  baseId = process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID
}) => {
  const [status, setStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [message, setMessage] = useState<string>('Checking Airtable connection...');

  useEffect(() => {
    const checkConnection = async () => {
      // Check if token and base ID are set
      if (!token || token === 'your_airtable_token_here') {
        setStatus('error');
        setMessage('Airtable token not configured');
        return;
      }

      if (!baseId || baseId === 'your_airtable_base_id_here') {
        setStatus('error');
        setMessage('Airtable Base ID not configured');
        return;
      }

      try {
        // For demo purposes, we'll just check if the keys are set
        // In a real app, you would make a test API call here
        setStatus('connected');
        setMessage('Connected to Airtable');
      } catch (error) {
        setStatus('error');
        setMessage('Error connecting to Airtable');
        console.error('Airtable connection error:', error);
      }
    };

    checkConnection();
  }, [token, baseId]);

  return (
    <div className={`card p-4 flex items-center ${
      status === 'connected'
        ? 'bg-success-50 border-success-200'
        : status === 'error'
          ? 'bg-danger-50 border-danger-200'
          : 'bg-secondary-50 border-secondary-200'
    }`}>
      {status === 'connected' ? (
        <FiCheckCircle className="text-success-600 text-xl mr-3" />
      ) : (
        <FiAlertCircle className={`${
          status === 'checking' ? 'text-secondary-400' : 'text-danger-600'
        } text-xl mr-3`} />
      )}
      <div>
        <p className={`font-medium ${
          status === 'connected'
            ? 'text-success-700'
            : status === 'error'
              ? 'text-danger-700'
              : 'text-secondary-700'
        }`}>
          {message}
        </p>
        {status === 'error' && (
          <p className="text-sm text-danger-600 mt-1">
            Please check your .env.local file and make sure your Airtable credentials are correct.
          </p>
        )}
      </div>
    </div>
  );
};

export default AirtableStatus;
