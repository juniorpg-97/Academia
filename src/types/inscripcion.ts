import type { CursoInscripcion } from './curso'

export type EstadoInscripcion = 'ACTIVA' | 'RETIRADA' | 'FINALIZADA'

export interface Calificacion {
  id: number
  inscripcionId: number
  descripcion: string
  nota: number
  fecha: string
}

export interface Inscripcion {
  id: number
  estado: EstadoInscripcion
  fecha: string
  estudiante: {
    id: number
    username: string
    nombre: string
    apellido: string
    fotoUrl: string | null
  }
  curso: CursoInscripcion
  calificaciones: Calificacion[]
  promedio: number | null
}
