import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import './OnboardingProfileType.css';

const OnboardingProfileType = () => {
  const navigate = useNavigate();
  const [selectedProfile, setSelectedProfile] = useState(null);

  const profileTypes = [
    {
      id: 'autista',
      svg: (
        <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="24" cy="24" r="20" fill="#43A1F2" fillOpacity="0.2"/>
          <circle cx="24" cy="18" r="8" fill="#43A1F2"/>
          <path d="M12 40C12 32 16 28 24 28C32 28 36 32 36 40" stroke="#43A1F2" strokeWidth="3" strokeLinecap="round"/>
        </svg>
      ),
      title: 'Persona autista',
      description: 'Uso AutiSi para encontrar herramientas y recursos para mí.',
      color: '#43A1F2',
    },
    {
      id: 'familiar',
      svg: (
        <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="24" cy="24" r="20" fill="#59C2BA" fillOpacity="0.2"/>
          <circle cx="18" cy="16" r="6" fill="#59C2BA"/>
          <circle cx="30" cy="20" r="5" fill="#59C2BA"/>
          <path d="M10 40C10 34 14 30 18 30" stroke="#59C2BA" strokeWidth="3" strokeLinecap="round"/>
          <path d="M22 40C22 36 26 32 30 32" stroke="#59C2BA" strokeWidth="3" strokeLinecap="round"/>
        </svg>
      ),
      title: 'Familiar o acompañante',
      description: 'Busco recursos y herramientas para acompañar a otra persona.',
      color: '#59C2BA',
    },
    {
      id: 'profesional',
      svg: (
        <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="24" cy="24" r="20" fill="#EC7054" fillOpacity="0.2"/>
          <circle cx="24" cy="16" r="7" fill="#EC7054"/>
          <path d="M14 40C14 32 18 28 24 28C30 28 34 32 34 40" stroke="#EC7054" strokeWidth="3" strokeLinecap="round"/>
          <path d="M24 23L24 28" stroke="#EC7054" strokeWidth="3" strokeLinecap="round"/>
          <circle cx="24" cy="30" r="2" fill="#EC7054"/>
        </svg>
      ),
      title: 'Profesional',
      description: 'Trabajo acompañando a personas autistas y sus familias.',
      color: '#EC7054',
    },
    {
      id: 'no-especificar',
      svg: (
        <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="24" cy="24" r="20" fill="#F1E067" fillOpacity="0.2"/>
          <circle cx="24" cy="18" r="8" fill="#F1E067"/>
          <path d="M16 32L32 32" stroke="#F1E067" strokeWidth="3" strokeLinecap="round"/>
          <path d="M12 40C12 32 16 28 24 28C32 28 36 32 36 40" stroke="#F1E067" strokeWidth="3" strokeLinecap="round"/>
        </svg>
      ),
      title: 'Prefiero no especificarlo',
      description: 'Quiero explorar la aplicación sin definir un perfil específico.',
      color: '#F1E067',
    },
  ];

  const handleContinue = () => {
    if (!selectedProfile) return;
    
    localStorage.setItem('userProfileType', selectedProfile);
    navigate('/onboarding/preferences');
  };

  const handleSkip = () => {
    navigate('/onboarding/preferences');
  };

  const selectedProfileData = profileTypes.find(p => p.id === selectedProfile);

  return (
    <div className="profile-type-container">
      <div className="profile-type-wrapper">
        <div className="profile-type-header">
          <h1 className="profile-type-title">¿Qué tipo de perfil sos?</h1>
          <p className="profile-type-subtitle">Elegí la opción que mejor te represente</p>
        </div>

        <div className="profile-type-grid">
          {profileTypes.map((profile) => (
            <div
              key={profile.id}
              onClick={() => setSelectedProfile(profile.id)}
              className={`profile-type-card ${profile.id} ${selectedProfile === profile.id ? 'selected' : ''}`}
            >
              <div className="profile-type-checkmark">
                <Check size={16} />
              </div>
              <div className="profile-type-icon">
                {profile.svg}
              </div>
              <p className="profile-type-name">{profile.title}</p>
            </div>
          ))}
        </div>

        {selectedProfileData && (
          <div className="profile-type-description">
            {selectedProfileData.description}
          </div>
        )}
      </div>

      <div className="profile-type-actions">
        <button
          onClick={handleContinue}
          disabled={!selectedProfile}
          className="profile-type-continue-button"
        >
          Continuar
        </button>

        <button
          onClick={handleSkip}
          className="profile-type-skip-button"
        >
          Saltar
        </button>
      </div>
    </div>
  );
};

export default OnboardingProfileType;
