import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

const OnboardingWelcome = () => {
  const navigate = useNavigate();

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      <div className="w-full max-w-md flex flex-col items-center text-center">
        {/* Logo */}
        <img 
          src={logo} 
          alt="AutiSi Logo" 
          className="w-48 h-auto mb-8"
          style={{ animation: 'fadeInDown 0.6s ease' }}
        />
        
        {/* Título principal */}
        <h1 
          className="text-3xl font-bold mb-3"
          style={{ 
            color: 'var(--color-ink)',
            animation: 'fadeInUp 0.6s ease 0.2s both'
          }}
        >
          Tu calma, a tu manera.
        </h1>
        
        {/* Descripción */}
        <p 
          className="text-base mb-12 leading-relaxed"
          style={{ 
            color: 'var(--color-text-secondary)',
            animation: 'fadeInUp 0.6s ease 0.4s both'
          }}
        >
          Descubrí lugares adaptados, conectate con la comunidad y encontrá recursos para tu bienestar diario.
        </p>
        
        {/* Botón principal */}
        <button
          onClick={() => navigate('/onboarding/intro')}
          className="w-full py-4 px-8 rounded-2xl text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
          style={{
            backgroundColor: 'var(--color-brand)',
            boxShadow: 'var(--shadow-lg)',
            animation: 'fadeInUp 0.6s ease 0.6s both'
          }}
        >
          Comenzar
        </button>
        
        {/* Botón secundario */}
        <button
          onClick={() => navigate('/auth')}
          className="w-full py-4 px-8 rounded-2xl font-semibold text-lg mt-4 transition-all duration-300"
          style={{
            backgroundColor: 'var(--color-white)',
            color: 'var(--color-brand)',
            border: '2px solid var(--color-brand)',
            animation: 'fadeInUp 0.6s ease 0.8s both'
          }}
        >
          Ya tengo cuenta
        </button>
      </div>
      
      <style jsx>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default OnboardingWelcome;
