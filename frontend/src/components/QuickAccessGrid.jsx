import React from 'react';
import { useNavigate } from 'react-router-dom';

const QuickAccessGrid = ({ items = [] }) => {
  const navigate = useNavigate();
  return (
    <div className="mb-5">
      <h2 className="text-[18px] font-bold text-[#0f172a] mb-3">Accesos rápidos</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {items.map((it) => (
          <button 
            key={it.id} 
            className="bg-white border border-gray-200 rounded-2xl p-4 lg:p-5 hover:border-[#43A1F2] hover:shadow-md transition-all cursor-pointer text-left group"
            onClick={() => navigate(it.to)}
          >
            <div className="text-[#43A1F2] text-xs font-bold uppercase tracking-wider mb-1 lg:mb-2 group-hover:scale-105 transition-transform">{it.kicker}</div>
            <div className="text-[#1b2a4a] font-semibold text-sm lg:text-base leading-tight">{it.title}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickAccessGrid;
