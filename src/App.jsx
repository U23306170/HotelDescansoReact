import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Layout from './components/Layout'
import { HotelProvider } from './context/HotelContext'
import About from './pages/About'
import Guests from './pages/Guests'
import Home from './pages/Home'
import Reservations from './pages/Reservations'
import RoomsAdmin from './pages/RoomsAdmin'
import AdminLogin from './pages/AdminLogin'
import { useHotel } from './context/useHotel'

function RequireAdmin({ children }) {
  const { authenticated } = useHotel()
  const location = useLocation()
  return authenticated ? children : <Navigate to="/ingresar" replace state={{ from: location.pathname }} />
}

export default function App() {
  return (
    <HotelProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="reservas" element={<RequireAdmin><Reservations /></RequireAdmin>} />
            <Route path="huespedes" element={<RequireAdmin><Guests /></RequireAdmin>} />
            <Route path="nosotros" element={<About />} />
            <Route path="ingresar" element={<AdminLogin />} />
            <Route path="habitaciones-admin" element={<RequireAdmin><RoomsAdmin /></RequireAdmin>} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </HotelProvider>
  )
}
