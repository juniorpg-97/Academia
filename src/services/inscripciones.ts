import { api } from '../lib/axios'
import type { ListaPaginada, RespuestaApi } from '../types/api'
import type { Inscripcion } from '../types/inscripcion'

export const inscripcionesService = {
  async listar(): Promise<ListaPaginada<Inscripcion>> {
    const { data } = await api.get<ListaPaginada<Inscripcion>>('/inscripciones', {
      params: { limit: 100 },
    })
    return data
  },

  async inscribir(cursoId: number): Promise<Inscripcion> {
    const { data } = await api.post<RespuestaApi<Inscripcion>>('/inscripciones', { cursoId })
    return data.data
  },
}
