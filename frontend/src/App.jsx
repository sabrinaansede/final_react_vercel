import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
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
import AgendaTerapias from "./views/agenda.jsx";
import ChecklistPersonalizado from "./views/checklist.jsx";
import Profesionales from "./views/profesionales";

const App = () => (
  <>
    <Navbar />
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
        path="/agenda"
        element={
          <ProtectedRoute>
            <AgendaTerapias />
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
      <Route path="/profesionales" element={<Profesionales />} />
    </Routes>
  </>
);

export default App;
