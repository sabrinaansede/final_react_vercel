import { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "../App.css";
import LeyendaMapa from "./LeyendaMapa";
import { useAuth } from "../context/AuthContext.jsx";
import apadeaIcon from "../assets/apadea.png";
import { MapPin, CheckCircle, Star, Check } from 'lucide-react';

// Base URL del backend (Vite)
const API_URL = import.meta.env.VITE_API_URL || "https://autisi-backend.onrender.com";

const iconoApadea = L.divIcon({
  className: "icono-apadea",
  html: `<div class="pin"><img src="${apadeaIcon}" alt="APADEA"/></div>`,
  iconSize: [36, 48],
  iconAnchor: [18, 48],
  popupAnchor: [0, -44],
});

const iconoComunidad = L.divIcon({
  className: "icono-comunidad",
  html: `
    <div class="pin">
      <div class="badge">
        <svg class="glyph" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      </div>
    </div>
  `,
  iconSize: [36, 48],
  iconAnchor: [18, 48],
  popupAnchor: [0, -44],
});

export default function MapaLugares() {
  const mapRef = useRef(null);
  const markerRefs = useRef({});
  const panelRef = useRef(null);
  const [lugares, setLugares] = useState([]);
  const [resenas, setResenas] = useState([]);
  const [filtros, setFiltros] = useState({
    q: "",
    tipo: "",
    provincia: "",
    certificado: "", // APADEA | Comunidad
    minRating: 0,
    inicial: "",
  });
  const [nuevoLugar, setNuevoLugar] = useState({
    nombre: "",
    direccion: "",
    latitud: null,
    longitud: null,
    tipo: "",
    provincia: "",
    descripcion: "",
    etiquetasSensoriales: [],
    certificadoPor: "Comunidad",
  });
  const [mensaje, setMensaje] = useState("");
  const { user: usuario, token: authToken } = useAuth();
  const [favLugares, setFavLugares] = useState(new Set());
  const [ratingComentarios, setRatingComentarios] = useState({}); 
  const [detalleLugar, setDetalleLugar] = useState(null);
  const cerrarDetalle = () => {
    console.log('Cerrando modal de detalles');
    setDetalleLugar(null);
    setShowAllReviews(false);
    setShowReviewForm(false);
    setExpandedDescription(false);
    setExpandedTags(false);
    setResenaForm({ puntuacion: 0, comentario: "" });
  };
  
  // Función para abrir el detalle del lugar
  const abrirDetalleLugar = (lugar) => {
    console.log('Abriendo detalles del lugar:', lugar);
    setDetalleLugar(lugar);
  };
  const [resenaForm, setResenaForm] = useState({ puntuacion: 0, comentario: "" });
  const [fotoUI, setFotoUI] = useState({ open: false, file: null, preview: "" });
  const [emocionalForm, setEmocionalForm] = useState({ emocion: "", fecha: "", notas: "" });
  const [showEmocionalForm, setShowEmocionalForm] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [expandedDescription, setExpandedDescription] = useState(false);
  const [expandedTags, setExpandedTags] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

  const [menuOpen, setMenuOpen] = useState(null);
  const [sortKey, setSortKey] = useState("default");
  const [soloGuardados, setSoloGuardados] = useState(false);
  const [selectedLugarId, setSelectedLugarId] = useState(null);
  const [sheetExpanded, setSheetExpanded] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const getCert = (l) => (l.certificacion || l.certificadoPor || "Comunidad");

  useEffect(() => {
    const cargarLugares = async () => {
      try {
        const res = await fetch(`${API_URL}/api/lugares`);
        const data = await res.json();
        setLugares(Array.isArray(data) ? data : data.data || data);
      } catch (err) {
        console.error("Error al cargar lugares:", err);
        setMensaje("❌ Error al cargar los lugares del mapa.");
      }
    };
    cargarLugares();
  }, []);

  useEffect(() => {
    const cargarResenas = async () => {
      try {
        const res = await fetch(`${API_URL}/api/resenas`);
        const data = await res.json();
        setResenas(Array.isArray(data) ? data : data.data || []);
      } catch (err) {
        console.error("Error al cargar reseñas:", err);
      }
    };
    cargarResenas();
  }, []);

  const ratingPorLugar = useMemo(() => {
    const map = new Map();
    resenas.forEach((r) => {
      const id = r.lugar?._id || r.lugar;
      if (!id) return;
      const prev = map.get(id) || { sum: 0, count: 0 };
      map.set(id, { sum: prev.sum + (r.puntuacion || 0), count: prev.count + 1 });
    });
    const result = {};
    map.forEach((v, k) => { result[k] = { avg: v.count ? v.sum / v.count : 0, count: v.count }; });
    return result;
  }, [resenas]);

  function ClickMarker() {
    useMapEvents({
      click(e) {
        setNuevoLugar((prev) => ({
          ...prev,
          latitud: e.latlng.lat,
          longitud: e.latlng.lng,
        }));
      },
    });
    return null;
  }

  const centrarUbicacionActual = () => {
    if (!navigator.geolocation) {
      setMensaje("⚠️ Geolocalización no disponible.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        if (mapRef.current) {
          mapRef.current.setView([latitude, longitude], 15, { animate: true });
        }
      },
      () => setMensaje("⚠️ No se pudo obtener tu ubicación."),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const abrirPanelAgregar = () => {
    setShowAddForm(true);
    setSheetExpanded(true);
    setTimeout(() => {
      if (panelRef.current) panelRef.current.scrollIntoView({ behavior: "smooth" });
    }, 120);
  };

  const cerrarPanel = () => {
    setSheetExpanded(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nuevoLugar.nombre || !nuevoLugar.direccion) {
      const faltantes = [];
      if (!nuevoLugar.nombre) faltantes.push("nombre");
      if (!nuevoLugar.direccion) faltantes.push("dirección");
      setMensaje(`⚠️ Falta completar: ${faltantes.join(", ")}.`);
      return;
    }

    try {
      // Si no hay coordenadas seleccionadas en el mapa, intentar geocodificar la dirección real
      let lat = nuevoLugar.latitud;
      let lng = nuevoLugar.longitud;

      if (!lat || !lng) {
        try {
          // Construimos una query más precisa usando dirección + provincia + país (Argentina)
          const partes = [nuevoLugar.direccion];
          if (nuevoLugar.provincia) partes.push(nuevoLugar.provincia);
          // Ajustá el país si fuera necesario
          partes.push("Argentina");
          const query = partes.join(", ");

          const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=ar&q=${encodeURIComponent(
            query
          )}`;

          console.log("📍 Geocodificando dirección:", query);
          const geoRes = await fetch(url, {
            headers: {
              "Accept-Language": "es",
            },
          });
          const geoData = await geoRes.json();
          if (Array.isArray(geoData) && geoData.length > 0) {
            lat = parseFloat(geoData[0].lat);
            lng = parseFloat(geoData[0].lon);
            // Guardar en estado para que el mapa se actualice
            setNuevoLugar((prev) => ({
              ...prev,
              latitud: lat,
              longitud: lng,
            }));
          } else {
            console.warn("⚠️ Geocodificación sin resultados para:", query);
          }
        } catch (gErr) {
          console.error("❌ Error al geocodificar dirección:", gErr);
        }
      }

      if (!lat || !lng) {
        setMensaje(
          "❌ No se pudo obtener la ubicación a partir de la dirección. Probá ajustar la dirección o hacer clic en el mapa."
        );
        return;
      }

      // Solo enviar campos que el backend define en el esquema
      const payload = {
        nombre: nuevoLugar.nombre,
        direccion: nuevoLugar.direccion,
        latitud: lat,
        longitud: lng,
        tipo: nuevoLugar.tipo || "",
        provincia: nuevoLugar.provincia || "",
        descripcion: nuevoLugar.descripcion || "",
        etiquetasSensoriales: nuevoLugar.etiquetasSensoriales || [],
        certificacion: nuevoLugar.certificadoPor || "Comunidad",
      };

      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/lugares`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      console.log("📌 Respuesta crear lugar:", res.status, data);

      if (res.ok) {
        const creado = data?.data || data; // el backend devuelve el lugar creado
        console.log("✅ Lugar creado en backend:", creado);

        // Actualizar lista en memoria inmediatamente
        setLugares((prev) => {
          if (!creado || !creado._id) return prev;
          // Evitar duplicados si ya está en la lista
          const exists = prev.some((l) => l._id === creado._id);
          return exists ? prev : [creado, ...prev];
        });

        // Volver a cargar desde servidor en segundo plano para asegurar persistencia
        try {
          const re = await fetch(`${API_URL}/api/lugares`);
          const lista = await re.json();
          const arr = Array.isArray(lista) ? lista : (lista.data || lista);
          console.log("📌 Lista de lugares tras crear:", arr.length);
          setLugares(arr);
        } catch (e) {
          console.warn("⚠️ No se pudo recargar la lista de lugares:", e);
        }

        setMensaje("✅ Lugar agregado correctamente.");
        // Centrar el mapa en el nuevo lugar
        if (mapRef.current && lat && lng) {
          const z = Math.max(mapRef.current.getZoom?.() || 13, 15);
          mapRef.current.setView([lat, lng], z, { animate: true });
        }

        // Intentar abrir el popup del nuevo lugar si tenemos su id
        if (creado && creado._id) {
          setTimeout(() => {
            const ref = markerRefs.current[creado._id];
            if (ref?.openPopup) ref.openPopup();
          }, 400);
        }

        // Resetear filtros para que no quede oculto
        setFiltros({ q: "", tipo: "", provincia: "", certificado: "", minRating: 0 });
        setNuevoLugar({
          nombre: "",
          direccion: "",
          latitud: null,
          longitud: null,
          tipo: "",
          provincia: "",
          descripcion: "",
          etiquetasSensoriales: [],
          certificadoPor: "Comunidad",
        });
      } else {
        const msg = data?.error || data?.message || `Error ${res.status}`;
        console.error("❌ Error al agregar lugar:", msg);
        setMensaje(`❌ Error al agregar lugar: ${msg}`);
      }
    } catch (error) {
      console.error("❌ Error de red al crear lugar:", error);
      setMensaje("❌ Error al conectar con el servidor.");
    }
  };

  const votarLugar = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/lugares/${id}/votar`, {
        method: "PUT",
      });
      const data = await res.json();
      if (res.ok) {
        setLugares((prev) => prev.map((l) => (l._id === data._id ? data : l)));
      }
    } catch (err) {
      console.error("Error al votar:", err);
    }
  };

  const enviarRating = async (lugarId, puntuacion, comentario = "") => {
    if (!usuario?._id) {
      setMensaje("⚠️ Debes iniciar sesión para calificar.");
      return;
    }
    try {
      const token = authToken || localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/resenas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ lugar: lugarId, usuario: usuario._id, puntuacion, comentario }),
      });
      const data = await res.json();
      if (res.ok) {
        setResenas((prev) => [...prev, data.data || data]);
      } else {
        setMensaje("❌ No se pudo enviar la calificación.");
      }
    } catch (e) {
      console.error(e);
      setMensaje("❌ Error al calificar.");
    }
  };

  const enviarResenaModal = async () => {
    if (!usuario?._id || !detalleLugar?._id) {
      setMensaje("⚠️ Debes iniciar sesión para dejar reseña.");
      return;
    }
    if (!resenaForm.puntuacion) {
      setMensaje("⚠️ Elegí una puntuación antes de enviar la reseña.");
      return;
    }
    try {
      const token = authToken || localStorage.getItem("token");
      const fd = new FormData();
      fd.append("lugar", detalleLugar._id);
      fd.append("usuario", usuario._id);
      fd.append("puntuacion", String(resenaForm.puntuacion));
      if (resenaForm.comentario) fd.append("comentario", resenaForm.comentario);
      if (fotoUI.file) fd.append("foto", fotoUI.file);
      const res = await fetch(`${API_URL}/api/resenas`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: fd,
      });
      const data = await res.json();
      if (res.ok) {
        setResenas((prev) => [...prev, data.data || data]);
        setResenaForm({ puntuacion: 0, comentario: "" });
        setFotoUI({ open: false, file: null, preview: "" });
        setMensaje("✅ Reseña enviada correctamente.");
      } else {
        const msg = data?.error || data?.message || `Error ${res.status}`;
        setMensaje(`❌ No se pudo enviar la reseña: ${msg}`);
      }
    } catch (e) {
      console.error(e);
      setMensaje("❌ Error al enviar la reseña.");
    }
  };

  const enviarRegistroEmocional = async () => {
    if (!usuario?._id || !detalleLugar?._id) {
      setMensaje("⚠️ Debes iniciar sesión para registrar cómo te sentiste.");
      return;
    }
    if (!emocionalForm.emocion || !emocionalForm.fecha) {
      setMensaje("⚠️ Completá la emoción y la fecha.");
      return;
    }
    try {
      const token = authToken || localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/registros-emocionales`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          usuario: usuario._id,
          lugar: detalleLugar._id,
          emocion: emocionalForm.emocion,
          fecha: emocionalForm.fecha,
          notas: emocionalForm.notas || ""
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMensaje("✅ Registro emocional guardado correctamente.");
        setShowEmocionalForm(false);
        setEmocionalForm({ emocion: "", fecha: "", notas: "" });
      } else {
        const msg = data?.error || data?.message || `Error ${res.status}`;
        setMensaje(`❌ No se pudo guardar el registro: ${msg}`);
      }
    } catch (e) {
      console.error(e);
      setMensaje("❌ Error al guardar el registro emocional.");
    }
  };
  const tipos = useMemo(() => Array.from(new Set(lugares.map((l) => l.tipo).filter(Boolean))), [lugares]);
  const provincias = useMemo(() => Array.from(new Set(lugares.map((l) => l.provincia).filter(Boolean))), [lugares]);

  useEffect(() => {
    try {
      const key = `fav_lugares_${usuario?._id || "anon"}`;
      const raw = localStorage.getItem(key) || "[]";
      const arr = JSON.parse(raw);
      setFavLugares(Array.isArray(arr) ? new Set(arr) : new Set());
    } catch {
      setFavLugares(new Set());
    }
  }, [usuario?._id]);

  const toggleFavLugar = (id) => {
    setFavLugares((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      try {
        const key = `fav_lugares_${usuario?._id || "anon"}`;
        localStorage.setItem(key, JSON.stringify(Array.from(next)));
      } catch {}
      return next;
    });
  };

  const lugaresFiltrados = useMemo(() => {
    return lugares.filter((l) => {
      const rating = ratingPorLugar[l._id]?.avg || 0;
      if (filtros.q) {
        const q = filtros.q.toLowerCase();
        const hit = (l.nombre || "").toLowerCase().includes(q) || (l.direccion || "").toLowerCase().includes(q) || (l.descripcion || "").toLowerCase().includes(q);
        if (!hit) return false;
      }
      if (filtros.tipo && l.tipo !== filtros.tipo) return false;
      if (filtros.provincia && l.provincia !== filtros.provincia) return false;
      if (filtros.certificado) {
        const cert = getCert(l) === "APADEA" ? "APADEA" : "Comunidad";
        if (cert !== filtros.certificado) return false;
      }
      if (filtros.inicial) {
        const first = (l.nombre || "").trim().charAt(0).toUpperCase();
        if (first !== filtros.inicial.toUpperCase()) return false;
      }
      if (soloGuardados && !favLugares.has(l._id)) return false;
      if (rating < (Number(filtros.minRating) || 0)) return false;
      return true;
    });
  }, [lugares, filtros, ratingPorLugar, soloGuardados, favLugares]);

  // Lista ordenada para el panel lateral
  const listaOrdenada = useMemo(() => {
    const arr = [...lugaresFiltrados];
    if (sortKey === "name") {
      arr.sort((a,b) => (a.nombre||"").localeCompare(b.nombre||""));
    } else if (sortKey === "rating") {
      arr.sort((a,b) => (ratingPorLugar[b._id]?.avg||0) - (ratingPorLugar[a._id]?.avg||0));
    }
    return arr;
  }, [lugaresFiltrados, sortKey, ratingPorLugar]);

  return (
    <div className="mapa-container">
      <div className="container-mapa-form">
        <div className="map-wrapper">
          <MapContainer center={[-34.6037, -58.3816]} zoom={13} className="mapa-leaflet" whenCreated={(map) => (mapRef.current = map)}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
            />
            <ClickMarker />

            {lugaresFiltrados.map((lugar) => (
              <Marker
                key={lugar._id}
                position={[lugar.latitud, lugar.longitud]}
                icon={getCert(lugar) === "APADEA" ? iconoApadea : iconoComunidad}
                ref={(ref) => { if (ref) markerRefs.current[lugar._id] = ref; }}
                eventHandlers={{
                  click: () => setSelectedLugarId(lugar._id),
                }}
              >
                <Popup closeButton={false}>
                  <div className="marker-popup" onClick={(e) => e.stopPropagation()}>
                    <div className="marker-popup-header">
                      <h4>{lugar.nombre}</h4>
                    </div>
                    <div className="marker-popup-body">
                      <div className="address">
                        <MapPin size={12} className="text-gray-500" />
                        <span>{lugar.direccion || 'Sin dirección'}</span>
                      </div>
                      
                      {(lugar.tipo || lugar.provincia || getCert(lugar) === 'APADEA') && (
                        <div className="popup-meta">
                          {lugar.tipo && <span className="tag">{lugar.tipo}</span>}
                          {lugar.provincia && lugar.provincia !== 'CABA' && (
                            <span className="tag">{lugar.provincia}</span>
                          )}
                          {getCert(lugar) === 'APADEA' && (
                            <span className="tag apadea-tag">
                              <CheckCircle size={12} className="text-[#1e40af]" style={{marginRight: '4px'}} />
                              Certificado APADEA
                            </span>
                          )}
                        </div>
                      )}
                      
                      <button 
                        className="w-full bg-[#43A1F2] text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-[#2E7BB8] transition-colors"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          abrirDetalleLugar(lugar);
                          const marker = markerRefs.current[lugar._id];
                          if (marker?.closePopup) marker.closePopup();
                        }}
                      >
                        Ver detalles y reseñas
                      </button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          <div className={`map-controls ${detalleLugar ? 'hidden' : ''}`}>
            <button type="button" className="!bg-white text-[#0f172a] border border-[#e2e8f0] px-[14px] py-[10px] !rounded-full shadow-[0_12px_28px_rgba(15,23,42,0.16)] cursor-pointer font-bold min-w-[170px] transition-transform hover:-translate-y-px hover:bg-[#f8fbff]" onClick={centrarUbicacionActual}>
              Mi ubicación
            </button>
            <button type="button" className="!bg-[#43A1F2] !text-white !border-transparent px-[14px] py-[10px] !rounded-full shadow-[0_12px_28px_rgba(15,23,42,0.16)] cursor-pointer font-bold min-w-[170px] transition-transform hover:-translate-y-px hover:!bg-[#1f6ed8]" onClick={abrirPanelAgregar}>
              + Agregar lugar
            </button>
          </div>
        </div>

      <div className={`sheet-preview ${sheetExpanded ? 'hidden' : ''}`} onClick={abrirPanelAgregar}>
        <div>
          <div className="preview-title">Explorar lugares</div>
          <div className="preview-subtitle">Abrí el panel para ver lugares y agregar uno nuevo.</div>
        </div>
        <button type="button" className="bg-[#43A1F2] text-white rounded-full px-4 py-2.5 border-none font-bold hover:bg-[#2E7BB8] transition-colors">Abrir</button>
      </div>

      <div ref={panelRef} className={`formulario-lugar ${sheetExpanded ? 'sheet-open' : 'sheet-closed'}`}>
        <div className="sheet-handle" onClick={() => setSheetExpanded((v) => !v)}>
          <span className="sheet-handle-bar" />
          <span className="sheet-handle-label">{sheetExpanded ? 'Desliza hacia abajo para cerrar' : 'Explorar lugares'}</span>
        </div>
        {/* Exploración estilo lista (claro) */}
        <div className="sidebar-light">
          <div className="sidebar-header">
            <div className="sidebar-title">Explorar lugares</div>
            <div className="sidebar-actions">
              <select className="select" value={filtros.minRating} onChange={(e) => setFiltros({ ...filtros, minRating: e.target.value })}>
                <option value={0}>Todos</option>
                {[1,2,3,4,5].map((n) => (
                  <option key={n} value={n}>{n}+ ⭐</option>
                ))}
              </select>
            </div>
          </div>
          <input className="input" type="text" placeholder="Buscar..." value={filtros.q} onChange={(e)=> setFiltros({ ...filtros, q: e.target.value })} />

          <div className="toolbar">
            <div className="toolbar-group">
              <button type="button" className="menu-button" onClick={() => setMenuOpen(menuOpen === 'show' ? null : 'show')}>Mostrar ▾</button>
              {menuOpen === 'show' && (
                <div className="menu" onMouseLeave={() => setMenuOpen(null)}>
                  <button className="menu-item" onClick={() => { setFiltros({ ...filtros, certificado: '', minRating: 0 }); setMenuOpen(null); }}>Todos</button>
                  <button className="menu-item" onClick={() => { setFiltros({ ...filtros, certificado: 'APADEA' }); setMenuOpen(null); }}>Certificados APADEA</button>
                  <button className="menu-item" onClick={() => { setFiltros({ ...filtros, certificado: 'Comunidad' }); setMenuOpen(null); }}>Comunidad</button>
                  <button className="menu-item" onClick={() => { setFiltros({ ...filtros, minRating: 4 }); setMenuOpen(null); }}>Rating 4+ ⭐</button>
                </div>
              )}
            </div>
            <div className="toolbar-group">
              <button type="button" className="menu-button" onClick={() => setMenuOpen(menuOpen === 'sort' ? null : 'sort')}>Ordenar por ▾</button>
              {menuOpen === 'sort' && (
                <div className="menu" onMouseLeave={() => setMenuOpen(null)}>
                  <button className={`menu-item ${sortKey==='default'?'active':''}`} onClick={() => { setSortKey('default'); setMenuOpen(null); }}>Relevancia</button>
                  <button className={`menu-item ${sortKey==='name'?'active':''}`} onClick={() => { setSortKey('name'); setMenuOpen(null); }}>Nombre (A–Z)</button>
                  <button className={`menu-item ${sortKey==='rating'?'active':''}`} onClick={() => { setSortKey('rating'); setMenuOpen(null); }}>Rating (alto→bajo)</button>
                </div>
              )}
            </div>
            <div className="toolbar-group">
              <button type="button" className="menu-button" onClick={() => setMenuOpen(menuOpen === 'filters' ? null : 'filters')}>Filtros ▾</button>
              {menuOpen === 'filters' && (
                <div className="menu" onMouseLeave={() => setMenuOpen(null)}>
                  <div className="menu-row">
                    <label className="label">Tipo</label>
                    <select className="select" value={filtros.tipo} onChange={(e)=> setFiltros({ ...filtros, tipo: e.target.value })}>
                      <option value="">Todos</option>
                      {tipos.map((t)=> (<option key={t} value={t}>{t}</option>))}
                    </select>
                  </div>
                  <div className="menu-row">
                    <label className="label">Provincia</label>
                    <select className="select" value={filtros.provincia} onChange={(e)=> setFiltros({ ...filtros, provincia: e.target.value })}>
                      <option value="">Todas</option>
                      {provincias.map((p)=> (<option key={p} value={p}>{p}</option>))}
                    </select>
                  </div>
                  <div className="menu-row">
                    <label className="label">Inicial</label>
                    <select className="select" value={filtros.inicial} onChange={(e)=> setFiltros({ ...filtros, inicial: e.target.value })}>
                      <option value="">Todas</option>
                      {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((ch) => (
                        <option key={ch} value={ch}>{ch}</option>
                      ))}
                    </select>
                  </div>
                  <div className="menu-actions">
                    <button type="button" className="btn btn-secondary" onClick={() => { setFiltros({ q:"", tipo:"", provincia:"", certificado:"", minRating:0, inicial:"" }); setMenuOpen(null); }}>Limpiar</button>
                    <button type="button" className="btn btn-primary" onClick={() => setMenuOpen(null)}>Aplicar</button>
                  </div>
                </div>
              )}
            </div>
            <div className="toolbar-group">
              <button
                type="button"
                className="menu-button"
                onClick={() => setSoloGuardados((v) => !v)}
              >
                {soloGuardados ? "Ver todos" : "Solo guardados"}
              </button>
            </div>
          </div>

          <div className="place-list">
            {listaOrdenada.slice(0, 3).map((l) => (
              <button
                key={l._id}
                type="button"
                className={`place-item ${selectedLugarId === l._id ? "selected" : ""}`}
                onClick={() => {
                  setSelectedLugarId(l._id);
                  if (mapRef.current) {
                    mapRef.current.setView(
                      [l.latitud, l.longitud],
                      Math.max(mapRef.current.getZoom?.() || 13, 15),
                      { animate: true }
                    );
                  }
                  if (markerRefs.current[l._id]?.openPopup) {
                    setTimeout(() => markerRefs.current[l._id].openPopup(), 200);
                  }
                }}
              >
                <div className="place-meta">
                  <div className="place-title">{l.nombre}</div>
                  <div className="place-sub">
                    {l.tipo || "—"} · {getCert(l)} ·{" "}
                    {Number(ratingPorLugar[l._id]?.avg || 0).toFixed(1)}⭐
                    {favLugares.has(l._id) && " · ★ Guardado"}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
        
        {showAddForm && (
          <div className="card pb-56 md:pb-0 relative">
            <button 
              className="absolute top-2 right-2 text-2xl text-slate-400 hover:text-slate-600 cursor-pointer bg-white/80 rounded-full w-8 h-8 flex items-center justify-center z-10"
              onClick={() => setShowAddForm(false)}
              aria-label="Cerrar formulario"
            >
              &times;
            </button>
            <div className="card-title">Agregar nuevo lugar</div>
            <p className="label">
              Podés escribir la dirección real y el sistema la geocodificará automáticamente.
            </p>
          <div style={{ fontSize: 12, color: '#64748b' }}>
            {nuevoLugar.latitud && nuevoLugar.longitud ? (
              <span>
                Coordenadas cargadas ✓ (lat: {nuevoLugar.latitud.toFixed(5)}, lng: {nuevoLugar.longitud.toFixed(5)})
              </span>
            ) : (
              <span>Usaremos la dirección para ubicar el lugar automáticamente.</span>
            )}
          </div>

          <form className="form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="label">Nombre del lugar</label>
              <input
                className="input"
                type="text"
                value={nuevoLugar.nombre}
                onChange={(e) => setNuevoLugar({ ...nuevoLugar, nombre: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="label">Dirección</label>
              <input
                className="input"
                type="text"
                value={nuevoLugar.direccion}
                onChange={(e) => setNuevoLugar({ ...nuevoLugar, direccion: e.target.value })}
                required
              />
            </div>

            <div className="filtros-row">
              <div className="form-group">
                <label className="label">Tipo</label>
                <input
                  className="input"
                  type="text"
                  placeholder="Ej: Shopping, Café..."
                  value={nuevoLugar.tipo}
                  onChange={(e) => setNuevoLugar({ ...nuevoLugar, tipo: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="label">Provincia</label>
                <input
                  className="input"
                  type="text"
                  value={nuevoLugar.provincia}
                  onChange={(e) => setNuevoLugar({ ...nuevoLugar, provincia: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="label">Descripción breve</label>
              <textarea
                className="input"
                placeholder="Contá qué hace especial a este lugar"
                value={nuevoLugar.descripcion}
                onChange={(e) => setNuevoLugar({ ...nuevoLugar, descripcion: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Etiquetas sensoriales</label>
              <div className="chips">
                {nuevoLugar.etiquetasSensoriales.map((tag, idx) => (
                  <span key={idx} className="chip">
                    {tag}
                    <button type="button" onClick={() => setNuevoLugar((prev) => ({
                      ...prev,
                      etiquetasSensoriales: prev.etiquetasSensoriales.filter((_, i) => i !== idx)
                    }))}>×</button>
                  </span>
                ))}
              </div>
              <input
                className="input"
                type="text"
                placeholder="Escribe y presioná Enter o coma"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ',') {
                    e.preventDefault();
                    const val = e.currentTarget.value.trim();
                    if (val && !nuevoLugar.etiquetasSensoriales.includes(val)) {
                      setNuevoLugar((prev) => ({ ...prev, etiquetasSensoriales: [...prev.etiquetasSensoriales, val] }));
                    }
                    e.currentTarget.value = '';
                  }
                }}
              />
            </div>
            <button
              className="w-full bg-[#43A1F2] text-white px-4 py-2.5 rounded-lg font-medium text-sm hover:bg-[#2E7BB8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              disabled={!nuevoLugar.nombre || !nuevoLugar.direccion}
            >
              Agregar lugar
            </button>
          </form>

          {mensaje && (
            <p className={mensaje.includes("Error") ? "msg msg-error" : "msg msg-success"}>{mensaje}</p>
          )}
        </div>
      )}
      </div>
      {detalleLugar && (
        <div className="fixed inset-0 bg-black/80 flex items-start justify-center p-5 pt-24 z-[10000]" onClick={cerrarDetalle}>
          <div className="bg-white rounded-t-3xl md:rounded-2xl max-w-3xl w-full md:max-h-[80vh] h-[80vh] md:h-auto overflow-y-auto relative shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button 
              className="absolute top-4 right-4 text-2xl text-slate-400 hover:text-slate-600 cursor-pointer z-[10001] bg-white/80 rounded-full w-8 h-8 flex items-center justify-center"
              onClick={cerrarDetalle}
              aria-label="Cerrar modal"
            >
              &times;
            </button>
            
            {/* Encabezado - diseño unificado (igual en móvil y desktop) */}
            <div className="border-b border-slate-200">
              {/* Imagen de ancho completo */}
              {detalleLugar.foto && (
                <div>
                  <img 
                    src={detalleLugar.foto} 
                    alt={detalleLugar.nombre}
                    className="w-full h-40 object-cover"
                  />
                </div>
              )}
              
              {/* Información principal - diseño vertical */}
              <div className="p-4">
                <div className="flex flex-col">
                  {/* Información del lugar */}
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-bold text-slate-800 mb-2">
                      {detalleLugar.nombre || 'Sin nombre'}
                    </h2>
                    <p className="text-sm text-slate-500 flex items-center gap-1 mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      {detalleLugar.direccion || 'Sin dirección'}
                      {detalleLugar.provincia && detalleLugar.provincia !== 'CABA' ? `, ${detalleLugar.provincia}` : ''}
                    </p>
                    {detalleLugar.tipo && (
                      <span className="inline-block px-3 py-1 bg-[#43A1F2]/10 text-[#43A1F2] rounded-full text-xs font-medium mb-2">
                        {detalleLugar.tipo}
                      </span>
                    )}
                    <div className="flex items-center gap-2">
                      <div className="flex text-yellow-400 text-sm">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <Star 
                            key={n} 
                            size={18} 
                            fill={n <= Math.round(ratingPorLugar[detalleLugar._id]?.avg || 0) ? "currentColor" : "none"} 
                            stroke={n <= Math.round(ratingPorLugar[detalleLugar._id]?.avg || 0) ? "none" : "currentColor"}
                            strokeWidth={2}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-semibold text-slate-700">
                        {Number(ratingPorLugar[detalleLugar._id]?.avg || 0).toFixed(1)}
                      </span>
                      <span className="text-sm text-slate-500">
                        ({resenas.filter(r => (r.lugar?._id || r.lugar) === detalleLugar._id).length} opiniones)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 md:p-4 md:pt-6 max-w-2xl mx-auto">
              {/* Tarjeta de certificación - diseño unificado (vertical en ambos) */}
              <div className="bg-gradient-to-r from-[#43A1F2]/10 to-[#43A1F2]/5 border border-[#43A1F2]/20 rounded-xl p-4 mb-4">
                <div className="flex flex-col gap-3">
                  <div className="flex gap-3">
                    {detalleLugar.certificadoPor === 'APADEA' && (
                      <div className="flex items-center gap-2 px-3 py-2 bg-white border border-[#43A1F2]/30 rounded-lg shadow-sm">
                        <CheckCircle size={18} className="text-[#43A1F2]" />
                        <div>
                          <div className="text-xs font-bold text-[#43A1F2]">Certificado APADEA</div>
                          <div className="text-[10px] text-[#43A1F2]/70">Validación oficial</div>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-2 px-3 py-2 bg-white border border-[#43A1F2]/30 rounded-lg shadow-sm">
                      <Star size={18} className="text-[#43A1F2]" fill="currentColor" />
                      <div>
                        <div className="text-xs font-bold text-[#43A1F2]">Validado por comunidad</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 justify-center pt-2 border-t border-[#43A1F2]/20">
                    <div className="text-center">
                      <div className="text-lg font-bold text-[#43A1F2]">{Number(ratingPorLugar[detalleLugar._id]?.avg || 0).toFixed(1)}</div>
                      <div className="text-[10px] text-slate-500">Puntaje promedio</div>
                    </div>
                    <div className="h-8 w-px bg-slate-300"></div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-[#43A1F2]">{ratingPorLugar[detalleLugar._id]?.count || 0}</div>
                      <div className="text-[10px] text-slate-500">Usuarios</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Descripción */}
              {detalleLugar.descripcion && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-[#43A1F2] mb-2">Descripción</h4>
                  <div className="text-sm text-slate-600 leading-relaxed">
                    {expandedDescription ? (
                      <>
                        {detalleLugar.descripcion}
                        <button 
                          className="text-[#43A1F2] font-medium ml-2 hover:underline text-xs"
                          onClick={(e) => { e.stopPropagation(); setExpandedDescription(false); }}
                        >
                          Ver menos
                        </button>
                      </>
                    ) : (
                      <>
                        {detalleLugar.descripcion.split(' ').slice(0, 15).join(' ')}...
                        <button 
                          className="text-[#43A1F2] font-medium ml-2 hover:underline text-xs"
                          onClick={(e) => { e.stopPropagation(); setExpandedDescription(true); }}
                        >
                          Ver más
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Características sensoriales */}
              {detalleLugar.etiquetasSensoriales?.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-[#43A1F2] mb-2">Características sensoriales</h4>
                  <div className="flex flex-wrap gap-2">
                    {detalleLugar.etiquetasSensoriales.slice(0, expandedTags ? undefined : 3).map((tag, i) => (
                      <span key={i} className="px-3 py-1.5 bg-gradient-to-r from-[#43A1F2]/10 to-[#59C2BA]/10 text-slate-700 rounded-full text-xs font-medium border border-[#43A1F2]/20">
                        {tag}
                      </span>
                    ))}
                    {detalleLugar.etiquetasSensoriales.length > 3 && !expandedTags && (
                      <button 
                        className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-full text-xs font-medium hover:bg-slate-200"
                        onClick={(e) => { e.stopPropagation(); setExpandedTags(true); }}
                      >
                        +{detalleLugar.etiquetasSensoriales.length - 3} más
                      </button>
                    )}
                  </div>
                </div>
              )}
              
              {/* Sección inferior: diseño unificado (vertical en ambos) */}
              <div className="grid grid-cols-1 gap-4 mb-4">
                {/* Tarjeta izquierda: Opiniones de la comunidad */}
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-4 border border-slate-200">
                  <h3 className="text-base font-bold text-[#43A1F2] mb-3">Opiniones de la comunidad</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex text-yellow-400">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <svg key={n} width="16" height="16" viewBox="0 0 24 24" fill={n <= Math.round(ratingPorLugar[detalleLugar._id]?.avg || 0) ? "currentColor" : "none"} stroke={n <= Math.round(ratingPorLugar[detalleLugar._id]?.avg || 0) ? "none" : "currentColor"} strokeWidth="2">
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm font-semibold text-slate-700">
                      {Number(ratingPorLugar[detalleLugar._id]?.avg || 0).toFixed(1)}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 mb-3">
                    {resenas.filter(r => (r.lugar?._id || r.lugar) === detalleLugar._id).length} opiniones
                  </p>
                  {resenas.filter(r => (r.lugar?._id || r.lugar) === detalleLugar._id).length > 0 && (
                    <button 
                      className="w-full py-2.5 bg-white text-slate-800 border border-slate-300 rounded-lg text-sm font-medium cursor-pointer hover:bg-slate-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowAllReviews(true);
                      }}
                    >
                      Ver todas las opiniones
                    </button>
                  )}

                  {/* Lista de opiniones */}
                  {showAllReviews && (
                    <div className="bg-white p-3 rounded-lg mt-3">
                      <div className="reviews-list max-h-40 overflow-y-auto">
                        {resenas
                          .filter(r => (r.lugar?._id || r.lugar) === detalleLugar._id)
                          .reverse()
                          .map((r, idx) => (
                            <div key={idx} className="review-item mb-2 last:mb-0 pb-2 border-b border-slate-100 last:border-0">
                              <div className="review-comment text-xs text-slate-700 mb-1">
                                {r.comentario || '(Sin comentario)'}
                              </div>
                              <div className="review-user text-[10px] text-slate-500">
                                {typeof r.usuario === 'object' ? (r.usuario?.nombre || 'Usuario') : 'Usuario'}
                              </div>
                            </div>
                          ))}
                      </div>
                      <button 
                        className="w-full mt-2 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-medium cursor-pointer hover:bg-slate-200"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowAllReviews(false);
                        }}
                      >
                        Ocultar opiniones
                      </button>
                    </div>
                  )}
                </div>

                {/* Tarjeta derecha: Escribir una reseña */}
                <div className="bg-gradient-to-br from-[#43A1F2]/5 to-[#43A1F2]/10 rounded-xl p-4 border border-[#43A1F2]/20">
                  <h3 className="text-base font-bold text-slate-900 mb-2">Comparte tu experiencia</h3>
                  <p className="text-sm text-slate-700 mb-3">
                    Ayuda a la comunidad contando cómo fue tu visita a este lugar.
                  </p>
                  <button 
                    className="w-full py-2.5 bg-[#43A1F2] text-white rounded-lg text-sm font-medium cursor-pointer border-none hover:bg-[#2E7BB8]"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowReviewForm(!showReviewForm);
                    }}
                  >
                    {showReviewForm ? 'Cancelar' : 'Escribir reseña'}
                  </button>

                  {/* Formulario de reseña */}
                  {showReviewForm && (
                    <div className="bg-white p-3 rounded-lg mt-3">
                      <div className="rating-stars mb-2">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <button
                            key={n}
                            type="button"
                            className={`star-btn ${n <= resenaForm.puntuacion ? 'active' : ''}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setResenaForm(prev => ({ ...prev, puntuacion: n }));
                            }}
                            aria-label={`Calificar con ${n} estrellas`}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                      
                      <textarea
                        className="review-textarea mb-2"
                        placeholder="Escribe tu reseña aquí..."
                        value={resenaForm.comentario}
                        onChange={(e) => setResenaForm(prev => ({ ...prev, comentario: e.target.value }))}
                        onClick={(e) => e.stopPropagation()}
                      />
                      
                      <button
                        className="submit-review-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          enviarResenaModal();
                        }}
                        disabled={!resenaForm.puntuacion}
                      >
                        Enviar reseña
                      </button>
                      
                      {mensaje && (
                        <p className={`review-message ${mensaje.includes('Error') ? 'error' : 'success'}`}>
                          {mensaje}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {!sheetExpanded && !detalleLugar && <LeyendaMapa />}
    </div>
  </div>
  );
}
