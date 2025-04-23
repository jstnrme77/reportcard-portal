/**
 * Utilities for fetching and parsing Airtable schema information
 */

import { getBase } from './airtable';

export interface FieldSchema {
  id: string;
  name: string;
  type: string;
  options?: any;
  description?: string;
}

export interface TableSchema {
  id: string;
  name: string;
  primaryFieldId: string;
  fields: FieldSchema[];
}

export interface BaseSchema {
  id: string;
  name: string;
  tables: TableSchema[];
}

/**
 * Fetches the schema for an Airtable base
 */
export async function fetchAirtableSchema(baseId?: string): Promise<BaseSchema> {
  try {
    const base = getBase(baseId);

    // Get all tables in the base - we'll use a predefined list of expected tables
    // since the Airtable JS SDK doesn't have a direct method to list all tables
    const expectedTableNames = ['Opportunities', 'Calls', 'Contacts', 'Clients', 'Clients By Month', 'Service Types Per Month', 'Backlinks', 'Guest Posts', 'Target URLs', 'Keywords', 'Anchor Text', 'Services', 'Months', 'Backlink Logs', 'Invoices', 'Team', 'Reminders'];
    const tables: TableSchema[] = [];

    // For each expected table, try to fetch a single record to get the schema
    for (const tableName of expectedTableNames) {
      try {
        // Try to access the table
        const table = base(tableName);

        // Fetch a single record to get field information
        // We limit to 1 record and only select the ID field to minimize data transfer
        const records = await table.select({ maxRecords: 1 }).all();

        // If we get here, the table exists
        // Now we need to extract field information from the record
        const fields: FieldSchema[] = [];
        let primaryFieldId = '';

        // If we have a record, we can extract field information
        if (records.length > 0) {
          const record = records[0];

          // Get all fields from the record
          const fieldNames = Object.keys(record.fields);

          // For each field, create a field schema object
          fieldNames.forEach((fieldName, index) => {
            const fieldValue = record.fields[fieldName];
            let fieldType = typeof fieldValue;

            // Try to determine more specific field types
            if (fieldType === 'object') {
              if (Array.isArray(fieldValue)) {
                fieldType = 'array' as any;
              } else if (fieldValue instanceof Date) {
                fieldType = 'date' as any;
              } else if (fieldValue === null) {
                fieldType = 'null' as any;
              }
            }

            // Create the field schema
            fields.push({
              id: `field_${index}`, // We don't have actual field IDs
              name: fieldName,
              type: fieldType,
              description: ''
            });

            // Assume the first field is the primary field
            if (index === 0) {
              primaryFieldId = `field_${index}`;
            }
          });
        }

        // Add the table to our list
        tables.push({
          id: tableName,
          name: tableName,
          primaryFieldId: primaryFieldId,
          fields: fields
        });
      } catch (tableError) {
        console.warn(`Table ${tableName} not found or error accessing it:`, tableError);
        // Continue with the next table
      }
    }

    return {
      id: baseId || process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID || '',
      name: 'Airtable Base', // The API doesn't easily provide the base name
      tables
    };
  } catch (error) {
    console.error('Error fetching Airtable schema:', error);
    throw error;
  }
}

/**
 * Gets the primary field for a table
 */
export function getPrimaryField(table: TableSchema): FieldSchema | undefined {
  return table.fields.find(field => field.id === table.primaryFieldId);
}

/**
 * Checks if the schema matches the expected structure for our application
 */
export function validateSchema(schema: BaseSchema): { valid: boolean; issues: string[] } {
  const issues: string[] = [];

  // Expected tables
  const expectedTables = ['Opportunities', 'Links', 'Approvals', 'Reports', 'Campaigns', 'Users'];
  const foundTables = schema.tables.map(table => table.name);

  // Check for missing tables
  const missingTables = expectedTables.filter(table => !foundTables.includes(table));
  if (missingTables.length > 0) {
    issues.push(`Missing tables: ${missingTables.join(', ')}`);
  }

  // Check fields for each table
  schema.tables.forEach(table => {
    const fieldNames = table.fields.map(field => field.name);

    switch (table.name) {
      case 'Opportunities':
        checkFields(fieldNames, ['Name', 'Status', 'Number of Calls', 'Deal Value'], table.name, issues);
        break;
      case 'Calls':
        checkFields(fieldNames, ['Name', 'Status', 'Date'], table.name, issues);
        break;
      case 'Contacts':
        checkFields(fieldNames, ['Name', 'Email', 'Phone'], table.name, issues);
        break;
      case 'Clients':
        checkFields(fieldNames, ['Name', 'Status'], table.name, issues);
        break;
      // Add other tables as you discover them
    }
  });

  return {
    valid: issues.length === 0,
    issues
  };
}

function checkFields(actualFields: string[], expectedFields: string[], tableName: string, issues: string[]) {
  const missingFields = expectedFields.filter(field => !actualFields.includes(field));
  if (missingFields.length > 0) {
    issues.push(`Table '${tableName}' is missing fields: ${missingFields.join(', ')}`);
  }
}
