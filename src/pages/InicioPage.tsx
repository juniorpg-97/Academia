import { ArrowRight, BookOpen, GraduationCap, Users, type LucideIcon } from 'lucide-react'
import { useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Cargando, ErrorCarga } from '../components/LoadState'
import { useApi } from '../hooks/useApi'
import { inscripcionesService } from '../services/inscripciones'
import { cursosService } from '../services/cursos'
import { usuariosService } from '../services/usuarios'
import { useAuthStore } from '../store/auth'
import type { Inscripcion } from '../types/inscripcion'
import type { ListaPaginada } from '../types/api'
import type { Curso } from '../types/curso'
import type { Usuario } from '../types/usuario'

function Encabezado({ etiqueta, titulo, descripcion }: { etiqueta: string; titulo: string; descripcion: string }) {
  return (
    <div className="mb-8">
      <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-emerald-800">{etiqueta}</p>
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">{titulo}</h1>
      <p className="mt-2 text-sm text-slate-500">{descripcion}</p>
    </div>
  )
}

function Metric({ icon: Icon, label, value, detail }: { icon: LucideIcon; label: string; value: string | number; detail: string }) {
  return (
    <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-900/[0.02]">
      <div className="mb-5 flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500">{label}</span>
        <span className="grid size-10 place-items-center rounded-xl bg-emerald-50 text-emerald-800"><Icon size={19} /></span>
      </div>
      <p className="text-3xl font-semibold tracking-tight text-slate-900">{value}</p>
      <p className="mt-1.5 text-xs text-slate-500">{detail}</p>
    </article>
  )
}

export function InicioPage() {
  const usuario = useAuthStore((state) => state.usuario)
  return usuario?.rol === 'ADMIN' ? <InicioAdmin /> : <InicioEstudiante />
}

function InicioEstudiante() {
  const usuario = useAuthStore((state) => state.usuario)
  const solicitarInscripciones = useCallback(() => inscripcionesService.listar(), [])
  const { data, loading, error, recargar } = useApi(solicitarInscripciones)
  const activas = data?.data.filter((item) => item.estado === 'ACTIVA') ?? []
  const creditos = activas.reduce((total, item) => total + item.curso.creditos, 0)

  return (
    <>
      <Encabezado
        etiqueta="Tu espacio de aprendizaje"
        titulo={`¡Hola, ${usuario?.nombre}!`}
        descripcion="Un pequeño paso cada día te acerca a grandes metas."
      />
      {loading ? <Cargando texto="Cargando tu actividad..." /> : error ? <ErrorCarga error={error} reintentar={() => void recargar()} /> : (
        <>
          <section className="grid gap-4 sm:grid-cols-2">
            <Metric icon={BookOpen} label="Cursos activos" value={activas.length} detail="Cursos en los que estás aprendiendo" />
            <Metric icon={GraduationCap} label="Créditos en curso" value={creditos} detail="Créditos de tus inscripciones activas" />
          </section>
          <section className="mt-9">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Tus cursos</h2>
                <p className="mt-1 text-sm text-slate-500">Retoma el camino que ya empezaste.</p>
              </div>
              <Link to="/inscripciones" className="hidden items-center gap-1 text-sm font-semibold text-emerald-800 hover:text-emerald-950 sm:flex">
                Ver inscripciones <ArrowRight size={15} />
              </Link>
            </div>
            {activas.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
                <BookOpen className="mx-auto mb-3 text-slate-400" size={25} />
                <p className="font-medium text-slate-800">Aún no tienes cursos activos</p>
                <p className="mt-1 text-sm text-slate-500">Explora el catálogo y encuentra algo que te inspire.</p>
                <Link to="/cursos" className="mt-4 inline-flex rounded-lg bg-emerald-800 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-900">Explorar cursos</Link>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {activas.slice(0, 4).map((inscripcion) => (
                  <Link key={inscripcion.id} to={`/cursos/${inscripcion.curso.id}`} className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md">
                    <span className="text-xs font-semibold tracking-wide text-emerald-800">{inscripcion.curso.codigo}</span>
                    <h3 className="mt-2 font-semibold text-slate-900 group-hover:text-emerald-900">{inscripcion.curso.nombre}</h3>
                    <p className="mt-3 text-xs text-slate-500">{inscripcion.curso.creditos} créditos · Inscrito el {new Date(inscripcion.fecha).toLocaleDateString('es')}</p>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </>
  )
}

function InicioAdmin() {
  const cursosRequest = useCallback(() => cursosService.listar(), [])
  const estudiantesRequest = useCallback(() => usuariosService.contarEstudiantes(), [])
  const cursos = useApi(cursosRequest)
  const estudiantes = useApi(estudiantesRequest)
  const loading = cursos.loading || estudiantes.loading
  const error = cursos.error ?? estudiantes.error
  const recargar = () => {
    void cursos.recargar()
    void estudiantes.recargar()
  }
  const usuario = useAuthStore((state) => state.usuario)

  return (
    <>
      <Encabezado
        etiqueta="Panel de administración"
        titulo={`¡Bienvenido, ${usuario?.nombre}!`}
        descripcion="Aquí tienes un resumen de la comunidad de AulaNova."
      />
      {loading ? <Cargando texto="Cargando el resumen..." /> : error ? <ErrorCarga error={error} reintentar={recargar} /> : (
        <section className="grid gap-4 sm:grid-cols-2">
          <Metric icon={BookOpen} label="Cursos publicados" value={cursos.data?.meta.total ?? 0} detail="Cursos disponibles en la plataforma" />
          <Metric icon={Users} label="Estudiantes" value={estudiantes.data?.meta.total ?? 0} detail="Cuentas con rol de estudiante" />
        </section>
      )}
    </>
  )
}

export type { Inscripcion, ListaPaginada, Curso, Usuario }
