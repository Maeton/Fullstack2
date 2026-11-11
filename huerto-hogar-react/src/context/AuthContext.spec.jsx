import { describe, beforeEach, afterEach, it, expect, vi } from "vitest";
import { useEffect } from "react";
import { render, act, cleanup } from "@testing-library/react";
import { AuthProvider, useAuth } from "./AuthContext.jsx";

let api;

function Sonda() {
  const auth = useAuth();

  useEffect(() => {
    api = auth;
  }, [auth]);

  return null;
}

function authDe(rol) {
  return {
    accessToken: `access-${rol}`,
    refreshToken: `refresh-${rol}`,
    expiresIn: 900,
    usuario: {
      id: 1,
      nombre: "Usuario de prueba",
      email: "prueba@huerto.cl",
      rol,
    },
  };
}

describe("AuthContext · login por rol", () => {
  let fetchMock;

  beforeEach(() => {
    localStorage.clear();
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    render(
      <AuthProvider>
        <Sonda />
      </AuthProvider>
    );
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    localStorage.clear();
  });

  it("guarda la sesión cuando el rol coincide con el seleccionado", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => authDe("ADMIN"),
    });

    let usuario;
    await act(async () => {
      usuario = await api.login("admin@huerto.cl", "Admin123!", "ADMIN");
    });

    expect(usuario.rol).toBe("ADMIN");
    expect(JSON.parse(localStorage.getItem("huerto_session")).usuario.rol).toBe(
      "ADMIN"
    );
  });

  it("rechaza las credenciales de otro rol y no guarda la sesión", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => authDe("ADMIN"),
    });

    await act(async () => {
      await expect(
        api.login("admin@huerto.cl", "Admin123!", "VENDEDOR")
      ).rejects.toThrow(
        "Las credenciales no corresponden al tipo de cuenta seleccionado."
      );
    });

    expect(localStorage.getItem("huerto_session")).toBeNull();
  });

  it("mantiene el comportamiento anterior si no se indica rol", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => authDe("CLIENTE"),
    });

    let usuario;
    await act(async () => {
      usuario = await api.login("cliente@huerto.cl", "Cliente123!");
    });

    expect(usuario.rol).toBe("CLIENTE");
    expect(localStorage.getItem("huerto_session")).not.toBeNull();
  });
});
