/* global describe, beforeEach, afterEach, it, expect, spyOn */

import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import Carrito from "./Carrito.jsx";

describe("Carrito", () => {
  let almacenamiento;

  beforeEach(() => {
    almacenamiento = {};

    spyOn(Storage.prototype, "getItem").and.callFake(
      (clave) => almacenamiento[clave] ?? null
    );

    spyOn(Storage.prototype, "setItem").and.callFake((clave, valor) => {
      almacenamiento[clave] = String(valor);
    });
  });

  afterEach(() => {
    cleanup();
  });

  it("muestra el carrito vacío y deshabilita finalizar compra", () => {
    // Comprueba el mensaje y que no se pueda comprar sin productos.
    render(<Carrito />);

    expect(screen.getByText("Tu carrito está vacío.").textContent)
      .toBe("Tu carrito está vacío.");
    expect(screen.getByRole("heading", { name: "Total: $0" }).textContent)
      .toBe("Total: $0");
    expect(screen.getByRole("button", { name: "Finalizar compra" }).disabled)
      .toBeTrue();
  });

  it("calcula los subtotales y el total de varios productos", () => {
    // Comprueba que cada precio se multiplique por su cantidad y se sume al total.
    almacenamiento.huerto_cart = JSON.stringify([
      { id: "FR001", name: "Manzanas Fuji", price: 1200, quantity: 2 },
      { id: "FR002", name: "Naranjas", price: 1000, quantity: 3 },
    ]);

    render(<Carrito />);

    expect(screen.getByText("Subtotal: $2.400").textContent)
      .toBe("Subtotal: $2.400");
    expect(screen.getByText("Subtotal: $3.000").textContent)
      .toBe("Subtotal: $3.000");
    expect(screen.getByRole("heading", { name: "Total: $5.400" }).textContent)
      .toBe("Total: $5.400");
  });

  it("elimina un producto al seleccionar cantidad cero", () => {
    // Comprueba que se quite el producto, se actualice el total y se guarde el cambio.
    almacenamiento.huerto_cart = JSON.stringify([
      { id: "FR001", name: "Manzanas Fuji", price: 1200, quantity: 2 },
      { id: "FR002", name: "Naranjas", price: 1000, quantity: 3 },
    ]);

    render(<Carrito />);

    fireEvent.change(screen.getAllByRole("combobox", { name: "Cantidad" })[0], {
      target: { value: "0" },
    });

    expect(screen.queryByRole("heading", { name: "Manzanas Fuji" })).toBeNull();
    expect(screen.getByRole("heading", { name: "Naranjas" }).textContent)
      .toBe("Naranjas");
    expect(screen.getByRole("heading", { name: "Total: $3.000" }).textContent)
      .toBe("Total: $3.000");
    expect(JSON.parse(almacenamiento.huerto_cart)).toEqual([
      { id: "FR002", name: "Naranjas", price: 1000, quantity: 3 },
    ]);
  });
});
