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
import Notificaciones from "./views/Notificaciones.jsx";
import MobileNavigation from "./components/MobileNavigation";
import AdminLayout from "./admin/AdminLayout";
import AdminPageLayout from "./admin/AdminPageLayout";
import Dashboard from "./admin/Dashboard";
import AdminProfesionales from "./admin/Profesionales";
import AdminContenido from "./admin/Contenido";
import Notifications from "./admin/Notifications";
import { useAuth } from "./context/AuthContext.jsx";
import NotificationPermission from "./components/NotificationPermission.jsx";
import OnboardingWelcome from "./components/OnboardingWelcome";
import OnboardingIntro from "./components/OnboardingIntro";
import OnboardingProfileType from "./components/OnboardingProfileType";
import OnboardingPreferences from "./components/OnboardingPreferences";
import AuthLanding from "./components/AuthLanding";

const App = () => {
  const location = useLocation();
  const { isAdmin } = useAuth();
  const isComunidadRoute = location.pathname.startsWith("/comunidad");
  const isAdminRoute = location.pathname.startsWith("/admin");
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth >= 768 : false
  );

  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const showMainNavbar = !location.pathname.startsWith("/onboarding") && !location.pathname.startsWith("/login") && !location.pathname.startsWith("/registro");
  const showMobileNav = !isDesktop && !location.pathname.startsWith("/login") && !location.pathname.startsWith("/registro") && !location.pathname.startsWith("/onboarding") && !isAdminRoute;
  const isMapRoute = location.pathname === "/mapa";
  const isAuthRoute = location.pathname.startsWith("/login") || location.pathname.startsWith("/registro");

  // Componente para proteger rutas de admin
  const AdminRoute = ({ children }) => {
    if (!isAdmin) {
      return <Navigate to="/" replace />;
    }
    return children;
  };

  return (
    <>
      {showMainNavbar && <Navbar />}
      <main className={`app-main${isMapRoute ? " app-main--flush" : ""}${isAuthRoute ? " app-main--no-navbar" : ""}`}>
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/onboarding" element={<OnboardingWelcome />} />
      <Route path="/onboarding/intro" element={<OnboardingIntro />} />
      <Route path="/onboarding/profile-type" element={<OnboardingProfileType />} />
      <Route path="/onboarding/preferences" element={<OnboardingPreferences />} />
      <Route path="/login" element={<AuthLanding initialTab="login" />} />
      <Route path="/registro" element={<AuthLanding initialTab="registro" />} />
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
        path="/notificaciones"
        element={
          <ProtectedRoute>
            <Notificaciones />
          </ProtectedRoute>
        }
      />
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
      {/* Rutas del Panel de Administración */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <Dashboard />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/lugares"
        element={
          <AdminRoute>
            <AdminPageLayout title="Gestión de Lugares" description="Administra los lugares cargados en la plataforma">
              <div className="p-8">Gestión de Lugares - Próximamente</div>
            </AdminPageLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/profesionales"
        element={
          <AdminRoute>
            <AdminProfesionales />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/comunidad"
        element={
          <AdminRoute>
            <AdminPageLayout title="Comunidad" description="Gestiona las publicaciones de la comunidad">
              <div className="p-8">Comunidad - Próximamente</div>
            </AdminPageLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/usuarios"
        element={
          <AdminRoute>
            <AdminPageLayout title="Gestión de Usuarios" description="Administra los usuarios de la plataforma">
              <div className="p-8">Usuarios - Próximamente</div>
            </AdminPageLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/notificaciones"
        element={
          <AdminRoute>
            <Notifications />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/contenido"
        element={
          <AdminRoute>
            <AdminContenido />
          </AdminRoute>
        }
      />
    </Routes>
      </main>
    {showMobileNav && <MobileNavigation />}
    <NotificationPermission />
  </>
  );
};

export default App;
