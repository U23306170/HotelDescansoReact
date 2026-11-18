// Contrato REST del cliente. El proveedor local implementa estos recursos con estado
// React y localStorage para que la app funcione sin servidor ni base de datos.
export const API_ENDPOINTS = {
  habitaciones: '/api/habitaciones',
  huespedes: '/api/huespedes',
  reservas: '/api/reservas',
}

export const REST_OPERATIONS = {
  list: 'GET',
  create: 'POST',
  update: 'PUT',
  delete: 'DELETE',
}
