import axios from 'axios'

export function mensajeError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data: unknown = error.response?.data
    if (data && typeof data === 'object' && 'message' in data && typeof data.message === 'string') {
      return data.message
    }
    if (error.code === 'ECONNABORTED') {
      return 'La solicitud tardó demasiado. Inténtalo nuevamente.'
    }
    if (!error.response) {
      return 'No se pudo conectar con el servidor. Revisa tu conexión e inténtalo nuevamente.'
    }
  }

  if (error instanceof Error) return error.message
  return 'Ocurrió un error inesperado. Inténtalo nuevamente.'
}
