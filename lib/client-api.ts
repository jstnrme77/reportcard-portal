/**
 * Client API utility for making API calls
 * This file serves as a central place for all API interactions
 */

import { AirtableRecord } from './airtable';

// Generic fetch function with error handling
export async function fetchData<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json() as T;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

// Function to handle API errors with fallbacks
export function handleApiError<T>(error: unknown, fallback: T): T {
  console.error('API error occurred:', error);
  return fallback;
}

// Type for API response with pagination
export interface PaginatedResponse<T> {
  data: T[];
  offset?: string;
  hasMore: boolean;
}

// Convert Airtable records to our application models
export function mapAirtableRecords<T>(records: AirtableRecord[]): T[] {
  return records.map(record => ({
    id: record.id,
    ...record.fields
  })) as T[];
}
