import { guardarSesion, leerSesion, limpiarSesion } from "./session";

export const API_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:8080";

let refrescoEnCurso = null;

async function ejecutarRefresco() {
  const sesion = leerSesion();

  if (!sesion?.refreshToken) {
    throw new Error("No hay sesión para renovar");
  }

  const respuesta = await fetch(`${API_URL}/api/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ refreshToken: sesion.refreshToken }),
  });

  if (!respuesta.ok) {
    throw new Error("La sesión expiró");
  }

  const auth = await respuesta.json();
  guardarSesion(auth);
  return auth;
}

/**
 * Renueva el access token una sola vez aunque varias peticiones
 * reciban 401 al mismo tiempo. Evita el bucle de refresh.
 */
export function refrescarSesion() {
  if (!refrescoEnCurso) {
    refrescoEnCurso = ejecutarRefresco().finally(() => {
      refrescoEnCurso = null;
    });
  }

  return refrescoEnCurso;
}

export async function apiFetch(ruta, opciones = {}, reintentar = true) {
  const sesion = leerSesion();
  const headers = new Headers(opciones.headers ?? {});

  if (opciones.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }

  if (sesion?.accessToken && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${sesion.accessToken}`);
  }

  const respuesta = await fetch(`${API_URL}${ruta}`, {
    ...opciones,
    headers,
  });

  const rutaSinRefresco =
    ruta.startsWith("/api/auth/login") ||
    ruta.startsWith("/api/auth/register") ||
    ruta.startsWith("/api/auth/refresh");

  if (
    respuesta.status === 401 &&
    reintentar &&
    sesion?.refreshToken &&
    !rutaSinRefresco
  ) {
    try {
      await refrescarSesion();
      return apiFetch(ruta, opciones, false);
    } catch {
      limpiarSesion();
      throw new Error("La sesión expiró. Inicia sesión nuevamente.");
    }
  }

  return respuesta;
}

export async function leerError(respuesta, porDefecto = "Ocurrió un error") {
  try {
    const cuerpo = await respuesta.json();
    return cuerpo?.message ?? cuerpo?.error ?? porDefecto;
  } catch {
    return porDefecto;
  }
}
