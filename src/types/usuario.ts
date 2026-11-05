export type Rol = 'ADMIN' | 'DOCENTE' | 'ESTUDIANTE'

export interface Usuario {
  id: number
  username: string
  nombre: string
  apellido: string
  email: string | null
  rol: Rol
  fotoUrl: string | null
  activo: boolean
  createdAt: string
  updatedAt: string
}

export interface Sesion {
  token: string
  tipo: string
  usuario: Usuario
}
