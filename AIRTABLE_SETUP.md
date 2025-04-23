# Airtable Integration Setup

This document provides instructions on how to connect your Airtable base to the ReportCard Portal.

## Prerequisites

1. An Airtable account
2. A base with tables that match the schema defined in `reportcard.md`
3. Airtable API key

## Getting Your Airtable Token

1. Log in to your Airtable account
2. Go to your [Account Settings](https://airtable.com/account)
3. Under the API section, click on "Generate personal access token"
4. Give your token a name and set the appropriate scopes (at minimum, you need "data.records:read" for all bases you want to access)
5. Copy this token for use in the next steps

## Finding Your Base ID

1. Go to the [Airtable API documentation](https://airtable.com/api)
2. Select the base you want to connect to
3. In the API documentation, you'll see your Base ID in the introduction section
4. It will look something like `appXXXXXXXXXXXXXX`

## Setting Up Your Environment Variables

1. Create a `.env.local` file in the root of your project (if it doesn't exist already)
2. Add the following lines to the file:

```
NEXT_PUBLIC_AIRTABLE_TOKEN=your_token_here
NEXT_PUBLIC_AIRTABLE_BASE_ID=your_base_id_here
```

3. Replace `your_token_here` with your actual personal access token
4. Replace `your_base_id_here` with your actual Base ID
5. Save the file

## Table Structure

The application is configured to work with the following Airtable table structure:

### Opportunities Table
- Name (Primary field)
- Status (Text)
- Number of Calls (Number)
- Status Digit (Number)
- Overall Deal Status (Number)
- Cohort (Array)
- Created Date (Text/Date)
- Record ID (Text)
- Is Deal Won? (Number, 1 for true)
- Max Status Digit (from Calls) (Number)
- Sales Cycle Duration (days) (Object)
- Deal Value (Number)
- Now (Text/Date)
- Number of Calls - Float (Number)
- Notes (Text)
- Last Contacted (Text/Date)
- Days Since Last Contact (Text)
- Trello URL (Text/URL)
- Trello Short ID (Text)
- Trello Status (Text)
- Email (Text/Email)
- Phone (Text)
- Source (Text)
- Trello Old (Text)

### Approvals Table
- id (Primary field)
- website_id (Link to Opportunities table)
- status (Single select: Pending, Approved, Rejected)
- decision_date (Date)
- comments (Long text)

### Links Table
- id (Primary field)
- url (URL)
- anchor_text (Text)
- placement_date (Date)
- domain_rating (Number)
- opportunity_id (Link to Opportunities table)
- content_type (Text)
- is_reserved (Checkbox)
- is_recycled (Checkbox)
- campaign_id (Link to Campaigns table)

### Reports Table
- id (Primary field)
- month (Date)
- service_type (Single select: Link Building, PPC)
- pdf_url (URL)
- notes (Long text)

### Campaigns Table
- id (Primary field)
- name (Text)
- start_date (Date)
- end_date (Date)
- target_links (Number)

### Users Table
- id (Primary field)
- email (Email)
- name (Text)
- role (Single select: Admin, Manager, User)

## Testing the Connection

1. Start the development server with `npm run dev`
2. Go to the Settings page
3. You should see the Airtable connection status
4. If connected, you'll see "Connected to Airtable"
5. If there's an error, check your API key and Base ID

## Viewing Your Airtable Schema

1. After connecting to Airtable, click on the "Airtable Schema" link in the sidebar
2. This page will display all tables and fields in your Airtable base
3. The schema viewer will validate your schema against what the application expects
4. If there are any issues, they will be highlighted with suggestions for fixing them
5. You can use this information to ensure your Airtable structure is compatible with the application

## Using Airtable Data in the Portal

Once connected, the portal will automatically fetch data from your Airtable base for:

- Live Links Report
- Approvals
- Reports
- Dashboard statistics

## Troubleshooting

If you encounter issues with the Airtable connection:

1. Verify your API key and Base ID are correct
2. Check that your Airtable base structure matches the expected schema
3. Ensure your Airtable account has access to the API (some free accounts may have limitations)
4. Check the browser console for any error messages
5. Restart the development server after making changes to environment variables
