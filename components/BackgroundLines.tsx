import React from 'react';

const lines = Array.from({ length: 12 });

const BackgroundLines: React.FC = () => (
  <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
    <div className="absolute inset-0 flex justify-between opacity-20">
      {lines.map((_, i) => (
        <div
          key={i}
          className="h-full w-px bg-blue-400 animate-bgline"
          style={{ animationDelay: `${i * 0.2}s` }}
        />
      ))}
    </div>
    <style jsx>{`
      @keyframes bgline {
        0%, 100% { transform: scaleY(1); opacity: 0.5; }
        50% { transform: scaleY(1.1); opacity: 1; }
      }
      .animate-bgline {
        animation: bgline 3s ease-in-out infinite;
      }
    `}</style>
  </div>
);

export default BackgroundLines; 