import React, { useState, useEffect } from 'react';
import { Search, FileText, Edit, Trash2, X, Info, Book, Heart, Brain, Star, Lightbulb } from 'lucide-react';
import AdminPageLayout from './AdminPageLayout.jsx';

const API_URL = import.meta.env.VITE_API_URL || "https://autisi-backend.onrender.com";

const ICON_OPTIONS = [
  { name: 'Info', label: 'Información', component: Info },
  { name: 'Book', label: 'Libro', component: Book },
  { name: 'Heart', label: 'Salud', component: Heart },
  { name: 'Brain', label: 'Desarrollo', component: Brain },
  { name: 'Star', label: 'Destacado', component: Star },
  { name: 'Lightbulb', label: 'Consejo', component: Lightbulb },
];

const AdminContenido = () => {
  const [articulos, setArticulos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingArticulo, setEditingArticulo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchArticulos();
  }, []);

  const fetchArticulos = async () => {
    try {
      const response = await fetch(`${API_URL}/api/articulos`);
      const data = await response.json();
      setArticulos(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      console.error('Error al cargar artículos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const articuloData = {
      id: formData.get('id') || editingArticulo?.id || `articulo-${Date.now()}`,
      title: formData.get('title'),
      icon: formData.get('icon'),
      intro: formData.get('intro'),
      sections: [],
      highlight: formData.get('highlight'),
      related: formData.get('related')?.split(',').map(s => s.trim()).filter(s => s) || [],
    };

    // Parse sections
    const sectionCount = parseInt(formData.get('sectionCount') || '0');
    for (let i = 0; i < sectionCount; i++) {
      const sectionTitle = formData.get(`section_${i}_title`);
      const sectionText = formData.get(`section_${i}_text`);
      const sectionList = formData.get(`section_${i}_list`)?.split('\n').map(s => s.trim()).filter(s => s) || [];
      
      if (sectionTitle) {
        articuloData.sections.push({
          title: sectionTitle,
          text: sectionText || undefined,
          list: sectionList.length > 0 ? sectionList : undefined,
        });
      }
    }

    try {
      const token = localStorage.getItem('token');
      const url = editingArticulo
        ? `${API_URL}/api/articulos/${editingArticulo._id}`
        : `${API_URL}/api/articulos`;
      const method = editingArticulo ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(articuloData),
      });

      if (response.ok) {
        setShowForm(false);
        setEditingArticulo(null);
        fetchArticulos();
      }
    } catch (error) {
      console.error('Error al guardar artículo:', error);
    }
  };

  const handleEdit = (articulo) => {
    setEditingArticulo(articulo);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este artículo?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/articulos/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchArticulos();
      }
    } catch (error) {
      console.error('Error al eliminar artículo:', error);
    }
  };

  const addSection = (e) => {
    const sectionCount = parseInt(e.target.previousElementSibling.value) || 0;
    e.target.previousElementSibling.value = sectionCount + 1;
    e.target.form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
  };

  const filteredArticulos = articulos.filter(
    (a) =>
      a.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.intro?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-3 border-gray-200 border-t-[#43A1F2] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <AdminPageLayout 
      title="Gestión de Contenido" 
      description="Administra los artículos del centro de información"
      actionButton={
        <button 
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-[#43A1F2] text-white text-sm font-medium rounded-lg hover:bg-[#2E7BB8] transition-colors"
        >
          Crear Artículo
        </button>
      }
    >
      <div className="space-y-8">
        {/* Search Bar */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar artículos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#43A1F2] focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Form Card */}
        {showForm && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {editingArticulo ? 'Editar Artículo' : 'Nuevo Artículo'}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {editingArticulo ? 'Actualiza la información del artículo' : 'Completa los datos para agregar un nuevo artículo'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingArticulo(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <input type="hidden" name="sectionCount" defaultValue={editingArticulo?.sections?.length || 0} />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ID</label>
                    <input
                      name="id"
                      defaultValue={editingArticulo?.id}
                      required
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#43A1F2] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ícono</label>
                    <select
                      name="icon"
                      defaultValue={editingArticulo?.icon || 'Info'}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#43A1F2] focus:border-transparent"
                    >
                      {ICON_OPTIONS.map((icon) => (
                        <option key={icon.name} value={icon.name}>{icon.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
                  <input
                    name="title"
                    defaultValue={editingArticulo?.title}
                    required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#43A1F2] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Introducción</label>
                  <textarea
                    name="intro"
                    defaultValue={editingArticulo?.intro}
                    rows="3"
                    required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#43A1F2] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Destacado</label>
                  <input
                    name="highlight"
                    defaultValue={editingArticulo?.highlight}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#43A1F2] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Artículos relacionados (separados por coma)</label>
                  <input
                    name="related"
                    defaultValue={editingArticulo?.related?.join(', ')}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#43A1F2] focus:border-transparent"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingArticulo(null);
                    }}
                    className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#43A1F2] text-white rounded-lg text-sm font-medium hover:bg-[#2E7BB8] transition-colors"
                  >
                    {editingArticulo ? 'Actualizar' : 'Guardar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Articles List */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">Listado de Artículos</h3>
            <p className="text-sm text-gray-500 mt-1">{filteredArticulos.length} artículos registrados</p>
          </div>
          <div className="divide-y divide-gray-200">
            {filteredArticulos.map((articulo) => {
              const IconComponent = ICON_OPTIONS.find(i => i.name === articulo.icon)?.component || FileText;
              return (
                <div key={articulo.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#43A1F2] to-[#2E7BB8] flex items-center justify-center text-white flex-shrink-0">
                        <IconComponent size={24} />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-base font-semibold text-gray-900 mb-2">{articulo.title}</h4>
                        <p className="text-sm text-gray-600 line-clamp-2">{articulo.intro}</p>
                        {articulo.highlight && (
                          <p className="text-sm text-[#43A1F2] font-medium mt-2">{articulo.highlight}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(articulo)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit size={18} className="text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(articulo.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 size={18} className="text-red-600" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {filteredArticulos.length === 0 && (
            <div className="text-center py-12">
              <FileText size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No se encontraron artículos</p>
            </div>
          )}
        </div>
      </div>
    </AdminPageLayout>
  );
};

export default AdminContenido;
