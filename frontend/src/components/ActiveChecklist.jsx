import React, { useState, useEffect } from "react";
import { CheckSquare, ChevronRight, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ActiveChecklist = () => {
  const navigate = useNavigate();
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

  const getProgressMessage = (percentage) => {
    if (percentage === 0) return 'Empecemos';
    if (percentage === 100) return '¡Checklist completo!';
    return 'Vas avanzando';
  };

  const handleNavigate = () => {
    navigate('/checklist');
  };

  // Si no hay checklist activo, mostrar tarjeta de invitación
  if (!activeChecklist || !activeChecklist.items || activeChecklist.items.length === 0) {
    return (
      <div className="checklist-invitation-card">
        <div className="checklist-invitation-header">
          <CheckSquare size={20} className="checklist-invitation-icon" />
          <h3 className="checklist-invitation-title">Organizá tu día</h3>
        </div>
        <p className="checklist-invitation-subtitle">
          Creá un checklist para organizar tus tareas y actividades.
        </p>
        <button className="checklist-invitation-button" onClick={handleNavigate}>
          <Plus size={16} />
          Crear checklist
        </button>
      </div>
    );
  }

  const completedCount = activeChecklist.items.filter(item => item.completado).length;
  const totalCount = activeChecklist.items.length;
  const percentage = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="checklist-progress-card">
      <div className="checklist-progress-header">
        <div className="checklist-progress-info">
          <div className="checklist-progress-title-row">
            <CheckSquare size={20} className="checklist-progress-icon" />
            <h3 className="checklist-progress-title">{activeChecklist.nombre}</h3>
          </div>
          <p className="checklist-progress-subtitle">
            {completedCount} de {totalCount} tareas
          </p>
        </div>
      </div>

      <div className="checklist-progress-bar-container">
        <div className="checklist-progress-bar">
          <div
            className="checklist-progress-fill"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="checklist-progress-percentage">{percentage}%</span>
      </div>

      <p className="checklist-progress-message">
        {getProgressMessage(percentage)}
      </p>

      <button className="checklist-progress-button" onClick={handleNavigate}>
        Continuar checklist
        <ChevronRight size={18} />
      </button>
    </div>
  );
};

export default ActiveChecklist;
