/**
 * Airtable API client
 * This file handles all interactions with the Airtable API
 */

import Airtable from 'airtable';
import { mapAirtableRecords } from './client-api';

// Define the Airtable record structure
export interface AirtableRecord {
  id: string;
  fields: Record<string, any>;
  createdTime: string;
}

// Initialize Airtable with token
export function initAirtable(): Airtable {
  const token = process.env.NEXT_PUBLIC_AIRTABLE_TOKEN;

  if (!token) {
    console.error('Airtable token is missing');
    throw new Error('Airtable token is required');
  }

  return new Airtable({ apiKey: token }); // The SDK still uses apiKey parameter even for tokens
}

// Get a reference to a specific base
export function getBase(baseId: string = process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID || ''): Airtable.Base {
  const airtable = initAirtable();
  return airtable.base(baseId);
}

// Generic function to fetch records from a table
export async function fetchRecords<T>(
  tableName: string,
  options?: {
    view?: string;
    maxRecords?: number;
    filterByFormula?: string;
    sort?: Array<{ field: string; direction: 'asc' | 'desc' }>;
  }
): Promise<T[]> {
  try {
    const base = getBase();
    const records = await base(tableName).select(options).all();
    return mapAirtableRecords<T>(records as unknown as AirtableRecord[]);
  } catch (error) {
    console.error(`Error fetching records from ${tableName}:`, error);
    throw error;
  }
}

// Function to create a record in a table
export async function createRecord<T>(
  tableName: string,
  fields: Record<string, any>
): Promise<T> {
  try {
    const base = getBase();
    const record = await base(tableName).create(fields);
    return {
      id: record.id,
      ...record.fields
    } as unknown as T;
  } catch (error) {
    console.error(`Error creating record in ${tableName}:`, error);
    throw error;
  }
}

// Function to update a record in a table
export async function updateRecord<T>(
  tableName: string,
  recordId: string,
  fields: Record<string, any>
): Promise<T> {
  try {
    const base = getBase();
    const record = await base(tableName).update(recordId, fields);
    return {
      id: record.id,
      ...record.fields
    } as unknown as T;
  } catch (error) {
    console.error(`Error updating record in ${tableName}:`, error);
    throw error;
  }
}

// Function to delete a record from a table
export async function deleteRecord(
  tableName: string,
  recordId: string
): Promise<boolean> {
  try {
    const base = getBase();
    await base(tableName).destroy(recordId);
    return true;
  } catch (error) {
    console.error(`Error deleting record from ${tableName}:`, error);
    throw error;
  }
}
