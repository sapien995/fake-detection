
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="py-6 px-4 md:px-8 border-b border-brand-secondary">
      <div className="container mx-auto text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-brand-accent tracking-wider">
          K-TRUTH
        </h1>
        <p className="mt-2 text-md md:text-lg text-brand-text-secondary">
          Digital Disinformation Intelligence System
        </p>
      </div>
    </header>
  );
};

export default Header;
