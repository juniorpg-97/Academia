import {
  BookOpen,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/auth'

export function Layout() {
  const usuario = useAuthStore((state) => state.usuario)
  const cerrarSesion = useAuthStore((state) => state.cerrarSesion)
  const navigate = useNavigate()
  const [menuAbierto, setMenuAbierto] = useState(false)

  const enlaces = [
    { to: '/inicio', label: 'Inicio', icon: LayoutDashboard },
    { to: '/cursos', label: 'Explorar cursos', icon: BookOpen },
    ...(usuario?.rol === 'ESTUDIANTE'
      ? [{ to: '/inscripciones', label: 'Mis inscripciones', icon: GraduationCap }]
      : []),
  ]

  function salir() {
    cerrarSesion()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-[#f7f9f8] text-slate-800">
      <header className="fixed inset-x-0 top-0 z-30 flex h-[68px] items-center justify-between border-b border-slate-200/80 bg-white px-5 lg:hidden">
        <Link className="flex items-center gap-2.5 font-bold tracking-tight text-slate-900" to="/inicio">
          <span className="grid size-9 place-items-center rounded-xl bg-emerald-800 text-white">
            <GraduationCap size={21} />
          </span>
          AulaNova
        </Link>
        <button
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
          type="button"
          onClick={() => setMenuAbierto(!menuAbierto)}
          aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
        >
          {menuAbierto ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[260px] flex-col bg-[#123c32] px-5 pb-5 pt-7 text-white transition-transform lg:translate-x-0 ${menuAbierto ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <Link className="mb-12 flex items-center gap-3 px-2" to="/inicio">
          <span className="grid size-11 place-items-center rounded-2xl bg-emerald-400/15 text-emerald-300">
            <GraduationCap size={26} />
          </span>
          <span>
            <span className="block text-lg font-bold tracking-tight">AulaNova</span>
            <span className="block text-[11px] tracking-wide text-emerald-100/65">APRENDE Y AVANZA</span>
          </span>
        </Link>

        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-100/50">
          Menú principal
        </p>
        <nav className="space-y-1.5" aria-label="Navegación principal">
          {enlaces.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMenuAbierto(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition ${isActive ? 'bg-emerald-400/15 text-white' : 'text-emerald-50/70 hover:bg-white/5 hover:text-white'}`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          <div className="mb-4 flex items-center gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-emerald-300/15 text-sm font-bold text-emerald-200">
              {usuario?.nombre.slice(0, 1)}
              {usuario?.apellido.slice(0, 1)}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold">
                {usuario?.nombre} {usuario?.apellido}
              </span>
              <span className="block text-xs text-emerald-100/55">
                {usuario?.rol === 'ADMIN' ? 'Administrador' : usuario?.rol === 'DOCENTE' ? 'Docente' : 'Estudiante'}
              </span>
            </span>
          </div>
          <button
            className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-sm text-emerald-50/70 transition hover:bg-white/5 hover:text-white"
            type="button"
            onClick={salir}
          >
            <LogOut size={16} /> Cerrar sesión
          </button>
        </div>
      </aside>

      {menuAbierto && (
        <button
          className="fixed inset-0 z-30 bg-slate-950/30 lg:hidden"
          type="button"
          onClick={() => setMenuAbierto(false)}
          aria-label="Cerrar menú"
        />
      )}

      <main className="min-h-screen pt-[68px] lg:ml-[260px] lg:pt-0">
        <div className="mx-auto w-full max-w-[1440px] px-5 py-8 sm:px-8 lg:px-11 lg:py-10">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
