import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Map, Volume2, Sun, MessageSquare, Heart, Stethoscope, Check } from 'lucide-react';
import './OnboardingPreferences.css';

const OnboardingPreferences = () => {
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState([]);

  const preferences = [
    {
      id: 'lugares',
      icon: Map,
      title: 'Lugares accesibles',
      description: 'Encontrá espacios adaptados a tus necesidades',
      color: '#59C2BA',
    },
    {
      id: 'espacios',
      icon: Volume2,
      title: 'Espacios tranquilos',
      description: 'Lugares con poco ruido y poca luz',
      color: '#59C2BA',
    },
    {
      id: 'salidas',
      icon: Sun,
      title: 'Preparar salidas',
      description: 'Organizá lo que necesitás antes de salir',
      color: '#43A1F2',
    },
    {
      id: 'comunidad',
      icon: MessageSquare,
      title: 'Comunidad',
      description: 'Compartí experiencias y conectate',
      color: '#961E67',
    },
    {
      id: 'bienestar',
      icon: Heart,
      title: 'Bienestar',
      description: 'Registrá tus emociones y cuidá tu salud',
      color: '#EC7054',
    },
    {
      id: 'profesionales',
      icon: Stethoscope,
      title: 'Profesionales',
      description: 'Encontrá terapeutas y especialistas',
      color: '#FFC83D',
    },
  ];

  const toggleSelection = (id) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleContinue = () => {
    // Aquí podríamos guardar las preferencias en el backend o localStorage
    localStorage.setItem('userPreferences', JSON.stringify(selectedItems));
    navigate('/');
  };

  const handleSkip = () => {
    navigate('/');
  };

  return (
    <div className="preferences-container">
      <div className="preferences-wrapper">
        <div className="preferences-header">
          <h1 className="preferences-title">¿Qué querés encontrar en AutiSi?</h1>
          <p className="preferences-subtitle">Seleccioná las funcionalidades que te interesan</p>
        </div>

        <div className="preferences-grid">
          {preferences.map((pref) => {
            const Icon = pref.icon;
            const isSelected = selectedItems.includes(pref.id);
            
            return (
              <div
                key={pref.id}
                onClick={() => toggleSelection(pref.id)}
                className={`preference-card ${isSelected ? 'selected' : ''}`}
              >
                <div className="preference-checkmark">
                  <Check size={16} />
                </div>
                <div className="preference-icon">
                  <Icon size={64} />
                </div>
                <h3 className="preference-name">{pref.title}</h3>
                <p className="preference-description">{pref.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="preferences-actions">
        <button
          onClick={handleContinue}
          className="preferences-continue-button"
        >
          Continuar
        </button>

        <button
          onClick={handleSkip}
          className="preferences-skip-button"
        >
          Saltar
        </button>
      </div>
    </div>
  );
};

export default OnboardingPreferences;
