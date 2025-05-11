import React from 'react';

function ShopPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-primary-100 mb-8">Shop</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Shop content will be implemented later */}
        <div className="bg-primary-800 rounded-lg p-6 text-center">
          <p className="text-primary-200 text-lg">Shop coming soon!</p>
        </div>
      </div>
    </div>
  );
}

export default ShopPage;