/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { apiFetch, leerError, refrescarSesion } from "../api/client";
import {
  guardarSesion,
  leerSesion,
  limpiarSesion,
} from "../api/session";

const AuthContext = createContext({
  usuario: null,
  sesion: null,
  cargando: false,
  login: async () => {},
  registrar: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }) {
  const [sesion, setSesion] = useState(() => leerSesion());
  const [usuario, setUsuario] = useState(() => leerSesion()?.usuario ?? null);
  const [cargando, setCargando] = useState(() => Boolean(leerSesion()));

  const limpiar = useCallback(() => {
    limpiarSesion();
    setSesion(null);
    setUsuario(null);
  }, []);

  // Restaura la sesión al recargar y la valida contra el backend.
  useEffect(() => {
    const guardada = leerSesion();

    if (!guardada) {
      return;
    }

    let activo = true;

    apiFetch("/api/auth/me")
      .then((respuesta) => (respuesta.ok ? respuesta.json() : Promise.reject()))
      .then((datos) => {
        if (!activo) return;
        setUsuario(datos);
        setSesion(leerSesion());
      })
      .catch(() => {
        if (activo) limpiar();
      })
      .finally(() => {
        if (activo) setCargando(false);
      });

    return () => {
      activo = false;
    };
  }, [limpiar]);

  // Renueva el token un minuto antes de que venza.
  useEffect(() => {
    if (!sesion) return;

    const margen = 60_000;
    const espera = Math.max(0, sesion.expiresAt - Date.now() - margen);

    const id = setTimeout(async () => {
      try {
        const auth = await refrescarSesion();
        setSesion(leerSesion());
        setUsuario(auth.usuario);
      } catch {
        limpiar();
      }
    }, espera);

    return () => clearTimeout(id);
  }, [sesion, limpiar]);

  async function login(email, password, rolEsperado) {
    const respuesta = await apiFetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (!respuesta.ok) {
      throw new Error(await leerError(respuesta, "Credenciales incorrectas"));
    }

    const auth = await respuesta.json();
    const rolReal = auth.usuario?.rol;

    if (rolEsperado && rolReal !== rolEsperado) {
      throw new Error(
        "Las credenciales no corresponden al tipo de cuenta seleccionado."
      );
    }

    guardarSesion(auth);
    setSesion(leerSesion());
    setUsuario(auth.usuario);
    return auth.usuario;
  }

  async function registrar(datos) {
    const respuesta = await apiFetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(datos),
    });

    if (!respuesta.ok) {
      throw new Error(await leerError(respuesta, "No se pudo crear la cuenta"));
    }

    const auth = await respuesta.json();
    guardarSesion(auth);
    setSesion(leerSesion());
    setUsuario(auth.usuario);
    return auth.usuario;
  }

  async function logout() {
    try {
      await apiFetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Aunque falle el servidor, la sesión local se cierra igual.
    } finally {
      limpiar();
    }
  }

  return (
    <AuthContext.Provider
      value={{ usuario, sesion, cargando, login, registrar, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
