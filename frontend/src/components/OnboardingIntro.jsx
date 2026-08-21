import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Map, Calendar, MessageSquare, Heart } from 'lucide-react';

const OnboardingIntro = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      icon: Map,
      title: 'Encontrá lugares que se adapten a vos',
      description: 'Descubrí espacios y lugares pensados para diferentes necesidades sensoriales.',
      color: '#59C2BA',
    },
    {
      icon: Calendar,
      title: 'Prepará tus salidas',
      description: 'Organizá lo que necesitás antes de salir con checklists personalizados.',
      color: '#43A1F2',
    },
    {
      icon: MessageSquare,
      title: 'Conectate con la comunidad',
      description: 'Compartí experiencias, recomendaciones y encontrá acompañamiento.',
      color: '#961E67',
    },
    {
      icon: Heart,
      title: 'Cuidá tu bienestar',
      description: 'Registrá tus emociones y descubrí recursos para tu calma diaria.',
      color: '#EC7054',
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate('/auth');
    }
  };

  const handleSkip = () => {
    navigate('/auth');
  };

  const currentStepData = steps[currentStep];
  const Icon = currentStepData.icon;

  return (
    <div 
      className="min-h-screen flex flex-col px-6 py-12"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      {/* Progress indicator */}
      <div className="flex justify-center gap-2 mb-12">
        {steps.map((_, index) => (
          <div
            key={index}
            className="h-1 rounded-full transition-all duration-300"
            style={{
              width: index === currentStep ? '32px' : '8px',
              backgroundColor: index === currentStep ? 'var(--color-brand)' : 'var(--color-text-light)',
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        {/* Icon container */}
        <div 
          className="w-32 h-32 rounded-3xl flex items-center justify-center mb-8"
          style={{
            backgroundColor: `${currentStepData.color}20`,
            animation: 'scaleIn 0.5s ease',
          }}
        >
          <Icon size={64} style={{ color: currentStepData.color }} />
        </div>

        {/* Title */}
        <h2 
          className="text-2xl font-bold mb-4 px-4"
          style={{ 
            color: 'var(--color-ink)',
            animation: 'fadeInUp 0.5s ease 0.1s both'
          }}
        >
          {currentStepData.title}
        </h2>

        {/* Description */}
        <p 
          className="text-base leading-relaxed px-4"
          style={{ 
            color: 'var(--color-text-secondary)',
            animation: 'fadeInUp 0.5s ease 0.2s both'
          }}
        >
          {currentStepData.description}
        </p>
      </div>

      {/* Bottom actions */}
      <div className="w-full max-w-md mx-auto space-y-4">
        <button
          onClick={handleNext}
          className="w-full py-4 px-8 rounded-2xl text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
          style={{
            backgroundColor: 'var(--color-brand)',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          {currentStep === steps.length - 1 ? 'Comenzar' : 'Siguiente'}
          <ChevronRight size={20} />
        </button>

        <button
          onClick={handleSkip}
          className="w-full py-3 px-8 rounded-2xl font-semibold text-base transition-all duration-300"
          style={{
            backgroundColor: 'transparent',
            color: 'var(--color-text-secondary)',
          }}
        >
          Saltar
        </button>
      </div>

      <style jsx>{`
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
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

export default OnboardingIntro;
