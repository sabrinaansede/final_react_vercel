import React, { useState, useRef, useEffect } from 'react';
import './FlipCard.css';

const FlipCard = ({ 
  icon, 
  title, 
  illustration, 
  explanation, 
  steps,
  onFlip 
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);

    const handleChange = (e) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    if (onFlip) onFlip(!isFlipped);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleFlip();
    }
  };

  const animationDuration = isReducedMotion ? '0s' : '600ms';

  return (
    <div
      ref={cardRef}
      className="flip-card-container"
      role="button"
      tabIndex={0}
      aria-label={`${title}. Presiona Enter o espacio para ver más detalles`}
      aria-pressed={isFlipped}
      onClick={handleFlip}
      onKeyDown={handleKeyDown}
      style={{ '--flip-duration': animationDuration }}
    >
      <div 
        className={`flip-card-inner ${isFlipped ? 'flipped' : ''}`}
        style={{ transitionDuration: animationDuration }}
      >
        {/* Front */}
        <div className="flip-card-front">
          <div className="flip-illustration-container">
            <img 
              src={illustration} 
              alt={`Ilustración de ${title}`}
              className="flip-illustration"
            />
          </div>
          <h3 className="flip-card-title">{title}</h3>
        </div>

        {/* Back */}
        <div className="flip-card-back">
          <div className="flip-illustration-container">
            <img 
              src={illustration} 
              alt={`Ilustración de ${title}`}
              className="flip-illustration"
            />
          </div>
          <div className="flip-back-content">
            <h3 className="flip-back-title">{title}</h3>
            <p className="flip-explanation">{explanation}</p>
            <div className="flip-steps">
              <h4 className="flip-steps-title">Pasos:</h4>
              <ol className="flip-steps-list">
                {steps.map((step, index) => (
                  <li key={index} className="flip-step-item">{step}</li>
                ))}
              </ol>
            </div>
            <button 
              className="flip-back-button"
              onClick={(e) => {
                e.stopPropagation();
                handleFlip();
              }}
              aria-label="Volver al frente"
            >
              ← Volver
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlipCard;
