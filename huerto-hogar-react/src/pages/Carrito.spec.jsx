import { describe, beforeEach, afterEach, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import Carrito from "./Carrito.jsx";

function renderizar() {
  return render(
    <MemoryRouter>
      <Carrito />
    </MemoryRouter>
  );
}

describe("Carrito", () => {
  let almacenamiento;

  beforeEach(() => {
    almacenamiento = {};

    vi.spyOn(Storage.prototype, "getItem").mockImplementation(
      (clave) => almacenamiento[clave] ?? null
    );

    vi.spyOn(Storage.prototype, "setItem").mockImplementation((clave, valor) => {
      almacenamiento[clave] = String(valor);
    });
  });

  afterEach(() => {
    cleanup();
  });

  it("muestra el carrito vacío y deshabilita finalizar compra", () => {
    renderizar();

    expect(screen.getByText("Tu carrito está vacío.").textContent)
      .toBe("Tu carrito está vacío.");
    expect(screen.getByRole("heading", { name: "Total: $0" }).textContent)
      .toBe("Total: $0");
    expect(screen.getByRole("button", { name: "Finalizar compra" }).disabled)
      .toBe(true);
  });

  it("calcula los subtotales y el total de varios productos", () => {
    almacenamiento.huerto_cart = JSON.stringify([
      { id: 1, name: "Manzanas Fuji", price: 1200, quantity: 2 },
      { id: 2, name: "Naranjas", price: 1000, quantity: 3 },
    ]);

    renderizar();

    expect(screen.getByText("Subtotal: $2.400").textContent)
      .toBe("Subtotal: $2.400");
    expect(screen.getByText("Subtotal: $3.000").textContent)
      .toBe("Subtotal: $3.000");
    expect(screen.getByRole("heading", { name: "Total: $5.400" }).textContent)
      .toBe("Total: $5.400");
  });

  it("elimina un producto al seleccionar cantidad cero", () => {
    almacenamiento.huerto_cart = JSON.stringify([
      { id: 1, name: "Manzanas Fuji", price: 1200, quantity: 2 },
      { id: 2, name: "Naranjas", price: 1000, quantity: 3 },
    ]);

    renderizar();

    fireEvent.change(screen.getAllByRole("combobox", { name: "Cantidad" })[0], {
      target: { value: "0" },
    });

    expect(screen.queryByRole("heading", { name: "Manzanas Fuji" })).toBeNull();
    expect(screen.getByRole("heading", { name: "Naranjas" }).textContent)
      .toBe("Naranjas");
    expect(screen.getByRole("heading", { name: "Total: $3.000" }).textContent)
      .toBe("Total: $3.000");
    expect(JSON.parse(almacenamiento.huerto_cart)).toEqual([
      { id: 2, name: "Naranjas", price: 1000, quantity: 3 },
    ]);
  });
});
