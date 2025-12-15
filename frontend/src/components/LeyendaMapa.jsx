import React, { useEffect, useState } from 'react';
import apadeaIcon from '../assets/apadea.png';

const styles = {
  container: {
    position: 'absolute',
    bottom: '20px',
    left: '24px',
    zIndex: 1000,
    padding: '16px',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '8px',
    boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
    maxWidth: '280px',
    fontFamily: 'Arial, sans-serif'
  },
  title: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    margin: '0 0 12px 0',
    color: '#333'
  },
  divider: {
    height: '1px',
    backgroundColor: '#e0e0e0',
    marginBottom: '12px'
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '12px'
  },
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '36px',
    height: '36px',
    flexShrink: 0
  },
  label: {
    fontSize: '0.9rem',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '2px'
  },
  description: {
    fontSize: '0.8rem',
    color: '#666',
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
        position: 'static',
        margin: '8px 16px 16px',
        padding: '12px 14px',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '8px',
        boxShadow: '0 3px 6px rgba(0,0,0,0.12)',
        fontFamily: 'Arial, sans-serif',
      }
    : styles.container;

  return (
    <div style={containerStyle}>
      <h3 style={styles.title}>Leyenda del Mapa</h3>
      <div style={styles.divider}></div>
      
      <div>
        <div style={styles.legendItem}>
          <div style={styles.iconContainer}>
            <img 
              src={apadeaIcon} 
              alt="APADEA" 
              style={{ width: '24px', height: 'auto' }} 
            />
          </div>
          <div>
            <div style={styles.label}>APADEA</div>
            <p style={styles.description}>Lugares certificados por APADEA</p>
          </div>
        </div>

        <div style={styles.legendItem}>
          <div style={styles.iconContainer}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#4CAF50" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 12c2.761 0 5-2.686 5-6s-2.239-6-5-6-5 2.686-5 6 2.239 6 5 6zm0 2c-3.866 0-7 2.239-7 5v3h14v-3c0-2.761-3.134-5-7-5z"/>
            </svg>
          </div>
          <div>
            <div style={styles.label}>Comunidad</div>
            <p style={styles.description}>Lugares recomendados por la comunidad</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeyendaMapa;
