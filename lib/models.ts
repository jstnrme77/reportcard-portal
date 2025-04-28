/**
 * Data models for the application
 * These types represent the data structures used throughout the application
 */

// Opportunity model based on actual Airtable schema
export interface Opportunity {
  id: string;
  Name: string;
  Status: string;
  'Number of Calls': number;
  'Status Digit': number;
  'Overall Deal Status': number;
  Cohort?: string[];
  'Created Date': string;
  'Record ID': string;
  'Is Deal Won?': number;
  'Max Status Digit (from Calls)': number;
  'Sales Cycle Duration (days)'?: any;
  'Deal Value': number;
  Now?: string;
  'Number of Calls - Float': number;
  Notes?: string;
  'Last Contacted'?: string;
  'Days Since Last Contact'?: string;
  'Trello URL'?: string;
  'Trello Short ID'?: string;
  'Trello Status'?: string;
  Email?: string;
  Phone?: string;
  Source?: string;
  'Trello Old'?: string;
}

// Approval model
export interface Approval {
  id: string;
  website_id: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  decision_date: string | null;
  comments: string;
  client_notes?: string;
  created_at: string;
  updated_at: string;
}

// Link model
export interface Link {
  id: string;
  url: string;
  anchor_text: string;
  placement_date: string;
  domain_rating: number;
  estimated_traffic?: number;
  price?: number;
  target_page?: string;
  link_cost?: number;
  opportunity_id?: string;
  content_type: string;
  is_reserved: boolean;
  is_recycled: boolean;
  campaign_id?: string;
  created_at: string;
  updated_at: string;
}

// Report model
export interface Report {
  id: string;
  month: string;
  service_type: 'Link Building' | 'PPC';
  pdf_url: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

// Campaign model
export interface Campaign {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  target_links: number;
  created_at: string;
  updated_at: string;
}

// User model
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'Admin' | 'Manager' | 'User';
  created_at: string;
  updated_at: string;
}

// Client model based on actual Airtable schema
export interface Client {
  id: string;
  'Company Name'?: string;
  Status?: string;
  'Record ID'?: string;
  'Status Code'?: number;
  Manager?: string[];
  Months?: string[];
  'Target URLs'?: string[];
  'Month ID (from Months)'?: string[];
  'Next Action'?: string;
  'Budget Spent'?: number;
  'Total Costs'?: number;
  'Gross Profit'?: number;
  'Live Links'?: number;
  'Event Tracking'?: string;
  'Link Budget_Static'?: number;
  'Budget Spent_STATIC'?: number;
  'Total Costs STATIC'?: number;
  'GROSS PROFIT STATIC'?: number;
  'Traffic Requirements'?: string;
  'Tracking Sheet'?: string;
  'Pricing Plan'?: string[];
  'Link Budget_1'?: number;
  'All Links Rollup'?: number;
  'Link Budget Rollup'?: number;
  'Collaborator (from Manager)'?: string[];
  'Link Tracking Sheet'?: string;
  'Open Backlink Airtable View'?: any;
  'Months With Us'?: number;
  Label?: string;
  Backlinks?: string[];
  Check?: string;
  Created?: string;
  'Month - Year - Surplus'?: string[];
}
