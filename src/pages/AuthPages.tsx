import { ArrowRight, BookOpen, CheckCircle2, GraduationCap, Sparkles } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authService, type DatosRegistro } from '../services/auth'
import { useAuthStore } from '../store/auth'
import { mensajeError } from '../lib/errores'

function Marca() {
  return (
    <Link to="/login" className="inline-flex items-center gap-2.5 text-lg font-bold tracking-tight text-slate-900">
      <span className="grid size-10 place-items-center rounded-xl bg-emerald-800 text-white">
        <GraduationCap size={23} />
      </span>
      AulaNova
    </Link>
  )
}

function Beneficios() {
  return (
    <div className="hidden min-h-screen flex-col justify-between overflow-hidden bg-[#123c32] p-12 text-white lg:flex xl:p-16">
      <Marca />
      <div className="relative z-10 max-w-xl">
        <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-emerald-200/15 bg-white/[0.06] px-3.5 py-2 text-xs font-medium text-emerald-100">
          <Sparkles size={14} /> Un nuevo comienzo empieza aquí
        </div>
        <h1 className="text-5xl font-semibold leading-[1.13] tracking-tight xl:text-6xl">
          Aprende algo nuevo. <span className="text-emerald-300">Llega más lejos.</span>
        </h1>
        <p className="mt-6 max-w-md text-base leading-7 text-emerald-50/65">
          Encuentra cursos que despierten tu curiosidad y construye el futuro que imaginas.
        </p>
        <div className="mt-10 flex items-center gap-3 text-sm text-emerald-50/80">
          <CheckCircle2 size={17} className="text-emerald-300" /> Tu próximo paso está más cerca de lo que crees.
        </div>
      </div>
      <div className="relative flex h-48 items-end">
        <div className="absolute -bottom-48 -right-36 size-[460px] rounded-full border border-emerald-100/10" />
        <div className="absolute -bottom-36 -right-24 size-[340px] rounded-full border border-emerald-100/10" />
        <div className="absolute bottom-0 right-0 grid size-24 place-items-center rounded-[28px] bg-emerald-400/10 text-emerald-200">
          <BookOpen size={42} strokeWidth={1.3} />
        </div>
        <span className="text-xs text-emerald-100/40">AulaNova · Aprende a tu ritmo</span>
      </div>
    </div>
  )
}

function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_1fr]">
      <Beneficios />
      <main className="flex min-h-screen items-center justify-center px-6 py-12 sm:px-12">
        <div className="w-full max-w-[430px]">
          <div className="mb-10 lg:hidden"><Marca /></div>
          {children}
        </div>
      </main>
    </div>
  )
}

export function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)
  const guardarSesion = useAuthStore((state) => state.guardarSesion)
  const navigate = useNavigate()

  async function enviar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setEnviando(true)
    try {
      const sesion = await authService.login({ username, password })
      guardarSesion(sesion.token, sesion.usuario)
      navigate('/inicio', { replace: true })
    } catch (requestError) {
      setError(mensajeError(requestError))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <AuthShell>
      <div className="mb-8">
        <p className="mb-2 text-sm font-semibold text-emerald-800">Qué bueno verte de nuevo</p>
        <h2 className="text-3xl font-semibold tracking-tight text-slate-900">Inicia sesión</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">Continúa aprendiendo justo donde lo dejaste.</p>
      </div>
      <form className="space-y-5" onSubmit={enviar}>
        <label className="block text-sm font-medium text-slate-700">
          Usuario
          <input
            className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/10"
            autoComplete="username"
            required
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="Tu nombre de usuario"
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Contraseña
          <input
            className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/10"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Tu contraseña"
          />
        </label>
        {error && <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700" role="alert">{error}</p>}
        <button
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-800 text-sm font-semibold text-white transition hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={enviando}
          type="submit"
        >
          {enviando ? 'Ingresando...' : 'Entrar a mi cuenta'} {!enviando && <ArrowRight size={17} />}
        </button>
      </form>
      <p className="mt-8 text-center text-sm text-slate-500">
        ¿Aún no tienes cuenta? <Link className="font-semibold text-emerald-800 hover:underline" to="/registro">Crea una cuenta</Link>
      </p>
    </AuthShell>
  )
}

export function RegistroPage() {
  const [form, setForm] = useState<DatosRegistro>({
    nombre: '',
    apellido: '',
    username: '',
    password: '',
    email: '',
  })
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)
  const guardarSesion = useAuthStore((state) => state.guardarSesion)
  const navigate = useNavigate()

  function cambiar(campo: keyof DatosRegistro, valor: string) {
    setForm((actual) => ({ ...actual, [campo]: valor }))
  }

  async function enviar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setEnviando(true)
    try {
      const datos = { ...form }
      if (!datos.email) delete datos.email
      const sesion = await authService.registrar(datos)
      guardarSesion(sesion.token, sesion.usuario)
      navigate('/inicio', { replace: true })
    } catch (requestError) {
      setError(mensajeError(requestError))
    } finally {
      setEnviando(false)
    }
  }

  const campos: { key: keyof DatosRegistro; label: string; type?: string; autoComplete: string }[] = [
    { key: 'nombre', label: 'Nombre', autoComplete: 'given-name' },
    { key: 'apellido', label: 'Apellido', autoComplete: 'family-name' },
    { key: 'username', label: 'Usuario', autoComplete: 'username' },
    { key: 'email', label: 'Correo electrónico (opcional)', type: 'email', autoComplete: 'email' },
    { key: 'password', label: 'Contraseña', type: 'password', autoComplete: 'new-password' },
  ]

  return (
    <AuthShell>
      <div className="mb-6">
        <p className="mb-2 text-sm font-semibold text-emerald-800">Tu próxima aventura comienza aquí</p>
        <h2 className="text-3xl font-semibold tracking-tight text-slate-900">Crea tu cuenta</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">Regístrate gratis y descubre tu siguiente curso.</p>
      </div>
      <form className="space-y-3.5" onSubmit={enviar}>
        {campos.map(({ key, label, type, autoComplete }) => (
          <label key={key} className="block text-sm font-medium text-slate-700">
            {label}
            <input
              className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/10"
              type={type ?? 'text'}
              autoComplete={autoComplete}
              required={key !== 'email'}
              minLength={key === 'username' ? 3 : key === 'password' ? 8 : undefined}
              maxLength={key === 'username' ? 50 : key === 'email' ? 150 : key === 'password' ? 72 : 100}
              pattern={key === 'username' ? '^[A-Za-z0-9._-]+$' : key === 'password' ? '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,72}$' : undefined}
              title={key === 'username' ? 'Usa letras, números, puntos, guiones o guiones bajos.' : key === 'password' ? 'Incluye una mayúscula, una minúscula, un número y al menos 8 caracteres.' : undefined}
              value={form[key]}
              onChange={(event) => cambiar(key, event.target.value)}
            />
          </label>
        ))}
        <p className="px-1 text-xs text-slate-500">La contraseña debe incluir al menos 8 caracteres, una mayúscula, una minúscula y un número.</p>
        {error && <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700" role="alert">{error}</p>}
        <button
          className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-800 text-sm font-semibold text-white transition hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={enviando}
          type="submit"
        >
          {enviando ? 'Creando cuenta...' : 'Crear cuenta y continuar'} {!enviando && <ArrowRight size={17} />}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-500">
        ¿Ya tienes cuenta? <Link className="font-semibold text-emerald-800 hover:underline" to="/login">Inicia sesión</Link>
      </p>
    </AuthShell>
  )
}
