import { AlertCircle, RefreshCw } from 'lucide-react'
import { mensajeError } from '../lib/errores'

export function Cargando({ texto = 'Cargando información...' }: { texto?: string }) {
  return (
    <div className="flex min-h-56 flex-col items-center justify-center gap-3 text-center text-sm text-slate-500">
      <span className="size-8 animate-spin rounded-full border-[3px] border-emerald-100 border-t-emerald-700" />
      {texto}
    </div>
  )
}

export function ErrorCarga({
  error,
  reintentar,
}: {
  error: unknown
  reintentar: () => void
}) {
  return (
    <div className="flex min-h-56 flex-col items-center justify-center gap-3 rounded-2xl border border-rose-100 bg-rose-50/60 p-8 text-center">
      <AlertCircle className="text-rose-600" size={26} />
      <p className="max-w-lg text-sm text-rose-800">{mensajeError(error)}</p>
      <button
        className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-rose-800 shadow-sm ring-1 ring-rose-200 hover:bg-rose-50"
        type="button"
        onClick={reintentar}
      >
        <RefreshCw size={15} /> Reintentar
      </button>
    </div>
  )
}
