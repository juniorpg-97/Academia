import { ArrowLeft, GraduationCap } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/auth'

export function NotFoundPage() {
  const usuario = useAuthStore((state) => state.usuario)
  return (
    <main className="grid min-h-screen place-items-center bg-[#f7f9f8] px-6">
      <div className="max-w-md text-center">
        <span className="mx-auto mb-7 grid size-14 place-items-center rounded-2xl bg-emerald-800 text-white"><GraduationCap size={29} /></span>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-800">Error 404</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">Esta página tomó otro camino</h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">La dirección que buscas no existe o se ha movido. Regresemos a un lugar conocido.</p>
        <Link to={usuario ? '/inicio' : '/login'} className="mt-7 inline-flex items-center gap-2 rounded-xl bg-emerald-800 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-900">
          <ArrowLeft size={16} /> Volver al inicio
        </Link>
      </div>
    </main>
  )
}
