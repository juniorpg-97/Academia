import { ArrowRight, BookOpen, GraduationCap } from 'lucide-react'
import { useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Cargando, ErrorCarga } from '../components/LoadState'
import { useApi } from '../hooks/useApi'
import { inscripcionesService } from '../services/inscripciones'

export function InscripcionesPage() {
  const solicitarInscripciones = useCallback(() => inscripcionesService.listar(), [])
  const { data, loading, error, recargar } = useApi(solicitarInscripciones)
  const activas = data?.data.filter((item) => item.estado === 'ACTIVA') ?? []

  return (
    <>
      <div className="mb-8">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-emerald-800">Tu aprendizaje</p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Mis inscripciones</h1>
        <p className="mt-2 text-sm text-slate-500">Todos los cursos que forman parte de tu camino.</p>
      </div>
      {loading ? <Cargando texto="Cargando tus inscripciones..." /> : error ? <ErrorCarga error={error} reintentar={() => void recargar()} /> : activas.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <GraduationCap className="mx-auto mb-3 text-slate-400" size={30} />
          <p className="font-semibold text-slate-800">Todavía no tienes inscripciones activas</p>
          <p className="mt-1 text-sm text-slate-500">Explora nuestros cursos y encuentra tu próximo desafío.</p>
          <Link to="/cursos" className="mt-5 inline-flex items-center gap-2 rounded-lg bg-emerald-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-900">
            Explorar cursos <ArrowRight size={15} />
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {activas.map((item) => (
            <article key={item.id} className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <span className="rounded-lg bg-emerald-50 px-2.5 py-1.5 text-[11px] font-bold text-emerald-800">{item.curso.codigo}</span>
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-800">ACTIVA</span>
              </div>
              <h2 className="mt-4 text-lg font-semibold text-slate-900">{item.curso.nombre}</h2>
              <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                <BookOpen size={15} /> {item.curso.creditos} créditos
              </div>
              <p className="mt-2 text-xs text-slate-500">Inscrito el {new Date(item.fecha).toLocaleDateString('es')}</p>
              {item.promedio !== null && <p className="mt-2 text-xs text-slate-500">Promedio: <span className="font-semibold text-slate-800">{item.promedio}</span></p>}
              <Link to={`/cursos/${item.curso.id}`} className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-800 hover:text-emerald-950">
                Ver curso <ArrowRight size={15} />
              </Link>
            </article>
          ))}
        </div>
      )}
    </>
  )
}
