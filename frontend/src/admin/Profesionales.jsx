import React, { useState, useEffect } from 'react';
import { Search, MapPin, Mail, Phone, Stethoscope, Edit, Trash2, X } from 'lucide-react';
import AdminPageLayout from './AdminPageLayout.jsx';

const API_URL = import.meta.env.VITE_API_URL || "https://autisi-backend.onrender.com";

const AdminProfesionales = () => {
  const [profesionales, setProfesionales] = useState([]);
  const [showForm, setShowForm] = useState(true);
  const [editingProfesional, setEditingProfesional] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEspecialidad, setFilterEspecialidad] = useState('');

  useEffect(() => {
    fetchProfesionales();
  }, []);

  const fetchProfesionales = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/profesionales`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setProfesionales(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      console.error('Error al cargar profesionales:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const profesionalData = {
      nombre: formData.get('nombre'),
      apellido: formData.get('apellido'),
      especialidad: formData.get('especialidad'),
      ubicacion: formData.get('ubicacion'),
      modalidad: formData.get('modalidad'),
      descripcion: formData.get('descripcion'),
      experiencia: formData.get('experiencia'),
      horarios: formData.get('horarios'),
      email: formData.get('email'),
      telefono: formData.get('telefono'),
    };

    try {
      const token = localStorage.getItem('token');
      const url = editingProfesional
        ? `${API_URL}/api/profesionales/${editingProfesional._id}`
        : `${API_URL}/api/profesionales`;
      const method = editingProfesional ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(profesionalData),
      });

      if (response.ok) {
        setShowForm(false);
        setEditingProfesional(null);
        fetchProfesionales();
      }
    } catch (error) {
      console.error('Error al guardar profesional:', error);
    }
  };

  const handleEdit = (profesional) => {
    setEditingProfesional(profesional);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este profesional?')) return;

    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/api/profesionales/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      fetchProfesionales();
    } catch (error) {
      console.error('Error al eliminar profesional:', error);
    }
  };

  const filteredProfesionales = profesionales.filter((prof) => {
    const matchesSearch = prof.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prof.apellido?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prof.especialidad?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = !filterEspecialidad || prof.especialidad === filterEspecialidad;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-3 border-gray-200 border-t-[#43A1F2] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <AdminPageLayout 
      title="Gestión de Profesionales" 
      description="Administra los profesionales de la plataforma"
      actionButton={
        <button 
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-[#43A1F2] text-white text-sm font-medium rounded-lg hover:bg-[#2E7BB8] transition-colors"
        >
          Agregar Profesional
        </button>
      }
    >
      <div className="space-y-8">
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar por nombre, apellido o especialidad..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#43A1F2] focus:border-transparent"
              />
            </div>
            <select
              value={filterEspecialidad}
              onChange={(e) => setFilterEspecialidad(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#43A1F2] focus:border-transparent"
            >
              <option value="">Todas las especialidades</option>
              <option value="Psicología">Psicología</option>
              <option value="Terapia Ocupacional">Terapia Ocupacional</option>
              <option value="Fonoaudiología">Fonoaudiología</option>
              <option value="Psicomotricidad">Psicomotricidad</option>
              <option value="Psicopedagogía">Psicopedagogía</option>
              <option value="Neuropediatría">Neuropediatría</option>
            </select>
          </div>
        </div>

        {/* Form Card */}
        {showForm && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-[#f8fafc] to-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#43A1F2] to-[#2E7BB8] flex items-center justify-center text-white">
                    <Stethoscope size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {editingProfesional ? 'Editar Profesional' : 'Nuevo Profesional'}
                    </h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {editingProfesional ? 'Actualiza la información del profesional' : 'Completa los datos para agregar un nuevo profesional'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingProfesional(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>
            </div>
            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Información Personal */}
                <div className="bg-[#f8fafc] rounded-xl p-6">
                  <h4 className="text-base font-semibold text-gray-900 mb-5 flex items-center gap-2">
                    <div className="w-1 h-5 bg-[#43A1F2] rounded-full"></div>
                    Información Personal
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                      <input
                        name="nombre"
                        defaultValue={editingProfesional?.nombre}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#43A1F2] focus:border-transparent transition-all"
                        placeholder="Ingresa el nombre"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Apellido</label>
                      <input
                        name="apellido"
                        defaultValue={editingProfesional?.apellido}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#43A1F2] focus:border-transparent transition-all"
                        placeholder="Ingresa el apellido"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        name="email"
                        type="email"
                        defaultValue={editingProfesional?.email}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#43A1F2] focus:border-transparent transition-all"
                        placeholder="ejemplo@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                      <input
                        name="telefono"
                        defaultValue={editingProfesional?.telefono}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#43A1F2] focus:border-transparent transition-all"
                        placeholder="+54 11 1234-5678"
                      />
                    </div>
                  </div>
                </div>

                {/* Información Profesional */}
                <div className="bg-[#f8fafc] rounded-xl p-6">
                  <h4 className="text-base font-semibold text-gray-900 mb-5 flex items-center gap-2">
                    <div className="w-1 h-5 bg-[#43A1F2] rounded-full"></div>
                    Información Profesional
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Especialidad</label>
                      <select
                        name="especialidad"
                        defaultValue={editingProfesional?.especialidad}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#43A1F2] focus:border-transparent transition-all bg-white"
                      >
                        <option value="">Seleccionar especialidad...</option>
                        <option value="Psicología">Psicología</option>
                        <option value="Terapia Ocupacional">Terapia Ocupacional</option>
                        <option value="Fonoaudiología">Fonoaudiología</option>
                        <option value="Psicomotricidad">Psicomotricidad</option>
                        <option value="Psicopedagogía">Psicopedagogía</option>
                        <option value="Neuropediatría">Neuropediatría</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ubicación</label>
                      <select
                        name="ubicacion"
                        defaultValue={editingProfesional?.ubicacion}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#43A1F2] focus:border-transparent transition-all bg-white"
                      >
                        <option value="">Seleccionar ubicación...</option>
                        <option value="CABA">CABA</option>
                        <option value="Rosario">Rosario</option>
                        <option value="Mendoza">Mendoza</option>
                        <option value="Córdoba">Córdoba</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Modalidad</label>
                      <select
                        name="modalidad"
                        defaultValue={editingProfesional?.modalidad}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#43A1F2] focus:border-transparent transition-all bg-white"
                      >
                        <option value="">Seleccionar modalidad...</option>
                        <option value="presencial">Presencial</option>
                        <option value="virtual">Virtual</option>
                        <option value="ambas">Mixta</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Experiencia</label>
                      <input
                        name="experiencia"
                        defaultValue={editingProfesional?.experiencia}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#43A1F2] focus:border-transparent transition-all"
                        placeholder="Ej: 5 años de experiencia"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Horarios</label>
                      <input
                        name="horarios"
                        defaultValue={editingProfesional?.horarios}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#43A1F2] focus:border-transparent transition-all"
                        placeholder="Ej: Lunes a Viernes 9:00-18:00"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                      <textarea
                        name="descripcion"
                        defaultValue={editingProfesional?.descripcion}
                        rows="4"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#43A1F2] focus:border-transparent transition-all resize-none"
                        placeholder="Describe brevemente la experiencia y enfoque del profesional..."
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingProfesional(null);
                    }}
                    className="px-6 py-3 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-[#43A1F2] to-[#2E7BB8] text-white rounded-lg text-sm font-medium hover:from-[#2E7BB8] hover:to-[#43A1F2] transition-all shadow-md"
                  >
                    {editingProfesional ? 'Actualizar Profesional' : 'Guardar Profesional'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Profesionales List */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">Listado de Profesionales</h3>
            <p className="text-sm text-gray-500 mt-1">{filteredProfesionales.length} profesionales registrados</p>
          </div>
          <div className="divide-y divide-gray-200">
            {filteredProfesionales.map((prof) => (
              <div key={prof._id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#43A1F2] to-[#2E7BB8] flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
                      {prof.nombre?.charAt(0) || ''}{prof.apellido?.charAt(0) || ''}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-base font-semibold text-gray-900">
                          {prof.nombre} {prof.apellido}
                        </h4>
                        <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full">
                          {prof.especialidad}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1.5">
                          <MapPin size={14} />
                          {prof.ubicacion}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Mail size={14} />
                          {prof.email}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Phone size={14} />
                          {prof.telefono}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Stethoscope size={14} />
                          {prof.modalidad}
                        </div>
                      </div>
                      {prof.descripcion && (
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{prof.descripcion}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(prof)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit size={18} className="text-gray-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(prof._id)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 size={18} className="text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {filteredProfesionales.length === 0 && (
            <div className="text-center py-12">
              <Stethoscope size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No se encontraron profesionales</p>
            </div>
          )}
        </div>
      </div>
    </AdminPageLayout>
  );
};

export default AdminProfesionales;
