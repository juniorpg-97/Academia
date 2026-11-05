import { api } from '../lib/axios'
import type { ListaPaginada } from '../types/api'
import type { Usuario } from '../types/usuario'

export const usuariosService = {
  async contarEstudiantes(): Promise<ListaPaginada<Usuario>> {
    const { data } = await api.get<ListaPaginada<Usuario>>('/usuarios', {
      params: { limit: 100, rol: 'ESTUDIANTE' },
    })
    return data
  },
}
