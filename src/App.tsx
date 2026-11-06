import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import { Layout } from "./components/Layout";
import { LoginPage, RegistroPage } from "./pages/AuthPages";
import { CursosPage } from "./pages/CursosPage";
import { DetalleCursoPage } from "./pages/DetalleCursoPage";
import { InicioPage } from "./pages/InicioPage";
import { InscripcionesPage } from "./pages/InscripcionesPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { useAuthStore } from "./store/auth";

function RedireccionRaiz() {
  const usuario = useAuthStore((state) => state.usuario);
  return usuario ? (
    <Navigate to="/inicio" replace />
  ) : (
    <Navigate to="/login" replace />
  );
}

function RutaProtegida() {
  const usuario = useAuthStore((state) => state.usuario);
  return usuario ? <Outlet /> : <Navigate to="/login" replace />;
}

function RutaPublica() {
  const usuario = useAuthStore((state) => state.usuario);
  return usuario ? <Navigate to="/inicio" replace /> : <Outlet />;
}

function RutaEstudiante() {
  const usuario = useAuthStore((state) => state.usuario);
  return usuario?.rol === "ESTUDIANTE" ? (
    <Outlet />
  ) : (
    <Navigate to="/inicio" replace />
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RedireccionRaiz />} />
        <Route element={<RutaPublica />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registro" element={<RegistroPage />} />
        </Route>
        <Route element={<RutaProtegida />}>
          <Route element={<Layout />}>
            <Route path="/inicio" element={<InicioPage />} />
            <Route path="/cursos" element={<CursosPage />} />
            <Route path="/cursos/:id" element={<DetalleCursoPage />} />
            <Route element={<RutaEstudiante />}>
              <Route path="/inscripciones" element={<InscripcionesPage />} />
            </Route>
          </Route>
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
