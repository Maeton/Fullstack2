import { describe, beforeEach, afterEach, it, expect, vi } from "vitest";
import { apiFetch, leerError } from "./client";
import { guardarSesion, leerSesion, limpiarSesion } from "./session";

const USUARIO = { id: 3, nombre: "Cliente Huerto", rol: "CLIENTE" };

function sesionGuardada(accessToken = "access-viejo", refreshToken = "refresh-1") {
  guardarSesion({
    accessToken,
    refreshToken,
    usuario: USUARIO,
    expiresIn: 900,
  });
}

function respuesta(cuerpo, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => cuerpo,
  };
}

describe("sesión en localStorage", () => {
  afterEach(() => {
    limpiarSesion();
  });

  it("guarda la sesión y calcula la expiración en milisegundos", () => {
    const antes = Date.now();
    const sesion = guardarSesion({
      accessToken: "a",
      refreshToken: "r",
      usuario: USUARIO,
      expiresIn: 60,
    });

    expect(sesion.usuario).toEqual(USUARIO);
    expect(sesion.expiresAt).toBeGreaterThanOrEqual(antes + 60_000);
    expect(leerSesion()).toEqual(sesion);
  });

  it("ignora respuestas incompletas y datos corruptos", () => {
    expect(guardarSesion({ accessToken: "a" })).toBeNull();

    localStorage.setItem("huerto_session", "{no es json");
    expect(leerSesion()).toBeNull();

    localStorage.setItem(
      "huerto_session",
      JSON.stringify({ accessToken: "a" })
    );
    expect(leerSesion()).toBeNull();
  });

  it("limpia la sesión guardada", () => {
    sesionGuardada();
    limpiarSesion();
    expect(localStorage.getItem("huerto_session")).toBeNull();
  });
});

describe("apiFetch", () => {
  let fetchMock;

  beforeEach(() => {
    localStorage.clear();
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("envía el token, el Accept y el Content-Type de las peticiones con cuerpo", async () => {
    sesionGuardada("token-actual");
    fetchMock.mockResolvedValue(respuesta({ ok: true }));

    await apiFetch("/api/pedidos", {
      method: "POST",
      body: JSON.stringify({ items: [] }),
    });

    const [url, opciones] = fetchMock.mock.calls[0];
    expect(url).toBe("http://localhost:8080/api/pedidos");
    expect(opciones.headers.get("Authorization")).toBe("Bearer token-actual");
    expect(opciones.headers.get("Accept")).toBe("application/json");
    expect(opciones.headers.get("Content-Type")).toBe("application/json");
  });

  it("no agrega Authorization cuando no hay sesión o se envía uno explícito", async () => {
    fetchMock.mockResolvedValue(respuesta([]));

    await apiFetch("/api/productos");
    expect(fetchMock.mock.calls[0][1].headers.has("Authorization")).toBe(false);

    await apiFetch("/api/productos", { headers: { Authorization: "Bearer x" } });
    expect(fetchMock.mock.calls[1][1].headers.get("Authorization")).toBe(
      "Bearer x"
    );
  });

  it("renueva la sesión ante un 401 y reintenta una sola vez", async () => {
    sesionGuardada("vencido", "refresh-1");

    fetchMock.mockImplementation((url, opciones) => {
      if (url.endsWith("/api/auth/refresh")) {
        return Promise.resolve(
          respuesta({
            accessToken: "nuevo",
            refreshToken: "refresh-2",
            usuario: USUARIO,
            expiresIn: 900,
          })
        );
      }

      return Promise.resolve(
        opciones.headers.get("Authorization") === "Bearer nuevo"
          ? respuesta({ id: 1 })
          : respuesta({ message: "No autorizado" }, 401)
      );
    });

    const res = await apiFetch("/api/auth/me");

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ id: 1 });
    expect(leerSesion().accessToken).toBe("nuevo");
    expect(leerSesion().refreshToken).toBe("refresh-2");
    expect(
      fetchMock.mock.calls.filter(([url]) => url.endsWith("/api/auth/refresh"))
    ).toHaveLength(1);
  });

  it("hace un solo refresh cuando varias peticiones reciben 401 a la vez", async () => {
    sesionGuardada("vencido", "refresh-1");

    fetchMock.mockImplementation((url, opciones) => {
      if (url.endsWith("/api/auth/refresh")) {
        return Promise.resolve(
          respuesta({
            accessToken: "nuevo",
            refreshToken: "refresh-2",
            usuario: USUARIO,
            expiresIn: 900,
          })
        );
      }

      return Promise.resolve(
        opciones.headers.get("Authorization") === "Bearer nuevo"
          ? respuesta({ ok: true })
          : respuesta({}, 401)
      );
    });

    const [a, b] = await Promise.all([
      apiFetch("/api/pedidos"),
      apiFetch("/api/usuarios"),
    ]);

    expect(a.status).toBe(200);
    expect(b.status).toBe(200);
    expect(
      fetchMock.mock.calls.filter(([url]) => url.endsWith("/api/auth/refresh"))
    ).toHaveLength(1);
  });

  it("no intenta refrescar en login, registro ni refresh", async () => {
    sesionGuardada();

    for (const ruta of [
      "/api/auth/login",
      "/api/auth/register",
      "/api/auth/refresh",
    ]) {
      fetchMock.mockClear();
      fetchMock.mockResolvedValue(respuesta({ message: "Credenciales" }, 401));
      const res = await apiFetch(ruta, { method: "POST", body: "{}" });
      expect(res.status).toBe(401);
      expect(fetchMock).toHaveBeenCalledTimes(1);
    }
  });

  it("cierra la sesión y avisa cuando el refresh falla", async () => {
    sesionGuardada();

    fetchMock.mockImplementation((url) =>
      url.endsWith("/api/auth/refresh")
        ? Promise.resolve(respuesta({}, 401))
        : Promise.resolve(respuesta({}, 401))
    );

    await expect(apiFetch("/api/pedidos")).rejects.toThrow(
      "La sesión expiró. Inicia sesión nuevamente."
    );
    expect(localStorage.getItem("huerto_session")).toBeNull();
  });

  it("no reintenta cuando se indica reintentar=false", async () => {
    sesionGuardada();
    fetchMock.mockResolvedValue(respuesta({}, 401));

    const res = await apiFetch("/api/pedidos", {}, false);

    expect(res.status).toBe(401);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

describe("leerError", () => {
  it("prefiere message, luego error y por último el texto por defecto", async () => {
    expect(await leerError(respuesta({ message: "Dato inválido" }))).toBe(
      "Dato inválido"
    );
    expect(await leerError(respuesta({ error: "Prohibido" }))).toBe("Prohibido");
    expect(await leerError(respuesta({}), "Fallback")).toBe("Fallback");
  });

  it("usa el texto por defecto si el cuerpo no es JSON", async () => {
    const rota = {
      json: async () => {
        throw new Error("sin JSON");
      },
    };

    expect(await leerError(rota, "Error de red")).toBe("Error de red");
  });
});
