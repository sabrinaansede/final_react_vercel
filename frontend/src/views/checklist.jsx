import React, { useState, useEffect } from "react";
import { CheckSquare, Plus, Edit, Trash2, ChevronRight, Star } from "lucide-react";
import "./checklist.css";

const ChecklistPersonalizado = () => {
  const [checklists, setChecklists] = useState([]);
  const [selectedChecklist, setSelectedChecklist] = useState(null);
  const [showChecklistForm, setShowChecklistForm] = useState(false);
  const [showItemForm, setShowItemForm] = useState(false);
  const [editingChecklist, setEditingChecklist] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  
  const [checklistFormData, setChecklistFormData] = useState({
    nombre: "",
    descripcion: ""
  });
  
  const [itemFormData, setItemFormData] = useState({
    nombre: "",
    completado: false
  });

  // Cargar checklists del localStorage
  useEffect(() => {
    const loadChecklists = () => {
      try {
        const savedChecklists = localStorage.getItem("checklistsPersonalizados");
        if (savedChecklists) {
          setChecklists(JSON.parse(savedChecklists));
        }
      } catch (error) {
        console.error("Error al cargar checklists:", error);
      }
    };

    loadChecklists();
    
    // Escuchar cambios en localStorage (para sincronización entre pestañas)
    const handleStorageChange = () => {
      loadChecklists();
    };
    window.addEventListener("storage", handleStorageChange);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Guardar checklists en localStorage cuando cambien
  useEffect(() => {
    try {
      localStorage.setItem("checklistsPersonalizados", JSON.stringify(checklists));
    } catch (error) {
      console.error("Error al guardar checklists:", error);
    }
  }, [checklists]);

  const handleCreateChecklist = (e) => {
    e.preventDefault();
    
    const newChecklist = {
      id: Date.now(),
      nombre: checklistFormData.nombre,
      descripcion: checklistFormData.descripcion,
      items: [],
      fechaCreacion: new Date().toISOString()
    };
    
    setChecklists([...checklists, newChecklist]);
    setChecklistFormData({ nombre: "", descripcion: "" });
    setShowChecklistForm(false);
  };

  const handleEditChecklist = (e) => {
    e.preventDefault();
    
    const updatedChecklists = checklists.map(checklist => 
      checklist.id === editingChecklist.id 
        ? { 
            ...checklist, 
            nombre: checklistFormData.nombre,
            descripcion: checklistFormData.descripcion
          }
        : checklist
    );
    
    setChecklists(updatedChecklists);
    
    // Actualizar selectedChecklist si está seleccionado
    if (selectedChecklist && selectedChecklist.id === editingChecklist.id) {
      setSelectedChecklist({
        ...selectedChecklist,
        nombre: checklistFormData.nombre,
        descripcion: checklistFormData.descripcion
      });
    }
    
    setEditingChecklist(null);
    setChecklistFormData({ nombre: "", descripcion: "" });
    setShowChecklistForm(false);
  };

  const handleDeleteChecklist = (checklistId) => {
    if (window.confirm("¿Estás seguro de eliminar este checklist?")) {
      setChecklists(checklists.filter(checklist => checklist.id !== checklistId));
      if (selectedChecklist?.id === checklistId) {
        setSelectedChecklist(null);
      }
    }
  };

  const handleCreateItem = (e) => {
    e.preventDefault();
    
    const newItem = {
      id: Date.now(),
      nombre: itemFormData.nombre,
      completado: false
    };
    
    const updatedChecklists = checklists.map(checklist => 
      checklist.id === selectedChecklist.id 
        ? { ...checklist, items: [...checklist.items, newItem] }
        : checklist
    );
    
    setChecklists(updatedChecklists);
    setSelectedChecklist({ ...selectedChecklist, items: [...selectedChecklist.items, newItem] });
    setItemFormData({ nombre: "", completado: false });
    setShowItemForm(false);
  };

  const handleEditItem = (e) => {
    e.preventDefault();
    
    const updatedChecklists = checklists.map(checklist => 
      checklist.id === selectedChecklist.id 
        ? {
            ...checklist,
            items: checklist.items.map(item =>
              item.id === editingItem.id
                ? { ...item, nombre: itemFormData.nombre }
                : item
            )
          }
        : checklist
    );
    
    setChecklists(updatedChecklists);
    setSelectedChecklist({
      ...selectedChecklist,
      items: selectedChecklist.items.map(item =>
        item.id === editingItem.id
          ? { ...item, nombre: itemFormData.nombre }
          : item
      )
    });
    
    setEditingItem(null);
    setItemFormData({ nombre: "", completado: false });
    setShowItemForm(false);
  };

  const handleToggleItem = (itemId) => {
    const updatedChecklists = checklists.map(checklist =>
      checklist.id === selectedChecklist.id
        ? {
            ...checklist,
            items: checklist.items.map(item =>
              item.id === itemId
                ? { ...item, completado: !item.completado }
                : item
            )
          }
        : checklist
    );

    setChecklists(updatedChecklists);
    setSelectedChecklist({
      ...selectedChecklist,
      items: selectedChecklist.items.map(item =>
        item.id === itemId
          ? { ...item, completado: !item.completado }
          : item
      )
    });

    // Actualizar la checklist activa en localStorage
    const activeChecklist = {
      ...selectedChecklist,
      items: selectedChecklist.items.map(item =>
        item.id === itemId
          ? { ...item, completado: !item.completado }
          : item
      )
    };
    localStorage.setItem("activeChecklist", JSON.stringify(activeChecklist));
  };

  const handleDeleteItem = (itemId) => {
    if (window.confirm("¿Estás seguro de eliminar este elemento?")) {
      const updatedChecklists = checklists.map(checklist => 
        checklist.id === selectedChecklist.id 
          ? {
              ...checklist,
              items: checklist.items.filter(item => item.id !== itemId)
            }
          : checklist
      );
      
      setChecklists(updatedChecklists);
      setSelectedChecklist({
        ...selectedChecklist,
        items: selectedChecklist.items.filter(item => item.id !== itemId)
      });
    }
  };

  const openEditChecklist = (checklist) => {
    setEditingChecklist(checklist);
    setChecklistFormData({ nombre: checklist.nombre, descripcion: checklist.descripcion });
    setShowChecklistForm(true);
  };

  const openEditItem = (item) => {
    setEditingItem(item);
    setItemFormData({ nombre: item.nombre, completado: item.completado });
    setShowItemForm(true);
  };

  const getCompletionPercentage = (checklist) => {
    if (checklist.items.length === 0) return 0;
    const completed = checklist.items.filter(item => item.completado).length;
    return Math.round((completed / checklist.items.length) * 100);
  };

  return (
    <div className="checklist-page">
      <div className="checklist-container">
        <div className="checklist-header">
          <div>
            <h1 className="checklist-title">Mi Checklist</h1>
            <p className="checklist-subtitle">Organizá tus salidas y actividades para no olvidar nada importante</p>
          </div>
          <button 
            className="new-checklist-btn"
            onClick={() => setShowChecklistForm(true)}
          >
            <Plus size={20} />
            Nueva checklist
          </button>
        </div>

        {!selectedChecklist ? (
          <div className="checklists-grid">
            {checklists.map(checklist => (
              <div 
                key={checklist.id} 
                className="checklist-card"
                onClick={() => {
                  setSelectedChecklist(checklist);
                  // Guardar como rutina activa
                  localStorage.setItem("activeChecklist", JSON.stringify(checklist));
                }}
              >
                <div className="checklist-icon">
                  <CheckSquare size={24} />
                </div>
                <div className="checklist-info">
                  <h3>{checklist.nombre}</h3>
                  {checklist.items.length > 0 ? (
                    <div className="checklist-items-preview">
                      {checklist.items.slice(0, 3).map((item, index) => (
                        <span key={item.id} className="item-preview">
                          {index > 0 && ", "}
                          {item.nombre}
                        </span>
                      ))}
                      {checklist.items.length > 3 && <span className="more-items">...</span>}
                    </div>
                  ) : (
                    <span>Sin elementos</span>
                  )}
                </div>
                <div className="checklist-actions">
                  <button 
                    className="action-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditChecklist(checklist);
                    }}
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    className="action-btn delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteChecklist(checklist.id);
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
            
            {checklists.length === 0 && (
              <div className="empty-state">
                <CheckSquare size={48} />
                <p>No hay checklists creados</p>
                <button 
                  className="add-item-btn"
                  onClick={() => setShowChecklistForm(true)}
                >
                  <Plus size={16} />
                  Crear primer checklist
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="checklist-detail">
            <button className="back-btn" onClick={() => setSelectedChecklist(null)}>
              <ChevronRight size={20} style={{ transform: 'rotate(180deg)' }} />
              Volver a categorías
            </button>

            <div className="checklist-detail-card">
              <div className="checklist-detail-header">
                <div className="checklist-title-section">
                  <h2>{selectedChecklist.nombre}</h2>
                  <div className="completion-info">
                    <span className="completed-count">
                      {selectedChecklist.items.filter(i => i.completado).length} de {selectedChecklist.items.length} completados
                    </span>
                  </div>
                </div>
                <button 
                  className="edit-checklist-btn"
                  onClick={() => openEditChecklist(selectedChecklist)}
                >
                  <Edit size={16} />
                  Editar lista
                </button>
              </div>

              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${getCompletionPercentage(selectedChecklist)}%` }}
                />
              </div>

              <div className="items-list">
                {selectedChecklist.items.length === 0 ? (
                  <div className="empty-state">
                    <CheckSquare size={48} />
                    <p>No hay elementos en este checklist</p>
                    <button 
                      className="add-item-btn"
                      onClick={() => setShowItemForm(true)}
                    >
                      <Plus size={16} />
                      Agregar primer elemento
                    </button>
                  </div>
                ) : (
                  selectedChecklist.items.map(item => (
                    <div key={item.id} className="item-row">
                      <div className="item-checkbox">
                        <input
                          type="checkbox"
                          checked={item.completado}
                          onChange={() => handleToggleItem(item.id)}
                        />
                      </div>
                      <div className="item-content">
                        <span className={`item-name ${item.completado ? 'completed' : ''}`}>
                          {item.nombre}
                        </span>
                      </div>
                      <div className="item-actions">
                        <button 
                          className="action-btn"
                          onClick={() => openEditItem(item)}
                        >
                          <Edit size={14} />
                        </button>
                        <button 
                          className="action-btn delete"
                          onClick={() => handleDeleteItem(item.id)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <button 
                className="add-item-btn"
                onClick={() => setShowItemForm(true)}
              >
                <Plus size={16} />
                Agregar elemento
              </button>
            </div>

            {/* Tarjeta de recomendaciones */}
            <div className="recommendations-card">
              <div className="recommendations-header">
                <h3>💡 Recomendaciones</h3>
              </div>
              <ul className="recommendations-list">
                <li>Prepará tu checklist la noche anterior para evitar olvidos de última hora</li>
                <li>Revisá los elementos antes de salir de casa</li>
                <li>Usá mochilas o bolsas organizadoras para cada categoría</li>
                <li>Mantené tus checklists actualizados según tus necesidades</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Modal para crear/editar checklist */}
      {showChecklistForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">
                {editingChecklist ? 'Editar checklist' : 'Crear nuevo checklist'}
              </h2>
              <button onClick={() => {
                setShowChecklistForm(false);
                setEditingChecklist(null);
                setChecklistFormData({ nombre: "", descripcion: "" });
              }} className="modal-close">
                ✕
              </button>
            </div>

            <form onSubmit={editingChecklist ? handleEditChecklist : handleCreateChecklist} className="checklist-form">
              <div className="form-group">
                <label>Nombre del checklist *</label>
                <input
                  type="text"
                  value={checklistFormData.nombre}
                  onChange={(e) => setChecklistFormData({ ...checklistFormData, nombre: e.target.value })}
                  required
                  placeholder="Ej: Escuela, Consulta médica, Viaje"
                />
              </div>

              <div className="form-group">
                <label>Descripción (opcional)</label>
                <textarea
                  value={checklistFormData.descripcion}
                  onChange={(e) => setChecklistFormData({ ...checklistFormData, descripcion: e.target.value })}
                  placeholder="Descripción breve del checklist"
                  rows={3}
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => {
                  setShowChecklistForm(false);
                  setEditingChecklist(null);
                  setChecklistFormData({ nombre: "", descripcion: "" });
                }}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  {editingChecklist ? 'Guardar cambios' : 'Crear checklist'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para crear/editar item */}
      {showItemForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">
                {editingItem ? 'Editar elemento' : 'Agregar elemento'}
              </h2>
              <button onClick={() => {
                setShowItemForm(false);
                setEditingItem(null);
                setItemFormData({ nombre: "", completado: false });
              }} className="modal-close">
                ✕
              </button>
            </div>

            <form onSubmit={editingItem ? handleEditItem : handleCreateItem} className="item-form">
              <div className="form-group">
                <label>Nombre del elemento *</label>
                <input
                  type="text"
                  value={itemFormData.nombre}
                  onChange={(e) => setItemFormData({ ...itemFormData, nombre: e.target.value })}
                  required
                  placeholder="Ej: Auriculares, Botella de agua, Medicación"
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => {
                  setShowItemForm(false);
                  setEditingItem(null);
                  setItemFormData({ nombre: "", completado: false });
                }}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  {editingItem ? 'Guardar cambios' : 'Agregar elemento'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChecklistPersonalizado;
