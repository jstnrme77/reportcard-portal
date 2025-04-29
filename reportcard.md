# Dashboard Portal Project Documentation

## Project Overview
This project is a responsive dashboard mockup built with Next.js and Tailwind CSS. The dashboard includes several key sections:

1. **Homepage/Dashboard** - Featuring welcome message, campaign status summary, monthly link targets vs. landed visualization, work-in-progress items, and instructional content
2. **Approvals Section** - For managing website approvals with status tracking, one-click approve/reject functionality, and client feedback collection
3. **Deliverables** - Data table for tracking links with filtering capabilities for month, campaign, content type, and opportunity type (reserved/recycled)
4. **Reporting History** - Monthly report snapshots with upload/download functionality, commentary fields, and service type filters

## Database Schema

### Users
- id: UUID (Primary Key)
- email: String
- name: String
- role: Enum (Admin, Manager, User)
- created_at: DateTime
- updated_at: DateTime

### Opportunities
- id: UUID (Primary Key)
- website_name: String
- url: String
- status: Enum (Pending, In Progress, Completed)
- domain_rating: Float
- added_date: DateTime
- user_id: UUID (Foreign Key)
- campaign_id: UUID (Foreign Key)
- created_at: DateTime
- updated_at: DateTime

### Approvals
- id: UUID (Primary Key)
- website_id: UUID (Foreign Key)
- status: Enum (Pending, Approved, Rejected)
- decision_date: DateTime
- comments: Text
- created_at: DateTime
- updated_at: DateTime

### Links
- id: UUID (Primary Key)
- url: String
- anchor_text: String
- placement_date: DateTime
- domain_rating: Float
- opportunity_id: UUID (Foreign Key)
- content_type: String
- is_reserved: Boolean
- is_recycled: Boolean
- campaign_id: UUID (Foreign Key)
- created_at: DateTime
- updated_at: DateTime

### Reports
- id: UUID (Primary Key)
- month: Date
- service_type: Enum (Link Building, PPC)
- pdf_url: String
- notes: Text
- created_at: DateTime
- updated_at: DateTime

### Campaigns
- id: UUID (Primary Key)
- name: String
- start_date: DateTime
- end_date: DateTime
- target_links: Integer
- created_at: DateTime
- updated_at: DateTime

## Project Structure
- `/pages` - Next.js pages
- `/components` - Reusable UI components
- `/styles` - Global styles and Tailwind configuration
- `/lib` - Utility functions and API clients
- `/public` - Static assets

## Design Guidelines
- Minimalist design approach
- Rounded corners for cards and buttons
- Soft shadows for depth
- Consistent spacing
- Clear typography hierarchy
- Responsive layout for all device sizes

## Implementation Details
The dashboard is built using:
- Next.js for the frontend framework
- Tailwind CSS for styling
- TypeScript for type safety
- React hooks for state management
- Context API for global state
- Chart.js for data visualization
- Airtable API for data storage and retrieval

### Homepage Features
- Campaign status summary showing total links built, links this month, pending approvals, and monthly target
- Monthly progress bar to track achievement against targets
- Monthly link targets vs. landed chart using Chart.js
- Work-in-progress section showing opportunities added, placements in progress, and pending approvals
- Welcome guide and "How to use the portal" section with instructional content

### Approvals Features
- List of websites needing client approval with domain rating and traffic information
- One-click approve or reject functionality
- Feedback form for rejection reasons
- Status badges (Pending, Approved, Rejected)
- Instruction note explaining the approval process

### Deliverables Features
- Table of placed links showing URL, anchor text, placement date, domain rating
- Filters for month, campaign, and content type
- Budget summary with allocated budget, used budget, and links delivered
- Cost breakdown by service type
- View for reserved or recycled opportunities with dedicated filter

### Reporting Features
- Monthly snapshots of campaign progress
- PDF upload/download capability
- Commentary fields for PM/strategist notes
- Filters for month and service type
- Overview data including links built, budget spent, key target pages, and location breakdown

## Airtable Integration
The application integrates with Airtable as its primary data source:

- Uses Airtable's API for fetching and updating data
- Custom hooks for data fetching with loading states and error handling
- Support for filtering and sorting data directly from Airtable
- Schema validation to ensure compatibility between the application and Airtable base
- Environment variables for configuring Airtable token and base ID
- Support for reserved and recycled opportunities tracking
- Campaign and client data relationships

## Deployment

### GitHub Pages Configuration
- The project is configured for deployment to GitHub Pages
- Static site generation using Next.js export functionality
- Automated deployment via GitHub Actions workflow
- Base path and asset prefix configured for repository subdirectory

### Deployment Process
- Automatic deployment on push to main branch
- Manual deployment available through npm run export
- Static files generated in the out directory
- GitHub Pages serves content from the gh-pages branch

## Future Enhancements
- Authentication system with user login and session management
- Real-time data updates using webhooks or polling
- Export functionality for reports and deliverables to CSV/Excel
- Advanced filtering options with saved filter presets
- User role management with permission controls
- Email notifications for new approvals or reports
- Mobile app version for on-the-go access
- Integration with additional data sources beyond Airtable
- Enhanced data visualization with more chart types and interactive elements
- Automated reporting with scheduled PDF generation