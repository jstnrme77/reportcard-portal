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
- Airtable account with API key

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file with your Airtable credentials:

```
NEXT_PUBLIC_AIRTABLE_TOKEN=your_airtable_token
NEXT_PUBLIC_AIRTABLE_BASE_ID=your_airtable_base_id
```

4. Run the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

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

## Deployment to Netlify

### Option 1: Deploy from Git

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Log in to Netlify and click "New site from Git"
3. Select your repository and configure the build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
4. Add your environment variables in the Netlify dashboard:
   - NEXT_PUBLIC_AIRTABLE_TOKEN
   - NEXT_PUBLIC_AIRTABLE_BASE_ID
5. Click "Deploy site"

### Option 2: Deploy using Netlify CLI

1. Install the Netlify CLI:

```bash
npm install -g netlify-cli
```

2. Build your application:

```bash
npm run build
```

3. Deploy to Netlify:

```bash
netlify deploy
```

4. Follow the prompts to create a new site or select an existing one
5. When asked for the publish directory, enter `.next`
6. Preview your site and then deploy to production:

```bash
netlify deploy --prod
```

### Accessing the Deployed Site

Once deployed, the site will be available at the URL provided by Netlify, typically in the format: `https://your-site-name.netlify.app`

## License

This project is licensed under the MIT License.
