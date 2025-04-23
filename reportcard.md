# Dashboard Portal Project Documentation

## Project Overview
This project is a responsive dashboard mockup built with Next.js and Tailwind CSS. The dashboard includes several key sections:

1. **Homepage/Dashboard** - Featuring welcome message, progress tracking, and opportunity summaries
2. **Approvals Section** - For managing website approvals with status tracking
3. **Live Link Report** - Data table for tracking links with filtering capabilities
4. **Reporting History** - Monthly report snapshots with upload/download functionality

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
- Authentication system
- Real-time data updates
- Export functionality for reports
- Advanced filtering options
- User role management