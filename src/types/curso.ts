export interface DocenteResumen {
  id: number
  username: string
  nombre: string
  apellido: string
  fotoUrl: string | null
}

export interface Curso {
  id: number
  codigo: string
  nombre: string
  descripcion: string | null
  creditos: number
  cupo: number
  inscritos: number
  disponibles: number
  docente: DocenteResumen | null
  createdAt: string
  updatedAt: string
}

export interface CursoInscripcion {
  id: number
  codigo: string
  nombre: string
  creditos: number
}
