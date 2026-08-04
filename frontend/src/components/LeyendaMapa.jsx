import React, { useEffect, useState } from 'react';
import apadeaIcon from '../assets/apadea.png';

const styles = {
  container: {
    position: 'absolute',
    bottom: '16px',
    left: '16px',
    zIndex: 1000,
    padding: '10px 12px',
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    borderRadius: '12px',
    boxShadow: '0 10px 24px rgba(15, 23, 42, 0.12)',
    width: 'auto',
    maxWidth: '220px',
    fontFamily: 'Arial, sans-serif'
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '10px'
  },
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '28px',
    height: '28px',
    flexShrink: 0
  },
  label: {
    fontSize: '0.85rem',
    fontWeight: '700',
    color: '#0f172a',
    margin: 0
  }
};

const LeyendaMapa = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const containerStyle = isMobile
    ? {
        position: 'absolute',
        bottom: '16px',
        left: '16px',
        zIndex: 1000,
        padding: '10px 12px',
        backgroundColor: 'rgba(255, 255, 255, 0.92)',
        borderRadius: '12px',
        boxShadow: '0 10px 24px rgba(15, 23, 42, 0.12)',
        width: 'auto',
        maxWidth: '220px',
        fontFamily: 'Arial, sans-serif',
      }
    : styles.container;

  return (
    <div style={containerStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
        <div style={styles.label}>APADEA</div>
        <div style={styles.label}>Comunidad</div>
      </div>
      <div style={styles.legendItem}>
        <div style={styles.iconContainer}>
          <img 
            src={apadeaIcon} 
            alt="APADEA" 
            style={{ width: '20px', height: 'auto' }} 
          />
        </div>
        <div style={{ fontSize: '0.75rem', color: '#4b5563', margin: 0 }}>
          Lugares certificados por APADEA
        </div>
      </div>
      <div style={styles.legendItem}>
        <div style={styles.iconContainer}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#4CAF50" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 12c2.761 0 5-2.686 5-6s-2.239-6-5-6-5 2.686-5 6 2.239 6 5 6zm0 2c-3.866 0-7 2.239-7 5v3h14v-3c0-2.761-3.134-5-7-5z"/>
          </svg>
        </div>
        <div style={{ fontSize: '0.75rem', color: '#4b5563', margin: 0 }}>
          Lugares recomendados por la comunidad
        </div>
      </div>
    </div>
  );
};

export default LeyendaMapa;
