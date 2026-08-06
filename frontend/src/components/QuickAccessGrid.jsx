import React from 'react';
import { useNavigate } from 'react-router-dom';

const QuickAccessGrid = ({ items = [] }) => {
  const navigate = useNavigate();
  return (
    <div className="mb-5">
      <h2 className="home-section-heading mb-3">Accesos rápidos</h2>
      <div className="grid grid-cols-2 gap-3">
        {items.map((it) => (
          <button 
            key={it.id} 
            className="bg-white border border-gray-200 rounded-2xl p-4 hover:border-[#43A1F2] hover:shadow-md transition-all cursor-pointer text-left"
            onClick={() => navigate(it.to)}
          >
            <div className="text-[#43A1F2] text-xs font-bold uppercase tracking-wider mb-1">{it.kicker}</div>
            <div className="text-[#1b2a4a] font-semibold text-sm leading-tight">{it.title}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickAccessGrid;
