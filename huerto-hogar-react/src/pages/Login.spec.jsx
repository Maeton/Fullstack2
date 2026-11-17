import { describe, afterEach, it, expect, vi } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import Login from "./Login.jsx";

const { login } = vi.hoisted(() => ({ login: vi.fn() }));

vi.mock("../context/AuthContext.jsx", () => ({
  useAuth: () => ({ login }),
}));

function renderizar() {
  return render(
    <MemoryRouter initialEntries={["/login"]}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<p>INICIO</p>} />
        <Route path="/admin" element={<p>ADMINISTRACION</p>} />
        <Route path="/vendedor" element={<p>PANEL VENDEDOR</p>} />
      </Routes>
    </MemoryRouter>
  );
}

describe("Login", () => {
  afterEach(() => {
    cleanup();
    login.mockReset();
  });

  it("exige correo y contraseña antes de llamar a la API", () => {
    renderizar();

    fireEvent.click(screen.getByRole("button", { name: "Ingresar" }));

    expect(screen.getByRole("alert").textContent).toBe(
      "Ingresa tu correo y contraseña."
    );
    expect(login).not.toHaveBeenCalled();
  });

  it("empieza en Cliente y cambia de tipo sin rellenar las credenciales", () => {
    renderizar();

    const cliente = screen.getByRole("button", { name: /^Cliente/ });
    const opcion = screen.getByRole("button", { name: /^Administrador/ });

    expect(cliente.getAttribute("aria-pressed")).toBe("true");

    fireEvent.click(opcion);

    expect(opcion.getAttribute("aria-pressed")).toBe("true");
    expect(cliente.getAttribute("aria-pressed")).toBe("false");
    expect(screen.getByLabelText("Correo electrónico").value).toBe("");
    expect(screen.getByLabelText("Contraseña").value).toBe("");
  });

  it("marca una sola opción como activa al cambiar de tipo de cuenta", () => {
    renderizar();

    const cliente = screen.getByRole("button", { name: /^Cliente/ });
    const vendedor = screen.getByRole("button", { name: /^Vendedor/ });

    fireEvent.click(cliente);
    expect(cliente.getAttribute("aria-pressed")).toBe("true");

    fireEvent.click(vendedor);
    expect(vendedor.getAttribute("aria-pressed")).toBe("true");
    expect(cliente.getAttribute("aria-pressed")).toBe("false");
  });

  it("inicia sesión y navega al destino", async () => {
    login.mockResolvedValue({ id: 3, rol: "CLIENTE" });

    renderizar();
    fireEvent.change(screen.getByLabelText("Correo electrónico"), {
      target: { value: " cliente@huerto.cl " },
    });
    fireEvent.change(screen.getByLabelText("Contraseña"), {
      target: { value: "Cliente123!" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Ingresar" }));

    expect(await screen.findByText("INICIO")).toBeTruthy();
    expect(login).toHaveBeenCalledWith(
      "cliente@huerto.cl",
      "Cliente123!",
      "CLIENTE"
    );
  });

  it("envía el rol seleccionado al iniciar sesión", async () => {
    login.mockResolvedValue({ id: 1, rol: "ADMIN" });

    renderizar();
    fireEvent.click(screen.getByRole("button", { name: /^Administrador/ }));
    fireEvent.change(screen.getByLabelText("Correo electrónico"), {
      target: { value: "admin@huerto.cl" },
    });
    fireEvent.change(screen.getByLabelText("Contraseña"), {
      target: { value: "Admin123!" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Ingresar" }));

    expect(await screen.findByText("ADMINISTRACION")).toBeTruthy();
    expect(login).toHaveBeenCalledWith(
      "admin@huerto.cl",
      "Admin123!",
      "ADMIN"
    );
  });

  it("muestra el mensaje del backend y no navega si falla", async () => {
    login.mockRejectedValue(new Error("Correo o contraseña incorrectos"));

    renderizar();
    fireEvent.change(screen.getByLabelText("Correo electrónico"), {
      target: { value: "cliente@huerto.cl" },
    });
    fireEvent.change(screen.getByLabelText("Contraseña"), {
      target: { value: "mala" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Ingresar" }));

    expect(await screen.findByRole("alert")).toBeTruthy();
    expect(screen.getByRole("alert").textContent).toBe(
      "Correo o contraseña incorrectos"
    );
    expect(screen.queryByText("INICIO")).toBeNull();
  });
});
