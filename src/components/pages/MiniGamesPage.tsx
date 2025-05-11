import React from 'react';

function MiniGamesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-primary-100 mb-8">Mini Games</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Mini games will be implemented here */}
        <div className="bg-primary-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-semibold text-primary-100 mb-4">Coming Soon!</h2>
          <p className="text-primary-200">
            Mini games are currently in development. Check back later for exciting new ways to earn rewards!
          </p>
        </div>
      </div>
    </div>
  );
}

export default MiniGamesPage;