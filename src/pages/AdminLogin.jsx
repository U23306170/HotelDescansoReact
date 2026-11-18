import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useHotel } from '../context/useHotel'

export default function AdminLogin() {
  const { authenticated, login } = useHotel()
  const location = useLocation()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  if (authenticated) return <Navigate to="/habitaciones-admin" replace />

  function submit(event) {
    event.preventDefault()
    if (!login(username.trim(), password)) {
      setError('Usuario o contraseña incorrectos.')
      return
    }
    navigate(location.state?.from || '/habitaciones-admin', { replace: true })
  }

  return <section className="container-hotel my-16 max-w-lg">
    <div className="card p-7">
      <p className="text-sm font-bold uppercase tracking-wider text-blue-600">Acceso de recepcionista</p>
      <h1 className="my-2 text-2xl font-bold">Iniciar sesión</h1>
      <p className="mb-6 text-sm text-slate-500">El panel permite gestionar huéspedes y habitaciones del hotel.</p>
      <form onSubmit={submit}>
        <label className="label" htmlFor="admin-user">Usuario</label>
        <input id="admin-user" className="field mb-4" autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} required />
        <label className="label" htmlFor="admin-password">Contraseña</label>
        <input id="admin-password" className="field mb-4" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
        {error && <p className="error mb-3" role="alert">{error}</p>}
        <button className="btn btn-primary w-full">Ingresar</button>
      </form>
      <p className="mt-4 text-xs text-slate-500">Demo local: usuario <strong>admin</strong> · contraseña <strong>admin123</strong></p>
      <Link className="mt-4 inline-block text-sm text-blue-600 hover:underline" to="/">← Volver al inicio</Link>
    </div>
  </section>
}
