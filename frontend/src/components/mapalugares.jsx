import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "../App.css";
import "./mapalugares.css";
import { useAuth } from "../context/AuthContext.jsx";
import apadeaIcon from "../assets/apadea.png";
import { MapPin, CheckCircle, Star, Check, Search, Navigation, Plus, Settings, User, Building, Activity, Heart, Briefcase, ChevronRight, Minus } from 'lucide-react';

// Base URL del backend (Vite)
const API_URL = import.meta.env.VITE_API_URL || "https://autisi-backend.onrender.com";

const getIconForCategory = (tipo) => {
  const tipoLower = (tipo || '').toLowerCase();
  if (tipoLower.includes('profesional') || tipoLower.includes('terapia') || tipoLower.includes('doctor')) {
    return L.divIcon({
      className: 'icono-circular',
      html: `<div class="marker-circle marker-professional"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg></div>`,
      iconSize: [44, 44],
      iconAnchor: [22, 22],
      popupAnchor: [0, -22],
    });
  }
  if (tipoLower.includes('espacio') || tipoLower.includes('lugar') || tipoLower.includes('edificio') || tipoLower.includes('escuela')) {
    return L.divIcon({
      className: 'icono-circular',
      html: `<div class="marker-circle marker-space"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18M5 21V7l8-4 8 4v14M9 10a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v11H9V10z"></path></svg></div>`,
      iconSize: [44, 44],
      iconAnchor: [22, 22],
      popupAnchor: [0, -22],
    });
  }
  if (tipoLower.includes('actividad') || tipoLower.includes('recreación') || tipoLower.includes('juego')) {
    return L.divIcon({
      className: 'icono-circular',
      html: `<div class="marker-circle marker-activity"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg></div>`,
      iconSize: [44, 44],
      iconAnchor: [22, 22],
      popupAnchor: [0, -22],
    });
  }
  if (tipoLower.includes('servicio') || tipoLower.includes('salud') || tipoLower.includes('ayuda')) {
    return L.divIcon({
      className: 'icono-circular',
      html: `<div class="marker-circle marker-service"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg></div>`,
      iconSize: [44, 44],
      iconAnchor: [22, 22],
      popupAnchor: [0, -22],
    });
  }
  // Default
  return L.divIcon({
    className: 'icono-circular',
    html: `<div class="marker-circle marker-default"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4M12 8h.01"></path></svg></div>`,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    popupAnchor: [0, -22],
  });
};

const iconoApadea = L.divIcon({
  className: "icono-apadea",
  html: `<div class="pin"><img src="${apadeaIcon}" alt="APADEA"/></div>`,
  iconSize: [36, 48],
  iconAnchor: [18, 48],
  popupAnchor: [0, -44],
});

const normalizeLugares = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

const hasValidCoords = (lugar) =>
  Number.isFinite(Number(lugar?.latitud)) && Number.isFinite(Number(lugar?.longitud));

function MapRefBridge({ mapRef }) {
  const map = useMap();
  useEffect(() => {
    mapRef.current = map;
    return () => {
      mapRef.current = null;
    };
  }, [map, mapRef]);
  return null;
}

