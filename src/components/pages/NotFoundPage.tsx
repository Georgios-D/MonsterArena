import React from 'react';
import { Link } from 'react-router-dom';
import { Ghost } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-primary-900 flex flex-col items-center justify-center p-4 text-white">
      <Ghost className="w-24 h-24 mb-8 text-accent-400" />
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-xl text-primary-200 mb-8">
        Oops! The monster you're looking for seems to have escaped.
      </p>
      <Link 
        to="/" 
        className="px-6 py-3 bg-accent-500 hover:bg-accent-600 rounded-lg transition-colors duration-200 font-semibold"
      >
        Return to Home
      </Link>
    </div>
  );
};

export default NotFoundPage;