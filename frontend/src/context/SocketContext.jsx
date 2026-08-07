import React, { createContext, useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import Toast from '../components/toast.jsx'

const SocketContext = createContext(null)

export const useSocket = () => useContext(SocketContext)

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'
    const s = io(BACKEND, { transports: ['websocket'], reconnection: true })
    setSocket(s)

    s.on('connect', () => {
      console.log('🔌 Socket conectado (cliente):', s.id)
    })

    s.on('new-notification', (payload) => {
      const text = payload && payload.titulo ? payload.titulo : 'Nueva notificación'
      setToast({ mensaje: text, tipo: 'ok' })
      setTimeout(() => setToast(null), 6000)
    })

    s.on('new-review', (payload) => {
      const text = payload && payload.comentario ? `Nueva reseña: ${payload.comentario}` : 'Nueva reseña'
      setToast({ mensaje: text, tipo: 'voto' })
      setTimeout(() => setToast(null), 6000)
    })

    // Community events
    s.on('nuevo-post', (payload) => {
      window.dispatchEvent(new CustomEvent('socket:nuevo-post', { detail: payload }))
    })

    s.on('editar-post', (payload) => {
      window.dispatchEvent(new CustomEvent('socket:editar-post', { detail: payload }))
    })

    s.on('eliminar-post', (payload) => {
      window.dispatchEvent(new CustomEvent('socket:eliminar-post', { detail: payload }))
    })

    s.on('nuevo-comentario', (payload) => {
      window.dispatchEvent(new CustomEvent('socket:nuevo-comentario', { detail: payload }))
    })

    s.on('nuevo-like', (payload) => {
      window.dispatchEvent(new CustomEvent('socket:nuevo-like', { detail: payload }))
    })

    s.on('usuario-conectado', (payload) => {
      window.dispatchEvent(new CustomEvent('socket:usuario-conectado', { detail: payload }))
    })

    s.on('usuario-desconectado', (payload) => {
      window.dispatchEvent(new CustomEvent('socket:usuario-desconectado', { detail: payload }))
    })

    return () => {
      s.disconnect()
    }
  }, [])

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
      <Toast mensaje={toast?.mensaje} tipo={toast?.tipo} onClose={() => setToast(null)} />
    </SocketContext.Provider>
  )
}

export default SocketContext