function ClickMarker({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
  });
  return null;
}

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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
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
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [sheetExpanded, setSheetExpanded] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const getCert = (l) => (l.certificacion || l.certificadoPor || "Comunidad");

  useEffect(() => {
    const cargarLugares = async () => {
      try {
        const res = await fetch(`${API_URL}/api/lugares`);
        const data = await res.json();
        setLugares(normalizeLugares(data));
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

  const handleMapClick = (latlng) => {
    setNuevoLugar((prev) => ({
      ...prev,
      latitud: latlng.lat,
      longitud: latlng.lng,
    }));
  };

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
          const arr = normalizeLugares(lista);
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
    <>
      <div className="mapa-container">
        <div className="container-mapa-form">
          <div className="map-wrapper">
            <MapContainer center={[-34.6037, -58.3816]} zoom={13} className="mapa-leaflet">
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
              />
              <MapRefBridge mapRef={mapRef} />
              <ClickMarker onMapClick={handleMapClick} />

              {lugaresFiltrados.filter(hasValidCoords).map((lugar) => (
                <Marker
                  key={lugar._id}
                  position={[Number(lugar.latitud), Number(lugar.longitud)]}
                  icon={getCert(lugar) === "APADEA" ? iconoApadea : getIconForCategory(lugar.tipo)}
                  ref={(ref) => { if (ref) markerRefs.current[lugar._id] = ref; }}
                  eventHandlers={{
                    click: () => {
                      setSelectedLugarId(lugar._id);
                      setShowBottomSheet(true);
                    },
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
                        
                        <div className="popup-actions">
                          <button 
                            className="popup-action-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavLugar(lugar._id);
                            }}
                          >
                            <Heart size={14} className={favLugares.has(lugar._id) ? "text-red-500" : ""} />
                          </button>
                          <button 
                            className="popup-action-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              abrirDetalleLugar(lugar);
                            }}
                          >
                            <ChevronRight size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          {/* Desktop Elements */}
          <div className={`map-search-desktop ${detalleLugar ? 'hidden' : ''}`}>
            <Search size={20} className="text-gray-400" />
            <input 
              type="text" 
              placeholder="¿Qué estás buscando?" 
              value={filtros.q} 
              onChange={(e) => setFiltros({ ...filtros, q: e.target.value })}
            />
            <button 
              className="map-filter-button-desktop"
              onClick={() => setSheetExpanded(true)}
            >
              <Settings size={20} />
            </button>
          </div>

          <div className={`map-controls-desktop-group ${detalleLugar ? 'hidden' : ''}`}>
            <div className="map-control-group-desktop">
              <button type="button" className="map-float-button-desktop" onClick={() => {
                if (mapRef.current) {
                  mapRef.current.zoomIn();
                }
              }}>
                <Plus size={20} />
              </button>
              <button type="button" className="map-float-button-desktop" onClick={() => {
                if (mapRef.current) {
                  mapRef.current.zoomOut();
                }
              }}>
                <Minus size={20} />
              </button>
            </div>
            <button type="button" className="map-float-button-desktop" onClick={centrarUbicacionActual}>
              <Navigation size={20} />
            </button>
            <button type="button" className="map-float-button-desktop primary" onClick={abrirPanelAgregar}>
              <Plus size={20} />
            </button>
          </div>

          {/* Mobile Elements */}
          <div className="map-search-compact">
            <Search size={20} className="text-gray-400" />
            <input 
              type="text" 
              placeholder="¿Qué estás buscando?" 
              value={filtros.q} 
              onChange={(e) => setFiltros({ ...filtros, q: e.target.value })}
            />
            <button 
              className="map-filter-button"
              onClick={() => setSheetExpanded(true)}
            >
              <Settings size={20} />
            </button>
          </div>

          <div className={`map-controls ${detalleLugar ? 'hidden' : ''}`}>
            <div className="map-control-group">
              <button type="button" className="map-float-button" onClick={() => {
                if (mapRef.current) {
                  mapRef.current.zoomIn();
                }
              }}>
                <Plus size={20} />
              </button>
              <button type="button" className="map-float-button" onClick={() => {
                if (mapRef.current) {
                  mapRef.current.zoomOut();
                }
              }}>
                <Minus size={20} />
              </button>
            </div>
            <button type="button" className="map-float-button" onClick={centrarUbicacionActual}>
              <Navigation size={20} />
            </button>
            <button type="button" className="map-float-button primary" onClick={abrirPanelAgregar}>
              <Plus size={20} />
            </button>
          </div>

          {/* Bottom Sheet para lugar seleccionado */}
          {showBottomSheet && selectedLugarId && (() => {
            const lugar = lugaresFiltrados.find(l => l._id === selectedLugarId);
            if (!lugar) return null;
            return (
              <div className="place-bottom-sheet visible">
                <div className="sheet-preview-content">
                  <div className="sheet-preview-title">{lugaresFiltrados.length} lugares encontrados ↑</div>
                  <div className="sheet-preview-subtitle">Tocá para ver detalles</div>
                </div>
                <button type="button" className="sheet-preview-button">
                  Ver
                </button>
              </div>
            );
          })()}

      <div ref={panelRef} className={`formulario-lugar ${sheetExpanded ? 'sheet-open' : 'sheet-closed'}`}>
        {/* Filtros */}
        {sheetExpanded && (
          <div className="sidebar-light">
            <div className="sidebar-header">
              <div className="sidebar-title">Filtros</div>
              <button 
                className="sidebar-close-button"
                onClick={() => setSheetExpanded(false)}
              >
                ✕
              </button>
            </div>

          <div className="filters-section">
            <div className="filters-label">¿Qué necesitás encontrar?</div>
            <div className="filters-chips">
              <button 
                type="button"
                className={`filter-chip ${!filtros.tipo ? 'active' : ''}`}
                onClick={() => setFiltros({ ...filtros, tipo: '' })}
              >
                Todos
              </button>
              <button 
                type="button"
                className={`filter-chip ${filtros.tipo === 'Profesionales' ? 'active' : ''}`}
                onClick={() => setFiltros({ ...filtros, tipo: 'Profesionales' })}
              >
                Profesionales
              </button>
              <button 
                type="button"
                className={`filter-chip ${filtros.tipo === 'Espacios' ? 'active' : ''}`}
                onClick={() => setFiltros({ ...filtros, tipo: 'Espacios' })}
              >
                Espacios
              </button>
              <button 
                type="button"
                className={`filter-chip ${filtros.tipo === 'Actividades' ? 'active' : ''}`}
                onClick={() => setFiltros({ ...filtros, tipo: 'Actividades' })}
              >
                Actividades
              </button>
              <button 
                type="button"
                className={`filter-chip ${filtros.tipo === 'Servicios' ? 'active' : ''}`}
                onClick={() => setFiltros({ ...filtros, tipo: 'Servicios' })}
              >
                Servicios
              </button>
            </div>
          </div>

          <div className="filters-section">
            <div className="filters-label">Distancia máxima</div>
            <select 
              className="filters-select"
              value={filtros.distancia}
              onChange={(e) => setFiltros({ ...filtros, distancia: e.target.value })}
            >
              <option value="">Todas las distancias</option>
              <option value="1">1 km</option>
              <option value="5">5 km</option>
              <option value="10">10 km</option>
              <option value="20">20 km</option>
              <option value="50">50 km</option>
            </select>
          </div>

          <div className="filters-section">
            <div className="filters-toggle">
              <div className="filters-toggle-info">
                <span className="filters-toggle-icon">♿</span>
                <span className="filters-toggle-text">Accesible</span>
              </div>
              <button 
                type="button"
                className={`filters-toggle-switch ${filtros.accesible ? 'active' : ''}`}
                onClick={() => setFiltros({ ...filtros, accesible: !filtros.accesible })}
              >
                <span className="filters-toggle-slider"></span>
              </button>
            </div>

            <div className="filters-toggle">
              <div className="filters-toggle-info">
                <span className="filters-toggle-icon">◷</span>
                <span className="filters-toggle-text">Abierto ahora</span>
              </div>
              <button 
                type="button"
                className={`filters-toggle-switch ${filtros.abiertoAhora ? 'active' : ''}`}
                onClick={() => setFiltros({ ...filtros, abiertoAhora: !filtros.abiertoAhora })}
              >
                <span className="filters-toggle-slider"></span>
              </button>
            </div>

            <div className="filters-toggle">
              <div className="filters-toggle-info">
                <span className="filters-toggle-icon">⭐</span>
                <span className="filters-toggle-text">Solo guardados</span>
              </div>
              <button 
                type="button"
                className={`filters-toggle-switch ${soloGuardados ? 'active' : ''}`}
                onClick={() => setSoloGuardados(!soloGuardados)}
              >
                <span className="filters-toggle-slider"></span>
              </button>
            </div>
          </div>

          <div className="filters-footer">
            <button 
              type="button"
              className="filters-button-secondary"
              onClick={() => {
                setFiltros({ q: filtros.q, tipo: "", provincia: "", certificado: "", minRating: 0, inicial: "" });
                setSoloGuardados(false);
              }}
            >
              Limpiar filtros
            </button>
            <button 
              type="button"
              className="filters-button-primary"
              onClick={() => setSheetExpanded(false)}
            >
              Aplicar filtros
            </button>
          </div>
        </div>
        )}
      </div>
      </div>
      </div>

      {/* Modal para agregar nuevo lugar - Desktop/Tablet con inline styles */}
      {!isMobile && showAddForm && createPortal(
        <div 
          onClick={() => setShowAddForm(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(15, 35, 60, 0.5)',
            zIndex: 9999999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'white',
              borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
              maxWidth: '430px',
              width: 'calc(100% - 40px)',
              maxHeight: 'calc(100vh - 40px)',
              overflowY: 'auto',
              padding: '20px'
            }}
          >
            <button 
              onClick={() => setShowAddForm(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: '#F3F4F6',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#6B7280',
                fontSize: '18px',
                zIndex: 1
              }}
            >
              ✕
            </button>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '16px',
              paddingBottom: '16px',
              borderBottom: '1px solid #E5E7EB'
            }}>
              <MapPin size={20} style={{ color: '#43A1F2' }} />
              <div style={{
                fontSize: '18px',
                fontWeight: 600,
                color: '#1B2A4A'
              }}>
                Agregar nuevo lugar
              </div>
            </div>
            
            <p style={{
              fontSize: '14px',
              color: '#6B7280',
              marginBottom: '16px',
              lineHeight: 1.5
            }}>
              Podés escribir la dirección real y el sistema la geocodificará automáticamente.
            </p>
            
            <div style={{
              fontSize: '13px',
              color: '#065F46',
              background: '#D1FAE5',
              padding: '8px 12px',
              borderRadius: '8px',
              marginBottom: '16px'
            }}>
              {nuevoLugar.latitud && nuevoLugar.longitud ? (
                <span>
                  Coordenadas cargadas ✓ (lat: {nuevoLugar.latitud?.toFixed(5) || 'N/A'}, lng: {nuevoLugar.longitud?.toFixed(5) || 'N/A'})
                </span>
              ) : (
                <span>Usaremos la dirección para ubicar el lugar automáticamente.</span>
              )}
            </div>

            <form onSubmit={handleSubmit} style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <div className="form-group">
                <label className="label">Nombre del lugar *</label>
                <input
                  className="input"
                  type="text"
                  placeholder="Ej. Centro de día, Biblioteca, etc."
                  value={nuevoLugar.nombre}
                  onChange={(e) => setNuevoLugar({ ...nuevoLugar, nombre: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="label">Dirección *</label>
                <input
                  className="input"
                  type="text"
                  placeholder="Ej. Av. Siempre Viva 123"
                  value={nuevoLugar.direccion}
                  onChange={(e) => setNuevoLugar({ ...nuevoLugar, direccion: e.target.value })}
                  required
                />
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
                gap: '12px'
              }}>
                <div className="form-group">
                  <label className="label">Tipo *</label>
                  <input
                    className="input"
                    type="text"
                    placeholder="Ej: Shopping, Café..."
                    value={nuevoLugar.tipo}
                    onChange={(e) => setNuevoLugar({ ...nuevoLugar, tipo: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="label">Provincia *</label>
                  <input
                    className="input"
                    type="text"
                    placeholder="Ej: Buenos Aires"
                    value={nuevoLugar.provincia}
                    onChange={(e) => setNuevoLugar({ ...nuevoLugar, provincia: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="label">Descripción breve *</label>
                <textarea
                  className="input"
                  placeholder="Contá qué hace especial a este lugar"
                  value={nuevoLugar.descripcion}
                  onChange={(e) => setNuevoLugar({ ...nuevoLugar, descripcion: e.target.value })}
                  rows={3}
                />
              </div>
              
              <div>
                <label className="label">Etiquetas sensoriales</label>
                <div className="chips">
                  {(nuevoLugar.etiquetasSensoriales || []).map((tag, idx) => (
                    <span key={idx} className="chip">
                      {tag}
                      <button type="button" onClick={() => setNuevoLugar((prev) => ({
                        ...prev,
                        etiquetasSensoriales: (prev.etiquetasSensoriales || []).filter((_, i) => i !== idx)
                      }))}>×</button>
                    </span>
                  ))}
                </div>
                <input
                  className="input"
                  type="text"
                  placeholder="Agregar etiqueta (ej: silencioso, iluminado)"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && tagInput.trim()) {
                      e.preventDefault();
                      setNuevoLugar((prev) => ({
                        ...prev,
                        etiquetasSensoriales: [...(prev.etiquetasSensoriales || []), tagInput.trim()]
                      }));
                      setTagInput('');
                    }
                  }}
                />
              </div>

              <div style={{
                display: 'flex',
                gap: '12px',
                marginTop: '8px'
              }}>
                <button
                  type="button"
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    background: '#F3F4F6',
                    color: '#374151',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '15px',
                    fontWeight: 500,
                    cursor: 'pointer'
                  }}
                  onClick={() => setShowAddForm(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    background: '#43A1F2',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '15px',
                    fontWeight: 500,
                    cursor: 'pointer'
                  }}
                >
                  Agregar lugar
                </button>
              </div>

              {mensaje && (
                <p style={{
                  marginTop: '12px',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  textAlign: 'center',
                  background: mensaje.includes('Error') ? '#FEE2E2' : '#D1FAE5',
                  color: mensaje.includes('Error') ? '#991B1B' : '#065F46'
                }}>
                  {mensaje}
                </p>
              )}
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Modal para agregar nuevo lugar - Mobile Bottom Sheet */}
      {isMobile && createPortal(
        <div 
          className={`add-place-modal-overlay ${showAddForm ? 'visible' : ''}`}
          onClick={() => setShowAddForm(false)}
        >
          <div 
            className={`add-place-modal-container ${showAddForm ? 'open' : ''}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle indicador para mobile */}
            <div className="add-place-handle"></div>
            
            <button 
              className="add-place-close"
              onClick={() => setShowAddForm(false)}
            >
              ✕
            </button>
            
            <div className="add-place-header">
              <MapPin size={20} className="add-place-icon" />
              <div className="add-place-title">Agregar nuevo lugar</div>
            </div>
            
            <p className="add-place-description">
              Podés escribir la dirección real y el sistema la geocodificará automáticamente.
            </p>
            
            <div className="add-place-coords">
              {nuevoLugar.latitud && nuevoLugar.longitud ? (
                <span>
                  Coordenadas cargadas ✓ (lat: {nuevoLugar.latitud?.toFixed(5) || 'N/A'}, lng: {nuevoLugar.longitud?.toFixed(5) || 'N/A'})
                </span>
              ) : (
                <span>Usaremos la dirección para ubicar el lugar automáticamente.</span>
              )}
            </div>

            <form className="add-place-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="label">Nombre del lugar *</label>
                <input
                  className="input"
                  type="text"
                  placeholder="Ej. Centro de día, Biblioteca, etc."
                  value={nuevoLugar.nombre}
                  onChange={(e) => setNuevoLugar({ ...nuevoLugar, nombre: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="label">Dirección *</label>
                <input
                  className="input"
                  type="text"
                  placeholder="Ej. Av. Siempre Viva 123"
                  value={nuevoLugar.direccion}
                  onChange={(e) => setNuevoLugar({ ...nuevoLugar, direccion: e.target.value })}
                  required
                />
              </div>

              <div className="add-place-modal-row">
                <div className="form-group">
                  <label className="label">Tipo *</label>
                  <input
                    className="input"
                    type="text"
                    placeholder="Ej: Shopping, Café..."
                    value={nuevoLugar.tipo}
                    onChange={(e) => setNuevoLugar({ ...nuevoLugar, tipo: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="label">Provincia *</label>
                  <input
                    className="input"
                    type="text"
                    placeholder="Ej: Buenos Aires"
                    value={nuevoLugar.provincia}
                    onChange={(e) => setNuevoLugar({ ...nuevoLugar, provincia: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="label">Descripción breve *</label>
                <textarea
                  className="input"
                  placeholder="Contá qué hace especial a este lugar"
                  value={nuevoLugar.descripcion}
                  onChange={(e) => setNuevoLugar({ ...nuevoLugar, descripcion: e.target.value })}
                  rows={3}
                />
              </div>
              
              <div>
                <label className="label">Etiquetas sensoriales</label>
                <div className="chips">
                  {(nuevoLugar.etiquetasSensoriales || []).map((tag, idx) => (
                    <span key={idx} className="chip">
                      {tag}
                      <button type="button" onClick={() => setNuevoLugar((prev) => ({
                        ...prev,
                        etiquetasSensoriales: (prev.etiquetasSensoriales || []).filter((_, i) => i !== idx)
                      }))}>×</button>
                    </span>
                  ))}
                </div>
                <input
                  className="input"
                  type="text"
                  placeholder="Agregar etiqueta (ej: silencioso, iluminado)"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && tagInput.trim()) {
                      e.preventDefault();
                      setNuevoLugar((prev) => ({
                        ...prev,
                        etiquetasSensoriales: [...(prev.etiquetasSensoriales || []), tagInput.trim()]
                      }));
                      setTagInput('');
                    }
                  }}
                />
              </div>

              <div className="add-place-buttons">
                <button
                  type="button"
                  className="add-place-button-secondary"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="add-place-button-primary"
                >
                  Agregar lugar
                </button>
              </div>

              {mensaje && (
                <p className={`add-place-message ${mensaje.includes('Error') ? 'msg-error' : 'msg-success'}`}>
                  {mensaje}
                </p>
              )}
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Modal de detalle de lugar */}
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
                      <span className="inline-block bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full mb-2">
                        {detalleLugar.tipo}
                      </span>
                    )}
                    {getCert(detalleLugar) === 'APADEA' && (
                      <div className="flex items-center gap-1 text-blue-600 text-sm mb-2">
                        <CheckCircle size={14} />
                        <span>Certificado APADEA</span>
                      </div>
                    )}
                    <p className="text-sm text-slate-600 mt-2">
                      {detalleLugar.descripcion || 'Sin descripción'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sección de reseñas */}
            <div className="p-4 border-t border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800 mb-3">Reseñas</h3>
              {resenas.filter(r => r.lugarId === detalleLugar._id).length === 0 ? (
                <p className="text-sm text-slate-500">No hay reseñas aún.</p>
              ) : (
                <div className="space-y-3">
                  {resenas.filter(r => r.lugarId === detalleLugar._id).map((resena) => (
                    <div key={resena._id} className="bg-slate-50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-700">
                          {resena.usuario || 'Usuario'}
                        </span>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className={i < resena.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-slate-600">{resena.comentario}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Formulario para agregar reseña */}
              <div className="mt-4 pt-4 border-t border-slate-200">
                <h4 className="text-sm font-medium text-slate-700 mb-2">Agregar tu reseña</h4>
                <div className="flex items-center gap-2 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      className={i < nuevaResena.rating ? "text-yellow-400 fill-yellow-400 cursor-pointer" : "text-gray-300 cursor-pointer"}
                      onClick={() => setNuevaResena({ ...nuevaResena, rating: i + 1 })}
                    />
                  ))}
                </div>
                <textarea
                  className="w-full border border-slate-300 rounded-lg p-2 text-sm"
                  placeholder="Escribe tu reseña..."
                  value={nuevaResena.comentario}
                  onChange={(e) => setNuevaResena({ ...nuevaResena, comentario: e.target.value })}
                  rows={3}
                />
                <button
                  className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
                  onClick={handleAgregarResena}
                >
                  Publicar reseña
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
