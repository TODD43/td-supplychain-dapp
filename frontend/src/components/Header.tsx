import React from 'react';

const Header: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <header className="bg-slate-900 border-b border-slate-700 sticky top-0 z-50">
      <div className="container flex justify-between items-center py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">SC</span>
          </div>
          <div>
            <h1 className="text-xl font-bold">TD SupplyChain</h1>
            <p className="text-xs text-slate-400">Blockchain Provenance & Asset Tracking</p>
          </div>
        </div>
        {children}
      </div>
    </header>
  );
};

export default Header;
