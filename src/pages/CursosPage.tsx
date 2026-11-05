import { ArrowRight, BookOpen, GraduationCap, UserRound } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Buscador } from '../components/Buscador'
import { Cargando, ErrorCarga } from '../components/LoadState'
import { useApi } from '../hooks/useApi'
import { cursosService } from '../services/cursos'
import type { Curso } from '../types/curso'

function BarraCupos({ curso }: { curso: Curso }) {
  const porcentaje = curso.cupo > 0 ? Math.min(100, Math.max(0, (curso.inscritos / curso.cupo) * 100)) : 0
  const lleno = curso.disponibles <= 0

  return (
    <div className="mt-5">
      <div className="mb-2 flex items-center justify-between text-xs">
        <span className="font-medium text-slate-600">{curso.inscritos} de {curso.cupo} inscritos</span>
        <span className={lleno ? 'font-semibold text-rose-600' : 'text-slate-500'}>
          {lleno ? 'Sin cupos' : `${curso.disponibles} disponibles`}
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full rounded-full ${lleno ? 'bg-rose-500' : 'bg-emerald-600'}`} style={{ width: `${porcentaje}%` }} />
      </div>
    </div>
  )
}

function TarjetaCurso({ curso }: { curso: Curso }) {
  return (
    <article className="flex flex-col rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-900/[0.02] transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-3">
        <span className="rounded-lg bg-emerald-50 px-2.5 py-1.5 text-[11px] font-bold tracking-wide text-emerald-800">{curso.codigo}</span>
        <span className="flex items-center gap-1.5 text-xs text-slate-500"><GraduationCap size={15} /> {curso.creditos} créditos</span>
      </div>
      <h2 className="text-lg font-semibold leading-snug text-slate-900">{curso.nombre}</h2>
      <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-slate-500">
        {curso.descripcion || 'Este curso aún no tiene una descripción.'}
      </p>
      <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
        <UserRound size={15} />
        {curso.docente ? `${curso.docente.nombre} ${curso.docente.apellido}` : 'Docente por asignar'}
      </div>
      <BarraCupos curso={curso} />
      <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4 text-[11px] text-slate-400">
        <span>Actualizado {new Date(curso.updatedAt).toLocaleDateString('es')}</span>
        <Link to={`/cursos/${curso.id}`} className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 hover:text-emerald-950">
          Ver curso <ArrowRight size={14} />
        </Link>
      </div>
    </article>
  )
}

export function CursosPage() {
  const [busqueda, setBusqueda] = useState('')
  const solicitarCursos = useCallback(() => cursosService.listar(), [])
  const { data, loading, error, recargar } = useApi(solicitarCursos)

  const cursosFiltrados = useMemo(() => {
    const termino = busqueda.trim().toLowerCase()
    return (data?.data ?? []).filter((curso) =>
      `${curso.nombre} ${curso.codigo}`.toLowerCase().includes(termino),
    )
  }, [busqueda, data])

  return (
    <>
      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-emerald-800">Aprende algo nuevo</p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Explora los cursos</h1>
          <p className="mt-2 text-sm text-slate-500">Encuentra el curso ideal para tu siguiente paso.</p>
        </div>
        <Buscador valor={busqueda} onCambiar={setBusqueda} />
      </div>

      {loading ? <Cargando texto="Cargando cursos..." /> : error ? <ErrorCarga error={error} reintentar={() => void recargar()} /> : (
        <>
          <p className="mb-4 text-sm text-slate-500">
            {busqueda ? `${cursosFiltrados.length} resultados` : `${data?.meta.total ?? cursosFiltrados.length} cursos disponibles`}
          </p>
          {cursosFiltrados.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
              <BookOpen className="mx-auto mb-3 text-slate-400" size={28} />
              <p className="font-semibold text-slate-800">{busqueda ? 'No encontramos resultados' : 'Aún no hay cursos disponibles'}</p>
              <p className="mt-1 text-sm text-slate-500">{busqueda ? 'Prueba con otro nombre o código.' : 'Vuelve más tarde para explorar nuevos cursos.'}</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {cursosFiltrados.map((curso) => <TarjetaCurso key={curso.id} curso={curso} />)}
            </div>
          )}
        </>
      )}
    </>
  )
}
