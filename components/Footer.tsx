import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-4 px-6 mt-8" style={{ background: '#999999' }}>
      <div className="max-w-5xl mx-auto text-center text-sm">
        &copy; {new Date().getFullYear()} Laud Tetteh. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer; 