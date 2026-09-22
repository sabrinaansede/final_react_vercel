import React, { useState, useEffect } from 'react';
import './Boti.css';
// import botiImage from '../assets/boti.png'; // Uncomment when image is uploaded

const BOTI_MESSAGES = {
  home: {
    greeting: "¡Hola! Soy Boti 👋",
    message: "Estoy acá para acompañarte. ¿Qué necesitás hoy?",
    buttonText: "Explorar AutiSi"
  },
  calma: {
    greeting: "¡Hola! Soy Boti 👋",
    message: "¿Buscamos algo que te ayude a sentirte mejor?",
    buttonText: "Ver técnicas"
  },
  mapa: {
    greeting: "¡Hola! Soy Boti 👋",
    message: "¿Buscamos un lugar que se adapte a vos?",
    buttonText: "Ver mapa"
  },
  emociones: {
    greeting: "¡Hola! Soy Boti 👋",
    message: "¿Cómo te sentís hoy?",
    buttonText: "Registrar estado"
  },
  informacion: {
    greeting: "¡Hola! Soy Boti 👋",
    message: "¿Querés aprender algo nuevo?",
    buttonText: "Explorar temas"
  },
  comunidad: {
    greeting: "¡Hola! Soy Boti 👋",
    message: "Hay otras personas que también quieren compartir.",
    buttonText: "Ver comunidad"
  }
};

const Boti = ({ context = 'home', onAction, showWelcomeOnMount = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const content = BOTI_MESSAGES[context] || BOTI_MESSAGES.home;

  useEffect(() => {
    if (showWelcomeOnMount) {
      setShowWelcome(true);
      const timer = setTimeout(() => {
        setShowWelcome(false);
      }, 5000); // 5 segundos
      return () => clearTimeout(timer);
    }
  }, [showWelcomeOnMount]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleAction = () => {
    if (onAction) {
      onAction();
    }
    setIsOpen(false);
  };

  return (
    <>
      <button className="boti-fab" onClick={handleToggle} aria-label="Abrir asistente Boti">
        {/* <img src={botiImage} alt="Boti" className="boti-fab-image" /> */}
        <div className="boti-fab-placeholder">
          <span className="boti-fab-emoji">🤖</span>
        </div>
      </button>

      {/* Welcome Message - Auto-show on mount */}
      {showWelcome && (
        <div className="boti-welcome-message">
          <div className="boti-welcome-content">
            <p className="boti-welcome-text">{content.message}</p>
          </div>
        </div>
      )}

      {/* Modal - Click to open */}
      {isOpen && (
        <div className="boti-modal-overlay" onClick={handleToggle}>
          <div className="boti-modal" onClick={(e) => e.stopPropagation()}>
            <div className="boti-modal-content">
              <h2 className="boti-greeting">{content.greeting}</h2>
              <p className="boti-message">{content.message}</p>
              <button className="boti-button" onClick={handleAction}>
                {content.buttonText}
              </button>
            </div>
            <button className="boti-close-button" onClick={handleToggle} aria-label="Cerrar">
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Boti;
