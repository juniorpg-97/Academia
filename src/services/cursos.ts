import { api } from '../lib/axios'
import type { ListaPaginada, RespuestaApi } from '../types/api'
import type { Curso } from '../types/curso'

export const cursosService = {
  async listar(): Promise<ListaPaginada<Curso>> {
    const { data } = await api.get<ListaPaginada<Curso>>('/cursos', { params: { limit: 100 } })
    return data
  },

  async obtener(id: number): Promise<Curso> {
    const { data } = await api.get<RespuestaApi<Curso>>(`/cursos/${id}`)
    return data.data
  },
}
