import { useRef, useState } from 'react'
import { useHotel } from '../context/useHotel'

const blankRoom = { number: '', type: 'Simple', price: '', status: 'Disponible', available: true, description: '', amenities: [] }
const amenityOptions = ['WiFi', 'Desayuno', 'TV', 'Minibar', 'Kit para mascota']

export default function RoomsAdmin() {
  const { rooms, saveRoom, deleteRoom } = useHotel()
  const [form, setForm] = useState(blankRoom)
  const [editingId, setEditingId] = useState(null)
  const [notice, setNotice] = useState('')
  const numberRef = useRef(null)

  function edit(room) {
    setEditingId(room.id)
    setForm({ ...room, price: String(room.price), amenities: [...room.amenities] })
    numberRef.current?.focus()
  }
  function reset() {
    setForm(blankRoom)
    setEditingId(null)
  }
  function submit(event) {
    event.preventDefault()
    if (rooms.some((room) => room.number === form.number.trim() && room.id !== editingId)) {
      setNotice('Ya existe una habitación con ese número.')
      return
    }
    const available = form.status === 'Disponible'
    setNotice(saveRoom({ ...form, id: editingId, number: form.number.trim(), price: Number(form.price), available }))
    reset()
  }

  return <section className="container-hotel my-12">
    <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
      <div><p className="text-sm font-bold uppercase tracking-wider text-blue-600">Panel de recepción</p><h1 className="section-title mb-0 mt-1">Gestión de habitaciones</h1></div>
    </div>
    {notice && <div className="mb-5 flex justify-between rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-800" role="status"><span>{notice}</span><button onClick={() => setNotice('')} aria-label="Cerrar">×</button></div>}
    <div className="grid items-start gap-6 lg:grid-cols-3">
      <form onSubmit={submit} className="card space-y-4 p-5 lg:col-span-1">
        <h2 className="text-lg font-bold">{editingId ? 'Editar habitación' : 'Registrar habitación'}</h2>
        <div><label className="label" htmlFor="room-number">Número</label><input ref={numberRef} id="room-number" className="field" required maxLength="8" value={form.number} onChange={(event) => setForm({ ...form, number: event.target.value })} /></div>
        <div><label className="label" htmlFor="room-type">Tipo</label><select id="room-type" className="field" value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })}><option>Simple</option><option>Doble</option><option>Suite</option><option>Pet-friendly</option></select></div>
        <div><label className="label" htmlFor="room-price">Precio por noche (S/)</label><input id="room-price" className="field" type="number" min="1" step="0.01" required value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} /></div>
        <div><label className="label" htmlFor="room-status">Estado</label><select id="room-status" className="field" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}><option>Disponible</option><option>Ocupada</option><option>Mantenimiento</option></select></div>
        <div><label className="label" htmlFor="room-description">Descripción</label><textarea id="room-description" className="field" rows="2" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></div>
        <fieldset><legend className="label">Servicios</legend><div className="grid grid-cols-2 gap-2 text-sm">{amenityOptions.map((amenity) => <label key={amenity} className="flex items-center gap-2"><input type="checkbox" checked={form.amenities.includes(amenity)} onChange={(event) => setForm({ ...form, amenities: event.target.checked ? [...form.amenities, amenity] : form.amenities.filter((item) => item !== amenity) })} />{amenity}</label>)}</div></fieldset>
        <div className="flex gap-2"><button className="btn btn-primary flex-1">{editingId ? 'Guardar cambios' : 'Registrar'}</button>{editingId && <button type="button" className="btn btn-secondary" onClick={reset}>Cancelar</button>}</div>
      </form>
      <div className="space-y-3 lg:col-span-2">
        {rooms.length === 0 && <p className="card p-6 text-slate-500">No hay habitaciones registradas.</p>}
        {rooms.map((room) => <article key={room.id} className="card flex flex-wrap items-center justify-between gap-4 p-5">
          <div><div className="flex flex-wrap items-center gap-2"><h2 className="font-bold">Hab. {room.number} — {room.type}</h2><span className={`badge ${room.status === 'Disponible' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>{room.status}</span></div><p className="mt-1 text-sm text-slate-500">S/ {Number(room.price).toFixed(2)} por noche · {room.description || 'Sin descripción'}</p><p className="mt-1 text-xs text-slate-500">{room.amenities.join(' · ') || 'Sin servicios registrados'}</p></div>
          <div className="flex gap-2"><button type="button" className="btn btn-outline" onClick={() => edit(room)}>Editar</button><button type="button" className="btn btn-danger" onClick={() => { if (window.confirm(`¿Eliminar la habitación ${room.number}?`)) setNotice(deleteRoom(room.id)) }}>Eliminar</button></div>
        </article>)}
      </div>
    </div>
  </section>
}
