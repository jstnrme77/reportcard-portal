import React from 'react';
import { BaseSchema, TableSchema, FieldSchema, getPrimaryField, validateSchema } from '../lib/schema';
import { FiDatabase, FiTable, FiKey, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

interface SchemaViewerProps {
  schema: BaseSchema | null;
  isLoading: boolean;
  error: Error | null;
}

const SchemaViewer: React.FC<SchemaViewerProps> = ({ schema, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="card p-6 text-center">
        <div className="animate-pulse flex flex-col items-center">
          <FiDatabase className="text-4xl text-secondary-400 mb-4" />
          <p className="text-secondary-600 dark:text-secondary-400">Loading schema information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card p-6 bg-danger-50 border-danger-200 text-danger-700">
        <div className="flex items-start">
          <FiAlertCircle className="text-2xl mr-3 mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-semibold mb-2">Error Loading Schema</h3>
            <p>{error.message}</p>
            <p className="mt-2 text-sm">
              Please check your Airtable API key and Base ID in the Settings page.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!schema) {
    return (
      <div className="card p-6 text-center">
        <FiDatabase className="text-4xl text-secondary-400 mb-4" />
        <p className="text-secondary-600 dark:text-secondary-400">No schema information available.</p>
      </div>
    );
  }

  // Validate the schema against our expected structure
  const validation = validateSchema(schema);

  return (
    <div className="space-y-6">
      {/* Schema Overview */}
      <div className="card">
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <FiDatabase className="text-2xl text-primary-600 mr-3" />
            <div>
              <h2 className="text-xl font-semibold">Base: {schema.name}</h2>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">ID: {schema.id}</p>
            </div>
          </div>

          <div className={`flex items-center px-3 py-1 rounded-full text-sm ${
            validation.valid
              ? 'bg-success-50 text-success-700'
              : 'bg-warning-50 text-warning-700'
          }`}>
            {validation.valid ? (
              <>
                <FiCheckCircle className="mr-1" />
                <span>Schema Valid</span>
              </>
            ) : (
              <>
                <FiAlertCircle className="mr-1" />
                <span>Schema Issues</span>
              </>
            )}
          </div>
        </div>

        {!validation.valid && (
          <div className="mt-4 p-3 bg-warning-50 border border-warning-200 rounded-md">
            <h3 className="font-medium text-warning-800 mb-2">Schema Validation Issues</h3>
            <ul className="list-disc pl-5 text-sm text-warning-700 space-y-1">
              {validation.issues.map((issue, index) => (
                <li key={index}>{issue}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-4">
          <p className="text-sm text-secondary-600 dark:text-secondary-400">
            This base contains {schema.tables.length} tables with their respective fields.
          </p>
        </div>
      </div>

      {/* Tables */}
      {schema.tables.length === 0 ? (
        <div className="card p-6 text-center">
          <p className="text-secondary-600 dark:text-secondary-400">
            No tables found in your Airtable base. Please check your API key and Base ID in the Settings page.
          </p>
        </div>
      ) : (
        schema.tables.map((table) => (
        <div key={table.id} className="card">
          <div className="flex items-center mb-4">
            <FiTable className="text-xl text-primary-600 mr-2" />
            <h3 className="text-lg font-semibold">{table.name}</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full table">
              <thead>
                <tr>
                  <th className="w-1/4">Field Name</th>
                  <th className="w-1/4">Type</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {table.fields.map((field) => {
                  const isPrimary = field.id === table.primaryFieldId;
                  return (
                    <tr key={field.id} className={isPrimary ? 'bg-primary-50 dark:bg-primary-900/10' : ''}>
                      <td className="flex items-center">
                        {isPrimary && <FiKey className="text-primary-600 mr-2" title="Primary Field" />}
                        <span className={isPrimary ? 'font-medium' : ''}>{field.name}</span>
                      </td>
                      <td>
                        <code className="px-2 py-1 bg-secondary-100 dark:bg-secondary-800 rounded text-xs">
                          {field.type}
                        </code>
                      </td>
                      <td className="text-sm text-secondary-600 dark:text-secondary-400">
                        {field.description || (isPrimary ? 'Primary field for this table' : '')}

                        {/* We don't have select options in our simplified schema */}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )))
      }
    </div>
  );
};

export default SchemaViewer;
