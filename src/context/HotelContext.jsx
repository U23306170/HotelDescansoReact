import { useEffect, useMemo, useState } from 'react'
import { guestLabel, initialGuests, initialReservations, rooms as seedRooms } from '../data'
import { API_ENDPOINTS } from '../services/api'
import { HotelContext } from './useHotel'

const STORAGE_KEY = 'descanso-eterno-data-v1'
const SESSION_KEY = 'descanso-eterno-admin-v1'
const readStored = (key, fallback) => {
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

export function HotelProvider({ children }) {
  const initialData = useMemo(() => readStored(STORAGE_KEY, {
    guests: initialGuests,
    reservations: initialReservations,
    rooms: seedRooms,
  }), [])
  const [guests, setGuests] = useState(initialData.guests)
  const [reservations, setReservations] = useState(initialData.reservations)
  const [rooms, setRooms] = useState(initialData.rooms)
  const [authenticated, setAuthenticated] = useState(() => readStored(SESSION_KEY, false))

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ guests, reservations, rooms }))
  }, [guests, reservations, rooms])

  useEffect(() => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(authenticated))
  }, [authenticated])

  const value = useMemo(() => ({
    guests, reservations, rooms, authenticated,
    apiEndpoints: API_ENDPOINTS,
    login(username, password) {
      if (username !== 'admin' || password !== 'admin123') return false
      setAuthenticated(true)
      return true
    },
    logout() { setAuthenticated(false) },
    saveGuest(guest) {
      if (guest.id) {
        setGuests((list) => list.map((item) => (item.id === guest.id ? { ...item, ...guest } : item)))
        return 'Los datos del huésped se actualizaron correctamente.'
      }
      setGuests((list) => [...list, { ...guest, id: Math.max(...list.map((item) => item.id), 0) + 1, status: 'Activo' }])
      return 'Huésped registrado correctamente.'
    },
    deleteGuest(id) {
      setGuests((list) => list.filter((item) => item.id !== id))
      return 'Huésped eliminado correctamente.'
    },
    saveRoom(room) {
      if (room.id) {
        setRooms((list) => list.map((item) => (item.id === room.id ? { ...item, ...room } : item)))
        return 'Habitación actualizada correctamente.'
      }
      setRooms((list) => [...list, { ...room, id: Math.max(...list.map((item) => item.id), 0) + 1 }])
      return 'Habitación registrada correctamente.'
    },
    deleteRoom(id) {
      setRooms((list) => list.filter((item) => item.id !== id))
      return 'Habitación eliminada correctamente.'
    },
    saveReservation(reservation) {
      if (reservation.id) {
        setReservations((list) => list.map((item) => (item.id === reservation.id ? { ...item, ...reservation } : item)))
        return 'Reserva actualizada correctamente.'
      }
      setReservations((list) => [...list, { ...reservation, id: Math.max(...list.map((item) => item.id), 0) + 1 }])
      return 'Reserva registrada correctamente.'
    },
    cancelReservation(id) {
      setReservations((list) => list.map((item) => (item.id === id ? { ...item, status: 'Anulada' } : item)))
      return 'La reserva fue anulada.'
    },
    guestNames: guests.map(guestLabel),
  }), [guests, reservations, rooms, authenticated])

  return <HotelContext.Provider value={value}>{children}</HotelContext.Provider>
}
