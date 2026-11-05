import { api } from '../lib/axios'
import type { RespuestaApi } from '../types/api'
import type { Sesion } from '../types/usuario'

export interface Credenciales {
  username: string
  password: string
}

export interface DatosRegistro extends Credenciales {
  nombre: string
  apellido: string
  email?: string
}

export const authService = {
  async login(credenciales: Credenciales): Promise<Sesion> {
    const { data } = await api.post<RespuestaApi<Sesion>>('/auth/login', credenciales)
    return data.data
  },

  async registrar(datos: DatosRegistro): Promise<Sesion> {
    const { data } = await api.post<RespuestaApi<Sesion>>('/auth/register', datos)
    return data.data
  },
}
