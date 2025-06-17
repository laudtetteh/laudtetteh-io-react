import React from 'react';

const HomeSection: React.FC = () => {
  return (
    <div id="home" className="arlo_tm_section animated">
      <div className="arlo_tm_home">
        <div className="content">
          <h3>David Parker</h3>
          {/* Animated text is now injected outside React's control */}
        </div>
      </div>
    </div>
  );
};

export default HomeSection; 