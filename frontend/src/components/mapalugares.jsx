import { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "../App.css";
import "./ModalDetalleLugar.css";
import LeyendaMapa from "./LeyendaMapa";
import { useAuth } from "../context/AuthContext.jsx";
import apadeaIcon from "../assets/apadea.png";

// Base URL del backend (Vite)
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

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
        <svg class="glyph" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path fill="currentColor" d="M12 12c2.761 0 5-2.686 5-6s-2.239-6-5-6-5 2.686-5 6 2.239 6 5 6zm0 2c-3.866 0-7 2.239-7 5v3h14v-3c0-2.761-3.134-5-7-5z"/>
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
  };
  
  // Función para abrir el detalle del lugar
  const abrirDetalleLugar = (lugar) => {
    console.log('Abriendo detalles del lugar:', lugar);
    
    // Usar la función de actualización de estado para asegurar que obtenemos el estado más reciente
    setDetalleLugar(prevLugar => {
      const nuevoLugar = { ...lugar };
      console.log('Actualizando detalleLugar a:', nuevoLugar);
      return nuevoLugar;
    });
    
    // Verificar el estado después de la actualización
    setTimeout(() => {
      console.log('Estado después de actualizar - detalleLugar:', detalleLugar);
      console.log('¿El modal debería estar visible?', !!detalleLugar);
    }, 100);
  };
  const [resenaForm, setResenaForm] = useState({ puntuacion: 0, comentario: "" });
  const [fotoUI, setFotoUI] = useState({ open: false, file: null, preview: "" });

  const [menuOpen, setMenuOpen] = useState(null); 
  const [sortKey, setSortKey] = useState("default");
  const [soloGuardados, setSoloGuardados] = useState(false);
  const [selectedLugarId, setSelectedLugarId] = useState(null);
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
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="12" height="12">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
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
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginRight: '4px'}}>
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="#1e40af"/>
                          </svg>
                          Certificado APADEA
                        </span>
                      )}
                    </div>
                  )}
                  
                  <button 
                    className="details-button"
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

      <div className="formulario-lugar">
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
            {listaOrdenada.slice(0, 12).map((l) => (
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
        
        <div className="card">
          <div className="card-title">Agregar nuevo lugar</div>
          <p className="label">
            Podés escribir la dirección real y/o hacer clic en el mapa para afinar la ubicación.
          </p>
          <div style={{ fontSize: 12, color: '#64748b' }}>
            {nuevoLugar.latitud && nuevoLugar.longitud ? (
              <span>
                Ubicación seleccionada ✓ (lat: {nuevoLugar.latitud.toFixed(5)}, lng:{" "}
                {nuevoLugar.longitud.toFixed(5)})
              </span>
            ) : (
              <span>Usaremos la dirección para buscar la ubicación en el mapa.</span>
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
              className="btn btn-primary"
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
      </div>

      {detalleLugar && (
        <div className="modal-backdrop" onClick={cerrarDetalle}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button 
              className="modal-close-btn" 
              onClick={cerrarDetalle}
              aria-label="Cerrar modal"
            >
              &times;
            </button>
            
            <div className="modal-header">
              <h2>{detalleLugar.nombre}</h2>
              <p className="modal-address">{detalleLugar.direccion}</p>
            </div>
            
            <div className="modal-body">
              <div className="info-section">
                <p><strong>Tipo:</strong> {detalleLugar.tipo || 'No especificado'}</p>
                <p><strong>Provincia:</strong> {detalleLugar.provincia || 'No especificada'}</p>
                
                {detalleLugar.descripcion && (
                  <div className="modal-section">
                    <h4>Descripción</h4>
                    <p>{detalleLugar.descripcion}</p>
                  </div>
                )}
                
                <div className="certification-section">
                  <div className="certification-header">
                    <h4 className="certification-title">Certificación</h4>
                  </div>
                  <div className="certification-items">
                    <div className="certification-item">
                      <span className="certification-dot yellow"></span>
                      <span>Certificación oficial: {detalleLugar.certificadoPor === 'APADEA' ? 'APADEA' : 'No certificado'}</span>
                    </div>
                    <div className="certification-item">
                      <span className="certification-dot green"></span>
                      <span>Validación comunitaria: {Number(ratingPorLugar[detalleLugar._id]?.avg || 0).toFixed(1)}/5 ({ratingPorLugar[detalleLugar._id]?.count || 0} usuarios)</span>
                    </div>
                  </div>
                </div>

                {detalleLugar.etiquetasSensoriales?.length > 0 && (
                  <div className="modal-section">
                    <h4>Características sensoriales</h4>
                    <div className="tags-container">
                      {detalleLugar.etiquetasSensoriales.map((tag, i) => (
                        <span key={i} className="modal-tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="reviews-section">
                <h3>Reseñas</h3>
                
                <div className="review-form-section">
                  <h4>Dejar reseña</h4>
                  <div className="rating-stars">
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
                    className="review-textarea"
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
                
                <div className="community-reviews">
                  <h4>Opiniones de la comunidad</h4>
                  <div className="reviews-list">
                    {resenas
                      .filter(r => (r.lugar?._id || r.lugar) === detalleLugar._id)
                      .slice(-3)
                      .reverse()
                      .map((r, idx) => (
                        <div key={idx} className="review-item">
                          {r.fotoUrl && (
                            <img 
                              src={r.fotoUrl} 
                              alt="foto reseña" 
                              className="review-image"
                            />
                          )}
                          <div className="review-comment">
                            {r.comentario || '(Sin comentario)'}
                          </div>
                          <div className="review-user">
                            {typeof r.usuario === 'object' ? (r.usuario?.nombre || 'Usuario') : 'Usuario'}
                          </div>
                        </div>
                      ))}
                    
                    {!resenas.some(r => (r.lugar?._id || r.lugar) === detalleLugar._id) && (
                      <div className="no-reviews">
                        Aún no hay opiniones. ¡Sé el primero en dejar una reseña!
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <LeyendaMapa />
    </div>
  </div>
  );
}
