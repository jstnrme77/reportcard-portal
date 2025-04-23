import React, { useState, useEffect } from 'react';
import { FiRefreshCw, FiDatabase } from 'react-icons/fi';
import SchemaViewer from '../components/SchemaViewer';
import { fetchAirtableSchema, BaseSchema } from '../lib/schema';

const SchemaPage: React.FC = () => {
  const [schema, setSchema] = useState<BaseSchema | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const loadSchema = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const schemaData = await fetchAirtableSchema();
      setSchema(schemaData);
    } catch (err) {
      console.error('Error loading schema:', err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSchema();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-secondary-50 flex items-center">
          <FiDatabase className="mr-3" />
          Airtable Schema
        </h1>

        <div className="mt-4 md:mt-0">
          <button
            onClick={loadSchema}
            className="btn btn-primary flex items-center"
            disabled={isLoading}
          >
            <FiRefreshCw className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Loading...' : 'Refresh Schema'}
          </button>
        </div>
      </div>

      <div className="card mb-6">
        <h2 className="text-lg font-semibold mb-2">About Schema Viewer</h2>
        <p className="text-secondary-600 dark:text-secondary-400">
          This page displays the structure of your Airtable base, including all tables and fields.
          Use this information to ensure your Airtable structure matches what the application expects.
        </p>
        <div className="mt-4 p-3 bg-primary-50 dark:bg-primary-900/10 rounded-md">
          <p className="text-sm text-primary-700 dark:text-primary-400">
            <strong>Tip:</strong> If you see validation issues, you may need to adjust your Airtable structure
            or modify the application code to match your schema.
          </p>
        </div>
        <div className="mt-4 p-3 bg-warning-50 dark:bg-warning-900/10 rounded-md">
          <p className="text-sm text-warning-700 dark:text-warning-400">
            <strong>Note:</strong> If you're seeing a 404 error or no tables are displayed, please check:
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>Your Airtable API key is correct in the Settings page</li>
              <li>Your Airtable Base ID is correct in the Settings page</li>
              <li>Your Airtable base contains at least one of the expected tables</li>
              <li>Your Airtable account has API access enabled</li>
            </ul>
          </p>
        </div>
      </div>

      <SchemaViewer
        schema={schema}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
};

export default SchemaPage;
