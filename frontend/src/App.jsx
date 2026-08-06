import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/navbar";
import Registro from "./views/registro";
import MapaLugares from "./components/mapalugares";
import Login from "./views/login";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./views/home";
import MisResenas from "./views/misresenas";
import Contacto from "./views/contacto.jsx";
import Perfil from "./components/dashboard/Dashboard";
import Tecnicas from "./views/tecnicas.jsx";
import ChecklistPersonalizado from "./views/checklist.jsx";
import Profesionales from "./views/profesionales";
import Comunidad from "./views/comunidad.jsx";
import CentroInformacion from "./views/CentroInformacion.jsx";
import MobileNavigation from "./components/MobileNavigation";

const App = () => {
  const location = useLocation();
  const isComunidadRoute = location.pathname.startsWith("/comunidad");
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth >= 768 : false
  );

  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const showMainNavbar = true;
  const showMobileNav = !isDesktop && !location.pathname.startsWith("/login") && !location.pathname.startsWith("/registro");
  const isMapRoute = location.pathname === "/mapa";

  return (
    <>
      {showMainNavbar && <Navbar />}
      <main className={`app-main${isMapRoute ? " app-main--flush" : ""}`}>
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/mapa" element={<MapaLugares />} />
      <Route
        path="/contacto"
        element={
          <ProtectedRoute>
            <Contacto />
          </ProtectedRoute>
        }
      />
      <Route path="/tecnicas" element={<Tecnicas />} />
      <Route
        path="/mis-resenas"
        element={
          <ProtectedRoute>
            <MisResenas />
          </ProtectedRoute>
        }
      />
      <Route path="/login" element={<Navigate to="/" replace />} />
      <Route path="/registro" element={<Registro />} />
      <Route 
        path="/perfil" 
        element={
          <ProtectedRoute>
            <Perfil />
          </ProtectedRoute>
        } 
      />
      <Route
        path="/checklist"
        element={
          <ProtectedRoute>
            <ChecklistPersonalizado />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profesionales"
        element={
          <ProtectedRoute>
            <Profesionales />
          </ProtectedRoute>
        }
      />
      <Route path="/centro-informacion" element={<CentroInformacion />} />
      <Route
        path="/comunidad"
        element={
          <ProtectedRoute>
            <Comunidad />
          </ProtectedRoute>
        }
      />
      <Route
        path="/comunidad/guardados"
        element={
          <ProtectedRoute>
            <Comunidad />
          </ProtectedRoute>
        }
      />
    </Routes>
      </main>
    {showMobileNav && <MobileNavigation />}
  </>
  );
};

export default App;
