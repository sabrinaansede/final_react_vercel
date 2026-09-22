import React, { useState, useEffect } from "react";
import axios from "axios";
import { CheckSquare, Plus, Edit, Trash2, ChevronRight, Star, Headphones, Droplet, Shield, Sun, Coffee, Heart, BookOpen, ClipboardCheck, HeartHandshake } from "lucide-react";
import "./checklist.css";
import { useAuth } from '../context/AuthContext.jsx';

const API_URL = import.meta.env.VITE_API_URL || "https://autisi-backend.onrender.com";

// Configurar axios para incluir el token
const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const ChecklistPersonalizado = () => {
  const { user } = useAuth();
  const [checklists, setChecklists] = useState([]);
  const [selectedChecklist, setSelectedChecklist] = useState(null);
  const [showChecklistForm, setShowChecklistForm] = useState(false);
  const [showItemForm, setShowItemForm] = useState(false);
  const [editingChecklist, setEditingChecklist] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(true);

  const [checklistFormData, setChecklistFormData] = useState({
    nombre: "",
    descripcion: ""
  });

  
  const [itemFormData, setItemFormData] = useState({
    nombre: "",
    completado: false
  });

  // Cargar checklists de la API
  useEffect(() => {
    const loadChecklists = async () => {
      try {
        if (user?._id) {
          const response = await api.get(`/api/checklists/usuario/${user._id}`);
          setChecklists(response.data);
        }
      } catch (error) {
        console.error("Error al cargar checklists:", error);
        // Fallback a localStorage si falla la API
        try {
          const savedChecklists = localStorage.getItem("checklistsPersonalizados");
          if (savedChecklists) {
            setChecklists(JSON.parse(savedChecklists));
          }
        } catch (localError) {
          console.error("Error al cargar de localStorage:", localError);
        }
      } finally {
        setLoading(false);
      }
    };

    loadChecklists();
  }, [user?._id]);

  // Guardar checklists en localStorage como backup cuando cambien
  useEffect(() => {
    try {
      localStorage.setItem("checklistsPersonalizados", JSON.stringify(checklists));
    } catch (error) {
      console.error("Error al guardar checklists en localStorage:", error);
    }
  }, [checklists]);

  const handleCreateChecklist = async (e) => {
    e.preventDefault();
    
    if (!user || !user._id) {
      console.error("Usuario no disponible:", user);
      alert("No se puede crear el checklist. Usuario no identificado.");
      return;
    }
    
    console.log("Usuario:", user);
    console.log("Usuario ID:", user._id);
    console.log("Token:", localStorage.getItem("token"));
    
    try {
      const newChecklist = {
        usuarioId: user._id,
        nombre: checklistFormData.nombre,
        descripcion: checklistFormData.descripcion,
        items: [],
      };
      
      console.log("Enviando checklist:", newChecklist);
      const response = await api.post(`/api/checklists`, newChecklist);
      console.log("Respuesta:", response.data);
      setChecklists([...checklists, response.data]);
      setChecklistFormData({ nombre: "", descripcion: "" });
      setShowChecklistForm(false);
    } catch (error) {
      console.error("Error al crear checklist:", error);
      console.error("Error response:", error.response);
      console.error("Error message:", error.message);
      alert("Error al crear checklist: " + (error.response?.data?.message || error.message));
      // Fallback a localStorage si falla la API
      const localChecklist = {
        id: Date.now(),
        nombre: checklistFormData.nombre,
        descripcion: checklistFormData.descripcion,
        items: [],
        fechaCreacion: new Date().toISOString()
      };
      setChecklists([...checklists, localChecklist]);
      setChecklistFormData({ nombre: "", descripcion: "" });
      setShowChecklistForm(false);
    }
  };

  const handleEditChecklist = async (e) => {
    e.preventDefault();
    
    try {
      const updatedChecklist = {
        nombre: checklistFormData.nombre,
        descripcion: checklistFormData.descripcion,
      };
      
      const checklistId = editingChecklist._id || editingChecklist.id;
      
      if (!checklistId) {
        throw new Error("No se puede identificar la checklist");
      }
      
      const response = await api.put(`/api/checklists/${checklistId}`, updatedChecklist);
      
      const updatedChecklists = checklists.map(checklist => 
        (checklist._id === checklistId || checklist.id === checklistId) 
          ? response.data
          : checklist
      );
      
      setChecklists(updatedChecklists);
      
      // Actualizar selectedChecklist si está seleccionado
      const selectedId = selectedChecklist?._id || selectedChecklist?.id;
      if (selectedChecklist && selectedId === checklistId) {
        setSelectedChecklist(response.data);
      }
      
      setEditingChecklist(null);
      setChecklistFormData({ nombre: "", descripcion: "" });
      setShowChecklistForm(false);
    } catch (error) {
      console.error("Error al editar checklist:", error);
      // Fallback a localStorage si falla la API
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
    }
  };

  const handleDeleteChecklist = async (checklistId) => {
    if (window.confirm("¿Estás seguro de eliminar este checklist?")) {
      try {
        const id = checklistId._id || checklistId.id || checklistId;
        
        if (!id) {
          throw new Error("No se puede identificar la checklist");
        }
        
        await api.delete(`/api/checklists/${id}`);
        setChecklists(checklists.filter(checklist => 
          (checklist._id !== id && checklist.id !== id)
        ));
        
        const selectedId = selectedChecklist?._id || selectedChecklist?.id;
        if (selectedChecklist && selectedId === id) {
          setSelectedChecklist(null);
        }
      } catch (error) {
        console.error("Error al eliminar checklist:", error);
        // Fallback a localStorage si falla la API
        const id = checklistId._id || checklistId.id || checklistId;
        setChecklists(checklists.filter(checklist => checklist.id !== id));
        
        const selectedId = selectedChecklist?._id || selectedChecklist?.id;
        if (selectedChecklist && selectedId === id) {
          setSelectedChecklist(null);
        }
      }
    }
  };

  const handleCreateItem = async (e) => {
    e.preventDefault();
    
    try {
      const newItem = {
        id: Date.now().toString(),
        nombre: itemFormData.nombre,
        completado: false
      };
      
      const updatedItems = [...selectedChecklist.items, newItem];
      const checklistId = selectedChecklist._id || selectedChecklist.id;
      
      if (!checklistId) {
        throw new Error("No se puede identificar la checklist");
      }
      
      const response = await api.put(`/api/checklists/${checklistId}`, {
        items: updatedItems
      });
      
      const updatedChecklists = checklists.map(checklist => 
        (checklist._id === checklistId || checklist.id === checklistId) 
          ? response.data
          : checklist
      );
      
      setChecklists(updatedChecklists);
      setSelectedChecklist(response.data);
      setItemFormData({ nombre: "", completado: false });
      setShowItemForm(false);
    } catch (error) {
      console.error("Error al crear item:", error);
      // Fallback a localStorage si falla la API
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
    }
  };

  const handleEditItem = async (e) => {
    e.preventDefault();
    
    try {
      const updatedItems = selectedChecklist.items.map(item =>
        item.id === editingItem.id
          ? { ...item, nombre: itemFormData.nombre }
          : item
      );
      
      const checklistId = selectedChecklist._id || selectedChecklist.id;
      
      if (!checklistId) {
        throw new Error("No se puede identificar la checklist");
      }
      
      const response = await api.put(`/api/checklists/${checklistId}`, {
        items: updatedItems
      });
      
      const updatedChecklists = checklists.map(checklist => 
        (checklist._id === checklistId || checklist.id === checklistId) 
          ? response.data
          : checklist
      );
      
      setChecklists(updatedChecklists);
      setSelectedChecklist(response.data);
      
      setEditingItem(null);
      setItemFormData({ nombre: "", completado: false });
      setShowItemForm(false);
    } catch (error) {
      console.error("Error al editar item:", error);
      // Fallback a localStorage si falla la API
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
    }
  };

  const handleToggleItem = async (itemId) => {
    try {
      const updatedItems = selectedChecklist.items.map(item =>
        item.id === itemId
          ? { ...item, completado: !item.completado }
          : item
      );
      
      const checklistId = selectedChecklist._id || selectedChecklist.id;
      
      if (!checklistId) {
        throw new Error("No se puede identificar la checklist");
      }
      
      const response = await api.put(`/api/checklists/${checklistId}`, {
        items: updatedItems
      });
      
      const updatedChecklists = checklists.map(checklist =>
        (checklist._id === checklistId || checklist.id === checklistId)
          ? response.data
          : checklist
      );

      setChecklists(updatedChecklists);
      setSelectedChecklist(response.data);

      // Actualizar la checklist activa en localStorage
      localStorage.setItem("activeChecklist", JSON.stringify(response.data));
    } catch (error) {
      console.error("Error al toggle item:", error);
      // Fallback a localStorage si falla la API
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

      const activeChecklist = {
        ...selectedChecklist,
        items: selectedChecklist.items.map(item =>
          item.id === itemId
            ? { ...item, completado: !item.completado }
            : item
        )
      };
      localStorage.setItem("activeChecklist", JSON.stringify(activeChecklist));
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (window.confirm("¿Estás seguro de eliminar este elemento?")) {
      try {
        const updatedItems = selectedChecklist.items.filter(item => item.id !== itemId);
        
        const checklistId = selectedChecklist._id || selectedChecklist.id;
        
        if (!checklistId) {
          throw new Error("No se puede identificar la checklist");
        }
        
        const response = await api.put(`/api/checklists/${checklistId}`, {
          items: updatedItems
        });
        
        const updatedChecklists = checklists.map(checklist => 
          (checklist._id === checklistId || checklist.id === checklistId) 
            ? response.data
            : checklist
        );
        
        setChecklists(updatedChecklists);
        setSelectedChecklist(response.data);
      } catch (error) {
        console.error("Error al eliminar item:", error);
        // Fallback a localStorage si falla la API
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

  const getProgressMessage = (percentage) => {
    if (percentage === 0) return 'Empecemos';
    if (percentage === 100) return '¡Checklist completo!';
    return 'Vas avanzando';
  };

  const getIconForChecklist = (checklist) => {
    const name = checklist.nombre.toLowerCase();
    if (name.includes('primer') || name.includes('paso') || name.includes('inicio')) return BookOpen;
    if (name.includes('evalu') || name.includes('registro') || name.includes('importante')) return ClipboardCheck;
    if (name.includes('acompañ') || name.includes('apoyo') || name.includes('recurso')) return HeartHandshake;
    return CheckSquare;
  };

  const getColorForChecklist = (checklist) => {
    const name = checklist.nombre.toLowerCase();
    if (name.includes('primer') || name.includes('paso') || name.includes('inicio')) return '#43A1F2';
    if (name.includes('senal') || name.includes('caracter') || name.includes('rasgo')) return '#50C1B9';
    if (name.includes('apoyar') || name.includes('acompañ') || name.includes('guia')) return '#EC7054';
    if (name.includes('tecnic') || name.includes('estrateg') || name.includes('herramient')) return '#F59E0B';
    if (name.includes('comunidad') || name.includes('conectar') || name.includes('compartir')) return '#961E67';
    return '#43A1F2';
  };

  return (
    <div className="checklist-page">
      <div className="checklist-container">
        <div className="checklist-header">
          <div>
            <h1 className="checklist-title">Mis Checklists</h1>
            <p className="checklist-subtitle">Completá cada paso a tu ritmo.</p>
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
          <div className="checklists-list-mobile">
            {checklists.map(checklist => {
              const Icon = getIconForChecklist(checklist);
              const color = getColorForChecklist(checklist);
              const percentage = getCompletionPercentage(checklist);
              const completed = checklist.items.filter(i => i.completado).length;
              const total = checklist.items.length;
              
              return (
                <div 
                  key={checklist.id} 
                  className="checklist-card-mobile"
                  onClick={() => {
                    setSelectedChecklist(checklist);
                    localStorage.setItem("activeChecklist", JSON.stringify(checklist));
                  }}
                  style={{ backgroundColor: `${color}22` }}
                >
                  <div className="checklist-card-header">
                    <div className="checklist-icon-wrapper" style={{ backgroundColor: `${color}30` }}>
                      <Icon size={28} style={{ color }} />
                    </div>
                    <div className="checklist-card-info">
                      <h3 className="checklist-card-title">{checklist.nombre}</h3>
                      <p className="checklist-card-description">{checklist.descripcion || 'Sin descripción'}</p>
                    </div>
                  </div>

                  <div className="checklist-progress-section">
                    <div className="checklist-progress-info">
                      <span className="checklist-progress-text">
                        {completed} / {total} completados
                      </span>
                      <span className="checklist-progress-percentage">{percentage}%</span>
                    </div>
                    <div className="checklist-progress-bar">
                      <div
                        className="checklist-progress-fill"
                        style={{ width: `${percentage}%`, backgroundColor: color }}
                      />
                    </div>
                  </div>

                  <div className="checklist-card-arrow">
                    <ChevronRight size={24} />
                  </div>
                </div>
              );
            })}
            
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
          <div className="checklist-detail-mobile">
            {/* Header */}
            <div className="checklist-detail-header-mobile">
              <button className="back-btn-mobile" onClick={() => setSelectedChecklist(null)}>
                <ChevronRight size={24} style={{ transform: 'rotate(180deg)' }} />
              </button>
              <div className="checklist-detail-title-section">
                <h2 className="checklist-detail-title-mobile">{selectedChecklist.nombre}</h2>
                <p className="checklist-detail-description-mobile">
                  {selectedChecklist.descripcion || 'Completá los pasos a tu ritmo.'}
                </p>
              </div>
            </div>

            {/* Progress Section */}
            <div className="checklist-progress-section-mobile">
              <div className="checklist-progress-info-mobile">
                <span className="checklist-progress-text-mobile">
                  {selectedChecklist.items.filter(i => i.completado).length} de {selectedChecklist.items.length} completados
                </span>
                <span className="checklist-progress-percentage-mobile">
                  {getCompletionPercentage(selectedChecklist)}%
                </span>
              </div>
              <div className="checklist-progress-bar-mobile">
                <div
                  className="checklist-progress-fill-mobile"
                  style={{ width: `${getCompletionPercentage(selectedChecklist)}%` }}
                />
              </div>
            </div>

            {/* Tasks List */}
            <div className="checklist-tasks-list-mobile">
              {selectedChecklist.items.length === 0 ? (
                <div className="empty-state-mobile">
                  <CheckSquare size={48} />
                  <p>No hay tareas en este checklist</p>
                  <button 
                    className="add-item-btn-mobile"
                    onClick={() => setShowItemForm(true)}
                  >
                    <Plus size={16} />
                    Agregar primera tarea
                  </button>
                </div>
              ) : (
                selectedChecklist.items.map(item => {
                  const checklistColor = getColorForChecklist(selectedChecklist);
                  return (
                    <div 
                      key={item.id} 
                      className={`checklist-task-card-mobile ${item.completado ? 'completed' : ''}`}
                      onClick={() => handleToggleItem(item.id)}
                    >
                      <div className="checklist-task-checkbox-mobile">
                        <div className={`checkbox-circle ${item.completado ? 'checked' : ''}`} style={{ 
                          borderColor: item.completado ? checklistColor : '#D1D5DB',
                          backgroundColor: item.completado ? checklistColor : 'transparent'
                        }}>
                          {item.completado && <CheckSquare size={16} style={{ color: 'white' }} />}
                        </div>
                      </div>
                      <div className="checklist-task-content-mobile">
                        <h3 className={`checklist-task-title-mobile ${item.completado ? 'completed' : ''}`}>
                          {item.nombre}
                        </h3>
                        <p className={`checklist-task-description-mobile ${item.completado ? 'completed' : ''}`}>
                          {item.descripcion || 'Tarea importante para tu checklist'}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Completion State */}
            {getCompletionPercentage(selectedChecklist) === 100 && selectedChecklist.items.length > 0 && (
              <div className="checklist-completion-state-mobile">
                <div className="completion-icon-mobile">
                  <CheckSquare size={48} />
                </div>
                <h3 className="completion-title-mobile">¡Checklist completada!</h3>
                <p className="completion-message-mobile">Completaste todos los pasos.</p>
                <button 
                  className="back-to-checklists-btn-mobile"
                  onClick={() => setSelectedChecklist(null)}
                >
                  Volver a Mis Checklists
                </button>
              </div>
            )}

            <button 
              className="add-task-btn-mobile"
              onClick={() => setShowItemForm(true)}
            >
              <Plus size={18} />
              Agregar tarea
            </button>
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
