import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { Usuario } from '../types/usuario'

interface AuthState {
  token: string | null
  usuario: Usuario | null
  guardarSesion: (token: string, usuario: Usuario) => void
  cerrarSesion: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      usuario: null,
      guardarSesion: (token, usuario) => set({ token, usuario }),
      cerrarSesion: () => set({ token: null, usuario: null }),
    }),
    {
      name: 'aulanova-session',
      storage: createJSONStorage(() => localStorage),
      partialize: ({ token, usuario }) => ({ token, usuario }),
    },
  ),
)
