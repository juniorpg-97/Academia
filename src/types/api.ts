export interface RespuestaApi<T> {
  success: boolean
  message?: string
  data: T
}

export interface ListaPaginada<T> extends RespuestaApi<T[]> {
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
