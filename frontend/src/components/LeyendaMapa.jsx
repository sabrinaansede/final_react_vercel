import React, { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import apadeaIcon from '../assets/apadea.png';

const styles = {
  container: {
    position: 'absolute',
    bottom: '110px',
    left: '16px',
    zIndex: 1000,
    padding: '12px 10px',
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    borderRadius: '12px',
    boxShadow: '0 10px 24px rgba(15, 23, 42, 0.12)',
    width: 'auto',
    maxWidth: '140px',
    fontFamily: 'Arial, sans-serif'
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '12px'
  },
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '24px',
    height: '24px',
    flexShrink: 0
  },
  label: {
    fontSize: '0.75rem',
    fontWeight: '700',
    color: '#0f172a',
    margin: 0
  },
  description: {
    fontSize: '0.7rem',
    color: '#4b5563',
    margin: 0,
    lineHeight: '1.2'
  }
};

const LeyendaMapa = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const containerStyle = isMobile
    ? {
        position: 'absolute',
        bottom: '180px',
        left: '16px',
        zIndex: 2000,
        padding: isExpanded ? '12px 10px' : '8px 10px',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '12px',
        boxShadow: '0 10px 24px rgba(15, 23, 42, 0.12)',
        width: 'auto',
        maxWidth: '140px',
        fontFamily: 'Arial, sans-serif',
      }
    : styles.container;

  return (
    <div style={containerStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isExpanded ? '8px' : '0' }}>
        <div style={{ fontSize: '0.7rem', fontWeight: '700', color: '#0f172a' }}>Leyenda</div>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          style={{ 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer', 
            padding: '2px',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          {isExpanded ? <ChevronUp size={16} color="#4b5563" /> : <ChevronDown size={16} color="#4b5563" />}
        </button>
      </div>
      
      {isExpanded && (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '8px' }}>
            <div style={{ fontSize: '0.65rem', fontWeight: '600', color: '#0f172a' }}>APADEA</div>
            <div style={{ fontSize: '0.65rem', fontWeight: '600', color: '#0f172a' }}>Comunidad</div>
          </div>
          
          <div style={styles.legendItem}>
            <div style={styles.iconContainer}>
              <img 
                src={apadeaIcon} 
                alt="APADEA" 
                style={{ width: '18px', height: 'auto' }} 
              />
            </div>
            <div>
              <div style={styles.description}>Certificados</div>
            </div>
          </div>
          
          <div style={styles.legendItem}>
            <div style={styles.iconContainer}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#4CAF50" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12c2.761 0 5-2.686 5-6s-2.239-6-5-6-5 2.686-5 6 2.239 6 5 6zm0 2c-3.866 0-7 2.239-7 5v3h14v-3c0-2.761-3.134-5-7-5z"/>
              </svg>
            </div>
            <div>
              <div style={styles.description}>Comunidad</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LeyendaMapa;
