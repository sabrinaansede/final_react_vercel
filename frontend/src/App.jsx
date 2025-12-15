import React from "react";
import { Routes, Route } from "react-router-dom";
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
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />
      <Route 
        path="/perfil" 
        element={
          <ProtectedRoute>
            <Perfil />
          </ProtectedRoute>
        } 
      />
    </Routes>
  </>
);

export default App;
