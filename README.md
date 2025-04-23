# Dashboard Portal

A responsive dashboard mockup built with Next.js and Tailwind CSS for link building and reporting.

## Features

- **Homepage / Dashboard**: Welcome message, progress tracking, and opportunity summaries
- **Approvals Section**: Manage website approvals with status tracking
- **Live Link Report**: Data table for tracking links with filtering capabilities
- **Reporting History**: Monthly report snapshots with upload/download functionality
- **Settings**: User preferences and account settings
- **Help**: Documentation and FAQs

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- React Icons
- Chart.js (for data visualization)

## Getting Started

### Prerequisites

- Node.js 14.x or higher
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

- `/pages` - Next.js pages
- `/components` - Reusable UI components
- `/styles` - Global styles and Tailwind configuration
- `/lib` - Utility functions and API clients
- `/public` - Static assets

## Design Guidelines

The dashboard follows a minimalist design approach with:
- Rounded corners for cards and buttons
- Soft shadows for depth
- Consistent spacing
- Clear typography hierarchy
- Responsive layout for all device sizes

## Deployment to GitHub Pages

### Automatic Deployment

This project is configured to automatically deploy to GitHub Pages when changes are pushed to the main branch. The deployment process is handled by GitHub Actions.

### Manual Deployment

To manually deploy the project to GitHub Pages:

1. Build the project:

```bash
npm run export
```

2. The static files will be generated in the `out` directory.

3. Push the contents of the `out` directory to the `gh-pages` branch of your repository.

### Accessing the Deployed Site

Once deployed, the site will be available at: `https://[your-github-username].github.io/reportcard-portal/`

## License

This project is licensed under the MIT License.
