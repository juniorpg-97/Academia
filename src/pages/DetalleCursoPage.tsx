import { ArrowLeft, BookOpen, CalendarDays, CheckCircle2, GraduationCap, UserRound } from 'lucide-react'
import { useCallback, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Cargando, ErrorCarga } from '../components/LoadState'
import { useApi } from '../hooks/useApi'
import { mensajeError } from '../lib/errores'
import { cursosService } from '../services/cursos'
import { inscripcionesService } from '../services/inscripciones'
import { useAuthStore } from '../store/auth'

export function DetalleCursoPage() {
  const { id } = useParams()
  const cursoId = Number(id)
  const usuario = useAuthStore((state) => state.usuario)
  const cursoRequest = useCallback(() => cursosService.obtener(cursoId), [cursoId])
  const inscripcionesRequest = useCallback(() => inscripcionesService.listar(), [])
  const curso = useApi(cursoRequest)
  const inscripciones = useApi(inscripcionesRequest)
  const [enviando, setEnviando] = useState(false)
  const [errorInscripcion, setErrorInscripcion] = useState('')
  const esEstudiante = usuario?.rol === 'ESTUDIANTE'
  const inscrito = Boolean(inscripciones.data?.data.some(
    (item) => item.curso.id === cursoId && item.estado === 'ACTIVA',
  ))
  const sinCupos = Boolean(curso.data && curso.data.disponibles <= 0)

  async function inscribirse() {
    setErrorInscripcion('')
    setEnviando(true)
    try {
      await inscripcionesService.inscribir(cursoId)
      await Promise.all([curso.recargar(), inscripciones.recargar()])
    } catch (requestError) {
      setErrorInscripcion(mensajeError(requestError))
    } finally {
      setEnviando(false)
    }
  }

  if (curso.loading || inscripciones.loading) return <Cargando texto="Cargando el curso..." />
  if (curso.error) return <ErrorCarga error={curso.error} reintentar={() => void Promise.all([curso.recargar(), inscripciones.recargar()])} />
  if (inscripciones.error) return <ErrorCarga error={inscripciones.error} reintentar={() => void inscripciones.recargar()} />
  if (!curso.data) return <ErrorCarga error={new Error('No encontramos este curso.')} reintentar={() => void curso.recargar()} />

  const porcentaje = curso.data.cupo > 0 ? Math.min(100, (curso.data.inscritos / curso.data.cupo) * 100) : 0

  return (
    <div className="mx-auto max-w-4xl">
      <Link to="/cursos" className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-emerald-800">
        <ArrowLeft size={16} /> Volver a cursos
      </Link>
      <article className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm">
        <div className="bg-[#123c32] px-6 py-9 text-white sm:px-10 sm:py-12">
          <span className="inline-flex rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold tracking-wide text-emerald-100">{curso.data.codigo}</span>
          <h1 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">{curso.data.nombre}</h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-emerald-50/70">
            {curso.data.descripcion || 'Este curso aún no tiene una descripción.'}
          </p>
        </div>
        <div className="grid gap-8 p-6 sm:grid-cols-[1fr_280px] sm:p-10">
          <div>
            <h2 className="mb-5 text-lg font-semibold text-slate-900">Información del curso</h2>
            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-800"><GraduationCap size={18} /></span>
                <div><p className="text-sm font-medium text-slate-800">{curso.data.creditos} créditos académicos</p><p className="mt-1 text-xs text-slate-500">Código {curso.data.codigo} · ID {curso.data.id}</p></div>
              </div>
              <div className="flex items-start gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-800"><UserRound size={17} /></span>
                <div><p className="text-sm font-medium text-slate-800">{curso.data.docente ? `${curso.data.docente.nombre} ${curso.data.docente.apellido}` : 'Docente por asignar'}</p><p className="mt-1 text-xs text-slate-500">Docente del curso</p></div>
              </div>
              <div className="flex items-start gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-800"><CalendarDays size={17} /></span>
                <div><p className="text-sm font-medium text-slate-800">Publicado el {new Date(curso.data.createdAt).toLocaleDateString('es')}</p><p className="mt-1 text-xs text-slate-500">Última actualización {new Date(curso.data.updatedAt).toLocaleDateString('es')}</p></div>
              </div>
              <div className="flex items-start gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-800"><BookOpen size={17} /></span>
                <div><p className="text-sm font-medium text-slate-800">{curso.data.inscritos} estudiantes inscritos</p><p className="mt-1 text-xs text-slate-500">Capacidad total: {curso.data.cupo} estudiantes</p></div>
              </div>
            </div>
          </div>
          <aside className="h-fit rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="mb-2 flex items-center justify-between text-sm font-medium text-slate-700">
              <span>Cupos disponibles</span><span>{curso.data.disponibles} / {curso.data.cupo}</span>
            </div>
            <div className="mb-5 h-2 overflow-hidden rounded-full bg-slate-200">
              <div className={`h-full rounded-full ${sinCupos ? 'bg-rose-500' : 'bg-emerald-600'}`} style={{ width: `${porcentaje}%` }} />
            </div>
            {esEstudiante && (inscrito ? (
              <div className="flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-50 text-sm font-semibold text-emerald-800">
                <CheckCircle2 size={17} /> Inscrito
              </div>
            ) : (
              <button
                className="h-11 w-full rounded-xl bg-emerald-800 text-sm font-semibold text-white transition hover:bg-emerald-900 disabled:cursor-not-allowed disabled:bg-slate-300"
                type="button"
                disabled={sinCupos || enviando}
                onClick={() => void inscribirse()}
              >
                {enviando ? 'Inscribiendo...' : sinCupos ? 'Sin cupos' : 'Inscribirme'}
              </button>
            ))}
            {errorInscripcion && <p className="mt-3 rounded-lg bg-rose-50 p-3 text-xs leading-5 text-rose-700" role="alert">{errorInscripcion}</p>}
          </aside>
        </div>
      </article>
    </div>
  )
}
