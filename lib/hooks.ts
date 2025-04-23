/**
 * Custom hooks for data fetching
 * These hooks provide a convenient way to fetch and manage data from Airtable
 */

import { useState, useEffect } from 'react';
import { fetchRecords, createRecord, updateRecord, deleteRecord } from './airtable';

// Hook for fetching data from Airtable
export function useAirtableData<T>(
  tableName: string,
  options?: {
    view?: string;
    maxRecords?: number;
    filterByFormula?: string;
    sort?: Array<{ field: string; direction: 'asc' | 'desc' }>;
    enabled?: boolean;
  }
) {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const enabled = options?.enabled !== undefined ? options.enabled : true;

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (!enabled) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const result = await fetchRecords<T>(tableName, options);
        if (isMounted) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err as Error);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [tableName, JSON.stringify(options), enabled]);

  // Function to refresh data
  const refetch = async () => {
    setIsLoading(true);
    try {
      const result = await fetchRecords<T>(tableName, options);
      setData(result);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to create a new record
  const create = async (fields: Record<string, any>) => {
    try {
      const newRecord = await createRecord<T>(tableName, fields);
      setData(prev => [...prev, newRecord]);
      return newRecord;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  // Function to update a record
  const update = async (recordId: string, fields: Record<string, any>) => {
    try {
      const updatedRecord = await updateRecord<T>(tableName, recordId, fields);
      setData(prev => prev.map(item => (item as any).id === recordId ? updatedRecord : item));
      return updatedRecord;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  // Function to delete a record
  const remove = async (recordId: string) => {
    try {
      await deleteRecord(tableName, recordId);
      setData(prev => prev.filter(item => (item as any).id !== recordId));
      return true;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  return { data, isLoading, error, refetch, create, update, remove };
}
