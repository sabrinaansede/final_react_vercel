import React, { useState, useEffect } from "react";
import { CheckSquare, ChevronRight, X } from "lucide-react";

const ActiveChecklist = () => {
  const [activeChecklist, setActiveChecklist] = useState(null);

  useEffect(() => {
    const loadActiveChecklist = () => {
      try {
        const saved = localStorage.getItem("activeChecklist");
        if (saved) {
          setActiveChecklist(JSON.parse(saved));
        }
      } catch {}
    };

    loadActiveChecklist();
    window.addEventListener("storage", loadActiveChecklist);
    return () => window.removeEventListener("storage", loadActiveChecklist);
  }, []);

  const handleToggleItem = (itemId) => {
    if (!activeChecklist) return;

    const updatedItems = activeChecklist.items.map(item =>
      item.id === itemId
        ? { ...item, completado: !item.completado }
        : item
    );

    const updatedChecklist = { ...activeChecklist, items: updatedItems };
    setActiveChecklist(updatedChecklist);
    localStorage.setItem("activeChecklist", JSON.stringify(updatedChecklist));

    try {
      const checklists = JSON.parse(localStorage.getItem("checklistsPersonalizados") || "[]");
      const updatedChecklists = checklists.map(checklist =>
        checklist.id === activeChecklist.id
          ? { ...checklist, items: updatedItems }
          : checklist
      );
      localStorage.setItem("checklistsPersonalizados", JSON.stringify(updatedChecklists));
    } catch {}
  };

  const handleDismiss = () => {
    localStorage.removeItem("activeChecklist");
    setActiveChecklist(null);
  };

  if (!activeChecklist || !activeChecklist.items || activeChecklist.items.length === 0) {
    return null;
  }

  const completedCount = activeChecklist.items.filter(item => item.completado).length;
  const totalCount = activeChecklist.items.length;
  const percentage = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="bg-white rounded-2xl p-5 shadow-md border-2 border-[#43A1F2] mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-lg font-bold text-[#1B2A4A]">
          <CheckSquare size={20} className="text-[#43A1F2]" />
          <span>{activeChecklist.nombre}</span>
        </div>
        <button 
          className="bg-gray-100 border-none rounded-lg w-7 h-7 flex items-center justify-center cursor-pointer text-gray-500 hover:bg-gray-200 hover:text-[#1B2A4A] transition-all"
          onClick={handleDismiss}
        >
          <X size={16} />
        </button>
      </div>

      <div className="mb-4">
        <div className="text-sm text-gray-500 font-medium mb-2">
          {completedCount} de {totalCount} completados
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-[#43A1F2] to-[#2E7BB8] transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 mb-4">
        {activeChecklist.items.slice(0, 3).map(item => (
          <div key={item.id} className="flex items-center gap-2.5 p-2 bg-gray-50 rounded-lg hover:bg-blue-50 transition-all">
            <input
              type="checkbox"
              checked={item.completado}
              onChange={() => handleToggleItem(item.id)}
              className="w-4.5 h-4.5 cursor-pointer accent-[#43A1F2]"
            />
            <span className={`text-sm font-medium text-gray-700 transition-all ${item.completado ? 'line-through text-gray-400' : ''}`}>
              {item.nombre}
            </span>
          </div>
        ))}
        {activeChecklist.items.length > 3 && (
          <div className="text-sm text-gray-500 font-medium text-center py-2">
            +{activeChecklist.items.length - 3} más
          </div>
        )}
      </div>

      <button 
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#43A1F2] to-[#2E7BB8] text-white border-none rounded-xl py-3 text-sm font-semibold cursor-pointer hover:-translate-y-0.5 hover:shadow-lg transition-all"
        onClick={() => window.location.href = '/checklist'}
      >
        Ver checklist completo
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default ActiveChecklist;
