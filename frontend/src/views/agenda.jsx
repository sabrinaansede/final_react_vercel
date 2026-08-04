import React, { useState, useEffect } from "react";
import { Calendar, Clock, MapPin, User, Bell, Edit, Trash2, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import "./agenda.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const AgendaTerapias = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    profesional: "",
    fecha: "",
    hora: "",
    lugar: "",
    notas: "",
    recordatorio: false
  });

  // Cargar eventos del backend
  useEffect(() => {
    const fetchAgendaEvents = async () => {
      try {
        const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
        const token = localStorage.getItem('token');
        
        if (!usuario?._id?.toString() || !token) return;
        
        const res = await fetch(`${API_URL}/api/agenda/usuario/${usuario._id}`, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json' 
          },
          credentials: 'include'
        });
        
        if (res.ok) {
          const data = await res.json();
          const events = Array.isArray(data) ? data : data.data || [];
          setEvents(events);
        } else {
          // Fallback a localStorage si falla el backend
          const savedEvents = localStorage.getItem("agendaTerapias");
          if (savedEvents) {
            setEvents(JSON.parse(savedEvents));
          }
        }
      } catch (error) {
        console.error('Error al cargar eventos:', error);
        // Fallback a localStorage si falla el backend
        const savedEvents = localStorage.getItem("agendaTerapias");
        if (savedEvents) {
          setEvents(JSON.parse(savedEvents));
        }
      }
    };
    
    fetchAgendaEvents();
  }, []);

  // Guardar eventos en localStorage como backup
  useEffect(() => {
    localStorage.setItem("agendaTerapias", JSON.stringify(events));
  }, [events]);

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateClick = (day) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(dateStr);
  };

  const getEventsForDate = (dateStr) => {
    return events.filter(event => event.fecha === dateStr);
  };

  const hasEvent = (day) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.some(event => event.fecha === dateStr);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    const token = localStorage.getItem('token');
    
    try {
      if (editingEvent) {
        // Editar evento existente
        const res = await fetch(`${API_URL}/api/agenda/${editingEvent._id || editingEvent.id}`, {
          method: 'PUT',
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json' 
          },
          credentials: 'include',
          body: JSON.stringify({
            ...formData,
            usuario: usuario._id
          })
        });
        
        if (res.ok) {
          const updatedEvent = await res.json();
          setEvents(events.map(event => 
            event.id === editingEvent.id 
              ? { ...formData, id: editingEvent.id, _id: updatedEvent._id || editingEvent._id }
              : event
          ));
        }
        setEditingEvent(null);
      } else {
        // Crear nuevo evento
        const res = await fetch(`${API_URL}/api/agenda`, {
          method: 'POST',
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json' 
          },
          credentials: 'include',
          body: JSON.stringify({
            ...formData,
            usuario: usuario._id
          })
        });
        
        if (res.ok) {
          const newEvent = await res.json();
          setEvents([...events, { ...formData, id: newEvent._id || Date.now(), _id: newEvent._id }]);
        }
      }

      setFormData({
        nombre: "",
        profesional: "",
        fecha: "",
        hora: "",
        lugar: "",
        notas: "",
        recordatorio: false
      });
      setShowForm(false);
    } catch (error) {
      console.error('Error al guardar evento:', error);
      // Fallback a localStorage si falla el backend
      if (editingEvent) {
        setEvents(events.map(event => 
          event.id === editingEvent.id 
            ? { ...formData, id: editingEvent.id }
            : event
        ));
      } else {
        const newEvent = {
          ...formData,
          id: Date.now()
        };
        setEvents([...events, newEvent]);
      }
      setFormData({
        nombre: "",
        profesional: "",
        fecha: "",
        hora: "",
        lugar: "",
        notas: "",
        recordatorio: false
      });
      setShowForm(false);
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setFormData(event);
    setShowForm(true);
  };

  const handleDelete = async (eventId) => {
    if (window.confirm("¿Estás seguro de eliminar este turno?")) {
      const token = localStorage.getItem('token');
      const eventToDelete = events.find(e => e.id === eventId || e._id === eventId);
      
      try {
        if (eventToDelete?._id) {
          const res = await fetch(`${API_URL}/api/agenda/${eventToDelete._id}`, {
            method: 'DELETE',
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json' 
            },
            credentials: 'include'
          });
          
          if (res.ok) {
            setEvents(events.filter(event => event.id !== eventId && event._id !== eventId));
          }
        } else {
          // Fallback para eventos sin _id (solo localStorage)
          setEvents(events.filter(event => event.id !== eventId));
        }
      } catch (error) {
        console.error('Error al eliminar evento:', error);
        // Fallback a localStorage si falla el backend
        setEvents(events.filter(event => event.id !== eventId));
      }
    }
  };

  const getUpcomingEvents = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return events
      .filter(event => {
        const eventDate = new Date(event.fecha);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate >= today;
      })
      .sort((a, b) => {
        const dateA = new Date(a.fecha + 'T' + a.hora);
        const dateB = new Date(b.fecha + 'T' + b.hora);
        return dateA - dateB;
      })
      .slice(0, 3);
  };

  return (
    <div className="agenda-page">
      <div className="agenda-container">
        <div className="agenda-header">
          <h1 className="agenda-title">Agenda de Terapias</h1>
          <div className="premium-badge">
            <span className="premium-star">⭐</span>
            Premium
          </div>
        </div>

        <div className="agenda-layout">
          {/* Calendario */}
          <div className="calendar-section">
            <div className="calendar-header">
              <button onClick={handlePrevMonth} className="calendar-nav-btn">
                <ChevronLeft size={20} />
              </button>
              <h2 className="calendar-month">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <button onClick={handleNextMonth} className="calendar-nav-btn">
                <ChevronRight size={20} />
              </button>
            </div>

            <div className="calendar-grid">
              {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
                <div key={day} className="calendar-day-header">
                  {day}
                </div>
              ))}

              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} className="calendar-day empty"></div>
              ))}

              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const isSelected = selectedDate === dateStr;
                const hasEventDay = hasEvent(day);
                const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();

                return (
                  <button
                    key={day}
                    onClick={() => handleDateClick(day)}
                    className={`calendar-day ${isSelected ? 'selected' : ''} ${hasEventDay ? 'has-event' : ''} ${isToday ? 'today' : ''}`}
                  >
                    {day}
                    {hasEventDay && <div className="event-dot"></div>}
                  </button>
                );
              })}
            </div>

            {/* Eventos del día seleccionado */}
            {selectedDate && (
              <div className="selected-day-events">
                <h3 className="selected-day-title">
                  Eventos del {new Date(selectedDate).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                </h3>
                {getEventsForDate(selectedDate).length > 0 ? (
                  getEventsForDate(selectedDate).map((event) => (
                    <div key={event.id} className="event-card">
                      <div className="event-header">
                        <h4 className="event-title">{event.nombre}</h4>
                        <div className="event-actions">
                          <button onClick={() => handleEdit(event)} className="event-action-btn">
                            <Edit size={16} />
                          </button>
                          <button onClick={() => handleDelete(event.id)} className="event-action-btn delete">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      {event.profesional && (
                        <div className="event-detail">
                          <User size={16} />
                          <span>{event.profesional}</span>
                        </div>
                      )}
                      <div className="event-detail">
                        <Clock size={16} />
                        <span>{event.hora}</span>
                      </div>
                      {event.lugar && (
                        <div className="event-detail">
                          <MapPin size={16} />
                          <span>{event.lugar}</span>
                        </div>
                      )}
                      {event.recordatorio && (
                        <div className="event-detail">
                          <Bell size={16} />
                          <span>Recordatorio activado</span>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="no-events">No hay eventos para este día</p>
                )}
              </div>
            )}
          </div>

          {/* Panel lateral */}
          <div className="agenda-sidebar">
            {/* Botón agregar nuevo evento */}
            <button onClick={() => setShowForm(true)} className="add-event-btn">
              <Plus size={20} />
              Agregar nuevo turno
            </button>

            {/* Próximos turnos */}
            <div className="upcoming-section">
              <h3 className="upcoming-title">Próximos turnos</h3>
              {getUpcomingEvents().length > 0 ? (
                getUpcomingEvents().map((event) => (
                  <div key={event.id} className="upcoming-card">
                    <div className="upcoming-date">
                      {new Date(event.fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                    </div>
                    <div className="upcoming-info">
                      <h4 className="upcoming-name">{event.nombre}</h4>
                      <div className="upcoming-time">
                        <Clock size={14} />
                        {event.hora}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-upcoming">No hay turnos próximos</p>
              )}
            </div>
          </div>
        </div>

        {/* Modal formulario */}
        {showForm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="modal-title">
                  {editingEvent ? 'Editar turno' : 'Agregar nuevo turno'}
                </h2>
                <button onClick={() => {
                  setShowForm(false);
                  setEditingEvent(null);
                  setFormData({
                    nombre: "",
                    profesional: "",
                    fecha: "",
                    hora: "",
                    lugar: "",
                    notas: "",
                    recordatorio: false
                  });
                }} className="modal-close">
                  ✕
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="event-form">
                <div className="form-group">
                  <label>Nombre de la terapia o actividad *</label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    required
                    placeholder="Ej: Terapia de lenguaje"
                  />
                </div>

                <div className="form-group">
                  <label>Nombre del profesional (opcional)</label>
                  <input
                    type="text"
                    value={formData.profesional}
                    onChange={(e) => setFormData({ ...formData, profesional: e.target.value })}
                    placeholder="Ej: Dra. María González"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Fecha *</label>
                    <input
                      type="date"
                      value={formData.fecha}
                      onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Hora *</label>
                    <input
                      type="time"
                      value={formData.hora}
                      onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Lugar (opcional)</label>
                  <input
                    type="text"
                    value={formData.lugar}
                    onChange={(e) => setFormData({ ...formData, lugar: e.target.value })}
                    placeholder="Ej: Centro AutiSi"
                  />
                </div>

                <div className="form-group">
                  <label>Notas adicionales (opcional)</label>
                  <textarea
                    value={formData.notas}
                    onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                    placeholder="Ej: Traer documentos anteriores"
                    rows={3}
                  />
                </div>

                <div className="form-group checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.recordatorio}
                      onChange={(e) => setFormData({ ...formData, recordatorio: e.target.checked })}
                    />
                    <span>Activar recordatorio</span>
                  </label>
                </div>

                <div className="form-actions">
                  <button type="button" onClick={() => {
                    setShowForm(false);
                    setEditingEvent(null);
                  }} className="btn-secondary">
                    Cancelar
                  </button>
                  <button type="submit" className="btn-primary">
                    {editingEvent ? 'Guardar cambios' : 'Agregar turno'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgendaTerapias;
