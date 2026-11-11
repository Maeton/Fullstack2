const CLAVE = "huerto_session";

export function leerSesion() {
  try {
    const datos = JSON.parse(localStorage.getItem(CLAVE));
    if (!datos?.accessToken || !datos?.refreshToken) return null;
    return datos;
  } catch {
    return null;
  }
}

export function guardarSesion(auth) {
  if (!auth?.accessToken || !auth?.refreshToken) return null;

  const sesion = {
    accessToken: auth.accessToken,
    refreshToken: auth.refreshToken,
    usuario: auth.usuario,
    expiresAt: Date.now() + Number(auth.expiresIn ?? 0) * 1000,
  };

  localStorage.setItem(CLAVE, JSON.stringify(sesion));
  return sesion;
}

export function limpiarSesion() {
  localStorage.removeItem(CLAVE);
}
