import { Search, X } from 'lucide-react'

interface BuscadorProps {
  valor: string
  onCambiar: (valor: string) => void
}

export function Buscador({ valor, onCambiar }: BuscadorProps) {
  return (
    <label className="flex h-12 w-full max-w-md items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 text-slate-400 shadow-sm transition focus-within:border-emerald-600 focus-within:ring-4 focus-within:ring-emerald-600/10">
      <Search size={18} aria-hidden="true" />
      <input
        className="min-w-0 flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
        placeholder="Buscar por curso o código..."
        type="search"
        value={valor}
        onChange={(event) => onCambiar(event.target.value)}
        aria-label="Buscar cursos por nombre o código"
      />
      {valor && (
        <button
          className="rounded-md p-1 hover:bg-slate-100"
          type="button"
          onClick={() => onCambiar('')}
          aria-label="Limpiar búsqueda"
        >
          <X size={15} />
        </button>
      )}
    </label>
  )
}
