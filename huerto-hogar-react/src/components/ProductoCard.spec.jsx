/* global describe, beforeEach, afterEach, it, expect, spyOn */

import {
  render,
  screen,
  fireEvent,
  cleanup,
} from "@testing-library/react";

import ProductoCard from "./ProductoCard.jsx";

describe("ProductoCard", () => {
  const producto = {
    id: "FR001",
    nombre: "Manzanas Fuji",
    descripcion: "Manzanas frescas.",
    precio: 1200,
    stock: 10,
    img: "/manzana.jpg",
  };

  let almacenamiento;

  beforeEach(() => {
    almacenamiento = {};

    spyOn(Storage.prototype, "getItem").and.callFake(
      (clave) => almacenamiento[clave] ?? null
    );

    spyOn(Storage.prototype, "setItem").and.callFake(
      (clave, valor) => {
        almacenamiento[clave] = String(valor);
      }
    );
  });

  afterEach(() => {
    cleanup();
  });

  it("muestra el nombre y descripción del producto", () => {
    // Comprueba que se muestren el nombre y la descripción del producto.
    render(<ProductoCard producto={producto} />);

    expect(
      screen.getByRole("heading", { name: "Manzanas Fuji" })
        .textContent
    ).toBe("Manzanas Fuji");

    expect(
      screen.getByText("Manzanas frescas.").textContent
    ).toBe("Manzanas frescas.");
  });

  it("agrega un producto al carrito al hacer clic", () => {
    // Comprueba que el clic guarde el producto y muestre la confirmación.
    render(<ProductoCard producto={producto} />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Agregar un kilo de Manzanas Fuji al carrito",
      })
    );

    const carrito = JSON.parse(almacenamiento.huerto_cart);

    expect(carrito.length).toBe(1);
    expect(carrito[0].id).toBe("FR001");
    expect(carrito[0].quantity).toBe(1);
    expect(carrito[0].price).toBe(1200);

    expect(screen.getByRole("status").textContent)
      .toContain("Se agregó 1 kilo al carrito.");
  });

  it("deshabilita el botón cuando no hay stock", () => {
    // Comprueba que no se pueda agregar un producto sin stock.
    render(
      <ProductoCard producto={{ ...producto, stock: 0 }} />
    );

    const boton = screen.getByRole("button", {
      name: "Agregar un kilo de Manzanas Fuji al carrito",
    });

    expect(boton.disabled).toBeTrue();
    expect(boton.textContent).toBe("Sin stock");
  });
});
