import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';

const NotFound: React.FC = () => {
  const router = useRouter();

  // Handle client-side routing for GitHub Pages
  useEffect(() => {
    // Check if we're on GitHub Pages and need to handle SPA routing
    const path = window.location.pathname;
    const isGitHubPages = path.includes('/reportcard-portal/');
    
    if (isGitHubPages && !path.endsWith('/')) {
      // Try to route to the correct page in the SPA
      const route = path.replace('/reportcard-portal', '');
      if (route !== '/404') {
        router.replace(route);
      }
    }
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <h1 className="text-4xl font-bold text-secondary-900 dark:text-secondary-50 mb-4">404 - Page Not Found</h1>
      <p className="text-secondary-600 dark:text-secondary-400 mb-8 max-w-md">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link href="/" className="btn btn-primary flex items-center">
        <FiArrowLeft className="mr-2" />
        Return to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;
