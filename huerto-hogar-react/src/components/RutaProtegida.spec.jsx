import { describe, afterEach, it, expect, vi } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { render, screen, cleanup } from "@testing-library/react";
import RutaProtegida from "./RutaProtegida.jsx";

const estado = vi.hoisted(() => ({ usuario: null, cargando: false }));

vi.mock("../context/AuthContext.jsx", () => ({
  useAuth: () => estado,
}));

function renderizar(roles) {
  return render(
    <MemoryRouter initialEntries={["/privado"]}>
      <Routes>
        <Route path="/login" element={<p>LOGIN</p>} />
        <Route path="/sin-acceso" element={<p>SIN ACCESO</p>} />
        <Route
          path="/privado"
          element={
            <RutaProtegida roles={roles}>
              <p>CONTENIDO PRIVADO</p>
            </RutaProtegida>
          }
        />
      </Routes>
    </MemoryRouter>
  );
}

describe("RutaProtegida", () => {
  afterEach(() => {
    cleanup();
    estado.usuario = null;
    estado.cargando = false;
  });

  it("redirige al login cuando no hay sesión", () => {
    renderizar(["ADMIN"]);
    expect(screen.getByText("LOGIN")).toBeTruthy();
  });

  it("redirige a sin acceso cuando el rol no coincide", () => {
    estado.usuario = { id: 3, rol: "CLIENTE" };
    renderizar(["ADMIN"]);
    expect(screen.getByText("SIN ACCESO")).toBeTruthy();
  });

  it("muestra el contenido cuando el rol está permitido", () => {
    estado.usuario = { id: 1, rol: "ADMIN" };
    renderizar(["ADMIN"]);
    expect(screen.getByText("CONTENIDO PRIVADO")).toBeTruthy();
  });

  it("no renderiza el contenido mientras carga la sesión", () => {
    estado.cargando = true;
    renderizar(["ADMIN"]);
    expect(screen.queryByText("CONTENIDO PRIVADO")).toBeNull();
    expect(screen.queryByText("LOGIN")).toBeNull();
  });
});
