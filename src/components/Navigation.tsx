import React from 'react';
import chinaLogo from '../../Images/China.svg';

export const Navigation: React.FC = () => {
  return (
    <nav 
      id="China-main-nav"
      className="fixed top-0 left-0 right-0 z-[100] flex items-center p-4 sm:p-5 transition-all duration-300"
    >
      <div className="flex items-center gap-3">
        <img
          id="China-nav-logo"
          src={chinaLogo}
          alt="China"
          className="w-[26px] h-[26px] object-contain hover:rotate-12 transition-transform duration-300"
        />
        <span className="text-white text-2xl font-playfair italic leading-none select-none hero-text-shadow">
          China
        </span>
      </div>
    </nav>
  );
};
