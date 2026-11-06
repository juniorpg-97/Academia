import { api } from "../lib/axios";
import { mensajeError } from "../lib/errores"; // Importamos la utilidad
import type { RespuestaApi } from "../types/api";
import type { Usuario } from "../types/usuario";

export interface Credenciales {
  username: string;
  password: string;
}

export interface DatosRegistro extends Credenciales {
  nombre: string;
  apellido: string;
  email?: string;
}

export interface Sesion {
  token: string;
  tipo: string;
  usuario: Usuario;
}

export const authService = {
  async login(credenciales: Credenciales): Promise<Sesion> {
    try {
      const { data } = await api.post<RespuestaApi<Sesion>>(
        "/auth/login",
        credenciales,
      );
      return data.data;
    } catch (error) {
      throw new Error(mensajeError(error));
    }
  },

  async registrar(datos: DatosRegistro): Promise<Sesion> {
    try {
      const { data } = await api.post<RespuestaApi<Sesion>>(
        "/auth/register",
        datos,
      );
      return data.data;
    } catch (error) {
      throw new Error(mensajeError(error));
    }
  },
};
