import React from 'react';

const Loader: React.FC = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
    <div className="h-32 w-1 bg-gray-300 animate-pulse rounded-full" style={{ boxShadow: '0 0 16px #fff' }} />
  </div>
);

export default Loader; 